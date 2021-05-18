import React from 'react';
import {View, Text} from 'react-native';
import {TwitterTweetEmbed} from 'react-twitter-embed';

const Tweet = ({json}) => {
  const {id, text} = json.data;

  const options = {
    cards: 'hidden',
    align: 'center',
    width: '550',
    conversation: 'none',
  };

  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
};

export default Tweet;
