import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewTask } from './task.interfaces';
import { STATE_TYPES_ENUM } from './taskStatusEnum';

const createTaskBody: Record<keyof NewTask, any> = {
  title: Joi.string().required(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string())
};

export const createTask = {
  body: Joi.object().keys(createTaskBody),
};

export const getTasks = {
  query: Joi.object().keys({
    status: Joi.string(),
    isCompleted: Joi.string(),
    title: Joi.string(),
    author: Joi.string(),
    tags: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

export const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      status: Joi.string().valid(STATE_TYPES_ENUM.SHARED, STATE_TYPES_ENUM.PRIVATE),
    })
    .min(1),
};

export const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};
