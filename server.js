const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3001;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {

    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;

    fs.appendFile('server.log', log + '\n', (obj) => {
        if (obj != null) {
            console.log('unnable to write log.', obj);
        }
    });

    next();
});


app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('yell', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Wecome to the node express server for study purposes'
    });

});

app.get('/help', (req, res) => {
    res.send('help page');
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'unnable to locate'
    });
});


var users = [];
users.push({ id: 1, name: "guilherme" });
users.push({ id: 2, name: "danilo" });

app.get('/api/user', (req, res) => {

    res.send({
        users: users
    });

});

app.get('/api/user/:searchById', (req, res) => {

    var reqId = req.query.id;

    var ret = users.filter((user) => {
        return user.id == reqId;
    });

    res.send({
        users: ret
    });

});


app.listen(port, () => {
    console.log(`server is up at port ${port}`);
});