require('dotenv').config();
const sequelize = require("./src/config/database")
const express = require('express');
const app = express();
const cors = require('cors');
const express_port = 8080;
const path = require('path')

const authRoutes = require('./src/routes/authRoutes');
const createRoutes = require('./src/routes/createRoutes')
const authorFetchRoutes = require('./src/routes/authorFetchRoutes')
const authorUpdateRoutes = require('./src/routes/authorUpdateRoutes')
const userFetchRoutes = require('./src/routes/userFetchRoutes')
const archiveRoutes = require('./src/routes/archiveRoutes')
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/create', createRoutes)
app.use('/api/authorfetch', authorFetchRoutes)
app.use('/api/authorupdate', authorUpdateRoutes)
app.use('/api/userfetch', userFetchRoutes)
app.use('/api/archive', archiveRoutes)
app.use('/uploads', express.static(path.posix.join(__dirname, 'uploads')))

//uncomment to sync db vvv -harley
// sequelize.sync() 
console.log(path.posix.join(__dirname, 'uploads'))
app.listen(express_port, ()=> {
    console.log('Listening on port 8080');
})
