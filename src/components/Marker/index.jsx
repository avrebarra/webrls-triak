// src\components\Marker\index.jsxs

import React, {Component} from 'react';

import './index.css';

class Marker extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
          <div className='location-marker'>
            <div className='pin' usertype={this.props.usertype}></div>
            {this.props.usertype == 'you' &&
              <div className='pulse'></div>
            }
            <div className='username'>{this.props.username}</div>
          </div>
        );
    }
}

export default Marker;
