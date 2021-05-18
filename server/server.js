const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const needle = require('needle');

const port = 4001;

const token =
  'Bearer AAAAAAAAAAAAAAAAAAAAAGSnMQEAAAAAjQyZO9HWE9UfuG25Y%2FVSFpUGqCM%3DAgSAXLt2aJuqRNQJ5j3vhW8KWAnIMTNlKferDJS8hSpnVqgKll';

const rulesurl = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamurl = 'https://api.twitter.com/2/tweets/search/stream';

const rules = JSON.stringify({
  add: [{value: 'from:Tushar89739110'}],
});

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const io = socketIo(server);

const getRules = async () => {
  try {
    const response = await needle('get', rulesurl, {
      headers: {authorization: token},
    });
    if (response.status === 200) {
      return response.body;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteRules = async (rules) => {
  const ids = rules.map((item) => item.id);
  const data = JSON.stringify({delete: {ids: ids}});
  try {
    const response = await needle('post', rulesurl, data, {
      headers: {'content-type': 'application/json', authorization: token},
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const streamConnect = (socket) => {
  try {
    const stream = needle.get(streamurl, {
      headers: {'content-type': 'application/json', authorization: token},
      timeout: 20000,
    });

    stream
      .on('data', (data) => {
        try {
          const json = JSON.parse(data);
          //console.log(json);
          if (json.connection_issue) {
            socket.emit('error', json);
          } else {
            if (json.data) {
              socket.emit('tweet', json);
            } else {
              socket.emit('error', json);
            }
          }
        } catch (error) {
          socket.emit('heartbeat');
        }
      })
      .on('error', (error) => {
        socket.emit('error', error);
      });
  } catch (error) {
    console.log('error occured while getting tweets');
  }
};

io.on('connection', async (socket) => {
  try {
    socket.emit('message', 'client connected');
    const rules = await getRules();
    if (rules) {
      await deleteRules(rules);
    }
    streamConnect(io);
  } catch (error) {
    console.log(error);
  }
});

app.get('/', (req, res) => {
  res.send('start???');
});
server.listen(port, () => {
  console.log(`port running on ${port}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const util = require('util');
// const request = require('request');
// const path = require('path');
// const socketIo = require('socket.io');
// const http = require('http');
// const axios = require('axios');

// const get = util.promisify(request.get);
// const post = util.promisify(request.post);

// const rules = {
//   add: [{value: 'from:Tushar89739110 from:narendramodi from:ANI'}],
// };

// const token =
//   'Bearer AAAAAAAAAAAAAAAAAAAAAGSnMQEAAAAAjQyZO9HWE9UfuG25Y%2FVSFpUGqCM%3DAgSAXLt2aJuqRNQJ5j3vhW8KWAnIMTNlKferDJS8hSpnVqgKll';

// const rulesurl = 'https://api.twitter.com/2/tweets/search/stream/rules';
// const streamurl = 'https://api.twitter.com/2/tweets/search/stream';

// const app = express();

// const server = http.createServer(app);

// const port = 5000;
// const hostname = '192.168.43.102';

// const io = socketIo(server);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.get('/', (req, res) => {
//   res.send('success... you are on the right path..');
// });

// const callToAPI = async (url, method, data) => {
//   try {
//     const res = await axios({
//       method: method,
//       headers: {
//         'content-type': 'application/json',
//         authorization: token,
//       },
//       url: url,
//       data: data ? data : {},
//     });
//     //console.log(res);
//     return res;
//   } catch (error) {
//     console.log('call to api error', error);
//   }
// };

// app.get('/Rules', async (req, res) => {
//   console.log('get Rules: ');
//   const response = await axios({
//     method: 'get',
//     url: rulesurl,
//     headers: {
//       authorization: token,
//     },
//   });
//   res.json(response.data.data);
//   console.log('response', response.data);
// });

// app.post('/Rules', async (req, res) => {
//   console.log('req.data ', req.body);
//   const response = await callToAPI(rulesurl, 'post', req.body);
//   console.log(response.data);
// });

// app.get('/Stream', async (req, res) => {
//   try {
//     console.log('stream starts');
//     const response = await axios({
//       method: 'get',
//       url: streamurl,
//       headers: {
//         authorization: token,
//       },
//     });
//     response
//       .on('data', (data) => {
//         console.log('tweet received');
//         try {
//           const json = JSON.parse(data);
//           if (json.data) {
//             io.emit('tweet', json);
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       })
//       .on('error', (error) => {
//         console.log('error', error);
//       });
//   } catch (error) {
//     console.log('get Stream', error);
//   }
// });

// io.on('connection', async () => {
//   console.log('client connected');
// });

// server.listen(port, () => {
//   console.log(`server running on ${port}`);
// });
