import React from 'react';

export default function UserList(props) {
  
  let currentMembers = props.users.map(user => {
    return (
      <li>
        {user.username}
      </li>
    )
  });
   
  
  if (props.UserList === 'open' ){
      return (
        <div>
          <p>List of current users in this room</p>
          
            <ul>
              {currentMembers}
            </ul>
            
          
        </div>
      )}

  else{
    return (
      <div>
      
      </div>
    )
  }
}
