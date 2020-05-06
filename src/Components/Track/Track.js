import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {}

        //this.renderAction = this.renderAction.bind(this);
    }


    //double check the .bind() below if this isn't working...
    renderAction() {
        if(this.props.isRemoval) {
            return <button className="Track-Action">-</button>
        }
        else {
            return <button className="Track-Action">+</button>
        }
    }
    
    render() {
        return(
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction.bind(this)}
            </div>
        );
    }
}