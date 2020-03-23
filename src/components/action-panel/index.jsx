import React, {Component} from 'react';

class ActionPanel extends Component {
    render() {
        return (
            <div id='action-panel' className={`flex flex-col ${this.props.canPlay ? 'ready' : 'not-ready'}`}>
                <button className='m-2 bg-blue-700 text-white p-1 px-5 mr-2 hover:bg-blue-900'
                        onClick={this.props.onPlayCard}
                        disabled={!this.props.showPlayBtn}>
                    Play
                </button>
                <button className='m-2 bg-blue-700 text-white p-1 px-5 mr-2 hover:bg-blue-900'
                        onClick={this.props.onDrawCard}
                        disabled={!this.props.showDrawBtn}>
                    Take
                </button>
                <button className='m-2 bg-red-800 text-white p-1 px-5 hover:bg-red-900'
                        onClick={this.props.onShow}>
                    Show
                </button>
            </div>
        );
    }
}

export default ActionPanel;