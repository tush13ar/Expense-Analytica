import React from 'react';
import {
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {AddTransaction, DeleteTransaction} from './addTransaction';
import {EmptyList, SelectAll} from './noteList';
import {hideModal, showModal} from './slices/modalSlice';
import {updateTransaction} from './slices/transactionsSlice';
import BudgetContainer from './spendLimit';
import TransactionModal from './transactionModal';

class TransactionList extends React.Component {
  state = {
    transactions: this.props.transactions,
    transactionObject: {},
    numCheckedTransaction: 0,
    isSearching: false,
    searchText: '',
  };

  componentDidUpdate(prevProps) {
    // console.log('list: ');
    console.log(this.props.transactions);
    const selectedTransactionStrength = [...this.props.transactions].reduce(
      (acc, cur) => {
        return cur.isChecked ? acc + 1 : acc;
      },
      0,
    );

    if (this.state.numCheckedTransaction !== selectedTransactionStrength) {
      this.setState({numCheckedTransaction: selectedTransactionStrength});
    }
    if (prevProps.transactions !== this.props.transactions) {
      this.setState({transactions: this.props.transactions});
    }
  }

  showFilteredList = (text) => {
    if (text === '') {
      this.setState({transactions: this.props.transactions, searchText: text});
    } else {
      this.setState({isSearching: true, searchText: text});
      const transactionKeys = [
        'amount',
        'category',
        'note',
        'date',
        'month',
        'timestamp',
      ];
      const newArray = this.state.transactions.filter((item) => {
        let match = false;

        // console.log(item);
        transactionKeys.forEach((key) => {
          if (item[key]) {
            if (
              item[key].toString().toLowerCase().includes(text.toLowerCase())
            ) {
              console.log(key + ' ' + item[key].toString().includes(text));
              match = true;
            }
          }
        });
        return match;
      });
      console.log('newArray');
      this.setState({transactions: newArray});
    }
  };

  onPressAddTransaction = () => {
    this.setState({
      transactionObject: {
        category: null,
        amount: null,
        note: null,
      },
    });
    this.props.showModal();
  };

  onPressDeleteTransaction = () => {
    const newArray = [...this.props.transactions].filter(
      (transaction) => !transaction.isChecked,
    );
    this.props.updateTransaction(newArray);
    this.showFilteredList(this.state.searchText);
  };

  onSelect = (data) => {
    const newDataItem = {...data.item};

    newDataItem.selectedStyle = newDataItem.isChecked
      ? styles.plain
      : styles.highlight;
    newDataItem.isChecked = !newDataItem.isChecked;

    const newArray = [...this.props.transactions];

    const index = newArray.findIndex((item) => newDataItem.key === item.key);

    newArray[index] = newDataItem;

    this.props.updateTransaction(newArray);
    this.showFilteredList(this.state.searchText);
  };

  onSelectAll = () => {
    const newArray = [...this.props.transactions].map((item) => {
      if (this.state.transactions.includes(item)) {
        return {...item, isChecked: true, selectedStyle: styles.highlight};
      } else {
        return item;
      }
    });
    this.props.updateTransaction(newArray);
    this.showFilteredList(this.state.searchText);
  };

  sections = () => {
    const transactionsByMonth = this.state.transactions.reduce((obj, cur) => {
      const month = cur.month;
      return {
        ...obj,
        [month]: [...(obj[month] || []), cur],
      };
    }, {});
    return Object.keys(transactionsByMonth)
      .map((month) => ({
        title: month,
        data: transactionsByMonth[month].sort((a, b) => b.key - a.key),
      }))
      .sort((a, b) => {
        return b.data[0].key - a.data[0].key;
      });
  };

  renderItem = (data) => (
    <TouchableOpacity
      onPress={() => {
        this.setState({transactionObject: {...data.item}});
        this.props.showModal();
      }}
      onLongPress={() => {
        this.onSelect(data);
      }}>
      <Card
        containerStyle={[styles.row, data.item.selectedStyle]}
        wrapperStyle={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 40, color: 'white'}}>
            {data.item.date}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '40%',
          }}>
          <Text style={styles.rowText}>{data.item.amount}</Text>
          <Text style={styles.rowText}>{data.item.category}</Text>
          <Text style={styles.rowText} numberOfLines={1}>
            {data.item.note}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
  renderSectionHeader = (obj) => {
    return (
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'teal',
          paddingLeft: 10,
        }}>
        {obj.section.title}
      </Text>
    );
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: 'ivory',
        }}>
        <BudgetContainer />
        <TextInput
          placeholder="Search"
          value={this.state.searchText}
          onChangeText={this.showFilteredList}
          style={{borderWidth: 1, margin: 2}}
        />
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.sections()}
          contentContainerStyle={
            this.sections().length === 0
              ? {flex: 1, justifyContent: 'center', alignItems: 'center'}
              : {}
          }
          ListEmptyComponent={<EmptyList text={'Add your expenses here...'} />}
        />
        <Modal
          visible={this.props.modalVisible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => {
            this.props.hideModal();
          }}>
          <TransactionModal transactionObject={this.state.transactionObject} />
        </Modal>
        <View
          ref={(view) => {
            this.icon = view;
          }}
          onLayout={(event) =>
            this.icon.measure((x, y, w, h) => {
              console.log(x + ' ' + y + ' ' + w + ' ' + h);
            })
          }
          style={{
            position: 'absolute',
            bottom: 50 / 2,
            right: 50 / 2,
          }}>
          {this.state.numCheckedTransaction > 0 ? (
            <DeleteTransaction
              modifyTransaction={this.onPressDeleteTransaction}
            />
          ) : (
            <AddTransaction modifyTransaction={this.onPressAddTransaction} />
          )}
        </View>
        {this.state.numCheckedTransaction > 0 && (
          <SelectAll
            onSelectAll={this.onSelectAll}
            numSelectedItems={this.state.numCheckedTransaction}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'teal',
    borderRadius: 10,
    flexDirection: 'row',
  },
  rowText: {
    color: 'white',
  },
  plain: {
    backgroundColor: 'teal',
  },
  highlight: {
    backgroundColor: 'brown',
  },
});

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  modalVisible: state.modal,
});

export default connect(mapStateToProps, {
  showModal,
  hideModal,
  updateTransaction,
})(TransactionList);
