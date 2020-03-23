import React, {Component} from 'react';

class GameArea extends Component {
    render() {

        if (!this.props.hasGameStarted) {
            return (
                <div className='bg-green-600 w-4/5 flex flex-col h-screen justify-between content-between'>
                    <div className='text-center'>
                        <div className='p-5 text-white'>
                            Waiting for users to join.
                            Click here to start the game.
                        </div>
                        <button className='bg-blue-900 px-5 py-2 text-white' onClick={this.props.startGameHandler}>
                            Start Game
                        </button>
                    </div>
                </div>
            )
        }

        if (!this.props.hasDeck) {
            return (
                <div className='bg-green-600 w-4/5 flex flex-col h-screen justify-between content-between'>
                    <div className='text-center'>
                        <div className='p-5 text-white'>
                            Distributing cards. Please wait...
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div
                className={`bg-green-600 w-4/5 flex flex-col h-screen justify-between content-between 
                ${this.props.canPlay ? 'ready' : 'not-ready'}`}
                id='game-area'>
                <div className='flex flex-1'>
                    <div className='w-4/5 flex flex-col ml-5'>
                        <div className='mt-3 text-white'>Last card(s)</div>
                        <div className='w-full flex flex-1 flex-row items-center' id='prev-play-area'/>
                        <div className='mt-3 text-white'>You played below card(s)</div>
                        <div className='w-full flex flex-1 flex-row items-center' id='play-area'/>
                    </div>
                    <div className='w-1/5 flex flex-col'>
                        <div className='mt-3 text-white text-center'>Deck</div>
                        <div className='flex-1 relative' id='deck'/>
                        <div className='mt-3 text-white text-center'>Joker</div>
                        <div className='flex-1 relative' id='joker'/>
                    </div>
                </div>
                <hr/>
                <div className='flex flex-row items-center'>
                    <div className='' id='hand'/>
                </div>
            </div>
        );
    }
}

export default GameArea;