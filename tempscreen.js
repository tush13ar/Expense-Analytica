import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import {View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class Reaction extends Component {
  state = {
    selectedIcon: 'thumbs-up',
    icons: ['thumbs-up', 'thumbs-down', 'heart', 'star'],
    showSelector: false,
  };

  iconList = () => {
    return (
      <View style={{flexDirection: 'row', paddingBottom: 5}}>
        {this.state.icons.map((icon) => (
          <TouchableHighlight
            style={{paddingRight: 8}}
            onPress={() => {
              this.setState({selectedIcon: icon, showSelector: false});
            }}>
            <Icon name={icon} color={'blue'} size={35} />
          </TouchableHighlight>
        ))}
      </View>
    );
  };

  selectIcon = () => {};
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.showSelector && this.iconList()}
        <TouchableHighlight
          onPress={() => {
            this.setState({showSelector: true});
          }}>
          <Icon name={this.state.selectedIcon} color={'red'} size={40} />
        </TouchableHighlight>
      </View>
    );
  }
}

export default Reaction;
