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

        let playAreaMessage = 'Play area';
        const currentUserName = this.props.users?.find(u => u.id === this.props.activePlayer)?.username;

        if (this.props.showPlayBtn) {
            if (this.props.canPlay) {
                playAreaMessage = 'You have to play';
            } else {
                playAreaMessage = `${currentUserName} has to play`;
            }
        } else {
            if (this.props.canPlay) {
                playAreaMessage = 'You played below card(s)';
            } else {
                playAreaMessage = `${currentUserName} played below card(s)`;
            }
        }

        let previousPlayMessage = 'Last card(s)';
        const previousUserName = this.props.users?.find(u => u.id === this.props.previousPlayer)?.username;
        if (previousUserName) {
            previousPlayMessage = `${previousUserName} played below card(s)`
        }

        const userAllowed = this.props.users.length > 0
            && this.props.currentUser != null
            && this.props.users.find(user => user.id === this.props.currentUser.id) !== undefined;

        return (
            <div
                className={`bg-green-600 w-4/5 flex flex-col h-screen justify-between content-between 
                ${this.props.canPlay ? 'ready' : 'not-ready'}`}
                id='game-area'>
                <div className='flex flex-1 justify-between'>
                    <div className='w-3/4 flex flex-col ml-5'>
                        <div className='mt-3 text-white'>{previousPlayMessage}</div>
                        <div className='w-full flex flex-1 flex-row items-center' id='prev-play-area'/>
                        <div className='mt-3 text-white'>{playAreaMessage}</div>
                        <div className='w-full flex flex-1 flex-row items-center' id='play-area'/>
                    </div>
                    <div className='w-1/4 flex flex-col'>
                        <div className='mt-3 text-white text-center'>Deck</div>
                        <div className='flex-1 relative' id='deck'/>
                        <div className='mt-3 text-white text-center'>Joker</div>
                        <div className='flex-1 relative ml-3' id='joker'/>
                    </div>
                </div>
                <hr className='mx-5 opacity-50'/>
                <div className='flex flex-row items-center'>
                    <div className='' id='hand'/>
                    <div className='text-white'>
                        {!userAllowed ? 'Game already started. You cannot play. But you can watch. 😎' : ''}
                    </div>
                </div>
            </div>
        );
    }
}

export default GameArea;