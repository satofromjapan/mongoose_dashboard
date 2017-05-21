//dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//create express app
var app = express();

//use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cat_dashboard')

//Schema
var DashboardSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 2},
  age: {type: Number, required: true, min: 1, max: 30},
  color: {type: String, required: true, minlength: 2}
}, {timestamps: true});

mongoose.model('Cat', DashboardSchema);
var Cat = mongoose.model('Cat');

//set up views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//root route (show all cats) *complete
app.get('/', function (req, res){
  Cat.find({}, function(err, cats){
    res.render('index', {cats: cats})
  })

})

//route to display form for new cat *complete
app.get('/cats/new', function(req,res){
  res.render('new')
})

//route to handle the creating of new cat *complete
app.post('/cats', function(req,res){
  console.log("POST DATA", req.body);
  var cat = new Cat({name: req.body.name, age: req.body.age, color: req.body.color})
  cat.save(function(err){
    if(err){
      // console.log('error')
      // console.log(quote.errors);
      console.log("these are errors", cat.errors)
      res.render('new', {title: 'you have errors!', errors: cat.errors})
    }
    else{
      console.log('success')
      res.redirect('/')
    }
  })
})

//route to show form to edit an existing cat *complete
app.get('/cats/edit/:id', function(req,res){
  Cat.find({_id: req.params.id}, function(err, cats){
    res.render('edit', {cats: cats})
  })

})

//route to handle the editing of existing cat *complete
app.post('/cats/:id', function(req,res){
  console.log("POST DATA", req.body)
  Cat.update({_id:req.params.id}, {name: req.body.name, age: req.body.age, color: req.body.color}, function(err){
    if(err){
      console.log(cat.errors);
      res.render('/cats/:id')
    }
    else {
      console.log('success')
      res.redirect('/')
    }
  })
})

//route to delete a cat by ID
app.get('/cats/destroy/:id', function(req, res){
  console.log("POST DATA", req.body)
  Cat.remove({_id: req.params.id}, function(err){
    if(err){

      console.log("these are errors", cat.errors)
      res.render('index', {title: 'you have errors!', errors: cat.errors})
    }
    else{
      console.log('success')
      res.redirect('/')
    }
  })
})

//server
var server = app.listen(8000, function(){
  console.log('listening on port 8000')
})
