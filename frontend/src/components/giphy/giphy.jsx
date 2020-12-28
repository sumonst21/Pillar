import React from "react"
import './giphy.css'

class Giphy extends React.Component {
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
      // this.useGiphy = this.props.useGiphy.bind(this);
   }
   makeGiphyRequest(){
       let keyword = this.state.keyword;
      if (keyword.length >= 1){
         
         this.props.fetchGiphy(keyword)
         .then(giphy => {
            
            this.setState({
               giphys: giphy.giphy.data.data
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
         keyword: e.currentTarget.value
      }, this.makeGiphyRequest);
     
   }

   componentDidMount(){

   }

   render(){
      if(this.state.giphyBoxOpen === true){
         return(   
            <div>
                  <button id="toggler" onClick={this.toggleGiphy}> Giphy </button>
                  <input type="text" value={this.state.keyword} onChange={this.handleChange} placeholder="Search Giphy" />
                  
                  {this.state.giphys.length > 0 && this.state.keyword.length > 1 ? (
                     <div> 
                        <ul className="giphy-ul">
                           {this.state.giphys.map(gifs => {
                              

                              return(
                              <li className="giphy-li" key={gifs.images.downsized.url} onClick={this.props.useGiphy}>
                                 <img src={gifs.images.downsized.url} alt="" className="giphy-li-img" />
                              </li>      
                              )
                              
                           })}
                        </ul>
                     </div>
                  ) : ""} 
                  
            </div>
         )
      }else{
         return(
            <button id="toggler" onClick={this.toggleGiphy}> Giphy </button>
         )
      }
   }
}

export default Giphy;