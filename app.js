var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {google} = require('googleapis');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var gcal = require('google-calendar');
var fs = require('fs');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

const credential = require("./credentials.json");
var data;


passport.use(new GoogleStrategy({
    clientID: credential["web"]["client_id"],
    clientSecret: credential["web"]["client_secret"],
    callbackURL: credential["web"]["redirect_uris"][0]
  },
  function (accessToken, refreshToken, profile, done){
    profile.accessToken = accessToken;
    fs.writeFileSync("gcal.auth", accessToken);
    // var google_calendar = new gcal.GoogleCalendar(accessToken);
    // google_calendar.events.list(calendarId='primary',function(err, eventList) {
    //   data = JSON.parse(eventList);
    // })
    return done(null, profile);
}))

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', function(req, res) {
  res.render('login')
})

app.get('/auth',
  passport.authenticate('google', {
    scope: ['profile','https://www.googleapis.com/auth/calendar']
  }));



app.get('/auth_redirect', passport.authenticate('google', {failureRedirect: '/' }),
function (req, res){
  res.redirect('/index');
})

app.get('/index', function(req, res) {
  var accessToken = fs.readFileSync('gcal.auth').toString();
  var google_calendar = new gcal.GoogleCalendar(accessToken);
  google_calendar.events.list(calendarId='primary',function(err, eventList) {
    data = JSON.parse(eventList);
    res.render('index', {event : data});
  })

})


app.get('/json', function(req, res) {
  res.send(data);
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
