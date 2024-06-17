import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Task from './task.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedTask, ITaskDoc, UpdateTaskBody } from './task.interfaces';

/**
 * Create a task
 * @param {NewTask} taskBody
 * @returns {Promise<ITaskDoc>}
 */
export const createTask = async (taskBody: NewCreatedTask): Promise<ITaskDoc> => {
  if (await Task.isTitleTaken(taskBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }

  return Task.create(taskBody);
};

/**
 * Query for tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTasks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Query for published tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryPublishedTasks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Query for My tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMyTasks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITaskDoc | null>}
 */
export const getTaskById = async (id: mongoose.Types.ObjectId): Promise<ITaskDoc | null> => Task.findById(id);

/**
 * Update task by id
 * @param {mongoose.Types.ObjectId} taskId
 * @param {UpdateTaskBody} updateBody
 * @returns {Promise<ITaskDoc | null>}
 */
export const updateTaskById = async (
  taskId: mongoose.Types.ObjectId,
  updateBody: UpdateTaskBody,
  owner: mongoose.Types.ObjectId
): Promise<ITaskDoc | null> => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (updateBody.title && (await Task.isTitleTaken(updateBody.title, taskId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task title already taken');
  }
  if (task.owner.toString() !== owner.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update the task you created');
  }

  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Delete task by id
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<ITaskDoc | null>}
 */
export const deleteTaskById = async (
  taskId: mongoose.Types.ObjectId,
  owner: mongoose.Types.ObjectId
): Promise<ITaskDoc | null> => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (task?.owner.toString() !== owner.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own task');
  }

  await task.deleteOne();
  return task;
};
