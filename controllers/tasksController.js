import Task from '../models/Task.js'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

// CREATE TASK //
const createTask = async (req, res) => {
  const { title, details } = req.body

  if (!title || !details) {
    throw new BadRequestError('Please provide all values')
  }
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  res.status(StatusCodes.CREATED).json({ task })
}

// GET ALL TASKS //
const getAllTasks = async (req, res) => {
  const { status, taskType, sort, search } = req.query

  const queryObject = {
    createdBy: req.user.userId,
    status: ["started", "pending"]
  }

  // SEARCH, STATUS, TYPE //
  if (status && status !== 'all') {
    queryObject.status = status
  }
  if (taskType && taskType !== 'all') {
    queryObject.taskType = taskType
  }
  if (search) {
    queryObject.title = { $regex: search, $options: 'i' }
  }

  let result = Task.find(queryObject)

  // SORTING FILTERS //
  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('title')
  }
  if (sort === 'z-a') {
    result = result.sort('-title')
  }

  const tasks = await result
  res.status(StatusCodes.OK).json({ tasks })
}

// UPDATE TASK //
const updateTask = async (req, res) => {
  const { id: taskId } = req.params
  const { details, title } = req.body

  if (!title || !details) {
    throw new BadRequestError('Please provide all values')
  }
  const task = await Task.findOne({ _id: taskId })

  if (!task) {
    throw new NotFoundError(`No task with id :${taskId}`)
  }

  checkPermissions(req.user, task.createdBy)

  const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ updatedTask })
}

// DELETE TASK //
const deleteTask = async (req, res) => {
  const { id: taskId } = req.params
  const task = await Task.findOne({ _id: taskId })

  if (!task) {
    throw new NotFoundError(`No task with id :${taskId}`)
  }

  checkPermissions(req.user, task.createdBy)
  await task.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Task removed' })
}

// STATS //
const showStats = async (req, res) => {
  let stats = await Task.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    started: stats.started || 0,
    finished: stats.finished || 0,
  }

  let monthlyApplications = await Task.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createTask, deleteTask, getAllTasks, updateTask, showStats }