const express = require("express");
const app = express();

const db = require('./config/keys').mongoURI;
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');


const server = require("http").createServer(app);
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/messages", messages);
app.use("/api/rooms", rooms);

const Message = require("./models/Message");
const Room = require("./models/Room");
//const room = require("./validation/room");


io.on("connection", socket => {
  console.log(`connection made from socket id ${socket.id}`);

  socket.on("User connected", ({ user, rooms }) => {
    //create rooms
    Object.keys(rooms).forEach(roomId => {
      socket.join(roomId);
    })
      //io.emit("new member", members + rooms) to let rooms know someone else is now online
  })

  socket.on("Create Message", msg => {
    connect.then(db => {
      try {
        let message = new Message({
          message: msg.message,
          sender: msg.userId,
          room: msg.room,
        });
        message.save((err, document) => {

          //record error, if any
          if (err) return res.json({ success: false, err });

          //retrieve new message by sender???
          Message.find({ "_id": document._id })
            .populate("sender")
            .exec((err, document) => {
              //emit to a unique reciever

              //add to a rooms array of messages
              Room.findOneAndUpdate(
                { _id: document[0].room },
                { $push: { messages: document } },
                (error, success) => {
                  if (error) {
                    console.log("Add message to room array failed: " + error);
                  } else {
                    io.emit(`MTC_${document[0].room.toString()}`, document);
                    console.log("Message added to room");
                  }
                }
              )
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
