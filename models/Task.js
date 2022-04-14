import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide title'],
        maxlength: 50,
    },
    details: {
        type: String,
        required: [true, 'Please provide details'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum:["started", "finished", "pending"],
        default: "pending",
    },
    taskType: {
        type: String,
        enum:["quit", "practice", "create", "relax"],
        default: "practice",
    },
    taskLocation: {
        type: String,
        default: "my city",
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"]
    }
}, { timestamps: true } )

export default mongoose.model("Task", TaskSchema)