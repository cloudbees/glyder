pipeline {
  agent {
    docker {
      image 'node:carbon'
    }

  }
  stages {
    stage('NPM Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'make build'
      }
    }
  }
}