import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { STATE_TYPES_ENUM } from './taskStatusEnum';
import { ITaskDoc, ITaskModel } from './task.interfaces';

const taskSchema = new mongoose.Schema<ITaskDoc, ITaskModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: STATE_TYPES_ENUM,
      default: STATE_TYPES_ENUM.PRIVATE,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

/**
 * Check if title is taken
 * @param {string} title - The task's title
 * @param {ObjectId} [excludeTaskId] - The id of the task to be excluded
 * @returns {Promise<boolean>}
 */
taskSchema.static(
  'isTitleTaken',
  async function (taskTitle: string, excludeTaskId: mongoose.ObjectId): Promise<boolean> {
    const task = await this.findOne({ title: taskTitle, _id: { $ne: excludeTaskId } });
    return !!task;
  }
);

const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', taskSchema);

export default Task;
