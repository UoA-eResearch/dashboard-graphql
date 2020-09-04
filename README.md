# dashboard-graphql
* AWS Serverless (Lambda) GraphQL Server for the Research Hub Dashboard
* Built using the [Serverless Framework](https://serverless.com/)
* Packaged with Webpack using the serverless-bundle plugin
* Supports debugging with Visual Studio Code
* Supports unit and integration testing using Jest
* Built-in code linting with ESlint
* CI/CD with Jenkins

## Setup

1. Install Serverless Framework globally:
```
npm install -g serverless
```

2. Install NPM modules:
```
npm install
```

3. Obtain Temporary AWS credentials for UoA (**Note:** only valid for 1 hour):
Running and testing locally will not succeed without AWS credentials. Instructions for accessing the credentials are on the [Auckland Uni wiki](https://wiki.auckland.ac.nz/pages/viewpage.action?spaceKey=UC&title=AWS+Temporary+Credentials+for+CLI).

* Make sure that the credentials are located in ~/.aws/credentials and take note of the profile for the credentials. Currently "saml" is the default profile at the time of writing this.
* Passing in the aws credentials to the deploy and test commands can be done by adding arguments after a double dash to the run/test commands. This applies to any npm command.
e.g.
* Deploying with the default sandbox stage and saml profile:
`npm run deploy -- --aws-profile saml`

## Run locally
* To run locally simply execute:
```
npm start
```

## Debug Locally
* Inside Visual Studio Code hit `F5` and select `Debug` as config file (this config is for Windows. If you are using Linux, select the `Debug Linux` config). Attach breakpoints as desired.

## Code Linting
* To lint your code with ESLint (linting also runs automatically prior to running unit tests):
```
npm run pretest
```

## Unit/Integration Tests
* To run unit & integration tests with Jest:
```
npm test
```

All test-related files are located in the `tests/` folder. 

NOTE: Jest is set up to get required env variables like the eResearch project API url and API key. This is done by first copying the generated env variables into the .serverless folder in a .env file. Then when Jest loads up, the setupFilesAfterEnv config (see package.json) points to the jest-preload-env.js file, where the dotenv package is used to load the variables from the .env file into the current environment. For further Jest configuration options, see https://jestjs.io/docs/en/configuration.

## Load Testing
* EasyGraphQL and Artillery have been set up in this project to run load testing on the graphql server. You can test the server locally, or point at the deployed server on AWS. See the `README` in the `tests/load-testing` folder to see how to configure and run load testing.

## Deploy to AWS
* To deploy to AWS execute:
```
npm run deploy
```
How the deployment occurs is described in the `serverless.yml` file, and environment-specific settings are stored in the `env/` folder, in json format. The default environment is dev (sandbox).
During deployment to AWS, Serverless Framework handles creating/updating the entire application stack, which includes the following:
* Lambda function
* API Gateway
* API Gateway mapping to our custom domain (via the serverless-domain-manager plugin)
* S3 Bucket for uploading the source files
* Cognito Authorizer for API Gateway
* IAM Role and Permissions

NOTE: The graphql endpoint (for sandbox environment) under the domain mapping will be:
https://apigw.sandbox.amazon.auckland.ac.nz/dev-cer-dashboard-graphql/graphql

### Deploy to a different stage
* By default the deploy command deploys to the `dev` stage
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

## CI/CD
When updates to this repo are pushed to the **sandbox**, **nonprod**, or **prod** branches (which correspond to the 3 UoA AWS environments), a Github webhook triggers one of three corresponding jobs in the UoA production Jenkins server.
The Jenkins server uses the configurations set in its' environment for setting up access to the AWS resources/accounts/tags as well as deploying the stack on AWS. 
The Jenkins pipeline that gets run is defined in the `Jenkinsfile` in this repository. The pipeline includes the following main stages:
* Checkout
* AWS Credential Grab
* Build
* Run tests
* Deploy
* Post-pipeline steps (Slack and GitHub notifications)

Resources will not be deployed to AWS if any of the preceding pipeline stages fail. Therefore, it is a good idea to try running the unit and integration tests locally as described above, before committing code to any of the CI branches.
Slack notifications can be viewed in the Research-Hub channel in uoa.slack.com.
Notification of a pipeline success or failure can also be seen in GitHub, as either a tick or a cross beside the commit that triggered the build.

## Branch Protection
Currently, only the prod branch has branch protection applied. Branch protection is configured so that changes can only be merged into the branch once a pull request is submitted and approved. To view and modify branch protection rules in GitHub, go here: https://github.com/UoA-eResearch/dashboard-graphql/settings/branches (requires admin access).
