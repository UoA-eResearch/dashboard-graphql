awsProfile = ''
slackChannel = "research-hub"
slackCredentials = "UoA-Slack-Access-Research-Hub"

pipeline {
    agent {
        label("uoa-buildtools-ionic")
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                slackSend(channel: slackChannel, tokenCredentialId: slackCredentials, message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
            }
        }

        stage('AWS Credential Grab') {
            steps{
                script {
                    echo "☯ Authenticating with AWS"

                    def awsCredentialsId = ''
                    def awsTokenId = ''

                    if (env.BRANCH_NAME == 'sandbox') {
                        echo 'Setting variables for sandbox deployment'
                        awsCredentialsId = 'aws-sandbox-user'
                        awsTokenId = 'aws-sandbox-token'
                        awsProfile = 'uoa-sandbox'

                    } else if (env.BRANCH_NAME == 'dev') {
                        echo 'Setting variables for dev deployment'
                        awsCredentialsId = 'aws-its-nonprod-access'
                        awsTokenId = 'aws-its-nonprod-token'
                        awsProfile = 'uoa-its-nonprod'

                    } else if (env.BRANCH_NAME == 'test') {
                        echo 'Setting variables for test deployment'
                        awsCredentialsId = 'aws-its-nonprod-access'
                        awsTokenId = 'aws-its-nonprod-token'
                        awsProfile = 'uoa-its-nonprod'

                    } else if (env.BRANCH_NAME == 'prod') {
                        echo 'Setting variables for prod deployment'
                        awsCredentialsId = 'aws-its-prod'
                        awsTokenId = 'Access token for ITS Prod Account'
                        awsProfile = 'uoa-its-prod'

                    } else {
                        echo 'No Env set'
                    }

                    echo "awsProfile set to ${awsProfile}"

                    withCredentials([
                        usernamePassword(credentialsId: "${awsCredentialsId}", passwordVariable: 'awsPassword', usernameVariable: 'awsUsername'),
                        string(credentialsId: "${awsTokenId}", variable: 'awsToken')
                    ]) {
                        sh 'python3 /home/jenkins/aws_saml_login.py --idp iam.auckland.ac.nz --user $awsUsername --password $awsPassword --token $awsToken --role devops --profile ' + awsProfile
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "Building dashboard-graphql project. Build number: ${env.BUILD_NUMBER}"
                sh "npm install"
                echo "further build steps are handled in the deployment stage"
            }
        }
        
        stage('Run tests') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'sandbox') {
                        echo "Testing dashboard-graphql project"
                        sh "env AWS_PROFILE=${awsProfile} npm run test:ci"
                    } else {
                        echo 'Skipping tests for nonprod deployment. To do: enable correct env vars for tests in nonprod.'
                    }
                }
            }   
        }
  
        stage('Deploy') {
            steps {
                echo "Deploying dashboard-graphql to Lambda on ${env.BRANCH_NAME}"
                script {                    
                    sh "sls --version"
                    sh "sls deploy --stage ${env.BRANCH_NAME} --aws-profile ${awsProfile}"
                    echo "Deploy to ${env.BRANCH_NAME} complete"
                }
            }
        }
    }
    
    post {
        success {
            echo "Jenkins job ran successfully. Deployed to ${env.BRANCH_NAME}"
            slackSend(channel: slackChannel, tokenCredentialId: slackCredentials, message: "😎 Build successful - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
        }
        failure {
            echo 'Jenkins job failed :('
            slackSend(channel: slackChannel, tokenCredentialId: slackCredentials, message: "😱 Build failed - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
        }
    }
}