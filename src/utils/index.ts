import http from 'node:http'
import { ROUTES } from '../constants'

export const validateBasePath = (pathElements: string[]) => {
  if (pathElements[0] && pathElements[1]) {
    const isPathValid = pathElements[0] === 'api' && (ROUTES[pathElements[1]]);
    return isPathValid;
  }
  return false;
}

export const parseRequestBody = (req: http.IncomingMessage) => new Promise((resolve, reject) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    resolve(JSON.parse(body));
  });

  req.on('error', (error: Error) => {
    reject(error);
  });
});

export const validateUUID = (id: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  if(uuidRegex.test(id)) {
    return true
  }
  throw new Error('Id is not of UUID type.')
}

export const getErrorMessage = (error: unknown) => {
  if(error instanceof Error) {
    return error.message
  }
  return error
}