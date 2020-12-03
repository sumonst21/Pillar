const express = require("express");
const app = express();

const db = require('./config/keys').mongoURI;
const passport = require('passport');
const mongoose = require('mongoose');

const server= require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',  //added this due to CORS error
  }
});

const connect = mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const rooms = require("./routes/api/rooms");
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/messages", messages);
app.use("/api/rooms", rooms);

const Message = require("./models/Message");
// debugger;

io.on("connection", socket => {
  
  socket.on("Create Message", msg => {
    //msg ->  {message, timestamp, username, room}
    
    // debugger;
    connect.then(db => {
      try {

        //create new message


        let message = new Message({ 
                                    message: msg.message,
                                    sender: msg.userId,
                                    room: msg.rooom,
          });
          
          //attempt to save to database
          message.save((err, document) => {
            //record error, if any
            
            if(err) return res.json({ success: false, err });

            //retrieve new message by sender???
            Message.find({ "_id": document._id })
            .populate("sender")
            .exec((err,document) => {
//added socket.join
              socket.join(document.room);
              return io.to(document.room).emit("Broadcast Message",document);
            })
          })
        } catch (error) {
          console.log(error);
        }
      })
      
    })
    
    
  })
  
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`Server is running on port ${port}`));