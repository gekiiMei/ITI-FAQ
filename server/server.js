require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const express_port = 8080;

app.use(cors());
app.use(express.json())

app.listen(express_port, ()=> {
    console.log('Listening on port 8080');
})
