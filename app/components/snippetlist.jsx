import React from 'react';

import Snippet from './snippet';


export default class SnippetList extends React.Component {
    checkIfMatch(snippet) {
        var searchValue = this.props.searchValue.toLowerCase();

        var nameMatch = snippet.name.toLowerCase().includes(searchValue);

        var langMatch = snippet.language.toLowerCase().includes(searchValue);

        var tagMatch = false;
        snippet.tags.forEach((tag) => {
            if(tag.toLowerCase().includes(searchValue)) {
                tagMatch = true;
            }
        });

        return nameMatch || langMatch || tagMatch;
    }

    render() {
        var snippets = [];
        if(this.props.snippets !== null) {
            if(this.props.searchValue === undefined) {
                this.props.snippets.forEach((snippet) => {
                    snippets.push(<Snippet snippet={snippet} key={snippet._id} handleClick={this.props.handleSnippetClick} handlePin={this.props.handlePin} handleDelete={this.props.handleDelete} handleTagClick={this.props.handleTagClick} languages={this.props.languages} />);
                });
            } else {
                this.props.snippets.forEach((snippet) => {
                    if(this.checkIfMatch(snippet))
                        snippets.push(<Snippet snippet={snippet} key={snippet._id} handleClick={this.props.handleSnippetClick} handlePin={this.props.handlePin} handleDelete={this.props.handleDelete} handleTagClick={this.props.handleTagClick} languages={this.props.languages} />);
                    return;
                });
            }
        }

        return (
            <ul className="sn-snippet-list">
                {snippets === null ? <span>Loading...</span> : snippets.length !== 0 ? snippets : <span>No snippets found.</span>}
            </ul>
        );
    }
}
