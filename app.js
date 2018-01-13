var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');


//Load User model
require('./models/user');
require('./models/cert');


//Handlebars helpers
const {
  section,
  categoryList,
  formatDate,
  select
} = require('./helpers/hbs');

//Load keys
const keys = require('./config/keys');

//Map global promise
mongoose.Promise = global.Promise

var promise = mongoose.connect(keys.mongoURI, {
  useMongoClient: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Passport config
const passportConfig = require('./config/passport');

//require routes
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var cert = require('./routes/cert');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({
	helpers: {
		section:section,
    categoryList: categoryList,
    formatDate: formatDate,
    select: select
	},
	defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/cert', cert);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
