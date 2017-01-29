import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import CodeMirror from 'codemirror';
import {remote} from 'electron';
require('codemirror/addon/runmode/runmode');
require('codemirror/addon/mode/loadmode');

import Tag from './tag';


export default class Snippet extends React.Component {
    constructor(props) {
        super(props);

        CodeMirror.modeURL = 'codemirror/mode/%N/%N';

        this.handleClick = this.handleClick.bind(this);
        this.handlePinClick = this.handlePinClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    componentDidUpdate() {
        var language;
        for(var i = 0; i < this.props.languages.length; i++) {
            if(this.props.languages[i].name === this.props.snippet.language) {
                language = this.props.languages[i];
                break;
            }
        }

        if(language !== null && language !== undefined) {
            CodeMirror.requireMode(language.mode, () => {
                CodeMirror.runMode(this.props.snippet.code, language.mime, this.refs.code)
            });
        } else {
            CodeMirror.runMode(this.props.snippet.code, "", this.refs.code)
        }
    }

    handleClick() {
        this.props.handleClick(this.props.snippet);
    }

    handlePinClick(event) {
        event.stopPropagation();
        this.props.handlePin(this.props.snippet._id, this.props.snippet.pinned)
    }

    handleDeleteClick(event) {
        event.stopPropagation();
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            type: 'question',
            buttons: ['yes', 'no'],
            title: 'Delete Snippet',
            message: 'Are you sure you want to delete this snippet?'
        }, (response) => {
            if(response === 0) {
                this.props.handleDelete(this.props.snippet._id);
            }
        });
    }

    getDate() {
        var snippetDate = moment(this.props.snippet.dateAdded);
        if(snippetDate.year() === moment().year())
            return snippetDate.format('D MMM');
        return snippetDate.format('D MMM Y')
    }

    render() {
        if(this.props.snippet.language == 'JSX') {
            console.log(this.props.snippet.code);
        }
        var tagElements = [];
        this.props.snippet.tags.forEach((tag) => {
            tagElements.push(<Tag key={tag} handleClick={this.props.handleTagClick} tag={tag} />);
        });
        return (
            <li className={classNames('sn-snippet',{pinned: this.props.snippet.pinned})} onClick={this.handleClick}>
                <button className="icon pin" onClick={this.handlePinClick}>
                    <svg>
                        <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                    </svg>
                </button>
                <button className="icon delete" onClick={this.handleDeleteClick}>
                    <svg>
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                </button>
                <pre ref="code" className="CodeMirror cm-s-monokai2"></pre>
                <ul className="tags">
                    {tagElements}
                </ul>
                <div className="info">
                    <span className="name">{this.props.snippet.name}</span>
                    <div className="detail">
                        <span className="language">{this.props.snippet.language}</span>
                        <span className="date">{this.getDate()}</span>
                    </div>
                </div>
            </li>
        )
    }
}
