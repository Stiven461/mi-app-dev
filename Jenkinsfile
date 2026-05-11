pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Stiven461/mi-app-dev.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                bat 'node test.js'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Pipeline completado exitosamente'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline exitoso!'
        }
        failure {
            echo '❌ Construcción fallida'
        }
    }
}