const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const userRouter = require('./router/userRouter')


//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("DB connected"))
    .catch((err) => console.log(err));
  
  // Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
  }));
  app.use(cookieParser());
  app.use(cors());
  
  // Routes
  app.use('/api', userRouter);
  
  // Error Handler
  app.use(errorHandler);