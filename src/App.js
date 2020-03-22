import logo from './logo.svg';
import '../node_modules/deck-of-cards/example/example.css'
import './styles/tailwind.css';
import './styles/app.scss';
import socketIOClient from "socket.io-client";
import React, {Component} from 'react';
import game from './game';
import network from './network';
import UserList from "./components/user-list";
import Provider from "./components/provider";
import UserForm from "./components/user-form";
import GameArea from "./components/game-area";

class App extends Component {
    constructor(props) {
        super(props);

        this.network = network();
        this.gameObj = game(this.network);

        this.onPlayCard = this.onPlayCard.bind(this);
        this.onDrawCard = this.onDrawCard.bind(this);
        this.onGameStateChanged = this.onGameStateChanged.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.enterGame = this.enterGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.onError = this.onError.bind(this);
        this.userAllowed = this.userAllowed.bind(this);

        this.state = {
            users: [],
            currentUser: null,
            joinGame: this.joinGame,
            isActive: false,
            hasDeck: false,
            error: false
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
                this.network.initialize(this.onGameStateChanged, this.onError);
                this.gameObj.registerUser(user);
            });
        }
    }

    onError() {
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

    componentDidMount() {
        this.enterGame();
    }

    onGameStateChanged(state) {
        console.log(state);
        this.gameObj.updateState(state);
        this.setState({
            users: state.users,
            isActive: state.isActive,
            hasDeck: state.deck.length > 0,
            error: false
        });
        if (state.deck.length > 0) {
            this.gameObj.render(this.state.currentUser.id);
        }
    }

    hasUser() {
        return this.state.currentUser;
    }

    userAllowed() {
        debugger;
        return this.state.users.length > 0
            && this.state.currentUser != null
            && this.state.users.find(user => user.id === this.state.currentUser.id);
    }

    render() {

        if (this.state.error) {
            return (<div className="w-full bg-green-900 h-10" id='top-nav'>
                <div className='text-white p-2'>
                    Server not found. Trying to connect...
                </div>
            </div>);
        }

        if (!this.hasUser()) {
            return <UserForm joinGame={this.joinGame}/>;
        }

        return (
            <div className='flex mb-4 flex-col'>
                <div className="w-full bg-green-900 h-10" id='top-nav'>
                    <div className='text-white p-2'>{this.state.currentUser.username.toUpperCase()}</div>
                </div>
                <div className='flex h-screen w-full'>
                    <GameArea hasGameStarted={this.state.isActive}
                              hasDeck={this.state.hasDeck}
                              startGameHandler={this.startGame}
                              onPlayCard={this.onPlayCard}
                              onDrawCard={this.onDrawCard}/>
                    <div className='bg-green-500 w-1/5' id='users'>
                        <UserList users={this.state.users}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
