import express from 'express'
const router = express.Router()

import { 
    createTask, 
    deleteTask, 
    getAllTasks, 
    updateTask, 
    showStats 
} from '../controllers/tasksController.js'

router.route("/").post(createTask).get(getAllTasks)
router.route("/stats").get(showStats)
router.route("/:id").delete(deleteTask).patch(updateTask)

export default router