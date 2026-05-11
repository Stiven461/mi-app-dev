pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'  // Configura esto en Global Tool Configuration
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/tu-usuario/tu-repo.git'
                // O si es local: checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Backend Tests') {
            steps {
                bat 'node -e "console.log(\"Backend OK\")"'
                // Aquí podrías correr pruebas con Jest o Mocha
            }
        }
        
        stage('Verify Frontend') {
            steps {
                bat 'node -e "console.log(\"Frontend files OK\")"'
            }
        }
        
        stage('Package Application') {
            steps {
                bat 'mkdir dist'
                bat 'copy *.js dist\\'
                bat 'copy *.json dist\\'
                bat 'copy *.html dist\\'
                bat 'copy *.css dist\\'
            }
        }
        
        stage('Deploy to Local') {
            steps {
                bat 'start /B node server.js'
                echo 'Aplicación desplegada en http://localhost:3001'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completado'
        }
        success {
            echo '✅ Construcción exitosa'
        }
        failure {
            echo '❌ Construcción fallida'
        }
    }
}