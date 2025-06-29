const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

const app = express();
app.use(middleware());

app.get('/', (req, res) => {
  console.log('hello world');
})

app.post('/visit-time', (req, res) => {
  // Create array between 0 to 180
  const visitTime = [];
    for (let i = 0; i <= 180; i++) {
        visitTime.push({
            label: String(i),
            value: i,
        });
    }

  res.send(visitTime);
});

app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const visitor = envoy.payload;
  const allowedVisitTime = envoy.meta.config.VISIT_TIME;
  const signedIn = visitor.attributes['signed-in-at'];
  const signedOut = visitor.attributes['signed-out-at'];
  const visitTime = getVisitTime(signedIn, signedOut)

  let message = "no";

  if(visitTime > allowedVisitTime) {
    message = "yes";
  }

  await job.attach({ label: 'Overstayed?', value: message });
  
  res.send({ allowedVisitTime });
});

// Helper function that calculates the length of a visit
function getVisitTime(signin, signout) {
    const date1 = new Date(signin);
    const date2 = new Date(signout);

    // Check if the dates are valid
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        console.error("Invalid date string provided. Please ensure the format is correct.");
        return NaN; // Return Not-a-Number for invalid date inputs
    }

    const time1 = date1.getTime(); // Returns milliseconds since Unix epoch
    const time2 = date2.getTime();

    const differenceInMilliseconds = Math.abs(time1 - time2);

    // Convert the difference from milliseconds to minutes
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    return differenceInMinutes;
}

app.use(errorMiddleware());

const listener = app.listen(8000 || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
