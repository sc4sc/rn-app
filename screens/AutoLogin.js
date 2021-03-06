import React from 'react'
import { SplashScreen } from 'expo'
import { View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import * as apis from '../apis'
import { userLoginSuccess } from '../actions/user'

class AutoLogin extends React.Component {
  componentDidMount = async () => {
    const { navigation } = this.props
    const appToken = await SecureStore.getItemAsync('appToken')
    if (!appToken) {
      console.log('[AutoLogin] Token does not exist')
      SplashScreen.hide()
      navigation.navigate('Login')
      return
    }

    apis.setAppToken(appToken)
    const userProfile = await apis.getProfile()

    if (userProfile.error) {
      // Invalidate token
      SecureStore.deleteItemAsync('appToken')
      console.log('[AutoLogin] Token is not valid - Server error')
      SplashScreen.hide()
      navigation.navigate('Login')
      return
    }

    this.props.authLoginSuccess(userProfile)
    console.log('[AutoLogin] Autologin Succeeded')

    const tryUpdatePushToken = () => {
      apis.updatePushToken().then(r => {
        if (r.error) {
          setTimeout(tryUpdatePushToken, 5000)
        }
      })
    }

    tryUpdatePushToken()
    SplashScreen.hide()
    navigation.navigate('App')
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'small'} />
      </View>
    )
  }
}

export default connect(
  null,
  {
    authLoginSuccess: userLoginSuccess,
  }
)(AutoLogin)
