import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Linking,
} from 'react-native'

import ProgressCard from './ProgressCard'
import Colors from '../constants/Colors'
import { formatDate, checkIsInbuilding } from '../utils'
import { typeMap } from '../constants/Incidents'
import * as contacts from '../constants/Contacts'
import i18n from '../i18n'

export default class IncidentCard extends React.Component {
  renderWrongIncident(progressStateColor, doc, location) {
    const { data } = this.props
    const { createdAt } = data

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.wrongContent}>
            <View>
              <Text style={styles.wrongDate}>{formatDate(createdAt)}</Text>
              <Text style={styles.wrongTitle}>{i18n.t('wrong_incident')}</Text>
              <Text style={styles.wrongInfo}>
                {doc.title}, {location ? location.properties.name : 'KAIST'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${contacts.secureTeam}`)}>
          <View
            style={[
              styles.progressState,
              {
                backgroundColor: progressStateColor,
                textAlign: 'center',
                flexDirection: 'row',
                marginTop: 15,
              },
            ]}>
            <Image
              style={styles.callIcon}
              source={require('../assets/images/group-9.png')}
            />
            <Text style={styles.callSafeTeam}>
              {i18n.t('call_to_secure_team')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { onPress, data } = this.props
    const { type, createdAt, state, Progresses, lat, lng } = data
    const confirmed = Progresses.length > 0
    const location = checkIsInbuilding({ lat, lng })
    const doc = typeMap[type]

    let progressStateColor = ''
    switch (state) {
      case '확인중':
        progressStateColor = '#d62c2c'
        break
      case '처리중':
        progressStateColor = '#f5c234'
        break
      case '완료':
        progressStateColor = '#7ed321'
        break
      default:
        progressStateColor = 'black'
    }

    let imageSrc
    switch (type) {
      case '화재':
        imageSrc = require('../assets/images/incidentDetail/fire.jpg')
        break
      case '가스':
        imageSrc = require('../assets/images/incidentDetail/gas.jpg')
        break
      case '화학물질 누출':
        imageSrc = require('../assets/images/incidentDetail/flask.jpg')
        break
      case '생물학적 유해물질 누출':
        imageSrc = require('../assets/images/incidentDetail/biohazard.jpg')
        break
      case '방사선':
        imageSrc = require('../assets/images/incidentDetail/radiation.jpg')
        break
      case '지진':
        imageSrc = require('../assets/images/incidentDetail/earthquake.jpg')
        break
      case '엘레베이터 사고':
        imageSrc = require('../assets/images/incidentDetail/lift.jpg')
        break
      case '정전':
        imageSrc = require('../assets/images/incidentDetail/antistatic.jpg')
        break
    }

    return progressStateColor === 'black' ? (
      this.renderWrongIncident(progressStateColor, doc, location)
    ) : (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.content}>
              <View>
                <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
                <Text style={styles.title}>{doc.title}</Text>
                <Text style={styles.addressText}>
                  {location ? location.properties.name : 'KAIST'}
                </Text>
              </View>
              <Image source={imageSrc} />
            </View>
            {confirmed ? (
              <ProgressCard author="안전팀" minHeight={0}>
                {JSON.parse(JSON.stringify(Progresses))[0].content}
              </ProgressCard>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderStyle}>
                  {i18n.t('empty_progress')}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.progressState,
            { backgroundColor: progressStateColor },
          ]}>
          <Text style={styles.progressText}>{i18n.t(state)}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    height: 190,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.22,
    shadowRadius: 2,
  },
  content: {
    height: 85,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 3 },
  addressText: { fontSize: 13 },
  dateText: {
    fontSize: 11,
    color: Colors.dateLightGrey,
    marginBottom: 5,
  },
  wrongContent: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongDate: {
    fontSize: 11,
    color: Colors.dateLightGrey,
    marginTop: 6,
    marginBottom: 5,
    textAlign: 'center',
  },
  wrongTitle: { fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  wrongInfo: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginTop: 16,
  },
  callIcon: { width: 18, height: 16, marginRight: 7 },
  callSafeTeam: {
    fontWeight: 'normal',
    fontSize: 13,
    letterSpacing: -0.5,
    color: 'white',
  },
  mapContainer: { width: 80, height: 120 },
  progressState: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  progressText: { fontSize: 13, fontWeight: 'bold', color: 'white' },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  placeholderStyle: { color: '#d0d0d0', fontSize: 13, textAlign: 'center' },
  wrongText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
})
