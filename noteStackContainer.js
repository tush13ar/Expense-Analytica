import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NoteList from './noteList';
import Note from './note';

const Stack = createStackNavigator();

NoteStack = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="NoteList"
        component={NoteList}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Note" component={Note} />
    </Stack.Navigator>
  );
};

export default NoteStack;
