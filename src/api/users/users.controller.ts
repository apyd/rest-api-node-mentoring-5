import * as http from "node:http";

import { userService } from "./users.service.js";

import {
  getErrorMessage,
  parseRequestBody,
  validateUUID,
} from "../../utils/index.js";
import {
  extendUserWithLinks,
  validateCreateUserDto,
  validateUpdateUserHobbiesDto,
} from "./users.utils.js";

import { REQUEST_METHOD } from "../../constants/index.js";

import { CreateUserDto, UpdateUserDto } from "./users.dto.js";
import { notFoundController } from "../common/notFound.controller.js";

export const usersController = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const { method } = req;

  const path = new URL(req.url!, `http://${req.headers.host}`).pathname;
  const pathElements = path?.split("/").filter((pathElement) => pathElement);
  const userId = pathElements?.[2];
  const pathContainsHobbies = pathElements?.[3] === "hobbies";

  if (method === REQUEST_METHOD.GET) {
    if (path === "/api/users") {
      try {
        const users = userService.getAll();
        const usersWithLinks = users.map(extendUserWithLinks);
        res
          .setHeader('Cache-Control', 'public, max-age=3600')
          .writeHead(200)
          .end(JSON.stringify({ data: usersWithLinks, error: null }));
        return;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res
          .writeHead(500)
          .end(JSON.stringify({ data: null, error: errorMessage }));
        return;
      }
    }

    if (pathContainsHobbies) {
      try {
        validateUUID(userId);
        const userHobbies = userService.getHobbies(userId);
        if (!userHobbies) {
          res
            .writeHead(404)
            .end(
              JSON.stringify({
                data: null,
                error: `User with id ${userId} doesn't exist`,
              })
            );
          return;
        }
        const data = {
          hobbies: userHobbies.hobbies,
          links: {
            self: `/api/users/${userId}`,
            hobbies: `/api/users/${userId}/hobbies`,
          },
        };
        res
          .setHeader('Cache-Control', 'private, max-age=3600')
          .writeHead(200)
          .end(JSON.stringify({ data, error: null }));
        return;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res
          .writeHead(500)
          .end(JSON.stringify({ data: null, error: errorMessage }));
        return;
      }
    }
  }

  if (method === REQUEST_METHOD.POST && path === "/api/users") {
    try {
      const body = (await parseRequestBody(req)) as CreateUserDto;
      validateCreateUserDto(body);
      const user = userService.create(body);
      if (!user) {
        res
          .writeHead(500)
          .end(
            JSON.stringify({
              data: null,
              error: `Server error. User cannot be created`,
            })
          );
        return;
      }
      const userWithLinks = extendUserWithLinks(user);
      res
        .writeHead(201)
        .end(JSON.stringify({ data: userWithLinks, error: null }));
      return;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      res
        .writeHead(500)
        .end(JSON.stringify({ data: null, error: errorMessage }));
      return;
    }
  }

  if (method === REQUEST_METHOD.PATCH && pathContainsHobbies) {
    try {
      const body = (await parseRequestBody(req)) as UpdateUserDto;
      validateUpdateUserHobbiesDto(body.hobbies);
      validateUUID(userId);
      const user = userService.update(userId, body);
      if (!user) {
        res
          .writeHead(404)
          .end(
            JSON.stringify({
              data: null,
              error: `User with id ${userId} doesn't exist`,
            })
          );
        return;
      }
      res
        .writeHead(200)
        .end(JSON.stringify({ data: {
          hobbies: user.hobbies,
          links: {
            self: `/api/users/${userId}/hobbies`,
            user: `/api/users/${userId}`,
          }
        }, error: null }));
      return;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      res
        .writeHead(500)
        .end(JSON.stringify({ data: null, error: errorMessage }));
      return;
    }
  }

  if (method === REQUEST_METHOD.DELETE && pathElements.length === 3) {
    try {
      validateUUID(userId);
      const user = userService.delete(userId);
      if (!user) {
        res
          .writeHead(404)
          .end(
            JSON.stringify({
              data: null,
              error: `User with id ${userId} doesn't exist`,
            })
          );
        return;
      }
      res.writeHead(200).end(JSON.stringify({ success: true, error: null }));
      return;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      res
        .writeHead(500)
        .end(JSON.stringify({ data: null, error: errorMessage }));
      return;
    }
  }

  notFoundController(res);
};
