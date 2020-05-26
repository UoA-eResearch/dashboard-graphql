# dashboard-graphql
* AWS Serverless (Lambda) GraphQL Server for the Research Hub Dashboard
* Built using the [Serverless Framework](https://serverless.com/)
* Packaged using webpack
* Supports debugging with Visual Studio Code
* TO DO: Add support for unit testing

## Setup

1. Install Serverless Framework globally
```
npm install -g serverless
```

2. Install NPM modules
```
npm install
```

3. [Obtain Temporary AWS credentials for UoA (**Note:** only valid for 1 hour)](https://wiki.auckland.ac.nz/pages/viewpage.action?spaceKey=UC&title=AWS+Temporary+Credentials+for+CLI)

## Run locally
* To run locally simply execute:
```
npm start
```

## Debug Locally
* Inside Visual Studio Code hit `F5` and select `Debug` as config file. Attach breakpoints as desired.

## Deploy to AWS
* To deploy to AWS execute:
```
npm run deploy
```

### Deploy to a different stage
* By default the above command deploys to the `dev` stage
* You can optionally pass a `-- --stage STAGE_NAME` flag (**Note:** the extra `--`)
```
npm run deploy -- --stage=test
```

## Get info about existing deployment
* To get information about the currently deployed endpoints, region, stage, layers etc execute:
```
sls info
```

## Invoke a deployed Lambda function running on AWS
```
sls invoke -f serverless-now
```

## Resources
* For general Serverless Framework help run: `sls help`