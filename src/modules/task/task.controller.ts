import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as taskService from './task.service';
import { io } from '../../index';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  req.body.owner = req?.user?._id;
  const task = await taskService.createTask(req.body);
  io.emit('taskCreated', task);
  res.status(httpStatus.CREATED).send(task);
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'owner', 'tags']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await taskService.queryTasks(filter, options);
  res.send(result);
});

export const getSharedTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'owner', 'tags']);
  filter.status = 'SHARED';
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
  const result = await taskService.queryTasks(filter, options);
  res.send(result);
});

export const getCompletedTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'owner', 'tags']);
  filter.isCompleted = true;
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
  const result = await taskService.queryTasks(filter, options);
  res.send(result);
});

export const getMyTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'status', 'tags']);
  if (filter.state) return filter.state.toUpperCase();
  filter.owner = req?.user?._id;
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
  const result = await taskService.queryMyTasks(filter, options);
  res.send(result);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const task = await taskService.getTaskById(new mongoose.Types.ObjectId(req.params['taskId']));
    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(task);
  }
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const owner = req?.user?._id.toString();
  if (typeof req.params['taskId'] === 'string') {
    const task = await taskService.updateTaskById(new mongoose.Types.ObjectId(req.params['taskId']), req.body, owner);

    io.emit('taskUpdated', task);

    res.send(task);
  }
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const owner = req?.user?._id.toString();
  if (typeof req.params['taskId'] === 'string') {
    await taskService.deleteTaskById(new mongoose.Types.ObjectId(req.params['taskId']), owner);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
