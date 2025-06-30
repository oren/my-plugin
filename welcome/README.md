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

## Step 1: Build the app

Before building the app let's discuss the flow between Envoy and our app and the technology choices we made.

When a visitor sign-in using Envoy, Envoy uses Webook (HTTP POST) to notify our app about the event. Our app extract the name of the visitor and updated the UI with that name. The UI refershes itself every 5 second. Instead of refreshing the UI we could have used Web Sockets but this would complicate the code and we chose the simplest and more straightforward solution. The UI also display a baloon that flys up. We use CSS animations instead of an external Javascript library because we wanted to keep things simple.

For the deployment option we chose to keep the app on your machine. We are using a tool called `ngrok` for this. In the real world you should deploy it on a cloud provider such as AWS or Heroku. 

Enough with talking. Let's start building!

First create a new folder called 'welcome'. Inside you need 2 files ('package.json' and 'server.js') and a folder called 'views'. Inside that folder you need a file called 'index.ejs'. To save you some time, copy the content of those 3 files from [this Github repository](https://github.com/oren/my-plugin/tree/main/welcome).

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

Amazing! Now let's take a brief look at the imporant parts of our app. If you just want to complete the guide without understanding how things works, feel free to skip to part 2.


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

## Step 2: Register the app with Envoy

Before you continue to step 2, we need to expose our app to the internet. Install ngrok and In another terminal, run this command:

```
ngrok http http://localhost:8000
```

You will see output like this:

```
https://c6b6-2601-645-8800-7180-581e-114a-6179-b578.ngrok-free.app -> http://localhost:8000
```

The long URL is the public URL of your app. Copy it because you'll need soon.


Create a [free acconut with Envoy](https://signup.envoy.com) and navigate to the [Dev Dashboard](https://dashboard.envoy.com/dev-dashboard).

In the 'My Integrations' page do the following:
* Click on 'Create New'
* Name: Greeting Visitors
* Description: Greeting Visitors
* 'Logo URL' and 'Small Logo URL': https://dashboard.envoy.com/assets/images/logo-small-red.svg
* API Scopes: 'entries.read'
* Check the 'From Envoy dashboard'
* Check 'Yes, display on the integration page'
* Under 'Event hook' click 'Add event hook'.
* Webhook URL: Enter the public URL of your app and add '/visitor-sign-in' at the end
* Trigger: Visitor sign-in

Under 'Setup Steps' do the following:
* Name: Greetings
* Type: Form
* Click 'Add a field'
* Label: Preferred Hello
* Type: Select
* Note: What greeting you want?
* Key: HELLO
* Options URL: Enter the public URL of your app and add ''/hello-options' at the end
* Check the 'Required'

Copy the Client ID and the Client Secret. Your app needs both as an environment variables. There are multiple ways to add them to the app, I add them to my ~/.bashrc file:

~/.bashrc
```
export ENVOY_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export ENVOY_CLIENT_ID="xxxxxxxx-xxxxxxx-xxxxx-xxxxxxx"
```

Go back to the terminal that runs your node server (not ngrok. keep ngrok running).
Shutdown your node server using ctrl+c. Now include the new environment variables using this command source `~/.bashrc`. Now re-run your app using `node server.js`. 


## Step 3: Use the app

On the Envoy's dashboard, click on 'Integrations', than click on 'Custom Integrations'. You should see your app. Click 'Install'. Select 'Configure'. It will ask you for your preferred HELLO. Click on 'Complete Setup'.

Note: this step is not used by your app but it is required to have it.

On the Envoy's dashboard, click on 'Visitors' and do the following:
* Click 'Sign in visitor'
* Full Name: Josh Mercer
* Click 'Sign in'

Go to the public URL of your app and you should see 'Welcome Josh Mercer!' with a baloon flying.

Congratulations 🏆✨🙌! You built a web app that integrates with Envoy platform and greets visitors.


