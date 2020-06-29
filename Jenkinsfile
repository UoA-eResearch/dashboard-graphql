pipeline {
    agent any

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }
        
        stage('Run tests') {
            when {
                changeset "**/dashboard-graphql/*.*"
            }
            steps {
                echo 'Testing dashboard-graphql project'
            }
        }  
        
        stage('Build') {
            when {
                changeset "**/dashboard-graphql/*.*"
            }
            steps {
                echo 'Building dashboard-graphql project'
            }
        }
  
        stage('Deploy') {
            when {
                changeset "**/dashboard-graphql/*.*"
            }
            steps {
                echo 'Deploying dashboard-graphql to Lambda on ' + BRANCH_NAME
            }
        }
    }
    
    post {
        success {
            echo 'Jenkins job ran successfully. Deployed to ' + BRANCH_NAME
        }
        failure {
            echo 'Jenkins job failed :('
        }
    }
}