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
    res.render('signup', {
        message: '',
        loggedin: controller.isLoggedIn(req.ip)
    });
})

app.post('/signup', function (req, res) {
    controller.signUp(req.body.authorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
        res.redirect('/');

    }, function onRejection(error) {
        if (error === 'author already created') {
            res.render('signup', {
                message: 'That author name already exists. Please, try another one.',
                loggedin: controller.isLoggedIn(req.ip)
            });
       
        } else {
            console.log(error);
            res.render('signup', {
                message: 'Something went wrong. Please, try again.',
                loggedin: controller.isLoggedIn(req.ip)
            });

        }
    });

});

app.get('/login', function (req, res) {
    res.render('login', {
        message: '',
        loggedin: controller.isLoggedIn(req.ip)
    });
})

app.post('/login', function (req, res) {

    controller.login(req.body.authorName, req.body.password, req.ip).then(function onFullFillment(authorAccount) {
        res.redirect('/');

    }, function onRejection(error) {
        if(error === 'Author not found'){
            res.render('login', {
                message: 'Author name or password invalid. Please, try again.',
                loggedin: controller.isLoggedIn(req.ip)
            })
        } else {
            res.render('login', {
                message: 'Something went wrong. Please, try again.',
                loggedin: controller.isLoggedIn(req.ip)
            });
        }
    })
})



app.get('/', function (req, res) {

    const authorAccount = controller.getAuthorAccount(req.ip);

    if(authorAccount === undefined){
        res.redirect('/login');
        
    } else {
        const homePost = new PostUI('', 'Home', 'this is my home content', new Date(), 'starmickey');

        controller.getAllPosts(new Date()).then(
            function onFullFillment(postUIs) {
                res.render('home', {
                    homePost: homePost, posts: postUIs,
                    loggedin: controller.isLoggedIn(req.ip)
                });
            },
            function onRejection(error) {
                console.log(error);
                redirect('/');
            }
        )

    }
});


app.get('/about', function (req, res) {

    const aboutPost = new PostUI('', 'About', 'this is my about content', new Date(), 'starmickey');
    
    res.render('about', {
        aboutPost: aboutPost,
        loggedin: controller.isLoggedIn(req.ip)
    })

})



app.get('/compose', function (req, res) {

    if( !controller.isLoggedIn(req.ip)){
        res.redirect('/login');

    } else {
        res.render('compose', {
            loggedin: controller.isLoggedIn(req.ip)
        })
    }

})


app.post('/compose', function (req, res) {
    if( !controller.isLoggedIn(req.ip)){
        res.redirect('/login');

    } else {
        controller.createPost(req.body.postTitle, req.body.postBody, req.ip);
        res.redirect('/');
    }
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});