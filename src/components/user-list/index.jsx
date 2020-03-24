import React, {Component} from 'react';

class UserList extends Component {

    render() {
        return (
            <div className='text-white p-1 overflow-y-auto' style={{flex: '0.9'}} id='users'>
                {this.props.users.map(userData => (
                    <div key={userData.id}
                         className={`flex justify-between p-2 m-1 rounded items-center
                         ${this.props.currentUser.id === userData.id ? 'bg-gray-800' : 'bg-green-800 '}`}>
                        <div className={`rounded-full w-2 h-2 mr-2 
                        ${userData.id === this.props.activePlayer ? 'bg-yellow-500' : ''}`}/>
                        <div className='flex-1'>{this.props.currentUser.id === userData.id ? 'You' : userData.username}</div>
                        <div className='rounded-full text-sm bg-gray-100 text-black h-5 w-5 text-center'>{userData.hand?.length || 0}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default UserList;