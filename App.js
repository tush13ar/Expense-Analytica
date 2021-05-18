import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import Analytics from './Analytics';
import NoteStack from './noteStackContainer';
import store from './store';
import TransactionList from './TransactionList';

import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import TempScreen from './temp';
import Reaction from './tempscreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let iconColor;
              let iconSize;
              console.log('size:' + size + ' ' + 'color:' + color);

              if (route.name === 'Home') {
                iconName = 'home';
                iconColor = focused ? 'orange' : 'red';
                iconSize = focused ? 25 : 20;
              } else if (route.name === 'Analytics') {
                iconName = 'pie-chart';
                iconColor = focused ? 'orange' : 'red';
                iconSize = focused ? 25 : 20;
              } else if (route.name === 'Notes') {
                iconName = 'sticky-note-o';
                iconColor = focused ? 'orange' : 'red';
                iconSize = focused ? 25 : 20;
              }
              return <Icon name={iconName} size={iconSize} color={iconColor} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'orange',
            inactiveTintColor: 'red',
          }}>
          <Tab.Screen name="Home" component={TransactionList} />
          <Tab.Screen name="Analytics" component={Analytics} />
          <Tab.Screen name="Notes" component={NoteStack} />
          <Tab.Screen name="temp" component={Reaction} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
