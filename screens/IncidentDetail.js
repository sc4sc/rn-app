import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { MapView } from 'expo';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import { Feather, Ionicons } from '@expo/vector-icons';

export default class IncidentDetail extends React.Component {
  renderHeader() {
    return (
      <View>
        <Text style={{ color: Colors.dateLightGrey }}>Jan 14, 2019</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 28,
              color: Colors.defaultBlack,
            }}
          >
            Conflagration
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                backgroundColor: Colors.dangerRed,
              }}
            />
            <View style={{ width: 5 }} />
            <Text style={{ color: Colors.dangerRed }}>Emergency</Text>
          </View>
        </View>
        <Text style={{ color: Colors.defaultBlack }}>Yuseong 291, Daejeon</Text>
      </View>
    );
  }

  renderProtocol() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 39,
          paddingVertical: 6,
          paddingLeft: 27,
          paddingRight: 6,
          marginHorizontal: 19,
          backgroundColor: '#44aa25',
        }}
      >
        <View>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            가까운 안전한 장소로 이동하세요
          </Text>
          <Text style={{ color: 'white' }}>자세한 행동 강령 보기</Text>
        </View>
        <View
          style={{
            width: 46,
            height: 46,
            backgroundColor: '#339216',
            borderRadius: 46,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="arrow-right" size={32} style={{ color: 'white' }} />
        </View>
      </View>
    );
  }

  renderProgress() {
    return (
      <View>
        <View
          style={[
            styles.subheaderContainer,
            { flexDirection: 'row', justifyContent: 'space-between' },
          ]}
        >
          <Text style={styles.subheaderText}>Progress</Text>
          <Text style={styles.subheaderText}>더보기</Text>
        </View>
        <View
          style={[
            styles.borderedContentBox,
            {
              borderColor: '#84c571',
            },
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name={'ios-checkmark-circle'}
              size={14}
              style={{ color: '#84c571' }}
            />
            <View style={{ width: 4 }} />
            <Text style={{ fontSize: 14, color: '#84c571' }}>안전팀</Text>
          </View>
          <Text>
            화재 진압되었습니다. 유성구 소방서와 함께 사고 원인 조사중 입니다.
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'stretch' }}
      >
        <View>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 36.374159,
              longitude: 127.365864,
              latitudeDelta: 0.00522,
              longitudeDelta: 0.00221,
            }}
          />
        </View>
        <View style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
          {this.renderHeader()}
          <View style={{ height: 28 }} />
          {this.renderProtocol()}
          <View style={{ height: 24 }} />
          {this.renderProgress()}
          <View style={{ height: 24 }} />
          <Text style={[styles.subheaderContainer, styles.subheaderText]}>
            Comment
          </Text>
          <TouchableOpacity style={styles.commentButton}>
            <Text style={styles.commentButtonText}>새로운 의견 등록하기</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.borderedContentBox,
              {
                borderColor: '#84c571',
              },
            ]}
          >
            <Text>화재 원인은 담배꽁초였던 것 같습니다.</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  map: { height: Layout.window.width },
  subheaderContainer: { marginBottom: 6 },
  subheaderText: { fontSize: 16, color: Colors.defaultGrey },
  commentButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    backgroundColor: Colors.buttonGrey,
    borderRadius: 10,
  },
  commentButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  borderedContentBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    minHeight: 100,
  },
});
