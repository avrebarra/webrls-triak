// src\components\App\index.jsxs

import React, {Component} from 'react';
import './index.css';
import socketapi from './helper/socketAPI';
import _ from 'lodash';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        room: '',
        lastLocation: null,
        buddyList : []
      };

      // initialize location watcher
      let watchID = navigator.geolocation.watchPosition(this.handleLocationChange.bind(this));

      // Subscribe to broadcast
      socketapi.setUserUpdateReceiver(this.handleUserUpdate.bind(this));
      socketapi.setRoomUserLeaveReceiver(this.handleRoomUserLeave.bind(this));
      socketapi.setUpdateRequestReceiver(this.handleUpdateRequest.bind(this));

      // This binding is necessary to make `this` work in the callback
      this.handleUsernameChange = this.handleUsernameChange.bind(this);
      this.handleRoomChange = this.handleRoomChange.bind(this);
    }

    // event handlers
    handleRoomChange(e) {
      let room = e.target.value;

      this.setState({ room, buddyList: [] });

      // Refresh list data
      socketapi.changeRoom(room);

      if (room) {
        let coordinate = this.state.lastLocation;
        let username = this.state.username;

        socketapi.updateUserData({coordinate, username});
        socketapi.requestRoomUpdate();
      }
    }

    handleUsernameChange(e) {
      let username = e.target.value;
      let room = this.state.room;

      this.setState({username});
      if (room) socketapi.updateUserData({username});
    }

    handleLocationChange(location) {
      let coordinate = {latitude: location.coords.latitude, longitude: location.coords.longitude};
      let room = this.state.room;

      this.setState({lastLocation:coordinate});
      if(room) socketapi.updateUserData({coordinate});
    }

    // Incoming event handlers
    handleUserUpdate(userUpdate) {
      let buddyList = this.state.buddyList;
      let index = _.findIndex(buddyList, function(buddy) { return buddy.id === userUpdate.id; });

      if (index >= 0) {
        _.forOwn(userUpdate.userdata, function(value, key) {
          buddyList[index].userdata[key] = value; // agak njelimet. Mohon dimaklumi.
        });
      }else{
        buddyList.push(userUpdate);
      }

      this.setState({buddyList});
    }

    handleUpdateRequest() {
      if(!this.state.room) return;

      let coordinate = this.state.lastLocation;
      let username = this.state.username;

      socketapi.updateUserData({coordinate, username});
    }

    handleRoomUserLeave(userid) {
      if(!this.state.room) return;

      let buddyList = this.state.buddyList;
      let index = _.findIndex(buddyList, function(buddy) { return buddy.id === userid; });

      if (index >= 0 ) buddyList.splice(index, 1);

      this.setState({buddyList});
    }

    render() {
        return (
          <div>
            <div id="basic-data">
              <div id="inputs">
                <div className="data-in" id="username">
                  <input type="text" placeholder="Enter your username" onChange={this.handleUsernameChange}/>
                </div>
                <div className="data-in" id="room-name">
                  <input type="text" placeholder="Enter room name" onChange={this.handleRoomChange}/>
                </div>
              </div>
              <div id="info">
                { this.state.room !== '' &&
                  <span> Room {this.state.room} has {this.state.buddyList.length} other active users.</span>
                }
              </div>
            </div>
            <div id="content">
              {this.state.buddyList.map(buddy =>
                <div key={buddy.id}>USER: {buddy.userdata.username} ({buddy.userdata.coordinate ? buddy.userdata.coordinate.longitude : ''},{buddy.userdata.coordinate ? buddy.userdata.coordinate.latitude : ''})</div>
              )}
            </div>
          </div>
        );
    }
}

export default App;
