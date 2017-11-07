// src\components\UserLocation\index.jsx

import React, {Component} from 'react';
import './index.css';

class UserLocation extends Component {
    render() {
        return (
          <div class="user-location">
            <div class="last-update">Just now</div>
            <div class="name">Athifah Rosi</div>
            <div class="location">My heart</div>
          </div>
        );
    }
}

export default UserLocation;
