import mongoose from 'mongoose';

const recurringPaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Schedule name is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: [true, 'Transaction type is required'],
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        tag: {
            type: [String],
            default: [],
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: [true, 'Recurrence frequency is required'],
            default: 'monthly',
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            default: null,
        },
        nextOccurrence: {
            type: Date,
            required: [true, 'Next occurrence date is required'],
            index: true,
        },
        lastRunDate: {
            type: Date,
            default: null,
        },
        occurrencesGenerated: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'completed', 'cancelled'],
            default: 'active',
            index: true,
        },
    },
    { timestamps: true }
);

const RecurringPayment =
    mongoose.models.recurringpayment ||
    mongoose.model('recurringpayment', recurringPaymentSchema);

export default RecurringPayment;
