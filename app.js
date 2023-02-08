const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    res.render('index');
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});