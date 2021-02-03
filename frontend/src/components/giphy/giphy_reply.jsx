import React from "react";
import ClickOutHandler from 'react-onclickout';

import './giphy.css';
import { getGiphy } from "../../util/giphy_api_util";


class GiphyReply extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         giphyBoxOpen: false,
         keyword: "",
         giphys: [],
      }

      this.handleChange = this.handleChange.bind(this);
      this.makeGiphyRequest = this.makeGiphyRequest.bind(this);
      this.toggleGiphy = this.toggleGiphy.bind(this);
      this.handleSelection = this.handleSelection.bind(this);
   }
   makeGiphyRequest(){
      let keyword = this.state.keyword;
      if (keyword.length >= 1){
         
         getGiphy(keyword)
         .then(giphy => {
             
            this.setState({
               giphys: giphy.data.data
            })
         }
      )}
   }

  toggleGiphy(e){
     
     let giphyBoxOpen = this.state.giphyBoxOpen;
     giphyBoxOpen === true ? 
      this.setState({ giphyBoxOpen: false}) : this.setState({giphyBoxOpen: true})

  }
   handleChange(e){
      this.setState({
         keyword: e.currentTarget.value,
      }, this.makeGiphyRequest);
   }

   handleSelection(e){
      this.setState({ giphyBoxOpen: false}, this.props.useGiphy(e));
      this.props.toggleGiphy();
      const ele = document.getElementById(`chatbox-item-${this.props.roomTitle}`);
      ele.scrollTop = ele.scrollHeight;
   }

   componentDidMount(){

   }

   render(){

         return(
            <ClickOutHandler onClickOut={this.props.toggleGiphy} >
               <div className={this.props.case ? "giphydiv" : "reply-giphydiv"}>
                  <div className={this.props.case ? "giphy-search" : "reply-giphy-search"}>
                     
                     <ul className={this.props.case ? "giphy-ul" : "reply-giphy-ul"}>
                        {this.state.giphys.length > 0 && this.state.keyword.length > 1 ? (
                           this.state.giphys.map(gifs => {                      
                                    return(
                                    <li className="giphy-li" key={gifs.images.downsized.url} onClick={this.handleSelection}>
                                       <img src={gifs.images.downsized.url} alt="" className="giphy-li-img" />
                                    </li>      
                                    )
                                    
                                 })
                        ) : ""} 
                     </ul>
                     <input className="giphy-search-input" id={`${this.props.roomTitle}-giphysearch`} type="text" value={this.state.keyword} onChange={this.handleChange} placeholder="Enter a search term to find a Giphy" />
                  </div>
               </div>
            </ClickOutHandler>    
         )
   }
}

export default GiphyReply;