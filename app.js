const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'ASDSADASDHASJLDFHASJKFNFIWEFUEMUIOWNVJDKLVNSDFKOJGNSGOKUSJNGSLJSDHFUOSDGHSDJGKLHSDGIK',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

let users = {};

fs.readFile('users.xml', function(err, data) {
    xml2js.parseString(data, function (err, result) {
        users = result.users.user.reduce((acc, user) => {
            acc[user.username[0]] = {username: user.username[0], password: user.password[0]};
            return acc;
        }, {});
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (!users[username]) {
      return done(null, false, { message: 'Usuario no encontrado.' });
    }
    if (users[username].password != password) {
      return done(null, false, { message: 'Contraseña incorrecta.' });
    }
    return done(null, users[username]);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  let user = users[username];
  done(null, user);
});

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/access',
    failureRedirect: '/login',
    failureFlash: 'Usuario o contraseña incorrectos'
  })
);

app.post('/register', (req, res) => {
    let newUser = {
        username: req.body.username,
        password: req.body.password
    };

    users[newUser.username] = newUser;

    let usersArray = Object.keys(users).map(key => users[key]);

    let builder = new xml2js.Builder();
    let xml = builder.buildObject({users: {user: usersArray}});

    fs.writeFile('users.xml', xml, function(err, data) {
        if (err) console.log(err);

        console.log("Usuario guardado correctamente.");
    });

    res.redirect('/login');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/public/register.html');
});

app.get('/access', function(req, res) {
    res.sendFile(__dirname + '/public/access.html');
});

app.get('/', function(req, res) {
  res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});