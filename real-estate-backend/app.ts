import express from 'express';
import cors from 'cors';
import listingsRouter from './src/routes/listings';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/listings', listingsRouter);

export default app;
