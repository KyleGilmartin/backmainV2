import express from 'express';
import Location from './routes/location';
import users from './routes/users';
import auth from './routes/auth'
import https from 'https';
import fs from 'fs'
import bodyParser from 'body-parser'

import mongoose from 'mongoose';
import cors from 'cors';
import config from './config'

const app = express();

app.use(cors());

const port = 2000;


// Define the database connecton and connect to it.
// Errors awill be logged to the console.
// this would normally come from a config file

//const connectionString = 'mongodb://127.0.0.1:27017/location'
const connectionString = config.connectionString;

mongoose.connect(connectionString, {
    "useNewUrlParser": true,
    "useUnifiedTopology": true,
    'useCreateIndex': true
}).
catch(error => {
    console.log('Database connection refused' + error);
    process.exit(2);
})

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log("DB connected")
});

const sslOptions = {

    key: fs.readFileSync("ssl/kylelocal.key"),

    cert: fs.readFileSync("ssl/kylelocal.cert")

};



// Configuring the built-in express body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/locations', Location);
app.use('/users', users);
app.use('/auth', auth);


app.get('/', (req, res) =>
    res.send('Sever Working'));


// app.get('/', (req, res) =>
//     res.send('Sever working, Port number);

app.get('/bananas', (req, res) =>
    res.send('hello world, this is bananas'));

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});







app.listen(port, () => console.log(`Example app listening on 
  ${port}!`))


https.createServer(sslOptions, app).listen(8080, () =>
    console.log('listening on 8080 too, don\'t forget the https'));