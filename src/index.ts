import http from 'node:http';
import { router } from './routes';

const app = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => await router(req, res))

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`)
})
