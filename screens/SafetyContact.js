import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AndroidTopMargin from '../components/AndroidTopMargin';
import { getBottomSpace, getStatusBarHeight } from '../utils/index.js';

const topMargin = getStatusBarHeight();
const bottomMargin = getBottomSpace();

export default class SafetyContact extends React.Component {
  render() {
    const {
      container,
      headerText,
      contentContainer,
      circle,
      notAppliedText,
      contentContainersecond,
    } = styles;
    const campusPolicNum = '010-4430-3985';
    const secureTeamNum = '010-4430-3985';

    return (
      <View style={container}>
        <View>
          <Text style={headerText}>KAIREN</Text>

          <View style={contentContainer}>
            <View style={circle} />
            <View style={circle} />
            <View style={circle} />
            <Text style={notAppliedText}> 주의 제보 (준비 중)</Text>
          </View>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${campusPolicNum}`)}
          >
            <View style={contentContainer}>
              <Image source={require('../assets/images/group-9.png')} />
              <View style={{ width: 5 }} />
              <Text style={{ fontSize: 16 }}> 캠퍼스 폴리스에 연락하기 </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${secureTeamNum}`)}
          >
            <View style={contentContainer}>
              <Image source={require('../assets/images/group-9.png')} />
              <View style={{ width: 5 }} />
              <Text style={{ fontSize: 16 }}> 안전팀에 연락하기 </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Setting')}
        >
          <View style={contentContainersecond}>
            <Image source={require('../assets/images/setting_icon.png')} />
            <View style={{ width: 5 }} />
            <Text style={{ fontSize: 16 }}>설정</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  headerText: {
    marginTop: 20 + topMargin,
    marginBottom: 40,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.9,
    color: '#4a4a4a',
    paddingLeft: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 16,
  },
  contentContainersecond: {
    height: 48 + bottomMargin,
    flexDirection: 'row',
    paddingTop: 16,
    backgroundColor: 'rgb(230,230,230)',
    paddingLeft: 16,
  },
  circle: {
    width: 3,
    height: 3,
    borderRadius: 50,
    backgroundColor: '#bebebe',
    marginRight: 5,
  },
  notAppliedText: { color: '#bebebe', fontSize: 16 },
};