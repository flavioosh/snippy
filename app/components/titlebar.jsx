import classNames from 'classnames';
import React from 'react';
import {remote} from 'electron';


export default class TitleBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleMinimizeClick = this.handleMinimizeClick.bind(this);
        this.handleMaximizeClick = this.handleMaximizeClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);

        this.state = {
            blur: false
        }

        var _this = this;
        remote.getCurrentWindow().on('blur', function() {
            _this.setState({blur: true});
        });
        remote.getCurrentWindow().on('focus', function() {
            _this.setState({blur: false});
        });

    }

    handleMinimizeClick() {
        remote.getCurrentWindow().minimize();
    }

    handleMaximizeClick() {
        if(remote.getCurrentWindow().isMaximized())
            remote.getCurrentWindow().unmaximize();
        else
            remote.getCurrentWindow().maximize();
    }

    handleCloseClick() {
        remote.getCurrentWindow().close();
    }

    render() {
        return (
            <div className={classNames('sn-titlebar', {'blur': this.state.blur})}>
                <span className="title">Snippy</span>
                <div className="buttons">
                    <button onClick={this.handleMinimizeClick}>
                        <svg>
                            <rect width="10" height="2" x="3" y="12"/>
                        </svg>
                    </button>
                    <button onClick={this.handleMaximizeClick}>
                        <svg>
                            <path d="m 2,2 0,12 12,0 0,-12 z m 2,2 8,0 0,8 -8,0 z"/>
                        </svg>
                    </button>
                    <button onClick={this.handleCloseClick}>
                        <svg>
                            <path d="M 14,3.6 12.4,2 8,6.4 3.6,2 2,3.6 6.4,8 2,12.4 3.6,14 8,9.6 12.4,14 14,12.4 9.6,8 Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}
