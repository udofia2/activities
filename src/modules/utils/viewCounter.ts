import catchAsync from './catchAsync';
import { Request, NextFunction } from 'express';
import Task from '../task/task.model';
import { io } from '../../index';

export const incrementViewCount = catchAsync(async (req: Request, _: any, next: NextFunction) => {
  if (typeof req.params['taskId'] === 'string') {
    const task = await Task.findOneAndUpdate(
      { _id: req.params['taskId'], status: 'SHARED' },
      { $inc: { view_count: 1 } },
      { new: true }
    );

    if (task) {
      io.emit('viewCountUpdated', task);
    }
  }
  next();
});
