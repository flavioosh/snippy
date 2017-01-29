import React from 'react';


export default class Tag extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        this.props.handleClick(this.props.tag);
    }


    render() {
        return (<li onClick={this.handleClick}>{this.props.tag}</li>)
    }
}
