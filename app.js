const express = require('express');
const bodyParser = require('body-parser');
const { signup } = require('./Controller');
const controller = require(__dirname + '/controller.js')

const app = express();

// Config App

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// Variables and constraints
let actualUserAccount;


// Event handlers

app.get('/signup', function (req, res) {
    res.render('signup', {message: ''});
})

app.post('/signup', function (req, res) {
    signup(req.body.userName, req.body.password).then(function onFullFillment(userAccount) {
        actualUserAccount = userAccount;
        res.render('signup', {message: 'sign up successfull'})

    }, function onRejection(error) {
        if (error === 'user already created') {
            res.render('signup', {message: 'That user name already exists. Please, try another one.'});
       
        } else {
            console.log(error);
        }
    });

});

app.get('/login', function (req, res) {
    res.render('login');
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});