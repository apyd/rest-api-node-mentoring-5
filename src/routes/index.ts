import http from 'node:http'

import { usersController } from "../api/users/users.controller"
import { notFoundController } from '../api/common/notFound.controller'
import { validateBasePath } from "../utils"

const routingMapper: Record<string, (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>> = {
  users: usersController
}

export const router = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const path = new URL(req.url!, `http://${req.headers.host}`).pathname
  const pathElements = path?.split('/').filter(pathElement => pathElement) || []
  const identifier = pathElements?.[1]
  const isPathValid = validateBasePath(pathElements)
  if (!isPathValid || !identifier) {
    notFoundController(res)
    return
  }
  const controller = routingMapper?.[identifier]
  controller && await controller(req, res)
}