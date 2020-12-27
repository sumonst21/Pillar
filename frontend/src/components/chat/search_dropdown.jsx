import React from 'react';
import {connect} from 'react-redux';

class SearchBarDropdown extends React.Component {
    constructor(props) {
        super(props)

        this.removeEmojis = this.removeEmojis.bind(this);
        this.customizedJoin = this.customizedJoin.bind(this);
        this.objectifiedMessages = this.objectifiedMessages.bind(this);
        this.boyer_moore = this.boyer_moore.bind(this);
    };

    removeEmojis(string) {//function to replace emojis with space from https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
        const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        return string.replace(regex, " ");
    }
    
    customizedJoin(arr, joiner, replacer=' '){//customized .join method to filter out the gifs and replace them with an optional input
        let res = '';
        for(let i=0; i<arr.length; i++){
            if(arr[i].slice(0,8) == 'https://' && arr[i].slice(arr[i].length-4, arr[i].length) == '.gif'){
                arr.splice(i, 1, replacer);
            } 
            res += `${arr[i]}${joiner}`; 
            
        };
        res = this.removeEmojis(res);
        return res.slice(0, -1);
    };
    
    objectifiedMessages(obj){//get an object with roomJoined's title as the key and each room's messages as values
        const messageArr = [];
        Object.entries(obj).forEach(room => {
            const newObj = {};
            newObj[room[1].title]=room[1].messages.map(m=>(m.message));
            messageArr.push(newObj);
        });
        // messageArr.join('Þ');
        return messageArr; 
    };

    boyer_moore(str, sub){//using customized Boyer-Moore searching algorithm for faster lookup time for each input
        let skip;
        let res = [];
        let stopper = 0;
        let counter = 0;
        let bad_char = new Array(265).fill(-1);

        for(let t=0; t<sub.length; t++){//constructing bad character table for each chatacter in the substring at its corresponding place in 256 ASCII characters
            const index = sub[t].charCodeAt();
            bad_char[index] = t;
        };

        for(let i=0; i<=str.length-sub.length; i+=skip){//compare each character from substring to string, if mismatch, then shift to the next matching character; if no matching character found, shift the entire length of the substring
            skip=0;
            for(let j = sub.length-1; j>=0; j--){
                if(sub[j] != str[i+j]){
                    const asciiIndex = bad_char[str[i+j].charCodeAt()];
                    skip = 1 > j-asciiIndex ? 1 : j-asciiIndex;
                    break;
                }
            };

            if(skip === 0){
                let pos_obj={};
                for(let x = stopper; x < i; x++){//stopper and counter are tracking variables to track how many 'Þ' has passed, which later will be used to index corresponding substrings for each chatroom
                    if(str[x] === 'Þ'){
                        counter += 1;
                    };
                };
                stopper = i;
                pos_obj[i]=counter;
                res.push(pos_obj);
                skip++;
            }
        };
        return res; //result will look like [ { '2': 0 }, { '7': 2 }, { '13': 3 } ], where keys are starting index positions for matching substrings and values are how many 'Þ' has passed
    };

    roomAssigner(){//adding logic to determine which room it belongs to
        

    }


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
        debugger
        return (
            <div>
                caonima
            </div>
        )
                    
        
        
    }  
};



export default (SearchBarDropdown);