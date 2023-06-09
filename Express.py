from ast import Constant

Constant express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let users = {};

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (users[username] && users[username] === password) {
        res.send('Logged in');

        // Añadimos el usuario al XML
        let xml = xmlbuilder.create('users');
        xml.ele('user', username);
        fs.writeFileSync('users.xml', xml.end({ pretty: true }));
    } else {
        res.send('Bad login');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));