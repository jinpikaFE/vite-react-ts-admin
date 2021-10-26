pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
            args '-p 3007:3007' 
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') { 
            steps {
                sh 'yarn' 
            }
        }
        stage('Test') {
            steps {
                sh 'chmod 755 ./jenkins/scripts/*.sh'
                sh './jenkins/scripts/test.sh'
            }
        }
    }
}