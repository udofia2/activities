## Description
This is a task management system that allows users to register and create tasks. Users can mark tasks as completed. Users can create private and shared tasks. Completed tasks and Shared tasks can be seen by anyone while private tasks are seen only by the owner of the task. Fully paginated.

- [Documentation](https://activities-csay.onrender.com/v1/docs)

## Quick Start

Clone the repo:

```bash
git clone https://github.com/udofia2/activities.git
```
```
cd tasks-management-socket
```

```bash
yarn install
```

```bash
cp .env.example .env
```

```bash
nvm use 18
```

```bash
yarn compile
```
for local development
```bash
yarn dev
```
for production build
```bash
yarn start
```

docker for dev
```bash
yarn docker:dev

```
docker for prod
```bash
yarn docker:prod
```
Compiling to JS from TS

```bash
yarn compile
```

Compiling to JS from TS in watch mode

```bash
yarn compile:watch
```

```bash
yarn commit
```

Testing:

```bash
# all tests
yarn test

# TypeScript tests
yarn test:ts

# JS tests
yarn test:js

# all tests in watch mode
yarn test:watch

# test coverage
yarn coverage
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

### API Endpoints

List of available routes:

**Auth routes**:\
`GET /health` - health check\

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - reset password token
`POST /v1/auth/reset-password` - reset password

**Blog routes**:\
`POST /v1/tasks` - create a task\
`GET /v1/tasks` - get all tasks including published and draft\
`GET /v1/tasks/shared` - get all shared tasks\
`GET /v1/tasks/completed` - get all completed tasks\
`GET /v1/tasks/my/tasks` - get all created tasks for a login user\
`GET /v1/tasks/:taskId` - get task\
`PATCH /v1/tasks/:taskId` - update task by a login user\
`DELETE /v1/tasks/:taskId` - delete task by a login user\

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user\


[Entities]:
- Users : Represents a registered user on the blogging platform.
- Tasks : Represents a task created by a user.
- Tokens : Represents an authentication or authorization token associated with a user.

[Attributes]

    User:
      -  _id (primary key)
      -  first_name
      -  last_name
      -  email (unique)
      -  password (hashed)
      -  role
      -  isEmailVerified

    Task:
      -  _id (primary key)
      -  title (unique)
      -  isCompleted
      -  description(boolean)
      -  owner_id (foreign key referencing User._id)
      -  status
      -  view_count
      -  tags
      Token:
      -  _id (primary key)
      -  token (unique)
      -  user (foreign key referencing User._id)
      -  type (refresh, reset_password)
      -  expires
      -  blacklisted


[Relationships]:
- User - Token(one-to-many)
- Task - User(many-to-one)

Diagram:

         (1)                        (N)
    User ----->* Token  (N)          |
         |                       Task
    user_id    user_id (FK) --------*-----> (relationship)

