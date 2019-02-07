import React from 'react';
import { View, Text } from 'react-native';
import { ChevronLeft, ChevronMiddle, ChevronRight } from '../components/ArrowPolygons';

const StateMarker = ({ children, selected, position }) => {
  const { markerTextStyle, circleStyle } = styles;

  let arrowColor = 'black';
  let Chevron = null;
  const chevronTextStyle = { color: selected ? 'white' : '#eaeaea', fontSize: 13 };

  switch (position) {
    case 'left':
      arrowColor = selected ? '#d62c2c' : 'white';
      Chevron = ChevronLeft;
      break;
    case 'center':
      arrowColor = selected ? '#f5c234' : 'white';
      Chevron = ChevronMiddle;
      break;
    case 'right':
      arrowColor = selected ? '#7ed321' : 'white';
      Chevron = ChevronRight;
      break;
    default:
      arrowColor = styles.defaultMarkerStyle;
  }

  return (
    <Chevron color={arrowColor}>
      <View style={[circleStyle, { backgroundColor: selected ? 'white' : '#eaeaea' }]} />
      <View style={{ width: 5 }} />
      <Text style={chevronTextStyle}> {children} </Text>
    </Chevron>
  );
};

const styles = {
  circleStyle: { width: 11, height: 11, borderRadius: 50, backgroundColor: 'white' },
  markerTextStyle: {},
};

export default StateMarker;