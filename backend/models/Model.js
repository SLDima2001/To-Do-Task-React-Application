import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model('Task', taskSchema);