import classNames from 'classnames';
import Config from 'electron-config';
import electron from 'electron';
import React from 'react';


const config = new Config();

export default class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            useSystemTitleBar: config.get('useSystemTitleBar') || false
        }

        this.handleUseSystemTitleBarCheckboxChange = this.handleUseSystemTitleBarCheckboxChange.bind(this);
        this.handleSendFeedbackClick = this.handleSendFeedbackClick.bind(this);
    }

    handleUseSystemTitleBarCheckboxChange(event) {
        this.setState({useSystemTitleBar: event.target.checked});
        config.set('useSystemTitleBar', event.target.checked);
    }

    handleSendFeedbackClick() {
        electron.shell.openExternal('http://www.github.com/flavioosh/snippy');
    }

    render() {
        return (
            <div className="sn-settings">
                <div className="contents">
                    <h1>Settings</h1>
                    <hr/>
                    <section>
                        <h2>General</h2>
                        <div className="setting switch">
                            <input type="checkbox" id="useSystemTitleBarCheckbox" checked={this.state.useSystemTitleBar} onChange={this.handleUseSystemTitleBarCheckboxChange} />
                            <label htmlFor="useSystemTitleBarCheckbox">
                                <span className="name">Use system titlebar</span>
                                <span className="comment">Requires restart</span>
                            </label>
                        </div>
                    </section>
                    <hr/>
                    <section>
                        <h2>Other</h2>
                        <div onClick={this.handleSendFeedbackClick} className="setting link">
                            <svg>
                                <path d="M 11.999245,2.2466809 C 6.4778068,2.2466809 2,6.7238809 2,12.247081 c 0,4.4177 2.8650845,8.1662 6.8388728,9.4891 0.5003414,0.092 0.6826619,-0.2173 0.6826619,-0.4825 0,-0.2376 -0.0087,-0.8661 -0.013922,-1.7006 -2.7815916,0.6042 -3.3684835,-1.3406 -3.3684835,-1.3406 -0.4549013,-1.1553 -1.1105484,-1.463 -1.1105484,-1.463 -0.9079634,-0.62 0.068755,-0.6077 0.068755,-0.6077 1.0037299,0.071 1.5316865,1.0307 1.5316865,1.0307 0.8920006,1.5279 2.3408172,1.0866 2.9105228,0.8306 0.090838,-0.6457 0.3493097,-1.0865 0.6347719,-1.3364 -2.2204915,-0.2531 -4.555164,-1.1106 -4.555164,-4.9425 0,-1.0922 0.3898285,-1.9842001 1.0295144,-2.6834001 -0.1031415,-0.253 -0.4463066,-1.2697 0.098217,-2.6465 0,0 0.8392065,-0.269 2.7496607,1.0244 0.7974629,-0.2215 1.6532399,-0.332 2.5034999,-0.3363 0.849634,0 1.704802,0.1148 2.5035,0.3363 1.909239,-1.2934 2.747214,-1.0244 2.747214,-1.0244 0.54576,1.3768 0.202576,2.3935 0.100061,2.6465 0.640915,0.6992 1.027673,1.5912001 1.027673,2.6834001 0,3.8418 -2.338354,4.687 -4.565597,4.9345 0.358515,0.3087 0.678363,0.919 0.678363,1.8521 0,1.3364 -0.01218,2.4152 -0.01218,2.7429 0,0.2678 0.180493,0.5789 0.687569,0.4813 3.970729,-1.3253 6.833353,-5.0708 6.833353,-9.4879 0,-5.5232001 -4.477805,-10.0004001 -10.001086,-10.0004001" />
                            </svg>
                            <span>View on GitHub</span>
                        </div>
                    </section>
                </div>
                <section className="actions">
                    <button onClick={this.props.handleClose}>
                        <span>Close</span>
                    </button>
                </section>
            </div>
        )
    }
}
