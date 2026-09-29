import express from 'express';
import userProtection from '../middleware/authMiddleware.js';
import {
  createTask,
  getAllUserTasks,
  getUserTaskByID,
  deleteTask,
  updateTask,
} from '../controller/TaskController.js';

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

/**
 * @swagger
 * /getAllUserTasks:
 *   get:
 *     summary: Get all tasks of the authenticated user
 *     description: Returns all tasks belonging to the authenticated user. Returns an empty array when the user has no tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
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
 *                   example: Success with data
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *
 *             examples:
 *               withData:
 *                 summary: User has tasks
 *                 value:
 *                   success: true
 *                   message: Success with data
 *                   data:
 *                     - task_id: 9
 *                       user_id: 1
 *                       task_name: Complete Node.js backend project
 *                       task_description: Finish the task and reminder API
 *                       created_at: "2026-09-28T09:31:30.694Z"
 *                       status: enabled
 *                       is_deleted: false
 *                       reminder_date: "2026-09-28T18:15:00.000Z"
 *                       reminder_time: "18:30:00"
 *                       timezone: Asia/Kathmandu
 *                       repeat: day
 *                       is_active: true
 *
 *               noData:
 *                 summary: User has no tasks
 *                 value:
 *                   success: true
 *                   message: Success but no data
 *                   data: []
 *
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
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
 *                   example: Unauthorized
 *
 *       503:
 *         description: Database service unavailable
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
 *                   example: Database Service Unavailable
 */
route.get('/getAllUserTasks', userProtection, getAllUserTasks);

/**
 * @swagger
 * /gettask/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns a specific task belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to retrieve
 *         schema:
 *           type: integer
 *           example: 9
 *
 *     responses:
 *       200:
 *         description: Task retrieved successfully
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
 *                   example: Success with data
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *
 *             example:
 *               success: true
 *               message: Success with data
 *               data:
 *                 - task_id: 9
 *                   user_id: 1
 *                   task_name: Complete Node.js backend project
 *                   task_description: Finish the task and reminder API
 *                   created_at: "2026-09-28T09:31:30.694Z"
 *                   status: enabled
 *                   is_deleted: false
 *                   reminder_date: "2026-09-28T18:15:00.000Z"
 *                   reminder_time: "18:30:00"
 *                   timezone: Asia/Kathmandu
 *                   repeat: day
 *                   is_active: true
 *
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
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
 *                   example: Unauthorized
 *
 *       503:
 *         description: Database service unavailable
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
 *                   example: Database Service Unavailable
 *
 *       404:
 *         description: Task not found
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
 *                   example: Request resouce not found
 */
route.get('/gettask/:id', userProtection, getUserTaskByID);

/**
 * @swagger
 * /deleteTask/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: integer
 *           example: 9
 *     responses:
 *       204:
 *         description: Task deleted successfully. No response body is returned.
 *
 *       401:
 *        description: Unauthorized. JWT token is missing or invalid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: Unauthorized
 *
 *       404:
 *         description: Task not found or does not belong to the authenticated user.
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
 *                   example: Request resource not found
 *
 *       503:
 *         description: Database service unavailable.
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
 *                   example: Database Service Unavailable
 */
route.delete('/deleteTask/:id', userProtection, deleteTask);

/**
 * @swagger
 * /updateTask/{id}:
 *   patch:
 *     summary: Update a task
 *     description: Updates one or more fields of a task belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: integer
 *           example: 5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_name:
 *                 type: string
 *                 example: Complete Node.js Backend
 *               task_description:
 *                 type: string
 *                 nullable: true
 *                 example: Finish the PATCH API
 *               status:
 *                 type: string
 *                 enum: [enabled, disabled]
 *                 example: enabled
 *               reminder_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-10-05"
 *               reminder_time:
 *                 type: string
 *                 nullable: true
 *                 example: "18:30:00"
 *               timezone:
 *                 type: string
 *                 example: Asia/Kathmandu
 *               repeat:
 *                 type: string
 *                 enum: [off, minute, hour, day, week, month, year]
 *                 example: week
 *               is_active:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Task updated successfully.
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
 *                   example: task updated successfully
 *                 updated_row:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *
 *       400:
 *         description: Invalid request body.
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
 *                   example: Invalid Request body
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Invalid repeat value
 *
 *       401:
 *         description: Authentication failed.
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
 *                   example: User is not authenticated
 *
 *       404:
 *         description: Task not found or does not belong to the authenticated user.
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
 *                   example: task not found
 *
 *       500:
 *         description: JWT secret is not configured.
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
 *                   example: JWT secret is not configured
 *
 *       503:
 *         description: Database service is unavailable.
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
 *                   example: Database Service Unavailable
 */
route.patch('/updateTask/:id', userProtection, updateTask);

export default route;
