import RNDateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';

import {
  Button,
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import {Svg} from 'react-native-svg';
import {connect} from 'react-redux';
import {VictoryPie} from 'victory-native';
import {EmptyList} from './noteList';

const colors = [
  'aqua',
  'blanchedalmond',
  'blue',
  'brown',
  'burlywood',
  'beige',
  'cadetblue',
  'chartreuse',
  'coral',
  'crimson',
  'gold',
  'grey',
  'violet',
  'lavender',
  'lawngreen',
  'lemonchiffon',
  'ligtblue',
  'lime',
  'limegreen',
  'maroon',
  'oldlace',
  'olive',
  'salmon',
];

const Temp = () => {
  return (
    <View
      style={{width: 50, height: 50, backgroundColor: 'red', paddingLeft: 10}}
    />
  );
};

const PieList = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor:
          props.activeCategory === props.row.x ? props.row.color : 'white',
        alignItems: 'center',
        paddingLeft: 5,
        borderRadius: 5,
      }}>
      <View
        style={{
          height: 25,
          width: 25,
          backgroundColor:
            props.activeCategory === props.row.x ? 'white' : props.row.color,
        }}
      />
      <Text style={{fontSize: 20, padding: 5}}>{props.row.x}</Text>
      <Text style={{fontSize: 20, padding: 5}}>{props.row.y}</Text>
      <Text style={{fontSize: 20, padding: 5}}>{props.row.percentage}%</Text>
    </View>
  );
};

class Analytics extends React.Component {
  state = {
    transactions: this.props.transactions,
    activeCategory: null,
    pickerToggle: null,
    fromDate: null,
    toDate: null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.transactions !== prevProps.transactions) {
      this.setState({
        transactions: this.props.transactions,
        fromDate: null,
        toDate: null,
      });
    }
    console.log(this.state.activeCategory);
    if (this.state.activeCategory) {
      this.list.scrollToIndex({index: 3, viewPosition: 0});
      console.log('scrollToIndex');
    }
  }

  data = () => {
    let totalAmount = 0;
    const categoryWithAmount = this.state.transactions.reduce((obj, cur) => {
      totalAmount = totalAmount + Number(cur.amount);
      const cat = cur.category;
      return {
        ...obj,
        [cat]: Number(obj[cat] || 0) + Number(cur.amount),
      };
    }, {});
    console.log('totalAmount' + totalAmount);
    const returnValue = Object.keys(categoryWithAmount).map((cat, index) => ({
      x: cat,
      y: categoryWithAmount[cat],
      percentage: +((categoryWithAmount[cat] / totalAmount) * 100).toFixed(2),
      color: colors[index],
    }));

    return returnValue;
  };

  setCategoryActive = (arg) => {
    this.setState((state) => {
      let updatedState = state.activeCategory == arg ? null : arg;
      return {activeCategory: updatedState};
    });
  };

  renderItem = (obj) => (
    <TouchableOpacity
      onPress={() => {
        console.log('presses');
        this.setCategoryActive(obj.item.x);
      }}
      style={{padding: 5}}>
      <PieList
        row={obj.item}
        setCategoryActive={this.setCategoryActive}
        activeCategory={this.state.activeCategory}
      />
    </TouchableOpacity>
  );

  applyRange = () => {
    const filteredTransactions = this.state.transactions.filter((item) => {
      const from = new Date(this.state.fromDate.toDateString());
      const to = new Date(this.state.toDate.toDateString());
      if (
        item.dateObject >= from.getTime() &&
        item.dateObject <= to.getTime() + 86400000
      ) {
        return true;
      } else {
        false;
      }
      console.log(from.getTime());
      console.log(to.getTime());
      console.log(item.dateObject);
    });
    this.setState({
      transactions: filteredTransactions,
    });
  };

  getItemLayout = (item, index) => ({
    length: 25,
    offset: 25 * index,
    index: index,
  });

  getHeader = () => (
    <VictoryPie
      data={this.data()}
      labels={({datum}) => datum.x}
      labelRadius={75}
      innerRadius={({datum}) =>
        datum.x == this.state.activeCategory ? 40 : 50
      }
      radius={({datum}) => (datum.x == this.state.activeCategory ? 110 : 100)}
      style={{
        data: {
          fill: ({datum}) => datum.color,
        },
      }}
      events={[
        {
          target: 'data',
          eventHandlers: {
            onPress: () => {
              console.log('hi');
              return [
                {
                  target: 'data',
                  mutation: (props) => {
                    this.setCategoryActive(props.datum.x);
                  },
                },
              ];
            },
          },
        },
      ]}
    />
  );

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderBottomWidth: 2,
            paddingBottom: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              padding: 10,
            }}>
            <View style={{alignContent: 'center'}}>
              <Text
                style={{fontSize: 20, color: 'blue'}}
                onPress={() => {
                  console.log(this.props.transactions);
                  this.setState({pickerToggle: 'from'});
                }}>{`${
                this.state.fromDate
                  ? this.state.fromDate.toDateString()
                  : 'From'
              }`}</Text>
            </View>
            <View style={{alignContent: 'center'}}>
              <Text
                style={{fontSize: 20, color: 'blue'}}
                onPress={() => {
                  this.setState({pickerToggle: 'to'});
                }}>{`${
                this.state.toDate ? this.state.toDate.toDateString() : 'To'
              }`}</Text>
            </View>
          </View>
          <View style={{alignItems: 'flex-end', paddingRight: 10}}>
            <Button title="Apply" onPress={this.applyRange} />
          </View>

          {this.state.pickerToggle && (
            <RNDateTimePicker
              value={new Date()}
              display={'spinner'}
              onChange={(event, date) => {
                if (this.state.pickerToggle === 'from') {
                  this.setState({fromDate: date, pickerToggle: null});
                } else {
                  this.setState({toDate: date, pickerToggle: null});
                }
              }}
            />
          )}
        </View>
        <VictoryPie
          data={this.data()}
          labels={({datum}) => datum.x}
          labelRadius={75}
          innerRadius={({datum}) =>
            datum.x == this.state.activeCategory ? 40 : 50
          }
          radius={({datum}) =>
            datum.x == this.state.activeCategory ? 110 : 100
          }
          style={{
            data: {
              fill: ({datum}) => datum.color,
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: () => {
                  console.log('hi');
                  return [
                    {
                      target: 'data',
                      mutation: (props) => {
                        this.setCategoryActive(props.datum.x);
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
        <FlatList
          ref={(list) => {
            this.list = list;
          }}
          data={this.data()}
          //ListHeaderComponent={this.getHeader()}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={<EmptyList text={'No Data to show here'} />}
          contentContainerStyle={
            this.data().length === 0
              ? {
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              : {}
          }
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  transactions: state.transactions,
});

export default connect(mapStateToProps)(Analytics);
