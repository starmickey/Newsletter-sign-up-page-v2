const express = require('express');
const bodyParser = require('body-parser');
const { PostUI } = require('./data-objects/PostUI');
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
    controller.signUp(req.body.authorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
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
    controller.login(req.body.authorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
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
        const homePost = new PostUI('', 'Home', 'this is my home content', new Date(), 'starmickey');
        const posts = [];
        posts.push(new PostUI('', 'Post', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", new Date(), 'starmickey'));
        posts.push(new PostUI('', 'Post', 'this is my post content', new Date(), 'starmickey'));
        posts.push(new PostUI('', 'Post', 'this is my post content', new Date(), 'starmickey'));
        posts.push(new PostUI('', 'Post', 'this is my post content', new Date(), 'starmickey'));
        posts.push(new PostUI('', 'Post', 'this is my post content', new Date(), 'starmickey'));

        res.render('home', {homePost: homePost, posts: posts});

    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});