import React from 'react';
import ChatBox from './chat_box_container';

class DashBoard extends React.Component{

   render(){

      //the ids entered below are the instance ids of two rooms in the db
      return(

         <div>
            <ChatBox socketId="/5fc90aaf6da6f760b4b3b84a"/>    
            <ChatBox socketId="/5fc9193d0cb8b668f49456cd"/>    
         </div>


      )
   }
}


export default DashBoard;