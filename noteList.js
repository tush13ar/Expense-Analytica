import React, {useRef} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Card} from 'react-native-elements';
import {AddTransaction, DeleteTransaction} from './addTransaction';

export const EmptyList = (props) => (
  <Text style={styles.EmptyListText}>{props.text}</Text>
);

const {height, width} = Dimensions.get('window');

export const SelectAll = (props) => {
  const button = useRef(null);

  return (
    <View
      ref={button}
      onLayout={() => {
        button.current.measure((x, y, w, h) => {});
      }}
      style={{
        position: 'absolute',
        bottom: 10,
        left: width / 2 - 47,

        flexDirection: 'column',
      }}>
      <Text style={{color: 'red'}}>
        {props.numSelectedItems} items selected
      </Text>
      <TouchableOpacity
        onPress={props.onSelectAll}
        style={{
          backgroundColor: 'red',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', margin: 8}}>Select All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default class NoteList extends React.Component {
  state = {
    noteList: [
      {
        text: 'complete app as soon as possible ',
        key: 0,
        isChecked: false,
        noteStyle: {backgroundColor: 'violet'},
        color: {light: 'tan', dark: 'black'},
      },
      {
        text: 'deliver copy of rent agreement',
        key: 1,
        isChecked: false,
        noteStyle: {backgroundColor: 'lightsalmon'},
        color: {light: 'lightsalmon', dark: 'green'},
      },
      {
        text: 'get upto 700 in rapid',
        key: 2,
        isChecked: false,
        noteStyle: {backgroundColor: 'palegoldenrod'},
        color: {light: 'palegoldenrod', dark: 'goldenrod'},
      },
      {
        text: 'complete app as soon as possible ',
        key: 3,
        isChecked: false,
        noteStyle: {backgroundColor: 'coral'},
        color: {light: 'coral', dark: 'black'},
      },
    ],
    numCheckedNotes: 0,
    selectAllVisible: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.route.params !== this.props.route.params) {
      if (!this.props.route.params.isEdited)
        this.setState({
          noteList: [
            ...this.state.noteList,
            {
              text: this.props.route.params.text,
              key: this.props.route.params.key,
              isChecked: false,
              noteStyle: {backgroundColor: this.props.route.params.color.light},
              color: this.props.route.params.color,
            },
          ],
        });
      else {
        const tempArray = this.state.noteList.map((obj) => {
          if (obj.key === this.props.route.params.key) {
            return {
              text: this.props.route.params.text,
              key: this.props.route.params.key,
              isChecked: false,
              noteStyle: {backgroundColor: this.props.route.params.color.light},
              color: this.props.route.params.color,
            };
          } else {
            return obj;
          }
        });
        this.setState({
          noteList: tempArray,
        });
      }
    }
    const numberOfCheckedNotes = [...this.state.noteList].reduce(
      (acc, cur) => (cur.isChecked ? acc + 1 : acc),
      0,
    );
    if (this.state.numCheckedNotes !== numberOfCheckedNotes) {
      this.setState({numCheckedNotes: numberOfCheckedNotes});
    }
  }

  onSelectAll = () => {
    const newArray = [...this.state.noteList].map((item) => {
      return {...item, isChecked: true, noteStyle: styles.noteHighlight};
    });
    this.setState({noteList: newArray});
  };

  addNote = () => {
    this.props.navigation.navigate('Note');
  };

  deleteNote = () => {
    const newArray = [...this.state.noteList].filter((note) => !note.isChecked);
    this.setState({
      noteList: newArray,
    });
  };

  onLongPress = (data) => {
    data.item.noteStyle = data.item.isChecked
      ? {backgroundColor: data.item.color.light}
      : styles.noteHighlight;
    data.item.isChecked = !data.item.isChecked;

    const index = this.state.noteList.findIndex(
      (item) => data.item.key === item.key,
    );

    const newNoteList = this.state.noteList;

    newNoteList[index] = data.item;

    this.setState({
      noteList: newNoteList,
    });
  };

  renderItem = (data) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('Note', {
          text: data.item.text,
          key: data.item.key,
          color: data.item.color,
        });
      }}
      onLongPress={() => {
        this.onLongPress(data);
      }}>
      <Card containerStyle={[data.item.noteStyle, styles.note]}>
        <Text style={{color: data.item.color.dark}} numberOfLines={5}>
          {data.item.text}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'floralwhite',
        }}>
        <FlatList
          columnWrapperStyle={{
            flex: 1,
            alignItems: 'center',
          }}
          data={this.state.noteList}
          contentContainerStyle={
            this.state.noteList.length === 0
              ? {flexGrow: 1, justifyContent: 'center', alignItems: 'center'}
              : {}
          }
          renderItem={(data) => this.renderItem(data)}
          numColumns={2}
          ListEmptyComponent={<EmptyList text={'Write your Notes here...'} />}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 50 / 2,
            right: 50 / 2,
          }}>
          {this.state.numCheckedNotes > 0 ? (
            <DeleteTransaction modifyTransaction={this.deleteNote} />
          ) : (
            <AddTransaction modifyTransaction={this.addNote} />
          )}
        </View>
        {this.state.numCheckedNotes > 0 && (
          <View>
            <SelectAll
              onSelectAll={this.onSelectAll}
              numSelectedItems={this.state.numCheckedNotes}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    borderWidth: 0,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.42,
    minHeight: Dimensions.get('window').height * 0.1,
  },
  noteHighlight: {
    backgroundColor: 'yellow',
  },

  EmptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  EmptyListText: {
    color: 'goldenrod',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
