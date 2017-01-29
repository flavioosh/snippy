import Config from 'electron-config';
import Datastore from 'nedb';
import React from 'react';
import {remote} from 'electron';

import CreateSnippet from './createsnippet';
import Header from './header';
import Settings from './settings';
import SnippetList from './snippetlist';
import TitleBar from './titlebar'
import ViewSnippet from './viewsnippet';

import path from 'path';


const config = new Config();

const SnippetCollection = new Datastore({
    filename: remote.app.getPath('userData') + '/data/snippets.db',
    autoload: true
});

const LanguageCollection = new Datastore({
    filename: remote.app.getPath('userData') + '/data/languages.db',
    autoload: true
});

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pinnedSnippets: [],
            recentSnippets: [],
            allSnippets: [],

            showCreateSnippet: false,
            showSettings: false,
            showViewSnippet: false,

            selectedSnippet: null,

            searchValue: '',

            languages: []
        }

        this.loadData = this.loadData.bind(this);

        this.handleSearchChange = this.handleSearchChange.bind(this);

        this.handleSnippetPin = this.handleSnippetPin.bind(this);
        this.handleSnippetDelete = this.handleSnippetDelete.bind(this);
        this.handleSnippetTagClick = this.handleSnippetTagClick.bind(this);

        this.handleCreateSnippetClick = this.handleCreateSnippetClick.bind(this);
        this.handleCreateSnippetClose = this.handleCreateSnippetClose.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);
        this.handleSettingsClose = this.handleSettingsClose.bind(this);
        this.handleViewSnippetClick = this.handleViewSnippetClick.bind(this);
        this.handleViewSnippetClose = this.handleViewSnippetClose.bind(this);

        this.handleBlackoutClick = this.handleBlackoutClick.bind(this);

        this.handleContentScroll = this.handleContentScroll.bind(this);
    }

    loadData() {
        var _this = this;

        // Load all snippets from NeDB
        // Pinned
        SnippetCollection.find({pinned: true}).sort({dateAdded: -1}).exec((error, snippets) => {
            _this.setState({pinnedSnippets: snippets});
        });

        // Recents
        SnippetCollection.find({pinned: false}).sort({dateAdded: -1}).exec((error, snippets) => {
            _this.setState({recentSnippets: snippets});
        });

        // All
        SnippetCollection.find({}).sort({name: 1}).exec((error, snippets) => {
            _this.setState({allSnippets: snippets});
        });

        // Load languages
        // LanguageCollection.find({}).sort({frequency: -1, name: 1}).exec((error, languages) => {
        LanguageCollection.find({}).sort({name: 1}).exec((error, languages) => {
            _this.setState({languages: languages});
        });
    }

    componentDidMount() {
        // Install languages if there are none
        if(!config.get('languagesInstalled') || false) {
            LanguageCollection.count({}, (err, count) => {
                if(count === 0) {
                    var langs = [
                        'text/x-csrc,clike,C',
                        'text/x-c++src,clike,C++',
                        'text/x-csharp,clike,C#',
                        'text/x-coffeescript,coffeescript,CoffeeScript',
                        'text/css,css,CSS',
                        'text/x-go,go,Go',
                        'text/html,xml,HTML',
                        'text/x-java,clike,Java',
                        'text/javascript,javascript,JavaScript',
                        'text/jsx,jsx,JSX',
                        'text/x-less,css,Less',
                        'text/x-markdown,markdown,Markdown',
                        'text/x-objectivec,clike,Objective-C',
                        'text/x-python,python,Python',
                        'text/x-php,php,PHP',
                        'text/x-pug,pug,Pug',
                        'text/x-ruby,ruby,Ruby',
                        'text/x-sass,sass,SASS',
                        'text/x-scss,css,SCSS',
                        'text/x-sh,shell,Shell',
                        'text/x-swift,swift,Swift',
                        'application/xml,xml,XML'
                    ];

                    for(var i = 0; i < langs.length; i++) {
                        var splitLang = langs[i].split(',');
                        var mime = splitLang[0],
                            mode = splitLang[1],
                            name = splitLang[2];

                        LanguageCollection.insert({
                            name: name,
                            mode: mode,
                            mime: mime
                        });
                    }
                }
            });

            config.set('languagesInstalled', true);
        }

        this.loadData();
    }

    handleSearchChange(searchValue) {
        this.setState({searchValue: searchValue});
    }

    handleSnippetPin(snippetID, pinned) {
        SnippetCollection.update({
            _id: snippetID
        },
        {
            $set: {
                pinned: !pinned
            }
        });
        this.loadData();
    }

    handleSnippetDelete(snippetID) {
        SnippetCollection.remove({
            _id: snippetID
        })
        this.loadData();
    }

    handleSnippetTagClick(tag) {
        this.setState({searchValue: tag});
    }


    handleCreateSnippetClick() {
        this.setState({showCreateSnippet: true});
    }

    handleCreateSnippetClose() {
        this.setState({showCreateSnippet: false});
    }

    handleSettingsClick() {
        this.setState({showSettings: true});
    }

    handleSettingsClose() {
        this.setState({showSettings: false})
    }

    handleViewSnippetClick(snippet) {
        this.setState({
            showViewSnippet: true,
            selectedSnippet: snippet
        });
    }

    handleViewSnippetClose() {
        this.setState({showViewSnippet: false});
    }

    handleBlackoutClick() {
        this.setState({
            showSettings: false,
            showCreateSnippet: false,
            showViewSnippet: false
        })
    }

    handleContentScroll() {
        const content = this.refs.content;
        const header = this.refs.header;

        if(content.scrollTop !== 0 && !header.state.hasShadow)
            header.setState({hasShadow: true});
        else if(content.scrollTop === 0 && header.state.hasShadow)
            header.setState({hasShadow: false});
    }

    render() {
        var langs = [];
        if(this.state.languages !== null) {
            this.state.languages.forEach((lang) => {
                langs.push(<div key={lang._id}>{lang.name}</div>);
            });
        }

        return (
            <div className="sn-app">
                {this.props.useSystemTitleBar ? null : <TitleBar />}
                <main>
                    <Header ref="header" searchValue={this.state.searchValue} handleSearchChange={this.handleSearchChange} handleCreateSnippetClick={this.handleCreateSnippetClick} handleSettingsClick={this.handleSettingsClick} />
                    <div className="content" ref="content" onScroll={this.handleContentScroll}>
                        {this.state.searchValue.length === 0 ? (
                        <section>
                            {this.state.pinnedSnippets.length === 0 ? null : (
                            <h2>Pinned</h2>
                            )}
                            {this.state.pinnedSnippets.length === 0 ? null : (
                            <SnippetList snippets={this.state.pinnedSnippets} handleSnippetClick={this.handleViewSnippetClick} handlePin={this.handleSnippetPin} handleDelete={this.handleSnippetDelete} handleTagClick={this.handleSnippetTagClick} languages={this.state.languages} />
                            )}
                            {this.state.pinnedSnippets.length === 0 ? null : (
                            <h2>Recents</h2>
                            )}
                            <SnippetList snippets={this.state.recentSnippets} handleSnippetClick={this.handleViewSnippetClick} handlePin={this.handleSnippetPin} handleDelete={this.handleSnippetDelete} handleTagClick={this.handleSnippetTagClick} languages={this.state.languages} />
                        </section>
                        ) : (
                        <section>
                            <h2>Search</h2>
                            <SnippetList snippets={this.state.allSnippets} searchValue={this.state.searchValue} handleSnippetClick={this.handleViewSnippetClick} handlePin={this.handleSnippetPin} handleDelete={this.handleSnippetDelete} handleTagClick={this.handleSnippetTagClick} languages={this.state.languages} />
                        </section>
                        )}
                    </div>
                </main>
                {this.state.showSettings ? (
                    <Settings handleClose={this.handleSettingsClose} />
                ) : null}
                {this.state.showCreateSnippet ? (
                    <CreateSnippet handleClose={this.handleCreateSnippetClose} languages={this.state.languages} snippetCollection={SnippetCollection} loadData={this.loadData} />
                ) : null}
                {this.state.showViewSnippet ? (
                    <ViewSnippet handleClose={this.handleViewSnippetClose} snippet={this.state.selectedSnippet} languages={this.state.languages} snippetCollection={SnippetCollection} loadData={this.loadData} />
                ) : null}
                {this.state.showSettings || this.state.showCreateSnippet || this.state.showViewSnippet ? (
                    <div className="blackout" onClick={this.handleBlackoutClick}></div>
                ) : null}
            </div>
        )
    }
}
