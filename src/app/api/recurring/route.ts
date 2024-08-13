// import cron from 'node-cron';
// import { connect } from '@/app/dbConfig/dbConfig';
// import RecurringPayment from '@/models/recurringPayment';
// import Transaction from '@/models/transactionModel'; // Your transaction model

// // Connect to MongoDB
// connect();

// // Schedule a task to run at midnight on the 1st of every month
// cron.schedule('0 0 1 * *', async () => {
//     try {
//         const now = new Date();

//         // Find all recurring payments that are due today
//         const duePayments = await RecurringPayment.find({
//             nextOccurrence: {
//                 $lte: now,
//             },
//         });

//         // Process each due payment
//         for (const payment of duePayments) {
//             // Create a new transaction
//             const transaction = new Transaction({
//                 userId: payment.userId,
//                 amount: payment.amount,
//                 description: payment.description,
//                 date: now,
//                 type: 'credit', // or 'debit' based on your requirement
//             });

//             await transaction.save();

//             // Update the next occurrence date
//             payment.nextOccurrence = new Date(now.setMonth(now.getMonth() + 1)); // Set to next month
//             await payment.save();
//         }

//         console.log('Recurring payments processed successfully');
//     } catch (error) {
//         console.error('Error processing recurring payments:', error);
//     }
// });
