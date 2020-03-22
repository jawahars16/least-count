import React, {Component} from 'react';
import Context from "../../context";
import { v1 as uuidv1 } from 'uuid';

class UserForm extends Component {

    constructor(props) {
        super(props);
        this.join = this.join.bind(this);

        this.username = React.createRef();
        this.room = React.createRef();
    }

    join() {
        const username = this.username.current.value;
        const room = this.room.current.value;

        this.props.joinGame(username, uuidv1());
    }

    render() {
        return (
            <div className='flex justify-center'>
                <div>
                    <div className='bg-blue-700 p-2 flex flex-col shadow-xl mt-10'>
                        <div className='m-1 text-white'>Username</div>
                        <input name='name' id='username' className='m-1' ref={this.username}/>
                        <div className='m-1 text-white'>Room</div>
                        <input name='room' id='room' className='m-1' ref={this.room}/>
                        <button className='m-1 bg-orange-700 text-white mt-3'
                                onClick={this.join}>Join
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserForm;