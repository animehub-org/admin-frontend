import React from "react";
import "../css/footer.scss"

class Footer extends React.PureComponent{
    render(){
        return(
            <div className="main-footer">
                <p>Animefoda</p>
                <div>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                </div>
            </div>
        )
    }
}

export default Footer;