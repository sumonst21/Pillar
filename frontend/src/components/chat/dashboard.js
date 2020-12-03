import React from 'react';
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{

   render(){

      //the ids entered below are the instance ids of two rooms in the db
      return(

         <div>
            <ChatBox room="5fc810be1f1ba53c26f5a0aa"/>    
         </div>


      )
   }
}


export default DashBoard;