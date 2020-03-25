import React, {Component} from 'react';

class ActionPanel extends Component {
    render() {
        return (
            <div className='flex flex-col'>
                <div id='action-panel'
                     className={`flex flex-col ${this.props.hasGameStarted && this.props.canPlay ? '' : 'hidden'}`}>
                    <button className='m-2 rounded bg-blue-700 text-white p-1 px-5 mr-2 hover:bg-blue-900'
                            onClick={this.props.onPlayCard}
                            disabled={!this.props.showPlayBtn}>
                        Play Card(s)
                    </button>
                    <button className='m-2 rounded bg-blue-700 text-white p-1 px-5 mr-2 hover:bg-blue-900'
                            onClick={this.props.onDrawCard}
                            disabled={!this.props.showDrawBtn}>
                        Take Card(s)
                    </button>
                    <button className='m-2 rounded bg-red-800 text-white p-1 px-5 hover:bg-red-900'
                            onClick={this.props.onDeclare}
                            disabled={!this.props.showPlayBtn}>
                        SHOW Points
                    </button>
                </div>
                <button className='m-2 mb-3 rounded bg-red-800 text-white p-1 px-5 hover:bg-red-900'
                        onClick={this.props.onEndGame}>
                    ☠️ Quit Game
                </button>
            </div>
        );
    }
}

export default ActionPanel;