import React from "react"
import moment from "moment";
class Replies extends React.Component {
   constructor(props){
      super(props)

      this.state ={
         replyBox: false,
         replyText: "",
         
      }
      this.handleReply = this.handleReply.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.submitReply = this.submitReply.bind(this);
   }

   handleReply(e) {
      this.state.replyBox === false ? 
      this.setState({replyBox: true}) : this.setState({replyBox: false})

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
      // room: this.props.message.room,
      // sender: this.props.message.sender,
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
      })
   }
   render(){

      return(
         <div>
            {this.state.replyBox === false ?
            (<button onClick={this.handleReply}> Add Reply</button>)
            :
            (
               <div>
                  <form onSubmit={this.submitReply}>
                    
                     <input type="text" onChange={this.handleChange}/>
                        
                  </form>
                     <button onClick={this.handleReply}> Cancel</button>
               </div>
            )}
            {this.props.msg.replies ? 
            this.props.msg.replies.map(reply =>{
              <li>{reply}</li>
            })
            : ""}
         </div>
      )
   }
}

export default Replies;