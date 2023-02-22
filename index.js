require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const config = require('config');
const PORT = config.get('serverPort') || 5000;
const cors = require('cors');
const sequelize = require('./bd');
const mapping = require('./models/mapping');
const router = require('./routers/index');
const errorMiddleware = require('./middleware/errorHandleMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://aner3mg1.beget.tech',
      'https://avmickey.github.io/myapp',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: [
      'Accept-Version',
      'Authorization',
      'Credentials',
      'Content-Type',
    ],
  })
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cookieParser(config.get('secretKey')));
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, 'static', 'build')));
app.get('/*', function (req, res) {
  try {
    res.sendFile(path.resolve(__dirname, 'static', 'build', 'index.html'));
  } catch (error) {
    console.log('error');
    console.log(error);
  }
});
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, console.log('done'));
  } catch (error) {
    console.log(error);
  }
};

start();
