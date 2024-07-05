import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        default: 'General'
    },
    userId: {
        type: String,
        required: [true, "Please provide the user ID"]
    },
    color: {
        type: String,
        default: 'blue'
    }
})

const Tag = mongoose.models.tags || mongoose.model("tags", tagSchema)

export default Tag;
