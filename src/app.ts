import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import authRoute from './Routes/authRoute.js';
import healthCheck from './Routes/healthRoute.js';
import tasks from './Routes/tasksRoute.js';
import adminRoute from './Routes/adminRoute.js';

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', authRoute);
app.use('/', healthCheck);
app.use('/', tasks);
app.use('/admin', adminRoute);

export default app;
