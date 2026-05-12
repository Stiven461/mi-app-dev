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
                    bat 'timeout /t 3 /nobreak > nul'
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
                echo '✅ Pipeline completado exitosamente! La app funciona!'
            }
        }
    }
    
    post {
        success {
            echo '🎉 ¡Aplicación verificada y funcionando!'
        }
        failure {
            echo '❌ La aplicación tiene errores. Revisa los logs.'
        }
    }
}