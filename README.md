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

* lightweigt indempotent chatroom operations (create, delete, update, show, join/leave, post/delete messages); 
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
  * logic and code (emphsize backend heavy design for message-chatroom assignments and why we favor it over frontend heavy: b/c as number of messages grow, frontend heavy design will delay chatroom load time as it takes longer to process data from backend)
  * For chatrooms, we came up two approaches to assign messages upon mounting:（1）Fetching the messages to the frontend all at once and filtering the messages according to each message's foreign key that denotes the chatroom it belongs to; （2）alternatively, saving the messages to the parent chatroom directly upon users sending the message so that everytime when the components mount, no extra time will be wasted. 
  * From an user experience standpoint,["a delay between 100 and 300 milliseconds is perceptible. a delay between 300 and 1,000 milliseconds makes the user feel like a machine is working, and if the delay is above 1,000 milliseconds, your user will likely start to mentally context-switch"](https://designingforperformance.com/performance-is-ux/#:~:text=A%20delay%20of%20less%20than,start%20to%20mentally%20context%2Dswitch)
  * Therefore, We went with the latter approach for the obvious reason: as number of message grows,relying message assignment purely in the frontend would delay chatroom load time. 
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
  * logic and code (discuss thought process and why this feature is important)
* algortithmic solution for searchbar
  * logic and code (compare search time between Pillar and slack using gif)
