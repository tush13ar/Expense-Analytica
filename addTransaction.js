import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import {TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HOC = (Comp,iconName) => (props) => (
  <Comp {...props} icon={iconName}/>
)

const ModifyTransaction = (props) => (
  <TouchableHighlight
    onPress={() => {
      console.log('modify check')
      props.modifyTransaction();
      
    }}>
    <Icon name={props.icon} size={70} color="blue" />
  </TouchableHighlight>
);

const AddTransaction = HOC(ModifyTransaction,'plus')

const DeleteTransaction = HOC(ModifyTransaction, 'trash-o')

export {AddTransaction, DeleteTransaction};
