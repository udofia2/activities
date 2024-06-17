import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { taskController, taskValidation } from '../../modules/task';
import { incrementViewCount } from '../../modules/utils/viewCounter'

const router: Router = express.Router();

router
  .route('/')
  .post(auth('createTask'), validate(taskValidation.createTask), taskController.createTask)
  .get(auth('getTasks'), validate(taskValidation.getTasks), taskController.getTasks);

router.route('/shared').get(validate(taskValidation.getTasks), taskController.getSharedTasks);
router.route('/completed').get(validate(taskValidation.getTasks), taskController.getCompletedTasks);

router.route('/my/tasks').get(auth('getMyTasks'), validate(taskValidation.getTasks), taskController.getMyTasks);

router
  .route('/:taskId')
  .get(incrementViewCount, validate(taskValidation.getTask), taskController.getTask)
  .patch(auth('upateMyTask'), validate(taskValidation.updateTask), taskController.updateTask)
  .delete(auth('deleteMyPost'), validate(taskValidation.deleteTask), taskController.deleteTask);

export default router;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: >
 *    *You MUST register to create task*.
 *    Task management and retrieval.
 *    Please take note of the annotations. 
 *    [Admin] = this means only admin and Owner can access this endpoint.
 *    [Owner] = this means only Owner of the task can access this endpoint, and resources fetched belongs only to the loggin user.
 *    Endpoints without any of the annotations is meant for everyone
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task - [Owner]
 *     description: Only registered users can create task(s).
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 description: Could be array of tags or a single tag
 *             example:
 *              title: Random's Delights Await You From History to Culture
 *              description: Explor a world of random delights, from history to culture and discover something new every day.
 *              tags: ['task', 'events', 'activities', 'todo']
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tasks(shared & private) - [Admin]
 *     description: Only the Admin can retrieve both private and the shared tasks for all registered users on the platform.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status of the task
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by Title of the task
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter by the Owner that shared the task
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: search by tags
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tasks/completed:
 *   get:
 *     summary: Get all completed tasks
 *     description: Both loggin and not loggin users can see list of all completed tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by Title of the task
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter by the owner that completed the task
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Search by tags
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: populate a field by name (ex. owner)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tasks/shared:
 *   get:
 *     summary: Get all shared tasks
 *     description: Both loggin and not loggin users can get all shared tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by Title of the task
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter by the owner that shared the task
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Search by tags
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: populate a field by name (ex. owner)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tasks/my/tasks:
 *   get:
 *     summary: Get all My task - [Owner]
 *     description: Only the logged-in owner can see all their created tasks(both shared and private). Please REMEMBER that if you create a task and not shared, the task will not appear on all list of tasks for none login users.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by Status of the task
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by Title of the task
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Search by tags
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: populate by query in the form of field name (ex. owner)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task
 *     description: both login and not login users can view a task. Kindly note that the view count does not apply to task that are private. It starts counting when you share the task and stops counting when you make the task private again.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a task - [Owner]
 *     description: Logged-in authors can only update their task information.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: must be a unique title
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 description: change status to SHARED or PRIVATE
 *             example:
 *              title: Random's Delights Await You From History to Culture
 *              status: SHARED
 *              description: Explor a world of random delights, from history to culture and discover something new every day.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a task - [Owner]
 *     description: Logged-in authors can delete only their task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
