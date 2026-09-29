pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '381466707207.dkr.ecr.ap-south-1.amazonaws.com/shopzone'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                sh '''
                    echo "Checking project files..."
                    ls -la
                    test -f index.html
                    test -f Dockerfile
                    echo "Validation successful"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                      -t ${ECR_REPO}:${IMAGE_TAG} \
                      .
                '''
            }
        }

        stage('ECR Login') {
            steps {
                sh '''
                    aws ecr get-login-password \
                      --region ${AWS_REGION} | \
                    docker login \
                      --username AWS \
                      --password-stdin ${ECR_REPO}
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    docker push ${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "CI pipeline completed successfully!"
            echo "Image: ${ECR_REPO}:${IMAGE_TAG}"
        }

        failure {
            echo "CI pipeline failed."
        }
    }
}