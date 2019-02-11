import React from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import Layout from '../constants/Layout';
import { requestPermission } from '../utils';
import { Permissions } from 'expo';

export default class Permission extends React.Component {
  state = { locationPermission: false, phoneCallPermission: false };

  async componentWillMount() {
    const locationPermission = await requestPermission(Permissions.LOCATION);
    const phoneCallPermission = await requestPermission(Permissions.CONTACTS);

    await this.setState({ locationPermission, phoneCallPermission });
  }

  renderPermissionWait() {
    return (
      <View style={[styles.buttonStyle, styles.buttonDisabled]}>
        <Text style={styles.buttonDisabledText}>권한 승인 대기 중</Text>
      </View>
    );
  }

  renderGoNext() {
    return (
      <TouchableOpacity
        style={[styles.buttonStyle, styles.buttonEnabled]}
        onPress={() => this.props.navigation.navigate('Auth')}
      >
        <Text style={styles.buttonEnabledText}> 다음으로 > </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const getAllPermission =
      this.state.locationPermission && this.state.phoneCallPermission;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="light-content" />

        <View>
          <Text style={styles.headerText}>권한 설정</Text>
          <Text style={[styles.plainText, { marginBottom: 55 }]}>
            KAIREN을 이용하기 위해서 다음의 권한이 필요합니다:
          </Text>

          <View style={styles.permissionContainer}>
            <View style={{ width: 30, marginRight: 10 }}>
              <Image source={require('../assets/images/mapPermission.png')} />
            </View>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.permissionType}>위치</Text>
                {this.state.locationPermission ? (
                  <Image source={require('../assets/images/check.png')} />
                ) : (
                  <Text style={{ color: '#bdbdbd', letterSpacing: -0.9 }}>
                    권한 승인 대기 중
                  </Text>
                )}
              </View>
              <Text style={styles.plainText}>
                현재 위치를 지도에 표시합니다.
              </Text>
            </View>
          </View>

          <View style={styles.permissionContainer}>
            <View style={{ width: 30, marginRight: 10 }}>
              <Image source={require('../assets/images/callPermission.png')} />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.permissionType}>전화</Text>
                {this.state.phoneCallPermission ? (
                  <Image source={require('../assets/images/check.png')} />
                ) : (
                  <Text style={{ color: '#bdbdbd', letterSpacing: -0.9 }}>
                    권한 승인 대기 중
                  </Text>
                )}
              </View>
              <Text style={styles.plainText}>
                안전팀 및 캠퍼스 폴리스에 전화를 요청합니다.
              </Text>
            </View>
          </View>
          {getAllPermission ? this.renderGoNext() : this.renderPermissionWait()}
        </View>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center' },
  headerText: {
    width: Layout.window.width,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.7,
    marginBottom: 21,
  },
  permissionContainer: {
    flexDirection: 'row',
    width: Layout.window.width,
    alignItems: 'center',
    marginLeft: 35,
    marginBottom: 30,
  },
  plainText: {
    fontSize: 14,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  permissionType: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonStyle: {
    borderRadius: 5,
    marginTop: 70,
    marginHorizontal: 17,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonEnabled: {
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonEnabledText: {
    fontSize: 17,
    letterSpacing: -0.6,
  },
  buttonDisabled: {
    backgroundColor: '#eaeaea',
  },
  buttonDisabledText: {
    fontSize: 17,
    letterSpacing: -0.6,
    color: '#d3d3d3',
  },
};
