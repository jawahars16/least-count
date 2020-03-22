import React, {Component} from 'react';

class UserList extends Component {

    constructor(props, context) {
        super(props, context);

    }

    render() {
        return (
            <div className='text-white p-1'>
                {this.props.users.map(userData => (
                    <div key={userData.id} className='flex justify-between bg-green-800 p-2 m-1'>
                        <div>{userData.username}</div>
                        <div>{userData.hand?.length}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default UserList;