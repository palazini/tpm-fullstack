import express from 'express';
import cors from 'cors';

import { userFromHeader } from './middlewares/userFromHeader';
import { eventsRouter } from './routes/events';
import { healthRouter } from './routes/health';
import { maquinasRouter } from './routes/maquinas';
import { chamadosRouter } from './routes/chamados';
import { agendamentosRouter } from './routes/agendamentos';
import { pecasRouter } from './routes/pecas';
import { causasRouter } from './routes/causas';
import { usuariosRouter } from './routes/usuarios';
import { authRouter } from './routes/auth';
import { checklistsRouter } from './routes/checklists';
import { analyticsRouter } from './routes/analytics';
import { botRouter } from './routes/bot';
import { env } from './config/env';

const app = express();

const ALLOW = env.cors.allowedOrigins;

app.use(cors({
  // se não definir CORS_ORIGINS, libera tudo (útil p/ dev)
  origin: ALLOW.length ? ALLOW : true,
}));

app.use(express.json());
app.use(userFromHeader);

app.use(eventsRouter);
app.use(healthRouter);
app.use(maquinasRouter);
app.use(chamadosRouter);
app.use(agendamentosRouter);
app.use(pecasRouter);
app.use(causasRouter);
app.use(usuariosRouter);
app.use(authRouter);
app.use(checklistsRouter);
app.use(analyticsRouter);
app.use(botRouter);

export { app };
