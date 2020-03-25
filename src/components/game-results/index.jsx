import React, {Component} from 'react';

class GameResults extends Component {
    render() {
        return (
            <div className='absolute bg-gray-100 rounded-lg shadow-2xl flex flex-col hidden' id='results-dialog'>
                <div className='text-white bg-blue-800 p-3 rounded-t-lg justify-between'>
                    <div>Game Results</div>
                </div>
                <div className='p-3 text-black overflow-auto flex-1'>
                    <div className='text-center'>{this.props.gameResult}</div>
                    <table className='mt-3 w-full'>
                        <thead>
                        <tr className='text-left bg-gray-300 font-medium'>
                            <th className='px-4'>Player</th>
                            <th className='px-4'>This Round</th>
                            <th className='px-4'>Total</th>
                        </tr>
                        {this.props.users.map(
                            user => (
                                <tr className='text-left' key={user.id}>
                                    <th className='px-4'>{user.username}</th>
                                    <th className='px-4'>{user.score || 0}</th>
                                    <th className='px-4'>{user.totalScore || 0}</th>
                                </tr>
                            )
                        )}
                        </thead>
                    </table>
                </div>
                <div className='flex justify-center p-2 text-white'>
                    <button className='hover:bg-orange-900 px-3 rounded mx-2 py-1 bg-blue-700'
                            onClick={this.props.onEndGame}>
                        End Game
                    </button>
                    <button className='hover:bg-orange-900 px-3 rounded mx-2 py-1 bg-blue-700'
                            onClick={this.props.onNextRound}>
                        Next Round
                    </button>
                </div>
            </div>
        );
    }
}

export default GameResults;