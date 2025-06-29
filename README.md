# my-plugin

## What is this repository?
Express.js application that integrates with Envoy to indicate whether a visitor overstayed their visit.

## How to run it?

First run the express app:
```
DEBUG=express:* node index.js
```

In another terminal, run ngrok to expose the application to the public internet:

```
ngrok http http://localhost:8000
```
