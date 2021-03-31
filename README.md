# Pillar

Communication Made Better by Pillar [Live](https://pillrz.herokuapp.com/#/)

![Splash Page Demo](https://github.com/dabaojian1992/Pillar/blob/main/gifs/splash2.gif)


### Mission Statement 


Pillar was born out of our frustration with using [Slack](https://slack.com/intl/en-is/) as the primary tool for group communications. Slack is all fine and dandy until users try to migrate a message from one channel to another, and when time is of the essence, this whole quit-current-channel-then-switch-to-another-then-switch-back process could become exponentially more cumbersome. 

As software developers, we work in groups, thus having an integrated UI for multi-channeled display comes in extremely handy when coordinating with different personel. To achieve this goal, we took inspiration from [TweetDeck](https://tweetdeck.twitter.com/), a dashboard application that is capable of receving multiple streams of tweets per user's customization. 

**In short, you can think of Pillar as our attempt to create a 'dashboarded' Slack that displays multiple channels to better facilitate real time group communications.** 


### Tech Stack

* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Node.js](https://nodejs.org/en/)
* [Socket.io](https://socket.io/)
* [Node-sass](https://www.npmjs.com/package/node-sass)
* [Emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react)
* [RxJS](https://rxjs-dev.firebaseapp.com/)

### Design roadmap

To enhance user experience, we sketched out a design to **optimize the efficiency for ease of use**, which includes: 
* a single page dashboard that provides accessibility to all of Pillar's features; 
![all features](https://github.com/dabaojian1992/Pillar/blob/main/gifs/all_features.gif)

* lightweight indempotent chatroom operations (create, delete, update, show, join/leave, post/delete messages); 
![Chatroom Operations](https://github.com/dabaojian1992/Pillar/blob/main/gifs/chatroom_operations.gif)

* cross device state preservation for chatroom display; 
![state preservation](https://github.com/dabaojian1992/Pillar/blob/main/gifs/state_preservation.gif)

* algorithmic solution(Boyer-Moore) for fast seach result lookup. 
![searchbar](https://github.com/dabaojian1992/Pillar/blob/main/gifs/search.gif)

### Design execution

* Single page dashboard
 ![dashboard](https://github.com/dabaojian1992/Pillar/blob/main/gifs/Screenshot%202021-02-07%20235445.png)
  * For ease of use, we comprised all of Pillar's features into a single dashboard. 
  * By design, 'DashBoard' component renders all of the sub-components. Therefore, its main functions are fetching all the necessary data upon mounting and setting up the websocket connection. 
  * Below is the code where we fetch data and connect websocket upon mounting:
  ```js
  componentDidMount(){
      
      getRooms(this.props.user.id)
         .then(rooms => {
            this.setState({
               roomsJoined: rooms,
            })
         })
         .then(()=>{
            getAvailableRooms(this.props.user.id)                                
            .then(rooms => {
               this.setState({
                  roomsAvailable: rooms,
               })
            })
            .then(()=>{
               this.setState({all: this.state.roomsAvailable.data.concat(this.state.roomsJoined.data)})
            })
         })
      
      this.socket.on("user left", this.userLeft);
      this.socket.on("user joined", this.userJoined);
      this.socket.on("room deleted", this.roomDeleted);
      this.socket.on("room created", this.roomCreated);
   }
   ```
* chartooms operations
  * For chatrooms, we came up two approaches to assign messages upon mounting:（1）Fetching the messages to the frontend all at once and filtering the messages according to each message's foreign key that denotes the chatroom it belongs to; （2）alternatively, saving the messages to the parent chatroom directly upon users sending the message so that when everytime a components mounts, no extra time will be wasted. 
  * From an user experience standpoint,["a delay between 100 and 300 milliseconds is perceptible; a delay between 300 and 1,000 milliseconds makes the user feel like a machine is working, and if the delay is above 1,000 milliseconds, your user will likely start to mentally context-switch"](https://designingforperformance.com/performance-is-ux/#:~:text=A%20delay%20of%20less%20than,start%20to%20mentally%20context%2Dswitch)
  * Therefore, we went with the latter approach for the obvious reason: as number of message grows,relying message assignment purely in the frontend would delay chatroom load time. 
  * Below is how we setup the backend code to save the message diretcly into its parent chatroom: 
  
  ```js
  socket.on("Create Message", msg => {
    connect.then(db => {
      try {

        const message = new Message({
          message: msg.message,
          sender: msg.userId,
          room: msg.room,
          username: msg.username,
        });

        message.save((err, document) => {
          //record error, if any
          if (err) return res.json({ success: false, err });
          io.emit(`MTC_${document.room._id.toString()}`, document);
           
          //add to a rooms array of messages
          Room.findOneAndUpdate(
            { _id: document.room._id },
            { $push: { messages: document } },
            (error, success) => {
               
              if (error) {
                console.log("Add message to room array failed: " + error);
              } else {
                io.emit(`MTC_${document.room._id.toString()}`, document);
                console.log("Username: "+message.username);
                 
              }
            }
          )
            
        })
      } catch (error) {
        console.log(error);
      }
    })

  })
  ```
* cross device state preservation
  * One of Pillar's key features is to preserve the chatroom's state across sessions. In other words, a closed chatroom should remain closed if an user logs back in after logging out. 
  * To achieve this, we came up with the design to save the chatroom's state to the database upon an user open/close a room. 
  * Below is the code where we save the chatroom state in the backend: 
  ```js
  router.patch('/closedfor', (req, res) => {
    REQ = req; 
    Room.findByIdAndUpdate(req.body.roomId)
    .exec().then(room => {
      if (room.closedFor.includes(req.body.email) ){
        room.closedFor = room.closedFor.filter(match => (match != req.body.email))
    }
    else{
        room.closedFor.push(req.body.email)
    }
    room.save().then(saved => {
      Room.find({})
        .populate({
          path: 'messages',
          model: 'Message',
          populate: {
            path: 'sender',
            model: 'User'
          }
        }).populate({
          path: 'users',
          model: 'User'
        }) 
        .exec((err, rooms) => {
          if (err) {
            res.status(404).json({ noroomsfound: 'No rooms found' });
          } else {
            let roomList = filterRooms(rooms, req.body.id);
            res.json(roomList);
          }

        })
    }) 
    })
  });
  ```
* algortithmic solution for searchbar
  * One of the most complained features of Slack is its search being slow. To create a more efficient searchbar, we customized our own [Boyer-Moore algotithm](https://www.youtube.com/watch?v=4Xyhb72LCX4) implementing its bad character rule. 
  * Below is the code where we implement the algorithm:
  ```js
  boyer_moore(arr, sub) {
        let filteredMessages = [];
        arr.forEach(room => {
            for (let r = 1; r < room.length; r++) {//iterating thru messages in each room
                if (room[r].slice(0, 8) !== 'https://' && room[r].slice(room[r].length - 4, room[r].length) !== '.gif' &&
                    room[r].slice(0, 4) !== '<img' && room[r].slice(room[r].length - 1, room[r].length) !== '>') {//skipiing gifs
                    room[r] = this.removeEmojis(room[r]);
                    let skip;
                    let bad_char = new Array(265).fill(-1);

                    for (let t = 0; t < sub.length; t++) {//constructing a bad character table for each chatacter in the substring at its corresponding place in 256 ASCII characters
                        const index = sub[t].charCodeAt();
                        bad_char[index] = t;
                    };

                    for (let i = 0; i <= room[r].length - sub.length; i += skip) {//compare each character from substring to string, if mismatch, then shift to the next    matching character; if no matching character found, shift the entire length of the substring
                        skip = 0;
                        for (let j = sub.length - 1; j >= 0; j--) {
                            if (sub[j].toLowerCase() != room[r][i + j].toLowerCase()) {
                                const asciiIndex = bad_char[room[r][i + j].charCodeAt()];
                                skip = 1 > j - asciiIndex ? 1 : j - asciiIndex;
                                break;
                            }
                        };
                        if (skip === 0) {
                            filteredMessages.push([room[0], r - 1, i]);
                            skip++;
                        };
                    }
                }
            }
        });

        return filteredMessages; 
    };
  ```
