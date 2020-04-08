## Quick Punch notification
Chrome extension that will auto prefill login fields  
and notify slack channel if you're logged in or logged out  
it has an option to update your profile status depends of logged action

## Configuration
Required placeholder:  
- SITE_URL
- API_URL_FOR_CHANNEL  
  
Optional placeholder:
- SLACK_ACCOUNT_TOKEN

```
manifest.json

...
"content_scripts": [
        {
            "matches": [
                "SITE_URL"
...
```

```
config.js

...
name: 'John Doe',
username: 'johndoe@gmail.com',

slackChannelUrl: 'API_URL_FOR_CHANNEL',
apiSlackProfilePresenceUrl: 'https://slack.com/api/users.setPresence',
slackProfileToken: 'SLACK_ACCOUNT_TOKEN',
...
```
### Generating slack token
To generate or create token for `slackProfileToken` value refer to the link below  
https://slack.com/intl/en-ph/help/articles/215770388-Create-and-regenerate-API-tokens

## Chrome installation
- enter to chrome url bar: `chrome://extensions/`
- Click `Load unpacked` button
- Locate the folder and enable