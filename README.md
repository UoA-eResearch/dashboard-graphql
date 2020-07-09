# dashboard-graphql
* AWS Serverless (Lambda) GraphQL Server for the Research Hub Dashboard
* Built using the [Serverless Framework](https://serverless.com/)
* Packaged with Webpack using the serverless-bundle plugin
* Supports debugging with Visual Studio Code
* Supports unit and integration testing using Jest
* Built-in code linting with ESlint

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

## Unit/Integration Tests
* To run unit & integration tests with Jest:
```
npm test
```
NOTE: Jest is set up to get required env variables like the eResearch project API url and API key. This is done by first copying the generated env variables into the .serverless folder in a .env file. Then when Jest loads up, the setupFilesAfterEnv config (see package.json) points to the jest-preload-env.js file, where the dotenv package is used to load the variables from the .env file into the current environment. For further Jest configuration options, see https://jestjs.io/docs/en/configuration.

## Load Testing
* EasyGraphQL and Artillery have been set up in this project to run load testing on the graphql server. You can test the server locally, or point at the deployed server on AWS. See the README in the tests/load-testing folder to see how to configure and run load testing.

## Deploy to AWS
* To deploy to AWS execute:
```
npm run deploy
```
Note: API Gateway API mapping needs to be configured after first deployment.
# TODO: update this section, using serverless-domain-manager plugin now
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