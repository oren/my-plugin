# Guide for building an Envoy app

## Introduction
This is a how-to guide for creating a web application that greet visitors by their name. It integrates with the Envoy platform.

At the end of the guide, we will have a website that looks like this:
![welcome](final.png)

The audience for the guide is someone with basic development skills and familiarity with Javascript, Node.JS, HTML, and CSS. 

## High Level

The guide has 3 parts:
1. Build a small Express.js app that serves HTML page.
1. Register the app in Envoy.
1. Use the app by signing up a visitor using Envoy platform.

## Step 1: Building the app

Before building the app let's discuss the flow between Envoy and our app and the technology choices we made.

When a visitor sign-in using Envoy, Envoy uses Webook (HTTP POST) to notify our app about the event. Our app extract the name of the visitor and updated the UI with that name. The UI refershes itself every 5 second. Instead of refreshing the UI we could have used Web Sockets but this would complicate the code and we chose the simplest and more straightforward solution. The UI also display a baloon that flys up. We use CSS animations instead of an external Javascript library because we wanted to keep things simple.

For the deployment option we chose to keep the app on your machine. We are using a tool called `ngrok` for this. In the real world you should deploy it on a cloud provider such as AWS or Heroku. 

Enough with talking. Let's start building!

First create a new folder called 'welcome'. Inside you need 2 files and a folder called 'views'. Inside that folder you need a file called 'index.ejs'. To save you some time, copy the content of those files from this Github repository: xxx  

Below is what you should end up with:
```
.
├── package.json
├── server.js
└── views
    └── index.ejs
```

Install the NPM dependencies
```
cd welcome
npm install
```

Run the app

```
node server.js
```

Open the broswer at http://localhost:8000 and verify that you see the welcome page:
![welcome](welcome.png)

Congratulations! Now let's take a brief look at the imporant parts of our app. If you just want to complete the guide without understanding how things works, feel free to skip to part 2.


First let's look at the dependencies we have in package.json. the important one is the Envoy Node.js SDK. It provides us with a middleware that is needed for integrating our app with Envoy.
```
  "dependencies": {
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "@envoy/envoy-integrations-sdk": "^1.5.0"
  }
```

Let's take a look at our server.js. This is the endpoint that will recieves the request from Envoy. That's the webhook. This will be called after we will register and setup our app on Envoy platform (step 2 of this guide). Whenever a visitor signs up, this endpoint will be called and our app sets the `latestVisitorName` variable. Every 5 seconds the HTML will re-render itself with the new visitor.

```
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

```


## Step 2: Registering the app with Envoy

## Step 3: Testing the app
