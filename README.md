# Pillar


## Mission Statement 

Pillar was born out of our frustration with using [Slack](https://slack.com/intl/en-is/) as the primary tool for group communication. Slack is all fine and dandy(despite having a sluggish searchbar) until users try to migrate a message from one channel to another, and when time is of the essence, this whole quit-current-channel-then-switch-to-another-then-switch-back process could become exponentially more cumbersome. 

As software developers, we work in groups, thus having an integrated UI for multi-channeled display comes in extremely handy when coordinating with different personel. To achieve this goal, we took inspiration from [TweetDeck](https://tweetdeck.twitter.com/), a dashboard application that is capable of receving multiple streams of tweets per user's customization. 

In short, you can think of Pillar as our attempt to create a 'dashboarded' Slack that displays multiple channels to better facilitate real time group communications. 

(insert gif here)

## Tech Stack

* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en/)
* [Socket.io](https://socket.io/)
* [RxJS](https://rxjs-dev.firebaseapp.com/)

## Design roadmap

To enhance user experience, we sketched out a design to **optimize the efficiency for ease of use**, which includes: 
* a single page dashboard that provides accessibility to all of Pillar's features; (insert screenshot here);
* lightweigt indempotent chatroom operations (create, delete, update, show, join/leave, post/delete messages); (insert multiple chatroom gifs here);
* cross device state preservation for chatroom display; (insert screenshots) 
* algorithmic solution(Boyer-Moore) for fast seach result lookup. (insert gifs)

## Design execution

* Single page dashboard
  * logic and code (maybe use a diagram for illustration)
* chartooms operations
  * logic and code (emphsize backend heavy design for message-chatroom assignments and why we favor it over frontend heavy: b/c as number of messages grow, frontend heavy design will delay chatroom load time as it takes longer to process data from backend)
* cross device state preservation
  * logic and code (discuss thought process and why this feature is important)
* algortithmic solution for searchbar
  * logic and code (compare search time between Pillar and slack using gif)
