import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5555;
const mongodbURL = process.env.MONGODB_URL || 'mongodb+srv://it22900968:DIma2001@gaminitours.jzsuooy.mongodb.net/?retryWrites=true&w=majority&appName=GaminiTours';

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send("Welcome to Todo API");
});

app.use('/tasks', taskRoutes);

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });