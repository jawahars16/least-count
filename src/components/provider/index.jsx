import React, {Component} from 'react';
import Context from '../../context';

class Provider extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Context.Provider value={this.props}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default Provider;