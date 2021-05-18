import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect} from 'react';
import {Button, TextInput, View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {budgetSubmitted} from './slices/budgetSlice';

const numOfDays = (toDate) => {
  const curDate = new Date().toDateString();
  const curDateInMs = new Date(curDate).getTime();
  const toDateInMs = new Date(toDate).getTime();
  return (toDateInMs - curDateInMs) / 86400000;
};

const BudgetInfo = (props) => {
  const budgetAmount = props.budgetAmount;

  const amountSpent = () => {
    const today = new Date().toDateString();
    const startDate = new Date(today).getTime();
    return props.transactions.reduce((acc, cur) => {
      if (cur.dateObject >= startDate) {
        console.log(startDate);
        return Number(acc) + Number(cur.amount);
      } else {
        return Number(acc);
      }
    }, 0);
  };
  return (
    <View style={{backgroundColor: 'brown'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: 'white'}}>Budget: {budgetAmount}</Text>
        <Text style={{color: 'white'}}>Amount Spent: {amountSpent()}</Text>
      </View>
      {budgetAmount - amountSpent() < 0 ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'white'}}>Budget Exceeded By</Text>
          <View style={{backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 30, color: 'red', fontWeight: 'bold'}}>
              {Math.abs(budgetAmount - amountSpent())}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'white'}}>You can spend</Text>
          <View style={{backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 30, color: 'red', fontWeight: 'bold'}}>
              {budgetAmount - amountSpent()}
            </Text>
          </View>

          <Text style={{fontSize: 20, color: 'white'}}>more</Text>
        </View>
      )}
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20, color: 'white'}}>
          with {numOfDays(props.targetDate.toDateString())} days remaining
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.flipToggle();
        }}
        style={{alignItems: 'flex-end'}}>
        <Icon name="history" color="orange" size={25} style={{margin: 5}} />
      </TouchableOpacity>
    </View>
  );
};

export class SpendLimit extends React.Component {
  state = {
    budget: null,
    date: null,
    showDatePicker: false,
    toggle: this.props.budgetToggle,
  };

  onBudgetInput = (amount) => {
    this.setState({budget: amount});
  };

  onBudgetSubmit = () => {
    this.props.onSubmit({
      budgetAmount: this.state.budget,
    });
    this.props.getDate(this.state.date);
    this.props.flipToggle();
  };

  onSelectDate = (event, date) => {
    this.setState({
      showDatePicker: false,
      date: date,
    });
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'brown',
          alignItems: 'center',
          padding: 10,
          justifyContent: 'flex-start',
        }}>
        <View style={{paddingBottom: 5}}>
          <TextInput
            placeholder={'Enter your Budget Target here...'}
            placeholderTextColor="white"
            value={this.state.budget}
            onChangeText={this.onBudgetInput}
            keyboardType="number-pad"
            style={{
              borderColor: 'white',
              borderWidth: 1,
              padding: 5,
              color: 'white',
            }}
            textAlign="center"
          />
        </View>
        <View style={{paddingBottom: 5}}>
          <Text
            style={{
              color: 'white',
              padding: 10,
              borderWidth: 1,
              borderColor: 'white',
            }}
            onPress={() => {
              this.setState({showDatePicker: true});
            }}>
            {this.state.date
              ? this.state.date.toDateString()
              : 'Select Target Date'}
          </Text>
        </View>

        {this.state.showDatePicker && (
          <RNDateTimePicker
            value={new Date()}
            display={'spinner'}
            onChange={this.onSelectDate}
            minimumDate={new Date()}
          />
        )}
        <Button title="Save" onPress={this.onBudgetSubmit} />
      </View>
    );
  }
}

class BudgetContainer extends React.Component {
  state = {toggle: true, targetDate: null};

  getDate = (date) => {
    this.setState({targetDate: date});
  };

  flipToggle = () => {
    this.setState({toggle: !this.state.toggle});
  };

  render() {
    if (this.state.toggle)
      return (
        <SpendLimit
          onSubmit={this.props.budgetSubmitted}
          getDate={this.getDate}
          flipToggle={this.flipToggle}
        />
      );
    else {
      return (
        <BudgetInfo
          transactions={this.props.transactions}
          budgetAmount={this.props.budgetAmount}
          targetDate={this.state.targetDate}
          flipToggle={this.flipToggle}
        />
      );
    }
  }
}

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  budgetToggle: state.budget.budgetSubmitByUser,
  budgetAmount: state.budget.amount,
});

export default connect(mapStateToProps, {budgetSubmitted})(BudgetContainer);
