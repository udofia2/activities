import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ITask {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  status: string;
  view_count: number;
  tags: string[];
  isCompleted: boolean;
}

export interface ITaskDoc extends ITask, Document {}

export interface ITaskModel extends Model<ITaskDoc> {
  isTitleTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateTaskBody = Partial<ITask>;
export type ModelTaskTest = Partial<ITask>;

export type NewCreatedTask = Omit<ITask, 'read_count' | 'state' | 'author' | 'isCompleted'>;

export type NewTask = Omit<ITask, 'view_count' | 'reading_time' | 'status' | 'owner' | 'isCompleted'>;
