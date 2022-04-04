const createTask = async (req, res) => {
    res.send("create a task")
}
const getAllTasks = async (req, res) => {
    res.send("get all tasks")
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