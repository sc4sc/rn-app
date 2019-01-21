import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { Icon } from '@shoutem/ui';
import * as actions from '../actions';

class ReportItem extends React.Component {
  renderIcon() {
    return <Icon name="checkbox-on" style={{ flex: 1 }} />;
  }

  renderNextButton() {
    return (
      <Text
        style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}
        onPress={this.props.onPress}
      >
        다음
      </Text>
    );
  }

  onButtonPressed = () => {
    this.props.selectIncident(this.props.type);
  };

  render() {
    const { type, selected, onPress: selectable } = this.props;

    const showSelected = selectable && selected;
    const empty = <View style={{ flex: 1 }} />;

    return (
      <TouchableOpacity onPress={this.onButtonPressed}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: selected ? '#d5d5d5' : '#5f5f5f' },
          ]}
        >
          {showSelected ? this.renderIcon() : empty}
          <Text
            style={[
              styles.itemContent,
              { color: selected ? 'black' : 'white' },
            ]}
          >
            {type}
          </Text>
          {showSelected ? this.renderNextButton() : empty}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 51,
    borderRadius: 9,
    marginBottom: 10,
  },
  itemContent: {
    flex: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
};

const mapStateToProps = (state, ownProps) => {
  return {
    selected: state.newIncident.selectedIncident === ownProps.type,
  };
};

export default connect(
  mapStateToProps,
  actions
)(ReportItem);
