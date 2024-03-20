import * as http from 'node:http'

import { usersController } from "../api/users/users.controller.js"
import { notFoundController } from '../api/common/notFound.controller.js'
import { validatePath } from "../utils/index.js"

const routingMapper: Record<string, (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>> = {
  users: usersController
}

export const router = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const path = new URL(req.url!, `http://${req.headers.host}`).pathname
  const pathElements = path?.split('/').filter(pathElement => pathElement) || []
  const isPathValid = validatePath(pathElements)
  if (!isPathValid) {
    notFoundController(res)
    return
  }
  const controller = routingMapper?.[pathElements[1]]
  await controller(req, res)
}