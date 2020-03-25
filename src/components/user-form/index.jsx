import React, {Component} from 'react';
import { v1 as uuidv1 } from 'uuid';

class UserForm extends Component {

    constructor(props) {
        super(props);
        this.join = this.join.bind(this);

        this.username = React.createRef();
    }

    join() {
        const username = this.username.current.value;
        if(username && username.length > 0) {
            this.props.joinGame(username, uuidv1());
        }
    }

    render() {
        return (
            <div className='flex justify-center'>
                <div className=' mt-10'>
                    <div className='text-center text-white bg-blue-800 p-3 text-2xl'>🎲 Least Count 🎲</div>
                    <div className='bg-blue-700 p-2 flex flex-col shadow-xl'>
                        <div className='m-1 text-white'>Name</div>
                        <input name='name' id='username' className='m-1' ref={this.username}/>
                        <div className='m-1 text-white hidden'>Room</div>
                        <input name='room' id='room' className='m-1 hidden'/>
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