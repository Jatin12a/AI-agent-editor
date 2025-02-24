
import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
const app = express();
connect()
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app; 