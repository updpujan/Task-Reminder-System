import express from 'express';
import userProtection from '../middleware/authMiddleware.js';
import adminProtection from '../middleware/adminAuthMiddleware.js';
import { getAllTasks } from '../controller/TaskController.js';
import { getAllUsers } from '../controller/userController.js';

const route = express.Router();

/**
 * @swagger
 * /getAllTasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns all tasks in the system. Only authenticated users with the admin role can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks retrieved successfully
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
 *             examples:
 *               withData:
 *                 summary: Tasks found
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
 *               noData:
 *                 summary: No tasks found
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
 *       403:
 *         description: Forbidden. The authenticated user does not have the admin role.
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
 *                   example: Forbidden- admin role required
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
 *                   example: Request resource not found
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
route.get('/getAllTasks', userProtection, adminProtection, getAllTasks);

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Returns all registered users with the user role. Requires a valid JWT belonging to an admin.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All users retrived sucessfully
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Pujan Upadhyay
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: pujan@gmail.com
 *                       role:
 *                         type: string
 *                         example: user
 *                       password:
 *                         type: string
 *                         example: $2b$10$exampleHash
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-09-28T12:00:51.599Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-09-29T12:59:47.817Z
 *
 *       204:
 *         description: Request successful but no users were found
 *
 *       401:
 *         description: Unauthorized - authentication failed or JWT is missing/invalid
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
 *                   example: Unauthorized
 *
 *       403:
 *         description: Forbidden - admin role required
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
 *                   example: Forbidden- admin role required
 *
 *       503:
 *         description: Database service unavailable
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
 *                   example: database service unavalible
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
route.get('/getAllUsers', userProtection, adminProtection, getAllUsers);

export default route;
