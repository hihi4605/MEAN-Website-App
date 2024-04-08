import { connect, connection } from 'mongoose';
let gracefulShutdown;

const dbURI = 'mongodb+srv://Chris:DrakeFan58949$@mydb.srmedx4.mongodb.net/';

(async () => {
  try {
    await connect(dbURI);
    console.log('Mongoose connected to ' + dbURI);

    // Monitor and report error connecting to database
    connection.on('error', function (err) {
      console.log('Mongoose connection error: ' + err);
    });

    // Monitor and report when database is disconnected
    connection.on('disconnected', function () {
      console.log('Mongoose disconnected');
    });

    // Closes (disconnects) from Mongoose DB upon shutdown
    gracefulShutdown = async function (msg) {
      await connection.close();
      console.log('Mongoose disconnected through ' + msg);
      process.exit(0);
    };

    // For nodemon restarts
    process.once('SIGUSR2', async function () {
      await gracefulShutdown('nodemon restart');
      process.kill(process.pid, 'SIGUSR2');
    });

    // For app termination
    process.on('SIGINT', async function () {
      await gracefulShutdown('app termination');
    });

    // For Heroku app termination
    process.on('SIGTERM', async function () {
      await gracefulShutdown('Heroku app shutdown');
    });


  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
});

// Bring in Schemas and Models
import './blog';