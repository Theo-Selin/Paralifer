import Task from '../models/Task.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'

const createTask = async (req, res) => {
    const {title, details} = req.body

    if(!title || !details) {
        throw new BadRequestError("Please provide all values")
    }
    req.body.createdBy = req.user.userId
    const task = await Task.create(req.body)
    res.status(StatusCodes.CREATED).json({ task })
}
const getAllTasks = async (req, res) => {
    const tasks = await Task.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json({tasks, totalTasks: tasks.length, numOfPages: 1 })
}
const updateTask = async (req, res) => {
    res.send("update a task")
}
const deleteTask = async (req, res) => {
    res.send("delete a task")
}
const showStats = async (req, res) => {
    res.send("show stats")
}

export { createTask, deleteTask, getAllTasks, updateTask, showStats }