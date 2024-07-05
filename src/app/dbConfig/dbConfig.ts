import mongoose from 'mongoose';

export async function connect() {
    try {
        console.log('URL',process.env.MONGO_URL)
        mongoose.connect(process.env.MONGO_URL!);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MogoDB connected successfully');
        })

        connection.on('error', (err) => {

            console.log('MogogDB connection error. Please make sure MongoDB is running. ' + err);

            process.exit();
        })

    } catch (error) {
        console.log('Cannot connect to DB !', error)
    }
}