var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


var dbUrl = "mongodb+srv://rmarathe:messagingapp@cluster0.etq7oql.mongodb.net/?retryWrites=true&w=majority";

app.use(express.static(__dirname));

io.on('connection', (socket)=>{
    console.log('A user is connected', socket.id)
})
mongoose.connect(dbUrl, (err)=> {
    console.log('monogodb connected', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

var Message = mongoose.model('Message', {name : String , message : String });

app.get('/messages',(req, res) => {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content- Type, Accept");
    console.log("In get");
    Message.find({}, (err,messages) => {
        console.log("In Get")
        res.send(messages);
    })
} );

app.post('/messages', (req, res) => {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content- Type, Accept");
    console.log("In post");
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
        sendStatus(500);
        io.emit("message",req.body);
        res.sendStatus(200);
    })
  })

server.listen(3000, ()=> {
    console.log("Server is runnig on port", server.address().port);
})