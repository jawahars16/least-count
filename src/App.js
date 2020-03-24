import '../node_modules/deck-of-cards/example/example.css'
import './styles/tailwind.css';
import './styles/app.scss';
import React, {Component} from 'react';
import game from './game';
import network from './network';
import UserList from "./components/user-list";
import UserForm from "./components/user-form";
import GameArea from "./components/game-area";
import ActionPanel from "./components/action-panel";
import GameResults from "./components/game-results";

class App extends Component {
    constructor(props) {
        super(props);

        this.network = network();
        this.gameObj = game(this.network);

        this.onPlayCard = this.onPlayCard.bind(this);
        this.onDrawCard = this.onDrawCard.bind(this);
        this.onGameStateChanged = this.onGameStateChanged.bind(this);
        this.onRoundEnd = this.onRoundEnd.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.enterGame = this.enterGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.onError = this.onError.bind(this);
        this.userAllowed = this.userAllowed.bind(this);
        this.declareGame = this.declareGame.bind(this);
        this.nextRound = this.nextRound.bind(this);

        this.state = {
            users: [],
            currentUser: null,
            joinGame: this.joinGame,
            isActive: false,
            hasDeck: false,
            error: false,
            showPlayBtn: true,
            showDrawBtn: false,
            activePlayer: null,
            previousPlayer: null,
            roundEnded: false,
            gameResult: ''
        };
    }

    enterGame() {
        const username = localStorage.getItem('username');
        const id = localStorage.getItem('userid');
        if (username && id) {
            const user = {username, id};
            this.setState({
                currentUser: user
            }, () => {
                this.network.initialize(this.onGameStateChanged, this.onRoundEnd, this.onError);
                this.gameObj.registerUser(user);
            });
        }
    }

    onError(err) {
        this.setState({
            error: true
        });
    }

    startGame() {
        this.gameObj.start();
    }

    joinGame(user, id) {
        localStorage.setItem('username', user);
        localStorage.setItem('userid', id);
        this.enterGame();
    }

    onPlayCard() {
        this.gameObj.play(this.state.currentUser.id);
    }

    onDrawCard() {
        this.gameObj.draw(this.state.currentUser.id);
    }

    declareGame() {
        this.gameObj.declare();
    }

    componentDidMount() {
        this.enterGame();
    }

    onRoundEnd(state) {
        this.updateGameState(state);
        this.setState({
            roundEnded: true,
            gameResult: state.gameResult
        });
    }

    onGameStateChanged(state) {
        this.updateGameState(state);
    }

    updateGameState(state) {
        this.gameObj.updateState(state);
        this.setState({
            roundEnded: false,
            users: state.users,
            isActive: state.isActive,
            hasDeck: state.deck.length > 0,
            error: false,
            showDrawBtn: state.activePlayDeck.length > 0,
            showPlayBtn: state.activePlayDeck.length <= 0,
            activePlayer: state.activePlayer,
            previousPlayer: state.previousPlayer
        });
        if (state.deck.length > 0) {
            this.gameObj.render(this.state.currentUser.id);
        }
    }

    hasUser() {
        return this.state.currentUser;
    }

    userAllowed() {
        return this.state.users.length > 0
            && this.state.currentUser != null
            && this.state.users.find(user => user.id === this.state.currentUser.id);
    }

    nextRound() {
        this.gameObj.start();
    }

    render() {
        if (this.state.error) {
            return (<div className="w-full bg-green-900 h-10" id='top-nav'>
                <div className='text-white p-2'>
                    Server not found. Trying to connect...
                </div>
                <div className='flex h-screen w-full'>
                    {this.state.error}
                </div>
            </div>);
        }

        if (!this.hasUser()) {
            return <UserForm joinGame={this.joinGame}/>;
        }

        const canPlay = this.state.currentUser.id === this.state.activePlayer;
        return (
            <div className={this.state.roundEnded ? 'round-ended' : ''}>
                <div className='flex mb-4 flex-col' id='app-area'>
                    <div className="w-full bg-green-900 h-10 flex justify-between" id='top-nav'>
                        <div className='text-white text-left p-2'>Least Count (Beta)</div>
                        <div className='text-white p-2 text-right'>
                            Hi {this.state.currentUser?.username.toUpperCase()}
                        </div>
                    </div>
                    <div className='flex h-screen w-full'>
                        <GameArea hasGameStarted={this.state.isActive}
                                  hasDeck={this.state.hasDeck}
                                  previousPlayer={this.state.previousPlayer}
                                  showDrawBtn={this.state.showDrawBtn}
                                  showPlayBtn={this.state.showPlayBtn}
                                  canPlay={canPlay}
                                  users={this.state.users}
                                  activePlayer={this.state.activePlayer}
                                  currentUser={this.state.currentUser}
                                  startGameHandler={this.startGame}/>
                        <div className='bg-green-500 w-1/5 flex flex-col'>
                            <UserList
                                activePlayer={this.state.activePlayer}
                                currentUser={this.state.currentUser}
                                users={this.state.users}/>
                            <ActionPanel
                                canPlay={canPlay}
                                users={this.state.users}
                                showDrawBtn={this.state.showDrawBtn}
                                showPlayBtn={this.state.showPlayBtn}
                                onDeclare={this.declareGame}
                                onPlayCard={this.onPlayCard}
                                onDrawCard={this.onDrawCard}/>
                        </div>
                    </div>
                </div>
                <GameResults
                    onNextRound={this.nextRound}
                    gameResult={this.state.gameResult}
                    users={this.state.users}/>
            </div>
        );
    }
}

export default App;
