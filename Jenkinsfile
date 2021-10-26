pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
            args '-p 3000:3000' 
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