import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'A task management API documentation',
    version: '0.0.1',
    description:
      'This is a task management system that allows users to register and create tasks. Users can mark task as completed. Users can see list of completed tasks. Users can also create private and shared tasks using **socket** . Completed tasks and Shared tasks can be seen by anyone while private tasks are seen only by the owner of the task. Fully paginated.  \n\n ##### ⚠️  *Admin Login(please use this credentials to login as Admin, so you can have access to the Users Endpoint. )* \n\n **email:** odiong@admin.com \n\n **password:** Password1 \n\n\n NOTE: you can also use the user endpoint to create another admin by setting the role to admin \n\n\n\n ℹ️ _Please the server is deployed on a a free hosting provider, kindly wait a few minutes if your first request returns network error_ 🙏🏾 🙏🏾 🙏🏾 \n\n\n\n\n When using Doc, kindly take note of the different servers. \n\n There are two servers(test and development servers) \n\n development server - use ONLY when localhost is running',
    license: {
      name: 'MIT',
      url: 'https://github.com/udofia2/tasks-management-socket.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
    {
      url: `https://tasks-management-socket.onrender.com/v1`,
      description: 'Test Server',
    },
  ],
};

export default swaggerDefinition;
