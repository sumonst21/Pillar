import React from 'react';
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{

   render(){

      //the ids entered below are the instance ids of two rooms in the db
      return(

         <div>
            <ChatBox room="5fc810be1f1ba53c26f5a0aa"/>    
            <ChatBox room="5fc879982d81c84872b2f7fb"/>    

         </div>


      )
   }
}


export default DashBoard;