import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Task Reminder System Backend API',
      version: '1.0.0',
      description: 'API documention for backend NOdejs of Task Reminder Sydtem',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        describe: 'Local Development Server',
      },
    ],
  },

  apis: ['./src/Routes/*.ts'],

  failOnErrors: true,
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
