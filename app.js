var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user');

/**
 * Connect to mongoDB.
 */

const mongoose = require('mongoose');
console.log('Connecting to MongoDB...');
mongoose.connect('mongodb://127.0.0.1:27017/tracking-money-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'lKa8gZ353a57jiDji1rd9XdZB1nod2FNlCYqAhB1LP4jjxnzLu9SZHTigbpBnVn', // Reemplaza con tu clave secreta
};


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRoutes = require('./routes/auth');
var expensesRoutes = require('./routes/expenses');
var incomesRoutes = require('./routes/incomes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/expenses', expensesRoutes);
app.use('/incomes', incomesRoutes);

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return done(null, false);
    }
    
    if (!user.validPassword(password)) {
      return done(null, false);
    }
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  console.log("lala");
  try{
  const user = await User.findOne({ _id: jwt_payload.userId });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }catch(err){
    return done(err, false);
  }

}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
