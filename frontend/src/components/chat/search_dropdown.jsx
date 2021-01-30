import React from 'react';
import { connect } from 'react-redux';
import { switches, switcheThread } from './data_share'

const mapStateToProps = (state) => {

    return {
        roomsJoined: state.rooms
    };

};


class SearchBarDropdown extends React.Component {
    constructor(props) {
        super(props)

        this.removeEmojis = this.removeEmojis.bind(this);
        this.listedMessages = this.listedMessages.bind(this);
        this.findRepliesMasterMessage = this.findRepliesMasterMessage.bind(this);
        this.objectifiedMessages = this.objectifiedMessages.bind(this);
        this.filteredRooms = this.filteredRooms.bind(this);
        this.objectifiedReplies = this.objectifiedReplies.bind(this);
        this.boyer_moore = this.boyer_moore.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClickChatroom = this.handleClickChatroom.bind(this);
        this.handleClickThread = this.handleClickThread.bind(this);
    };



    removeEmojis(string) {//function to replace emojis from https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
        const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        return string.replace(regex, " ");
    };



    listedMessages(obj) {//get an object with roomJoined's title as the key and each room's messages as values
        const messageArr = [];
        Object.entries(obj).forEach(room => {
            const title = [room[1].title]; //put title ar the index 0 in the messageArr
            const messages = room[1].messages.map(m => (
                m.message
            ));
            const newArr = title.concat(messages)
            messageArr.push(newArr);
        });
        return messageArr;
    };

    findRepliesMasterMessage(reply, obj) {
        const res = [];
        Object.entries(obj).forEach(room => {
            room[1].messages.forEach(m => {
                if (m.replies.map(m => (m.reply)).includes(reply)) {
                    return res.push(m.message)
                };
            });
        });
        return res;
    };

    listedReplies(obj) {
        const repliesArr = [];
        Object.entries(obj).forEach(room => {
            let allReplies = [];
            let title = [room[1].title];
            let replies = room[1].messages.filter(m => {
                return m.replies.length > 0
            });
            for (let i = 0; i < replies.length; i++) {
                allReplies = allReplies.concat(replies[i].replies.map(r => (r.reply)));
            }
            const newArr = title.concat(allReplies)
            repliesArr.push(newArr);
        });
        return repliesArr;
    };

    objectifiedMessages(arr) {//get an object with roomJoined's title as the key and each room's messages as values
        const newObj = {}
        Object.entries(arr).forEach(room => {
            newObj[room[1].title] = room[1].messages.map(m => (m.message));
        });
        return newObj;
    };

    objectifiedReplies(arr) {
        const repObj = {};
        arr.forEach(room => {
            repObj[room[0]] = room.slice(1);
        });
        return repObj;
    };

    filteredRooms(sub) {//display a list of matching rooms
        const { allRooms } = this.props;
        const roomList = allRooms.map(room => {

            return room.title
        });
        let filteredRooms = [];
        for (let r = 0; r < roomList.length; r++) {
            let skip;
            let bad_char = new Array(265).fill(-1);

            for (let t = 0; t < sub.length; t++) {//constructing a bad character table for each chatacter in the substring at its corresponding place in 256 ASCII characters
                const index = sub[t].charCodeAt();
                bad_char[index] = t;
            };

            for (let i = 0; i <= roomList[r].length - sub.length; i += skip) {//compare each character from substring to string, if mismatch, then shift to the next matching character; if no matching character found, shift the entire length of the substring
                skip = 0;
                for (let j = sub.length - 1; j >= 0; j--) {
                    if (sub[j].toLowerCase() != roomList[r][i + j].toLowerCase()) {
                        const asciiIndex = bad_char[roomList[r][i + j].charCodeAt()];
                        skip = 1 > j - asciiIndex ? 1 : j - asciiIndex;
                        break;
                    }
                };
                if (skip === 0) {
                    filteredRooms.push([roomList[r]]);
                    skip++;
                    break
                }
            }
        }
        return filteredRooms; //return list of object with matching room name as key and character index as value 
    };

    boyer_moore(arr, sub) {//customized seaching function based on Boyer Moore searchign algorithm for faster lookup
        let filteredMessages = [];
        arr.forEach(room => {//iterating thru rooms
            for (let r = 1; r < room.length; r++) {//iterating thru messages in each room
                if (room[r].slice(0, 8) !== 'https://' && room[r].slice(room[r].length - 4, room[r].length) !== '.gif' &&
                    room[r].slice(0, 4) !== '<img' && room[r].slice(room[r].length - 1, room[r].length) !== '>') {//skipiing gifs
                    room[r] = this.removeEmojis(room[r]);
                    let skip;
                    let bad_char = new Array(265).fill(-1);

                    for (let t = 0; t < sub.length; t++) {//constructing a bad character table for each chatacter in the substring at its corresponding place in 256 ASCII characters
                        const index = sub[t].charCodeAt();
                        bad_char[index] = t;
                    };

                    for (let i = 0; i <= room[r].length - sub.length; i += skip) {//compare each character from substring to string, if mismatch, then shift to the next matching character; if no matching character found, shift the entire length of the substring
                        skip = 0;
                        for (let j = sub.length - 1; j >= 0; j--) {
                            if (sub[j].toLowerCase() != room[r][i + j].toLowerCase()) {
                                const asciiIndex = bad_char[room[r][i + j].charCodeAt()];
                                skip = 1 > j - asciiIndex ? 1 : j - asciiIndex;
                                break;
                            }
                        };
                        if (skip === 0) {
                            filteredMessages.push([room[0], r - 1, i]);
                            skip++;
                        };
                    }
                }
            }
        });

        return filteredMessages; //this returns an array: [room_title, message_index, matching_character_index]
    };

    handleOpen(id) {
        const roomTitle = id.split('-');
        let roomsJoined = this.props.roomsJoined
        let email = this.props.user.email;
        let userId = this.props.user.id;
        for (let i = 0; i < Object.keys(roomsJoined).length; i++) {
            if (roomsJoined[Object.keys(roomsJoined)[i]].title === roomTitle[1] && roomsJoined[Object.keys(roomsJoined)[i]].closedFor.includes(email)) {
                let roomId = roomsJoined[Object.keys(roomsJoined)[i]]._id;
                this.props.editClosedFor(roomId, email, userId)
                    .then(rooms => {
                        
                    })
            }
        }
        switches.sendOpen(roomTitle[1]);//tells the chatroom to open
    };
    handleOpenThread(title) {
        let roomsJoined = this.props.roomsJoined
        let email = this.props.user.email;
        let userId = this.props.user.id;
        for (let i = 0; i < Object.keys(roomsJoined).length; i++) {
            if (roomsJoined[Object.keys(roomsJoined)[i]].title === title && roomsJoined[Object.keys(roomsJoined)[i]].closedFor.includes(email)) {
                let roomId = roomsJoined[Object.keys(roomsJoined)[i]]._id;
                // let email = this.props.user.email;
                // let userId = this.props.user.id;
                this.props.editClosedFor(roomId, email, userId)
                    .then(rooms => {
                    })
            }
        }
        switches.sendOpen(title);//tells the chatroom to open
    };
    async handleClickChatroom(id) {
        await this.handleOpen(id)
        setTimeout(() => {//open first then search the element
            const ele = document.getElementById(id);
            ele.scrollIntoView();
            this.props.handleDropDown();
        }, 600);
    };
    handleClickThread(id, room, msg) {
        this.handleOpenThread(room);
        switches.sendOpen(room);
        setTimeout(() => {
            switcheThread.sendOpenThread(msg);
            setTimeout(() => {
                const ele = document.getElementById(id);
                ele.scrollIntoView();
            })
        }, 1200);
        this.props.handleDropDown();
    };



    render() {
        let { roomsJoined, allRooms, roomsAvailable, searchInput } = this.props;
        if (allRooms !== undefined && roomsAvailable.data !== undefined) {
            allRooms = allRooms.map(r => (Object.values(r))).map(roomTitle => (roomTitle[3])) || []; //return an array of all of the room titles ["Dave's Room #1", "sss", "hahaha", "heyheyhey", "lala", "blah", "yoyo", "Cars", "new new new"]
            roomsAvailable = roomsAvailable.data.map(r => (Object.values(r))).map(roomTitle => (roomTitle[3])) || []; //return an array of all the rooms available to join
        };

        const roomArr = this.listedMessages(roomsJoined);
        const repliesArr = this.listedReplies(roomsJoined);
        const roomsDisplayed = roomArr.map(r => (r[0]));

        const availableRoomObj = this.objectifiedMessages(roomsJoined);
        const searchableReplies = this.objectifiedReplies(repliesArr);

        const matchedMessages = this.boyer_moore(roomArr, searchInput).map(m => {
            return [availableRoomObj[m[0]][m[1]].slice(m[2]), m[0], m[1]]; //m[0] is the chatroom title; m[1] is the index number for the matching string in the array; and m[2] is the matching substring
        });
        const matchedRooms = this.filteredRooms(searchInput).map(room => {
            return room[0];
        });
        const matchedReplies = this.boyer_moore(repliesArr, searchInput).map(m => {
            return [searchableReplies[m[0]][m[1]].slice(m[2]), m[0], m[1], searchableReplies[m[0]][m[1]]]; //m[0] is the chatroom title; m[1] is the index number for the matching string in the array; and m[2] is the matching substring
        });

        //function to find the thread master for the reply using the searchableReplies[m[0]][m[1]] from line 190
        const roomsJoinable = matchedRooms.filter(room => (roomsAvailable.includes(room)));
        const roomsOpened = matchedRooms.filter(room => (roomsDisplayed.includes(room)));


        return (
            <div className='searchbar-dropdown'>
                <div className='message-results'>
                    {matchedMessages.length === 0 ?
                        <p>No Messages Found</p>
                        :
                        <ul>
                            {matchedMessages.map(m => {
                                return (
                                    <li className="click-search" onClick={() => this.handleClickChatroom(`msg-${m[1]}-${m[2]}`)}>
                                        Message: {m[0]} Room: {m[1]}
                                    </li>
                                )
                            })}
                        </ul>}
                </div>
                <p>------------------------------</p>
                <div className='replies-results'>
                    {matchedReplies.length === 0 ?
                        <p>No Replies Found</p>
                        :
                        <ul>
                            {matchedReplies.map(m => {
                                const masterMessage = this.findRepliesMasterMessage(m[3], roomsJoined)//this should return a list of master messages
                                return (
                                    <li className="click-search" onClick={() => this.handleClickThread(`msg-reply-${m[3]}`, m[1], masterMessage[0])}>
                                        Thread Replies: {m[0]} Room: {m[1]}
                                    </li>
                                )
                            })}
                        </ul>}
                </div>
                <p>------------------------------</p>
                <div className='room-results'>
                    {matchedRooms.length === 0 ?
                        <p>No Rooms Found</p>
                        :
                        <ul>
                            {roomsJoinable.length === 0 ? null :

                                roomsJoinable.map(r => {
                                    return (
                                        <li>
                                            {r}
                                            <p>Rooms Not Joined</p>
                                        </li>
                                    )
                                })
                            }
                            {roomsOpened.length === 0 ? null :
                                roomsOpened.map(r => {
                                    return (
                                        <li>{r}</li>
                                    )
                                })
                            }
                        </ul>}

                </div>
            </div>
        )
    }
};


export default connect(
    mapStateToProps,
    null
)(SearchBarDropdown);