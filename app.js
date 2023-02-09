const express = require('express');
const bodyParser = require('body-parser');
const controller = require(__dirname + '/controller.js')

const app = express();

// Config App

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('trust proxy', true)


// Event handlers

app.get('/signup', function (req, res) {
    res.render('signup', {message: ''});
})

app.post('/signup', function (req, res) {
    controller.signup(req.body.AuthorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
        res.redirect('/');

    }, function onRejection(error) {
        if (error === 'author already created') {
            res.render('signup', {message: 'That author name already exists. Please, try another one.'});
       
        } else {
            console.log(error);
            res.render('signup', {message: 'Something went wrong. Please, try again.'});

        }
    });

});

app.get('/login', function (req, res) {
    res.render('login', {message: ''});
})

app.post('/login', function (req, res) {
    controller.login(req.body.AuthorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
        res.redirect('/');
    }, function onRejection(error) {
        if(error === 'Author not found'){
            res.render('login', {message: 'Author name or password invalid. Please, try again.'})
        } else {
            res.render('login', {message: 'Something went wrong. Please, try again.'});
        }
    })
})



app.get('/', function (req, res) {
    const authorAccount = controller.getAuthorAccount(req.ip);

    if(authorAccount === undefined){
        res.redirect('/login');
        
    } else {
        res.render('home');

    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});