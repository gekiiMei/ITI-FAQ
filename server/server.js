require('dotenv').config();
const sequelize = require("./src/config/database")
const express = require('express');
const app = express();
const cors = require('cors');
const express_port = 8080;

const authRoutes = require('./src/routes/authRoutes')

app.use(cors());
app.use(express.json())

app.use('/api/auth', authRoutes)

//uncomment to sync db vvv -harley
// sequelize.sync() 
app.listen(express_port, ()=> {
    console.log('Listening on port 8080');
})
