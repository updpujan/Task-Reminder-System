import express from 'express';
import healthController from '../controller/healthController.js';

const route = express.Router();

route.get('/health', healthController);

export default route;
