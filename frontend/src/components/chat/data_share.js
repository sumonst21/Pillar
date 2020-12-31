class SharedData {
    constructor(){
        this.openOrClose = [false];
        this.infoFromSearchbar = (bool) => {
            this.openOrClose.pop();
            this.openOrClose.push(bool);
            console.log(this.openOrClose)
        }; 
    };


    infoToChatbox(){

        return this.openOrClose
    };

}

const instance = new SharedData();

export default instance;