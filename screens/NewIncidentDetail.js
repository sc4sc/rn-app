import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Location } from 'expo';

import { getStatusBarHeight } from '../utils/index.js';
import NaverMap from '../components/NaverMap';
import AndroidTopMargin from '../components/AndroidTopMargin';
import Layout from '../constants/Layout';
import { newIncidentPostRequested } from '../actions/newIncident';
import { checkIsInbuilding } from '../utils';
import Colors from '../constants/Colors';
import memoize from 'fast-memoize';
import * as geojsonutil from 'geojson-utils';

const statusBarHeight = getStatusBarHeight();

class NewIncidentDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      markerCoords: null,
      locationName: '',
    };
    this.handlePressReport = this.handlePressReport.bind(this);
    this.report = this.report.bind(this);
    this.locatePosition = this.locatePosition.bind(this);
  }

  locating = false;
  locateTransactionId = 0;

  handleMapInit = () => {
    this.locatePosition();
  };

  handlePressReport() {
    Alert.alert(
      '제보하시겠습니까?',
      '자세한 현장 상황 확인을 위해 카이스트 안전팀이 곧 연락합니다',
      [
        { text: '취소' },
        { text: '확인', onPress: () => this.report(this.state.markerCoords) },
      ]
    );
  }

  handlePressMap = coords => {
    const kaist = require('../assets/geojson/KAIST.json');
    const point = { type: 'Point', coordinates: [coords.lng, coords.lat] };

    if (geojsonutil.pointInPolygon(point, kaist.features[0].geometry)) {
      this.updateLocationName(coords);
      this.setState({
        markerCoords: coords,
      });
      // After an manual marker update, locating should stop
      this.locateTransactionId += 1;
    } else {
      Alert.alert('위치를 지정할 수 없습니다.', 'KAIST 내부만 선택해주세요.', [
        { text: '확인' },
      ]);
    }
  };

  report(region) {
    const { lat, lng } = region;
    const locationGeoObj = checkIsInbuilding(region);
    const building = locationGeoObj ? locationGeoObj.properties.name : '';
    this.props.newIncidentPostRequested(
      {
        type: this.props.selectedIncident,
        lat,
        lng,
        building,
      },
      () => {
        this.props.navigation.dispatch(StackActions.popToTop());
      }
    );
  }

  updateLocationName = coords => {
    const locationGeoObj = checkIsInbuilding(coords);
    this.setState({
      locationName: locationGeoObj ? locationGeoObj.properties.name : '',
    });
  };

  async locatePosition() {
    if (this.locating) return;

    this.locating = true;

    const transactionId = this.locateTransactionId;

    const currentPosition = (await Location.getCurrentPositionAsync({
      maximumAge: 5000,
    })).coords;

    if (transactionId !== this.locateTransactionId) return;

    this.locating = false;

    const { longitude, latitude } = currentPosition;
    const coords = { lng: longitude, lat: latitude };
    this.updateLocationName(coords);
    this.setState({ markerCoords: coords });
    this.map.panTo(coords, {});
  }

  getMarkers = memoize(markerCoords => {
    if (!markerCoords) {
      return [];
    }
    return [
      {
        key: 'incidentLocation',
        coords: markerCoords,
      },
    ];
  });

  render() {
    const { container, headerContainer, headerText } = styles;
    // const { lat, lng } = this.state.markerCoords;

    return (
      <View style={container}>
        <StatusBar barStyle="light-content" backgroundColor="#ff9412" />
        <View style={headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.goBack()}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.backIcon}
                source={require('../assets/images/group-5.png')}
              />
              <Text style={headerText}>{this.props.selectedIncident}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}>
            <Image
                source={require('../assets/images/combined-shape.png')}
                style={{ width: 20, height:20, marginRight: 22 }}
            />
          </TouchableOpacity>
        </View>

        <NaverMap
          ref={el => (this.map = el)}
          style={{ flex: 1 }}
          onInit={this.handleMapInit}
          markers={this.getMarkers(this.state.markerCoords)}
          onPress={this.handlePressMap}
        />
        <View style={styles.searchBoxContainer}>
          <Text style={styles.questionText}>장소는 어디인가요?</Text>
          <View style={styles.searchBox}>
            <Text style={styles.searchText}>{this.state.locationName}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={this.handlePressReport}
        >
          <Text style={styles.buttonText}>제보 등록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={this.locatePosition}
        >
          <Image source={require('../assets/images/group-2.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf4',
  },
  headerContainer: {
    paddingTop: statusBarHeight + 10,
    paddingBottom: 22,
    flexDirection: 'row',
    backgroundColor: '#ff9412',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  backIcon: {
    width: 19,
    height: 22,
    marginLeft: 20,
  },
  searchBoxContainer: {
    width: Layout.window.width - 40,
    top: 115,
    position: 'absolute',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
    zIndex: 999,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  questionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f5a623',
    marginBottom: 9,
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchText: {
    fontSize: 16,
  },
  buttonStyle: {
    position: 'absolute',
    width: Layout.window.width - 30,
    bottom: 38,
    backgroundColor: '#f47b36',
    borderRadius: 10,
    marginHorizontal: 15,
    padding: 17,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  gpsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 116,
    right: 22,
    width: 45,
    height: 45,
    alignSelf: 'flex-end',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default connect(
  state => {
    return {
      selectedIncident: state.newIncident.selectedIncident,
    };
  },
  {
    newIncidentPostRequested,
  }
)(NewIncidentDetail);
