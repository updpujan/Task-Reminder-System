import express from 'express';
import healthController from '../controller/healthController.js';

const route = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check server and database health
 *     description: Checks whether the application server and PostgreSQL database are available.
 *
 *     responses:
 *       '200':
 *         description: Server and database are healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 services:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: up
 *                     database:
 *                       type: string
 *                       example: up
 *
 *       '503':
 *         description: One or more services are unavailable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unhealthy
 *                 services:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: up
 *                     database:
 *                       type: string
 *                       example: down
 */
route.get('/health', healthController);

export default route;
