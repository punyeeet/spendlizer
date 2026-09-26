import mongoose from 'mongoose';

let isConnected = false;

export async function connect() {
    if (isConnected || mongoose.connections[0]?.readyState) {
        isConnected = true;
        return;
    }

    if (!process.env.MONGO_URL) {
        console.error('MONGO_URL environment variable is not defined');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        isConnected = !!db.connections[0].readyState;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Cannot connect to DB !', error);
    }
}
