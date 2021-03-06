import React from 'react'
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native'
import { connect } from 'react-redux'
import i18n from '../i18n'
import Layout from '../constants/Layout'
import Spinner from '../components/Spinner'
import { userLoginRequest } from '../actions/user'
import { getStatusBarHeight } from '../utils/index.js'

const statusBarHeight = getStatusBarHeight()

class Login extends React.Component {
  onButtonPress() {
    const { navigation } = this.props
    const alertTitle = i18n.t('login_alert')
    const alertMsg = i18n.t('login_alert_detail')

    navigation.navigate('SSO', {
      onLogin: token => {
        this.props.userLoginRequest(
          token,
          () => navigation.navigate('App'),
          () => Alert.alert(alertTitle, alertMsg)
        )
      },
    })
  }

  render() {
    const { container, headerText } = styles
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={'dark-content'} />
        <View style={container}>
          <Image
            style={{ marginLeft: -10 }}
            source={require('../assets/images/fronticon.png')}
          />
          <Text style={headerText}>KAIREN</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={this.onButtonPress.bind(this)}
            disabled={this.props.isLoading}>
            {this.props.isLoading ? (
              <Spinner size="small" />
            ) : (
              <Text style={styles.mainText}>{i18n.t('SSO')}</Text>
            )}
          </TouchableOpacity>
          <Text
            style={styles.aboutText}
            onPress={() =>
              this.props.navigation.navigate('AboutUs', { parent: '로그인' })
            }>
            {i18n.t('about_us')}
          </Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  isSecureTeam: state.user.data.isAdmin,
  isLoading: state.user.loginInProgress,
})

export default connect(
  mapStateToProps,
  { userLoginRequest }
)(Login)

const styles = {
  container: {
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    paddingTop: statusBarHeight,
    fontSize: 33,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 29,
    marginTop: -15,
    letterSpacing: -1,
  },
  inputBox: {
    backgroundColor: 'black',
    height: 53,
    borderRadius: 5,
    marginBottom: 23,
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 12,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 53,
  },
  loginButton: {
    backgroundColor: '#2c8ff5',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: Layout.window.width - 40,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 8 },
    shadowColor: '#2c8ff5',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    // elevation: 5,
  },
  mainText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  aboutText: {
    marginTop: 25,
    textDecorationLine: 'underline',
  },
}
