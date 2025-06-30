const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

const app = express();
app.use(middleware());

app.set('view engine', 'ejs'); // Set EJS as the templating engine

let latestVisitorName = '';

app.get('/', (req, res) => {
  res.render('index', {
    visitorName: latestVisitorName,
  });
});

app.post('/hello-options', (req, res) => {
  res.send([
    {
      label: 'Hello',
      value: 'Hello',
    },
    {
      label: 'Welcome',
      value: 'Welcome',
    },
  ]);
});

app.post('/visitor-sign-in', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const visitorName = envoy.payload.attributes['full-name'];

  if (visitorName) {
    console.log(`New visitor signed in: ${visitorName}`);
    latestVisitorName = visitorName;
  }

  res.send({ success: true });
});

app.use(errorMiddleware());

const listener = app.listen(8000 || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
