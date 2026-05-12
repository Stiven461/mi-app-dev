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
                dir('backend') {
                    bat 'npm install'
                }
            }
        }
        
        stage('Start Backend') {
            steps {
                dir('backend') {
                    bat 'start /B node server.js'
                    bat 'ping -n 3 127.0.0.1 > nul'
                }
            }
        }
        
        stage('Test CRUD Completo') {
            steps {
                bat 'node test-completo.js'
            }
        }
        
        stage('Build') {
            steps {
                echo '✅ Pipeline completado exitosamente!'
            }
        }
    }
    
    post {
        success {
            echo '🎉 ¡Aplicación verificada y funcionando!'
        }
        failure {
            echo '❌ La aplicación tiene errores.'
        }
    }
}