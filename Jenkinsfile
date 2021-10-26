pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
            args '-p 3007:3007' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh './jenkins/scripts/build.sh' 
            }
        }
    }
}