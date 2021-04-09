// importing 3rd party modules
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

// Authentication modules
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';

// Authentication objects
let localStrategy = passportLocal.Strategy;
import User from '../Models/user';

// Module for auth messaging and error-management
import flash from 'connect-flash';

// App configuration
import indexRouter from '../Routes/index';
export const app = express();
export default app;

// DB configuration
import * as DBConfig from './db';
mongoose.connect(DBConfig.URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`Connected to MongoDB at: ${DBConfig.URI}`);
});


// view engine setup
app.set('views', path.join(__dirname, '../Views/'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../Client/')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Setup express sessions
app.use(session({
  secret: DBConfig.Secret,
  saveUninitialized: false,
  resave: false
}));

// Initialize flash
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use Auth Strategy
passport.use(User.createStrategy());

// Serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.serializeUser());

// Route configuration
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: createError.HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development

  let message = err.message;
  let error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: message, error: error, title: '', page: '', displayName: '' });
});

//module.exports = app;