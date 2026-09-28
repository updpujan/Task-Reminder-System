import express from 'express';
import userProtection from '../middleware/authMiddleware.js';
import { createTask } from '../controller/TaskController.js';

const route = express.Router();

/**
 * @swagger
 * /createTask:
 *   post:
 *     summary: Create a task with a reminder
 *     description: Creates a new task and its associated reminder in a single database transaction.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_name
 *               - reminder_time
 *               - timezone
 *               - repeat
 *             properties:
 *               task_name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Complete Node.js backend project
 *               task_description:
 *                 type: string
 *                 example: Finish the task and reminder API
 *               reminder_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-29"
 *               reminder_time:
 *                 type: string
 *                 example: "18:30:00"
 *               timezone:
 *                 type: string
 *                 maxLength: 100
 *                 example: Asia/Kathmandu
 *               repeat:
 *                 type: string
 *                 enum:
 *                   - off
 *                   - minute
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                 example: day
 *
 *     responses:
 *       201:
 *         description: Task and reminder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task Created Successfully
 *
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucess:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Task name is required
 *
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucess:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired Token
 *
 *       500:
 *         description: Failed to create task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to create Task
 */
route.post('/createTask', userProtection, createTask);

export default route;
