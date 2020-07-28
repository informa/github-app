# my-first-app

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app
> [Tutorial](https://bdougie.github.io/sls-probot-guide/#create-the-github-app)

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

This app is connected to the github app: sis-response-bot, via APP_ID and WEBHOOK_SECRET

When a webhook is triggered it will deliver details to this url: https://smee.io/7xsGYn3lfhMtCxuu

It has access (read/write) to the `issues` event, and adds a simple message when a issue is created.

This github app is installed on this repo: https://github.com/informa/test-repository