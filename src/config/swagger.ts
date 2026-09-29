import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Task Reminder System Backend API',
      version: '1.0.0',
      description:
        'API documentation for backend Node.js of Task Reminder System',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        Task: {
          type: 'object',
          properties: {
            task_id: {
              type: 'integer',
              example: 9,
            },

            user_id: {
              type: 'integer',
              example: 1,
            },

            task_name: {
              type: 'string',
              example: 'Complete Node.js backend project',
            },

            task_description: {
              type: 'string',
              example: 'Finish the task and reminder API',
            },

            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-28T09:31:30.694Z',
            },

            status: {
              type: 'string',
              enum: ['enabled', 'disabled'],
              example: 'enabled',
            },

            is_deleted: {
              type: 'boolean',
              example: false,
            },

            reminder_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-09-28T18:15:00.000Z',
            },

            reminder_time: {
              type: 'string',
              example: '18:30:00',
            },

            timezone: {
              type: 'string',
              example: 'Asia/Kathmandu',
            },

            repeat: {
              type: 'string',
              enum: ['off', 'minute', 'hour', 'day', 'week', 'month', 'year'],
              example: 'day',
            },

            is_active: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
  },

  apis: ['./src/Routes/*.ts'],

  failOnErrors: true,
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
