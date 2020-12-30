import React from "react"
import moment from "moment";
import Picker from 'emoji-picker-react';
import Giphy from "../giphy/giphy";
class Replies extends React.Component {
   constructor(props){
      super(props)

      this.state ={
         replyBox: false,
         replyText: "",
         repliesOpen: false,
         emojiPicker: false,
      }
      this.handleReply = this.handleReply.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.submitReply = this.submitReply.bind(this);
      this.toggleReplies = this.toggleReplies.bind(this)
      this.openEmoji = this.openEmoji.bind(this);
      this.selectEmoji = this.selectEmoji.bind(this);
      this.useGiphy = this.useGiphy.bind(this);
   }

   handleReply(e) {
      debugger;
      this.state.replyBox === false ? 
         (this.props.replies  ?
           this.setState({ replyBox: true, repliesOpen: true })
           : 
           this.setState({replyBox: true, repliesOpen: false})
         ) 
        :
        this.setState({ replyBox: false, repliesOpen: false })

   }
   handleChange(e){
      debugger
      this.setState({
         replyText: e.currentTarget.value
      })
   }

   submitReply(e){
      e.preventDefault();
      let username = this.props.user.username;
      let userId = this.props.user.id;
      let room = this.props.room;

      let timestamp = moment().format('LT');
      let reply = this.state.replyText;
      let message = this.props.msg.message
      let id =  this.props.message.id;
      this.props.socket.emit("Edit Message", {
         reply,
         timestamp,
         username,
         userId,
         room,
         message,
         id
      })
      this.setState({
         replyText: "",
         repliesOpen: true,
      })
   }

   toggleReplies() {
      this.state.repliesOpen === true ?
         this.setState({ repliesOpen: false, replyBox: false })
          : 
         this.setState({ repliesOpen: true, replyBox: true })
   }

   selectEmoji(e, emojiObject) {
      let newMessage = this.state.replyText + emojiObject.emoji;
      this.setState({
         replyText: newMessage
      })
   }

   openEmoji() {
      this.state.emojiPicker === true ?
         this.setState({ emojiPicker: false }) :
         this.setState({ emojiPicker: true })
   }

   useGiphy(e) {
      e.preventDefault();
      let username = this.props.user.username;
      let userId = this.props.user.id;
      let room = this.props.room;

      let timestamp = moment().format('LT');
      let reply = `${e.target.src}`;
      let message = this.props.msg.message;
      let id = this.props.message.id;
      this.props.socket.emit("Edit Message", {
         reply,
         timestamp,
         username,
         userId,
         room,
         message,
         id
      })
      this.setState({
         replyText: "",
         repliesOpen: true,
      })
   }


   render(){
      let msg = this.props.msg
      return(
         <div>
            {msg.replies && this.state.repliesOpen === true ?
               (

                  [msg.replies.map(reply => {
                     debugger;
                     // return (
                     if (reply.reply.includes("giphy")){
                        return (
                           <li key={reply._id} className="reply" >
                              {reply.username} says: <img className="chat-img" src={reply.reply} alt="image" />
                        </li>
                        )
                     }
                     else{
                        return (
                           <li key={reply._id} className="reply" id={`msg-reply-${reply.reply}`}>
                              {reply.username} says: {reply.reply}
                           </li>
                        )
                     }

                     // )
                  }),

                  
                     <button className="replies-div" onClick={this.toggleReplies}> Close Thread</button> 
                  ])
               : (msg.replies.length > 0 ? 
                  (msg.replies.length > 1 ?
                      <button className="replies-div" onClick={this.toggleReplies}> View {msg.replies.length} replies</button>
                      :
                     <button className="replies-div" onClick={this.toggleReplies}> View {msg.replies.length} reply</button>
                  )
                  : <button className="replies-div" onClick={this.toggleReplies}> Start Thread</button>)
            }
            {this.state.replyBox === false ?
            // (<button onClick={this.handleReply}> Add Reply</button>)
            ""
            :
            (
               <div>
                  <form onSubmit={this.submitReply}>
                    
                     <input type="text" onChange={this.handleChange} value={this.state.replyText}/>
                        
                  </form>
                     {this.state.emojiPicker === false ?
                        <button onClick={this.openEmoji} > ☺ </button> :
                        <div onMouseLeave={this.openEmoji}> <Picker className="emoji-picker" onEmojiClick={this.selectEmoji} /> </div>}
                     <Giphy useGiphy={this.useGiphy} roomTitle={this.props.room.title} />
                     {/* <button onClick={this.handleReply}> Cancel</button> */}
               </div>
            )}
            
         </div>
      )
   }
}

export default Replies;