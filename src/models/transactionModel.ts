import mongoose from "mongoose";
import Tag from "./tagModel";

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "Please provide the date"],
    },
    tag: {
        type: [String],
        default: []
    },
    amount: {
        type: Number,
        required: [true, "Please provide an amount"]
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: [true, "Please provide the user ID"]
    },
    type: {
        type: String,
        required: [true, "Please provide transaction type"]
    }
})

const Transaction = mongoose.models.transaction || mongoose.model("transaction", transactionSchema)

export default Transaction;
