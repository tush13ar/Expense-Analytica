import axios from 'axios';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {io} from 'socket.io-client';
import Tweet from './tweet';

class TweetFeed extends Component {
  state = {tweets: [], meassage: null};

  componentDidMount() {
    axios({url: 'http:192.168.43.102:4001/', method: 'get'}).then((res) => {
      this.setState({message: res.data});
    });
    const socket = io('http://192.168.43.102:4001');
    socket.on('message', (message) => {
      console.log('message received', message);
    });
    socket.on('tweet', (json) => {
      console.log(json.data);

      this.setState({tweets: [json, ...this.state.tweets]});
    });
  }

  componentDidUpdate() {
    //this.tweetStream();
  }

  tweetStream = () => {
    const socket = io('http:192.168.43.102:4001/');
    socket.on('connect', (message) => {
      console.log('message received', message);
    });
    socket.on('error', (error) => {
      console.log(error);
    });
    socket.on('heartbeat', () => {
      console.log('heartbeat');
    });
    socket.on('tweet', (json) => {
      if (json.body) {
        this.setState({tweets: [json.body, ...this.state.tweets]});
      }
    });
  };

  render() {
    return this.state.tweets.length > 0 ? (
      <ScrollView>
        {this.state.tweets.map((tweet) => (
          <Tweet key={tweet.data.id} json={tweet} />
        ))}
      </ScrollView>
    ) : (
      <Text>{this.state.message ? this.state.message : 'loading'}</Text>
    );
  }
}

export default TweetFeed;
