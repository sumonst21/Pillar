import React from 'react';
import {connect} from 'react-redux';

class SearchBarDropdown extends React.Component {
    constructor(props) {
        super(props)

        this.objectifiedMessages = this.objectifiedMessages.bind(this);
    }
    
    
    objectifiedMessages(obj){//get an object with roomJoined's title as the key and each room's messages as values
        const messageArr = [];
        Object.entries(obj).forEach(room => {
            const newObj = {};
            //  
            newObj[room[1].title]=room[1].messages.map(m=>(m.message));
            messageArr.push(newObj);
        });
        return messageArr.join('Þ');
    };


    render() {
        const {roomsJoined, allRooms, roomsAvailable, searchInput} = this.props;
        const roomObj = this.objectifiedMessages(roomsJoined);  
        //[{Dave's Room #1: ["hello Dave?", "Hi Dave.", "who am i?"...}, {yoyo: ["kjkjk", "what up homey?", "just chilling "...}...]
        //[{Dave's Room #1: [{[0, 11, 0]:"hello Dave?"}, {[starting index, ending index, object index=1]: "Hi Dave."}, "who am i?"...}
        //find character in string and use index to find its position in the above object 
        //Royer-Moore should return index positions like [13, 75, 12]
        //iterate the result and find the range in each message's key

        //or

        //seperate each message by 'Þ'
        //use the Royer-Moore algorithm
            //count the 'Þ' to get the index, and use the index to find the corresponding messages in the array below
        //roomObj: [{Dave's Room #1: ["hello Dave?", "Hi Dave.", "who am i?"...]}...]
         
        return (
            <div>
                caonima
            </div>
        )
                    
        
        
    }  
};



export default (SearchBarDropdown);