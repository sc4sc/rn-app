import React from 'react';
import { View } from 'react-native';
import { Permissions } from 'expo';
import { Spinner } from '../components/Spinner';

export default class PermissionLoading extends React.Component {
  async componentDidMount() {
    const { status: locationPermission } = await Permissions.getAsync(
      Permissions.LOCATION
    );

    if (locationPermission === 'granted') {
      this.props.navigation.navigate('AuthLoading');
    } else {
      this.props.navigation.navigate('Permission');
    }
  }

  render() {
    return <View />;
  }
}
