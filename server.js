const express = require('express');
const cors = require('cors');
require("dotenv").config();
// const swaggerUi = require("swagger-ui-express")
// const swaggerDocument = require("./src/swagger-output.json")

const connectDB  = 
require('./dbconnect');
const port = process.env.PORT || 3001 
connectDB(); 


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api', require('./src/router/index'));


app.get('/start', (req, res) => {
    res.send(`<h1>Hello Molimor<h1/>`);
});


app.listen(port,()=>{
    console.log("Server is running on port", port);
})