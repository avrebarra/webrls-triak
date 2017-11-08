// src\components\App\index.jsxs

import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import config from '../../config';
import _ from 'lodash';

// Components needed
import Marker from '../Marker';

// Loads CSS and helpers
import './index.css';
import socketapi from './helper/socketAPI';
import mapHelper from './helper/mapHelper';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        room: '',
        mapZoom : config.map.defaultZoom,
        initialLocation: null,
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

      if(this.state.initialLocation === null) this.setState({initialLocation:coordinate});
      this.setState({lastLocation:coordinate});
      console.log(this.state.lastLocation);
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
          <div className='app'>
            <div id="basic-data">
              <div id="inputs">
                <input type="text" placeholder="Enter your username" onChange={this.handleUsernameChange}/>
                <input type="text" placeholder="Enter room name" onChange={this.handleRoomChange}/>
              </div>
            </div>
            <div id="content">
              {this.state.initialLocation !== null &&
                <GoogleMapReact
                  bootstrapURLKeys={{key: "AIzaSyCH5CWjO1KB3zVUxc3YG8DLYX0-EyiqPGE"}}
                  defaultCenter={mapHelper.getShortCoordinateObject(this.state.initialLocation)}
                  defaultZoom={this.state.mapZoom}
                >
                  {this.state.lastLocation !== null &&
                    <Marker
                      usertype='you'
                      username={this.state.username}
                      lat={this.state.lastLocation.latitude}
                      lng={this.state.lastLocation.longitude}
                      text={this.state.username ? 'You are here!': this.state.username}
                    />
                  }
                  {this.state.buddyList.map(buddy =>
                    <Marker
                      key={buddy.id}
                      usertype='others'
                      username={buddy.userdata.username}
                      lat={buddy.userdata.coordinate.latitude}
                      lng={buddy.userdata.coordinate.longitude}
                      text={this.state.username ? 'You are here!': this.state.username}
                    />
                  )}
                </GoogleMapReact>
              }
            </div>
          </div>
        );
    }
}

export default App;

// {this.state.buddyList.map(buddy =>
//   <div key={buddy.id}>USER: {buddy.userdata.username} ({buddy.userdata.coordinate ? buddy.userdata.coordinate.longitude : ''},{buddy.userdata.coordinate ? buddy.userdata.coordinate.latitude : ''})</div>
// )}
