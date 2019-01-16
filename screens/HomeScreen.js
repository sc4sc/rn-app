import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from '@shoutem/ui';

import Incident from '../components/Incident';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.notchMargin} />

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Recent</Text>
            <View style={{ flex: 1 }} />
            {/* 설정 버튼임!!!! */}
            <Icon name="search" />
          </View>
          <ScrollView style={{ flex: 1 }}>
            <Incident />
            <Incident />
            <Incident />
            <Incident />
            <Incident />
            <Incident />
            <Incident />
            <Incident />
          </ScrollView>
        </SafeAreaView>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Send Report</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notchMargin: { height: Platform.select({ android: 40, ios: 0 }) },
  headerContainer: { margin: 8, marginLeft: 16, flexDirection: 'row' },
  header: { fontSize: 28, fontWeight: '800' },
  reportButton: {
    backgroundColor: 'grey',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    padding: 8,
  },
  reportButtonText: { color: '#FEFEFE', fontWeight: '500', fontSize: 24 },
});
