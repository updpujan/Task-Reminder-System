import express from 'express';
import registerValidation from '../middleware/registerValidationMiddleware.js';
import emailCheck from '../middleware/userEmailCheck.js';
import {
  registration,
  login /*logout*/,
} from '../controller/authController.js';

const route = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name containing only alphabets and single spaces between names.
 *                 pattern: '^[A-Za-z]+(?: [A-Za-z]+)*$'
 *                 example: Pujan Upadhyay
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: pujan@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 20
 *                 description: Must contain at least one uppercase letter, lowercase letter, number, and special character.
 *                 example: Pujan@123
 *
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 description: Role assigned to the user.
 *                 example: user
 *
 *     responses:
 *       '201':
 *         description: New user registered successfully.
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
 *                   example: New user registered successfully.
 *
 *       '400':
 *         description: Validation failed.
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
 *                   example: Validation failed.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Invalid email format
 *
 *       '409':
 *         description: User already exists.
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
 *                   example: User already exists.
 */
route.post('/register', registerValidation, emailCheck, registration);
route.post('/login', login);
//route.post('/logout',logout);

export default route;
