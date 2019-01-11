var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
//Note: laptop mongodb install path is C:\Program Files\MongoDB\Server\4.0
//commands:  mongo, show dbs, use customerapp, db.users.find()
var db = mongojs('customerapp', ['users'])
var objectId = mongojs.ObjectId;

var app = express();

//My middleware function
// var myLogger = function(req, res, next){
//     console.log('Logging...');
//     next();
// };

// app.use(myLogger);

// View Engine  (templating engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use(function(req, res, next){
    res.locals.errors = [];
    next();
});

// Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
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
//end middleware

// var people = [
//     {
//         name:  'Josh Hamilton',
//         firstName: 'Josh',
//         lastName: 'Hamilton',
//         age: 50,
//         email: 'jhamil@somefunnyplace.org'
//     },
//     {
//         name: 'Sarah Long',
//         firstName: 'Sarah',
//         lastName: 'Long',
//         age: 60,
//         email: 'sarahlong@baddabingbaddaboom.com'
//     }
// ];

//Begin routes
app.get('/', function(req, res){
    //res.send('Hello world!');
    //res.render('index')
    // res.render('index2', {
    //     title: 'Customers'
    // });
    // res.render('index3', {
    //     title: 'Customers'
    // });
    db.users.find(function (err, docs) {
        //docs is an array of all the documents in the collection
        console.log(docs);
        res.render('index4', {
            title: 'Customers',
            people: docs
        });
    });
    
    //res.json(people);
});

//const { check, validationResult } = require('express-validator/check');

app.post('/users/add',
    function(req, res){
        console.log('Form submitted');
        req.checkBody('first_name', 'First name is required').notEmpty();
        req.checkBody('last_name', 'Last name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not a valid email address').isEmail();

        var errors = req.validationErrors();
        if (errors) {
            console.log('errors');
            res.render('index4', {
                title: 'Customers',
                people: people,
                errors: errors
            });
        } else {
            errors = []
            var newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            };
            db.users.insert(newUser, function(dbInsertError, result){
                if (dbInsertError){
                    console.log(dbInsertError);
                };
                res.redirect('/');
            });
            console.log('SUCCESS');
            console.log(newUser);
        }
    }
);

app.delete('/users/delete/:id', function(req, res){
    console.log(req.params.id);
    db.users.remove({_id: objectId(req.params.id)}, function(deleteError, result){
        if (deleteError){
            console.log(deleteError);
        }
        else {
            res.redirect('/');
        }
    })
});

//End routes

app.listen(3000, function(){
    console.log('Server started on port 3000');
});