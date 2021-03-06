import React from 'react'
import {
  Alert,
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'
import { StackActions, SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import * as Location from 'expo-location'

import memoize from 'fast-memoize'
import * as geojsonutil from 'geojson-utils'
import moment from 'moment'
import * as apis from '../apis'
import { getBottomSpace } from '../utils/index.js'
import NaverMap from '../components/NaverMap'
import Layout from '../constants/Layout'
import { newIncidentPostRequested } from '../actions/newIncident'
import { checkIsInbuilding } from '../utils'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import i18n from '../i18n'

const statusBarHeight = getStatusBarHeight()

class NewIncidentDetail extends React.Component {
  constructor() {
    super()

    this.state = {
      markerCoords: null,
      locationName: '',
    }
    this.handlePressReport = this.handlePressReport.bind(this)
    this.report = this.report.bind(this)
    this.locatePosition = this.locatePosition.bind(this)
    this.locating = false
    this.locateTransactionId = 0
  }

  handleMapInit = () => {
    this.locatePosition()
  }

  async handlePressReport() {
    let currentIncidents
    await apis
      .listIncidents({ size: 100 })
      .then(res => (currentIncidents = res))

    for (let i = 0; i < currentIncidents.length; i++) {
      const { type, lat, lng, createdAt } = currentIncidents[i]
      const incidentGeoObj = checkIsInbuilding({ lat, lng })
      const incidentLocation = incidentGeoObj
        ? incidentGeoObj.properties.name
        : 'KAIST'
      const timePassed = moment().diff(moment(createdAt), 'seconds')

      const isBuildingSame = incidentLocation === this.state.locationName
      const isTimeClose = timePassed / (60 * 60) < 1
      const isTypeSame = type === this.props.selectedIncident

      if (isBuildingSame && isTimeClose && isTypeSame) {
        Alert.alert(
          i18n.t('duplicate_alert_title'),
          i18n.t('duplicate_alert_detail'),
          [
            { text: i18n.t('cancel') },
            { text: i18n.t('confirm'), onPress: () => this.report() },
          ]
        )
        return
      }
    }

    Alert.alert(
      i18n.t('report_confirm_title'),
      i18n.t('report_confirm_detail'),
      [
        { text: i18n.t('cancel') },
        { text: i18n.t('confirm'), onPress: () => this.report() },
      ]
    )
  }

  handlePressMap = coords => {
    const kaist = require('../assets/geojson/KAIST.json')
    const point = { type: 'Point', coordinates: [coords.lng, coords.lat] }

    if (geojsonutil.pointInPolygon(point, kaist.features[0].geometry)) {
      this.updateLocationName(coords)
      this.setState({
        markerCoords: coords,
      })
      // After an manual marker update, locating should stop
      this.locateTransactionId += 1
    } else {
      Alert.alert(
        i18n.t('location_error_title'),
        i18n.t('location_error_detail'),
        [{ text: i18n.t('confirm') }]
      )
    }
  }
  //TODO: Make this function to async (just put 'async')
  report = () => {
    this.props.newIncidentPostRequested(
      {
        type: this.props.selectedIncident,
        lat: this.state.markerCoords.lat,
        lng: this.state.markerCoords.lng,
        building: this.state.locationName,
        isTraining: this.props.isTraining,
      },
      () => {
        // TODO: Comment this function call
        this.props.navigation.dispatch(StackActions.popToTop())

        // TODO: Uncomment this function call
        // this.props.shrinkButton();
      }
    )
  }

  updateLocationName = coords => {
    const locationGeoObj = checkIsInbuilding(coords)
    this.setState({
      locationName: locationGeoObj ? locationGeoObj.properties.name : 'KAIST',
    })
  }

  async locatePosition() {
    if (this.locating) return

    this.locating = true

    const transactionId = this.locateTransactionId

    const currentPosition = (await Location.getCurrentPositionAsync({
      maximumAge: 5000,
    })).coords

    if (transactionId !== this.locateTransactionId) return

    this.locating = false

    const { longitude, latitude } = currentPosition
    const coords = { lng: longitude, lat: latitude }
    const kaist = require('../assets/geojson/KAIST.json')
    const point = { type: 'Point', coordinates: [coords.lng, coords.lat] }
    if (!geojsonutil.pointInPolygon(point, kaist.features[0].geometry)) {
      Alert.alert(
        i18n.t('location_error_title'),
        i18n.t('location_error_detail'),
        [{ text: i18n.t('confirm') }]
      )
      return
    }

    this.updateLocationName(coords)
    this.setState({ markerCoords: coords })
    this.map.panTo(coords, {})
  }

  getMarkers = memoize(markerCoords => {
    if (!markerCoords) {
      return []
    }
    return [
      {
        key: 'incidentLocation',
        coords: markerCoords,
      },
    ]
  })

  render() {
    const { container, headerContainer, headerText } = styles

    return (
      <View style={container}>
        <StatusBar barStyle="light-content" backgroundColor="#ff9412" />
        <SafeAreaView style={headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.goBack()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.backIcon}
                source={require('../assets/images/group-5.png')}
              />
              <Text style={headerText}>
                {i18n.t(this.props.selectedIncident)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.dispatch(StackActions.popToTop())
            }>
            <Image
              source={require('../assets/images/close.png')}
              style={{ width: 20, height: 20, marginRight: 22 }}
            />
          </TouchableOpacity>
        </SafeAreaView>

        <NaverMap
          ref={el => (this.map = el)}
          style={{ flex: 1 }}
          onInit={this.handleMapInit}
          markers={this.getMarkers(this.state.markerCoords)}
          onPress={this.handlePressMap}
        />
        <View style={styles.searchBoxContainer}>
          <Text style={styles.questionText}>{i18n.t('where_is_location')}</Text>
          <View style={styles.searchBox}>
            <Text style={styles.searchText}>{this.state.locationName}</Text>
          </View>
        </View>

        {/* TODO: Comment this block, from here */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={this.handlePressReport}>
          <Text style={styles.buttonText}>{i18n.t('upload_report')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gpsButton}
          onPress={this.locatePosition}>
          <Image source={require('../assets/images/group-2.png')} />
        </TouchableOpacity>
        {/* to here */}

        {/* TODO: Uncomment this block, from here */}
        {/* <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={this.locatePosition}
          >
            <Image source={require('../assets/images/group-2.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handlePressReport}
          >
            <Text style={styles.buttonText}>제보 등록</Text>
          </TouchableOpacity>
        </View> */}
        {/* to here */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    bottom: 60 + getBottomSpace(),
  },
  container: {
    flex: 1,
    backgroundColor: '#fffaf4',
  },
  headerContainer: {
    paddingTop: getBottomSpace() == 0 ? 15 : 20,
    paddingBottom: 17,
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
    // TODO: Change top from 115 to 20
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
    // TODO: Remove position.
    position: 'absolute',
    width: Layout.window.width - 30,
    // TODO: Remove bottom.
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
    // TODO: Comment this block, from here
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 116,
    right: 22,
    width: 45,
    height: 45,
    // to here

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
  // to here
})

export default connect(
  state => ({
    selectedIncident: state.newIncident.selectedIncident,
    isTraining: state.user.data.isTraining,
  }),
  { newIncidentPostRequested }
)(NewIncidentDetail)
