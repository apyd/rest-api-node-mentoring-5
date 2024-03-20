import * as http from 'node:http'

export const notFoundController = (res: http.ServerResponse) => {
  res.writeHead(404).end()
}