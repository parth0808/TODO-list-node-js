var express = require('express');
var app = express();
const dotenv = require('dotenv');
//var http = require('http');
//fs = require('fs');
/*app.use(express.static("public"));*/
const mongoose = require("mongoose");
const TodoTask = require("./Model/TodoTask");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
},
()=>{
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});


app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });
//app.get('/',(req,res) => {
//    res.render('todo.ejs');
//});

app.use(express.urlencoded({ extended: true }));
//Post
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

    //update
    app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
//remove
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
dotenv.config();

//






/*fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});    
        response.write(html);  
        response.end();  
        console.log("port 3000");
    }).listen(3000);
});*/

