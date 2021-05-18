import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
  TouchableHighlight,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

import {hideModal} from './slices/modalSlice';
import {updateTransaction, addTransaction} from './slices/transactionsSlice';

class TransactionModal extends React.Component {
  state = {
    transactionObject: this.props.transactionObject,
    newCategory: null,
    newCatModalVisible: false,
    categories: [],
  };
  componentDidMount() {
    const categoryList = this.props.transactions.reduce((acc, cur) => {
      const category = cur.category;
      return acc.findIndex((cat) => cat === category) === -1
        ? [...(acc || []), category]
        : acc;
    }, []);
    this.setState({categories: categoryList});
    console.log(categoryList);
  }
  onCategoryChange = (value) => {
    if (value === 'addNew') {
      this.setState({
        newCatModalVisible: true,
      });
    } else {
      this.setState({
        transactionObject: {...this.state.transactionObject, category: value},
      });
    }
  };
  onAmountChange = (value) => {
    this.setState({
      transactionObject: {...this.state.transactionObject, amount: `${value}`},
    });
  };
  onNoteChange = (value) => {
    this.setState({
      transactionObject: {...this.state.transactionObject, note: value},
    });
  };

  onDelete = () => {
    let tempArray = [...this.props.transactions];
    let transactionObjectIndex = this.props.transactions.findIndex(
      (transaction) => transaction.key == this.state.transactionObject.key,
    );
    tempArray.splice(transactionObjectIndex, 1);
    this.props.updateTransaction(tempArray);
    this.props.hideModal();
  };

  onSave = () => {
    if (
      this.state.transactionObject.category &&
      this.state.transactionObject.amount
    ) {
      if (this.state.transactionObject.key) {
        const tempArray = [...this.props.transactions];
        tempArray[
          this.state.transactionObject.key - 1
        ] = this.state.transactionObject;
        this.props.updateTransaction(tempArray);
        this.props.hideModal();
      } else {
        const dateObject = new Date();
        const dateAndTimeOfCreation =
          dateObject.toDateString() +
          ' ' +
          dateObject.toTimeString().slice(0, 8);
        const dateOfCreation = dateObject.getUTCDate();
        const monthOfCreation =
          dateObject.toDateString().slice(4, 7) +
          ' ' +
          dateObject.getUTCFullYear();
        const transactionObjectWithKeyAndTimestamp = {
          ...this.state.transactionObject,
          key:
            this.props.transactions.length == 0
              ? 1
              : this.props.transactions[this.props.transactions.length - 1]
                  .key + 1,
          timeStamp: dateAndTimeOfCreation,
          date: dateOfCreation,
          month: monthOfCreation,
          dateObject: dateObject.getTime(),
          isChecked: false,
          selectedStyle: null,
        };
        this.props.addTransaction(transactionObjectWithKeyAndTimestamp);
        this.props.hideModal();
      }
    } else {
      alert('Please select a category and enter appropriate amount.');
    }
  };

  onNewCategoryChange = (newCat) => {
    this.setState({newCategory: newCat});
  };

  onNewCategorySubmit = () => {
    if (this.state.newCategory) {
      this.setState({
        categories: [...this.state.categories, this.state.newCategory],
        newCatModalVisible: false,
        transactionObject: {
          ...this.state.transactionObject,
          category: this.state.newCategory,
        },
      });
    } else {
      alert('Please Enter a new Category');
    }
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: Dimensions.get('window').width * 0.9,
            height: Dimensions.get('window').width * 0.9,
            backgroundColor: 'rgba(100,100,150,1)',
            borderColor: 'rgba(100,150,200,1)',
            borderWidth: 5,
            borderRadius: 50,
            padding: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(100,150,200,1)',
            }}>
            <Picker
              style={{
                height: 50,
                width: 150,
                color: 'white',
                alignItems: 'center',
              }}
              dropdownIconColor="white"
              mode={'dialog'}
              selectedValue={
                this.state.transactionObject.category === null
                  ? 'selCat'
                  : this.state.transactionObject.category
              }
              onValueChange={(itemValue, itemIndex) => {
                if (!itemIndex == 0) this.onCategoryChange(itemValue);
              }}>
              <Picker.Item
                label={'Select a category'}
                value={'selCat'}
                key={'selCat'}
              />
              {this.state.categories.map((category) => (
                <Picker.Item label={category} value={category} key={category} />
              ))}
              <Picker.Item
                label={'+ Add New'}
                value={'addNew'}
                key={'addNew'}
              />
            </Picker>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={{
                borderWidth: 2,
                color: 'white',
                borderColor: 'rgba(100,150,200,1)',
              }}
              value={this.state.transactionObject.amount}
              onChangeText={this.onAmountChange}
              keyboardType={'number-pad'}
              placeholder="Enter Amount here..."
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={{
                borderWidth: 2,
                color: 'white',
                maxHeight: 60,
                borderColor: 'rgba(100,150,200,1)',
              }}
              placeholder="Write something here..."
              value={this.state.transactionObject.note}
              onChangeText={this.onNoteChange}
              multiline={true}
              numberOfLines={3}
            />
          </View>
          <View>
            <Text>{this.state.transactionObject.timeStamp}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={styles.buttonWithPadding}>
              <Button title="Save" onPress={this.onSave} />
            </View>
            {this.state.transactionObject.key && (
              <View style={styles.buttonWithPadding}>
                <Button title="Delete" onPress={this.onDelete} />
              </View>
            )}
          </View>
          <TouchableHighlight
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              top: 20,
              right: 20,
            }}
            onPress={() => {
              this.props.hideModal();
            }}>
            <Icon name="window-close" size={30} color="red" />
          </TouchableHighlight>
        </View>
        <View>
          <Modal
            visible={this.state.newCatModalVisible}
            onRequestClose={() => {
              this.setState({newCatModalVisible: false});
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TextInput
                ref={(input) => {
                  this.input = input;
                }}
                placeholder="Enter New Category"
                value={this.state.newcategory}
                onChangeText={this.onNewCategoryChange}
                autoFocus={true}
              />
              <Button title="Done" onPress={this.onNewCategorySubmit} />
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  transactions: state.transactions,
});
export default connect(mapStateToProps, {
  hideModal,
  updateTransaction,
  addTransaction,
})(TransactionModal);

const styles = StyleSheet.create({
  buttonWithPadding: {
    paddingHorizontal: 5,
  },
});
