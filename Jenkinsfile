pipeline {
    agent any

    tools {
        jdk "jdk"                    // JDK 17+ (sonar-scanner 8.x requires it)
        nodejs "nodejs"              // NodeJS tool configured in Jenkins (v20)
    }

    environment {
        SCANNER_HOME = tool 'sonarqubescanner'
        DOCKER_IMAGE = 'nithin0620/bloggr'   // change to your Docker Hub username
        DOCKER_TAG = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Nithin0620/Bloggr'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install --prefix backend
                    npm install --prefix frontend
                '''
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs . --format table -o fs.html'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqubeServer') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \\
                        -Dsonar.projectName=Bloggr \\
                        -Dsonar.projectKey=Bloggr \\
                        -Dsonar.sources=backend,frontend/src'''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    cd frontend
                    CI=false npm run build
                '''
            }
        }

        stage('Docker Build & Tag') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/') {
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest -f backend/Dockerfile ."
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --format table -o image.html ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Docker Push Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/') {
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'fs.html, image.html'
        }
    }
}
