import { app } from './app';
import { env } from './config/env';

const port = env.server.port;

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
