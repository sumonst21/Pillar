import React from "react"
import moment from "moment";
import Picker from 'emoji-picker-react';
import GiphyReply from "../giphy/giphy_reply";
import * as cloneDeep from 'lodash/cloneDeep';
import {switcheThread} from './../../components/chat/data_share';
import ClickOutHandler from 'react-onclickout';
import Reply from './reply';

class Replies extends React.Component {
   constructor(props){
      super(props)

      this.state ={
         replyBox: false,
         replyText: "",
         repliesOpen: false,
         emojiPicker: false,
         giphyBox: false,
         showOptions: false,
      }
      this.handleReply = this.handleReply.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.submitReply = this.submitReply.bind(this);
      this.openEmoji = this.openEmoji.bind(this);
      this.selectEmoji = this.selectEmoji.bind(this);
      this.useGiphy = this.useGiphy.bind(this);
      this.deleteGifReply = this.deleteGifReply.bind(this);
      this.toggleGiphy = this.toggleGiphy.bind(this);
      

   };

   componentDidMount(){
      this.subscription = switcheThread.receiveOpenThread().subscribe(message=>{
      if(message === this.props.message.message){
        this.setState({repliesOpen: true});
      }; 
    })
   };

   handleReply(e) {
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
      this.setState({
         replyText: e.currentTarget.value
      })
   };


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
   };

   selectEmoji(e, emojiObject) {
      let newMessage = this.state.replyText + emojiObject.emoji;
      this.setState({
         replyText: newMessage
      })
   };

   openEmoji() {
      this.state.emojiPicker === true ?
         this.setState({ emojiPicker: false }) :
         this.setState({ emojiPicker: true })
   };

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
   };

   deleteGifReply(e){
      let response = window.confirm(`Are you sure you want to delete your Gif?`);
      if (response) {
         let replies = cloneDeep(this.props.msg.replies);
         let replyId = e.currentTarget.id;
          
         let replyIndex = replies.findIndex(reply => replyId === reply._id);
         replies.splice(replyIndex, 1);

         this.props.socket.emit("Edit Message Reply", {
            message: this.props.msg,
            replies: replies,
         });
      }
   }

   toggleGiphy(){
      if (this.state.giphyBox){
         this.setState({
            giphyBox: false,
         })
      } else (
         this.setState({
            giphyBox: true
         })
      )
   }


   render(){
      let msg = this.props.msg;
      let giphy_button = "Giphy";
      if (this.state.giphyBox){
         giphy_button = "Close";
      }

      let emoji_menu = null;
      if(this.state.emojiPicker){
         emoji_menu = (
            <div onClick={this.openEmoji}>
               <ClickOutHandler onClickOut={this.openEmoji} >
                  <div className="picker-wrapper-reply">
                     <Picker className="emoji-picker" onEmojiClick={this.selectEmoji} />
                  </div>
               </ClickOutHandler>
            </div>
         )
      }



      return(
         <div className="replies-container">
            {msg.replies ?
               (<div className="replies-list-container">
                  <ul className="replies-list">
                     {msg.replies.map(reply => {
                        // return (
                        if (reply.reply.includes("giphy")){
                           return (
                              <li key={reply._id} className="reply" >
                                 <h6>{reply.username}:</h6>  
                                 <img className="chat-img" src={reply.reply} alt="image" />
                                 {reply.userId === this.props.user.id && 
                                    <button onClick={this.deleteGifReply} className="text-input-button2" 
                                       id={reply._id}>Delete Gif
                                    </button>
                                 }
                              </li>
                           )
                        }
                        else{
                           return (
                              <Reply reply={reply} socket={this.props.socket}
                                       msg={msg} user={this.props.user}/>
                           )
                        }
                     })}
                  </ul>
               </div>
                  )
               : (null)
            }
            <div className="send-reply-form">
               {this.state.giphyBox ? (
                  <GiphyReply useGiphy={this.useGiphy} toggleGiphy={this.toggleGiphy} 
                     roomTitle={this.props.room.title} />
               ):(null)}
               {emoji_menu}
               <div className="reply-form-buttons">
                  <button className="text-input-button2 reply-emoji" onClick={this.openEmoji} > ☺ </button> 
                  <button className="text-input-button reply" onClick={this.toggleGiphy}>{giphy_button}</button>
                  <form onSubmit={this.submitReply}>
                     <input className="message-text-input reply" type="text" placeholder="Send a reply" 
                        onChange={this.handleChange} value={this.state.replyText}/>
                     <button className="text-input-button reply" type="submit">Send</button>
                  </form>
               </div>
            </div>            
         </div>
      )
   }
}

export default Replies;