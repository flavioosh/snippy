import React from 'react';


export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
    }

    handleChange(event) {
        this.props.handleChange(event.target.value);
    }

    handleClearClick() {
        this.props.handleChange('');

        this.refs.searchInput.focus();
    }

    render() {
        return (
            <div className="sn-searchbar">
                <input value={this.props.value} ref="searchInput" onChange={this.handleChange} placeholder="Search" />
                <button onClick={this.handleClearClick}>
                    <svg>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        )
    }
}
