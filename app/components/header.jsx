import classNames from 'classnames';
import React from 'react';

import SearchBar from './searchbar';


export default class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasShadow: false
        }

        this.handleCreateSnippetClick = this.handleCreateSnippetClick.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
    }

    handleCreateSnippetClick() {
        this.props.handleCreateSnippetClick();
    }

    handleSettingsClick() {
        this.props.handleSettingsClick();
    }

    render() {
        return (
            <header className={classNames('sn-header', {shadow: this.state.hasShadow})}>
                <button className="icon add" onClick={this.props.handleCreateSnippetClick}>
                    <svg>
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </button>
                <SearchBar value={this.props.searchValue} handleChange={this.props.handleSearchChange} />
                <button className="icon settings" onClick={this.props.handleSettingsClick}>
                    <svg>
                        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                    </svg>
                </button>
            </header>
        )
    }
}
