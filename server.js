const express = require('express');
const cors = require('cors');
require("dotenv").config();
const path = require('path');

const connectDB  = 
require('./dbconnect');
const port = process.env.PORT || 3001 
connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./src/router/index'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/start', (req, res) => {
    res.send(`<h1>Hello Molimor<h1/>`);
});


app.listen(port,()=>{
    console.log("Server is running on port", port);
})