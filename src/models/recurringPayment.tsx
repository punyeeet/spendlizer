import mongoose from 'mongoose';
import Transaction from './transactionModel';

const recurringPaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: [String],
        default: []
    },
    startDate: {
        type: Date,
        required: true,
    },
    recurrence: {
        type: String, // e.g., 'monthly'
        required: true,
    },
    nextOccurrence: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    transactions: {
        type: [String],
        default:[]
    }
});

const RecurringPayment = mongoose.models.recurringpayment || mongoose.model('recurringpayment', recurringPaymentSchema);

export default RecurringPayment;
