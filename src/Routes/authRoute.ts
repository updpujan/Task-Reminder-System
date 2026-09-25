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

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user using their email and password and returns a JWT access token.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address.
 *                 example: pujan@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's account password.
 *                 example: Pujan@123
 *
 *     responses:
 *       '200':
 *         description: Login successful.
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
 *                   example: Login Sucessfully
 *                 token:
 *                   type: string
 *                   description: JWT access token used to authenticate protected API requests.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       '400':
 *         description: Email or password was not provided.
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
 *                   example: Login failed
 *                 errors:
 *                   type: string
 *                   example: Invalid Request: no email or password
 *
 *       '401':
 *         description: Invalid email or password.
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
 *                   example: Login Failed
 *                 errors:
 *                   type: string
 *                   example: Invalid Email or password
 */
route.post('/login', login);
//route.post('/logout',logout);

export default route;
