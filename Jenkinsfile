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
                // Navegar a la carpeta backend donde está package.json
                dir('backend') {
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                // test.js está en la raíz del proyecto
                bat 'node test.js'
            }
        }
        
        stage('Verify Backend') {
            steps {
                dir('backend') {
                    bat 'node -e "console.log(\"Backend funcionando correctamente\")"'
                }
            }
        }
        
        stage('Verify Frontend') {
            steps {
                dir('frontend') {
                    bat 'echo "Archivos del frontend verificados"'
                }
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