import classNames from 'classnames';
import React from 'react';
import {remote} from 'electron';
import CodeMirror from 'codemirror';
import Codemirror from 'react-codemirror';
import TagsInput from 'react-tagsinput';

require('codemirror/addon/mode/loadmode');

export default class ViewSnippet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.snippet.name,
            tags: this.props.snippet.tags,
            language: this.props.languages.indexOf(this.props.languages.filter((language) => {
                          return language.name == this.props.snippet.language;
                      })[0])
        }

        CodeMirror.modeURL = 'codemirror/mode/%N/%N';

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    changeLanguage(index) {
        var cm = this.refs.editor.getCodeMirror();
        var language = this.props.languages[index];
        cm.setOption('mode', language.mime);
        CodeMirror.autoLoadMode(cm, language.mode);
    }

    componentDidMount() {
        if(this.state.language)
            this.changeLanguage(this.state.language);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value})
    }

    handleLanguageChange(event) {
        this.setState({language: event.target.value});
        this.changeLanguage(event.target.value);
    }

    handleTagChange(tags) {
        this.setState({tags: tags});
    }

    handleSave() {
        this.props.snippetCollection.update({
            _id: this.props.snippet._id
        },
        {
            $set: {
                name: this.state.name,
                code: this.refs.editor.getCodeMirror().getValue(),
                language: this.props.languages[this.state.language].name,
                tags: this.state.tags
            }
        }, {}, () => {
            this.props.loadData();
        });
        this.props.handleClose();
    }

    handleClose() {
        if(this.state.name != this.props.snippet.name || this.state.tags != this.props.snippet.tags || this.refs.editor.getCodeMirror().getValue() != this.props.snippet.code) {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                type: 'question',
                buttons: ['yes', 'no'],
                title: 'Edit Snippet',
                message: 'Are you sure you want to close the snippet editor? All changes will be lost.'
            }, (response) => {
                if(response === 0) {
                    this.props.handleClose();
                }
            });
        } else {
            this.props.handleClose();
        }
    }

    render() {
        var languages = [];
        for(var i = 0; i < this.props.languages.length; i++) {
            languages.push(<option value={i} key={this.props.languages[i]._id}>{this.props.languages[i].name}</option>);
        }

        return (
            <div className="sn-edit-snippet">
                <div className="contents">
                    <header>
                        <input value={this.state.name} onChange={this.handleNameChange} placeholder="Snippet name" />
                        <select value={this.state.language} onChange={this.handleLanguageChange}>
                            {languages}
                        </select>
                    </header>
                    <Codemirror ref="editor" codeMirrorInstance={CodeMirror} value={this.props.snippet.code} options={{lineNumbers: true, theme: 'monokai2'}} />
                    <TagsInput value={this.state.tags} onChange={this.handleTagChange} />
                </div>
                <section className="actions">
                    <button onClick={this.handleClose}>
                        <span>Cancel</span>
                    </button>
                    <button className="save" onClick={this.handleSave}>
                        <span>Save</span>
                    </button>
                </section>
            </div>
        )
    }
}
