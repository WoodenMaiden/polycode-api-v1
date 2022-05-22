# Polycode 

⚠️ This app must be run AFTER the MongoDB instance is live, since this api will connect on startup

# Run this app
```
npm run build 
node dist/app.js
```

or via docker 

```
docker build . -t policodev1/api
docker run -p 80:3000 [-e ENV_VARIABLES_BELOW ]policodev1/api
```

# Environment variables 
| Variable | Description | Required ?| 
| ---      | ---      | ---      |
| PORT | Port to run the app on | no (default: 80) |
| SENDIN_BLUE_API_KEY | api key for mail sending via Sendinblue | yes |
| MONGO_URL | Mongo connection URI | yes |
| RUNNER_URL | URL of code runner | yes |
| SECRET | JWT secret | yes |


