import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NoteHeader = (props) => (
  <View
    style={{
      flexDirection: 'row',
      backgroundColor: props.color.light,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
    <TouchableOpacity onPress={props.onPressBack}>
      <Icon name="arrow-left" color="red" size={36} style={{margin: 5}} />
    </TouchableOpacity>
    <TouchableOpacity onPress={props.onChangeColor}>
      <Icon
        name="paint-brush"
        color={props.color.dark}
        size={36}
        style={{margin: 5}}
      />
    </TouchableOpacity>
  </View>
);

export default class Note extends React.Component {
  state = {
    noteText: null,
    noteKey: null,
    color: {},
    pageColors: [
      {light: 'blanchedalmond', dark: 'crimson'},
      {light: 'lightsalmon', dark: 'green'},
      {light: 'palegoldenrod', dark: 'goldenrod'},
      {light: 'white', dark: 'black'},
      {light: 'lightskyblue', dark: 'blue'},
    ],
  };

  componentDidMount() {
    if (this.props.route.params) {
      console.log('check cdm');
      this.setState({
        noteText: this.props.route.params.text,
        noteKey: this.props.route.params.key,
        color: this.props.route.params.color,
      });
    } else {
      console.log('check cdm');
      this.setState({color: {light: 'blanchedalmond', dark: 'crimson'}});
    }

    this.props.navigation.setOptions({
      header: this.header,
      tabBarVisble: false,
    });
  }

  componentDidUpdate() {
    this.props.navigation.setOptions({
      header: this.header,
      tabBarVisble: false,
    });
  }

  header = () => (
    <NoteHeader
      color={this.state.color}
      onPressBack={this.onSubmit}
      onChangeColor={this.changeColor}
    />
  );

  changeColor = () => {
    const colorIndex = this.state.pageColors.findIndex((item) => {
      console.log(item);
      console.log(this.state.color);
      return item == this.state.color ? true : false;
    });
    colorIndex !== this.state.pageColors.length - 1
      ? this.setState({color: this.state.pageColors[colorIndex + 1]})
      : this.setState({color: this.state.pageColors[0]});
  };

  onChangeText = (input) => {
    this.setState({noteText: input});
  };

  onSubmit = () => {
    if (this.state.noteText === null || this.state.noteText === '') {
      this.props.navigation.pop();
    } else {
      const id = Date.now();
      this.props.navigation.navigate('NoteList', {
        text: this.state.noteText,
        key: this.props.route.params ? this.state.noteKey : id,
        isEdited: this.props.route.params ? true : false,
        color: this.state.color,
      });
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: this.state.color.light,
        }}>
        <TextInput
          autoFocus={true}
          multiline={true}
          placeholder={'write something here...'}
          onChangeText={this.onChangeText}
          value={this.state.noteText}
          style={{color: this.state.color.dark}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
