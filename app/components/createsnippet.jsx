import classNames from 'classnames';
import React from 'react';
import {remote} from 'electron';
import CodeMirror from 'codemirror';
import Codemirror from 'react-codemirror';
import TagsInput from 'react-tagsinput';

require('codemirror/addon/mode/loadmode');

export default class CreateSnippet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            language: 0,
            tags: []
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
        this.props.snippetCollection.insert({
            name: this.state.name,
            code: this.refs.editor.getCodeMirror().getValue(),
            dateAdded: new Date(),
            pinned: false,
            language: this.props.languages[this.state.language].name,
            tags: this.state.tags
        });
        this.props.loadData();
        this.props.handleClose();
    }

    handleClose() {
        if(this.state.name != '' || this.state.tags.length != 0 || this.refs.editor.getCodeMirror().getValue() != '') {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                type: 'question',
                buttons: ['yes', 'no'],
                title: 'Create Snippet',
                message: 'Are you sure you want to close the snippet creator? All changes will be lost.'
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
                    <Codemirror ref="editor" codeMirrorInstance={CodeMirror} options={{lineNumbers: true, theme: 'monokai2'}} />

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
