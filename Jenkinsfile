awsProfile = ''

pipeline {
    agent {
        label("uoa-buildtools-ionic")
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                githubNotify description: "Build starting...", status: "PENDING"
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
                echo "Testing dashboard-graphql project"
                sh "npm run test:prod"
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

                    } else if (env.BRANCH_NAME == 'nonprod') {
                        echo 'Setting variables for nonprod deployment'
                        awsCredentialsId = 'aws-its-nonprod-access'
                        awsTokenId = 'aws-its-nonprod-token'
                        awsProfile = 'uoa-its-nonprod'

                    } else if (env.BRANCH_NAME == 'prod') {
                        echo 'Setting variables for prod deployment'
                        awsCredentialsId = 'uoa-its-prod-access'
                        awsTokenId = 'uoa-its-prod-token'
                        awsProfile = 'uoa-its-prod'

                    } else {
                        echo 'No Env set'
                    }

                    echo "awsProfile set to ${awsProfile}"

                    withCredentials([
                        usernamePassword(credentialsId: "${awsCredentialsId}", passwordVariable: 'awsPassword', usernameVariable: 'awsUsername'),
                        string(credentialsId: "${awsTokenId}", variable: 'awsToken')
                    ]) {
                        sh "python3 /home/jenkins/aws_saml_login.py --idp iam.auckland.ac.nz --user $awsUsername --password $awsPassword --token $awsToken --profile ${awsProfile}"
                    }
                }
            }
        }
  
        stage('Deploy') {
            steps {
                echo "Deploying dashboard-graphql to Lambda on ${env.BRANCH_NAME}"
                script {            
                    def stage = (
                        env.BRANCH_NAME == 'prod' ? 'prod' : 
                        env.BRANCH_NAME == 'nonprod' ? 'test' : 
                        'dev'
                    )
                    echo "Deployment stage = ${stage}"
                    
                    sh "sls deploy --stage ${stage} --aws-profile ${awsProfile}"

                    echo "Deploy to ${env.BRANCH_NAME} complete"
                }
            }
        }
    }
    
    post {
        success {
            echo "Jenkins job ran successfully. Deployed to ${env.BRANCH_NAME}"
            githubNotify description: "Build number ${env.BUILD_NUMBER} succeeded.",  status: "SUCCESS"
        }
        failure {
            echo 'Jenkins job failed :('
            githubNotify description: "Build number ${env.BUILD_NUMBER} failed.",  status: "FAILURE"
        }
    }
}