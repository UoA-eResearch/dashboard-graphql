# dashboard-graphql
* AWS Serverless (Lambda) GraphQL Server for the Research Hub Dashboard
* Built using the [Serverless Framework](https://serverless.com/)
* Packaged with Webpack using the serverless-bundle plugin
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
* Inside Visual Studio Code hit `F5` and select `Debug` as config file (this config is for Windows. If you are using Linux, select the `Debug Linux` config). Attach breakpoints as desired.

## Code Linting
* To lint your code with ESLint:
```
npm run pretest
```

## Unit Tests
* To run unit tests with Jest:
```
npm test
```

## Deploy to AWS
* To deploy to AWS execute:
```
npm run deploy
```
Note: API Gateway API mapping needs to be configured after first deployment.
- using AWS CLI:
```
aws apigateway create-base-path-mapping
--domain-name <value>
--base-path <value>
--rest-api-id <value>
--stage <value>
```
Example:
```
aws apigateway create-base-path-mapping
--domain-name apigw.sandbox.amazon.auckland.ac.nz
--base-path dev-cer-dashboard-graphql
--rest-api-id 69b7bd8o16
--stage dev
```
The graphql endpoint under the domain mapping will be:
https://apigw.sandbox.amazon.auckland.ac.nz/dev-cer-dashboard-graphql/graphql

To delete an API mapping:
```
aws apigateway delete-base-path-mapping
--domain-name <value>
--base-path <value>
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