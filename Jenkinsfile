pipeline {
    agent any

    tools {
        nodejs 'Node 24.15.0'
    }

    environment {
        ANDROID_HOME     = '/opt/android-sdk'
        ANDROID_SDK_ROOT = '/opt/android-sdk'
    }

    stages {

        stage('Environment Check') {
            steps {
                withEnv(["PATH+ANDROID=/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools"]) {
                    sh '''
                        echo "=== Environment Check ==="
                        echo "Node: $(node -v)"
                        echo "NPM: $(npm -v)"
                        echo "ANDROID_HOME: $ANDROID_HOME"
                        echo "PATH: $PATH"
                        free -h

                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                 sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx jest --ci --forceExit --passWithNoTests'
            }
            post {
                always {
                    junit testResults: 'test-results/junit.xml', allowEmptyResults: true
                }
                failure {
                    error '❌ Testing gagal! Build dihentikan.'
                }
            }
        }

        stage('Expo Prebuild') {
            steps {
                withEnv(["PATH+ANDROID=/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools"]) {
                    sh 'npx expo prebuild --platform android --clean'
                }
            }
        }

        stage('Configure Gradle') {
            steps {
                sh '''
                    cd android

                    grep -v "org.gradle.jvmargs\\|org.gradle.daemon\\|org.gradle.parallel\\|REACT_NATIVE_ARCHITECTURES\\|org.gradle.workers" gradle.properties > gradle.properties.tmp
                    mv gradle.properties.tmp gradle.properties

                    echo "REACT_NATIVE_ARCHITECTURES=arm64-v8a"                              >> gradle.properties
                    echo "org.gradle.daemon=false"                                            >> gradle.properties
                    echo "org.gradle.parallel=false"                                          >> gradle.properties
                    echo "org.gradle.workers.max=1"                                           >> gradle.properties
                    echo "org.gradle.jvmargs=-Xmx2g -XX:MaxMetaspaceSize=512m -XX:+UseG1GC" >> gradle.properties

                    echo "=== gradle.properties yang dipakai ==="
                    cat gradle.properties
                '''
            }
        }

        stage('Build APK') {
            steps {
                withEnv(["PATH+ANDROID=/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools"]) {
                    sh '''
                        cd android
                        chmod +x gradlew
                        ./gradlew assembleRelease --no-daemon --max-workers=1
                    '''
                }
            }
        }

        stage('Archive APK') {
            steps {
                archiveArtifacts artifacts: '**/*.apk', fingerprint: true
            }
        }

        stage('Deploy ke Server') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'moodbites-host-ssh',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        APK_PATH=$(find . -type f -name "*.apk" | head -n 1)
        
                        if [ -z "$APK_PATH" ]; then
                            echo "ERROR: APK tidak ditemukan!"
                            exit 1
                        fi
        
                        echo "APK ditemukan: $APK_PATH"
        
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no \
                            $SSH_USER@103.185.52.161 \
                            "mkdir -p /home/moodbites/apk"
        
                        scp -i $SSH_KEY -o StrictHostKeyChecking=no \
                            "$APK_PATH" $SSH_USER@103.185.52.161:/home/moodbites/apk/moodbites.apk
        
                        echo "=== Deploy APK Selesai! ==="
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build dan deploy berhasil!'
        }
        failure {
            echo '❌ Pipeline gagal. Cek log di atas.'
        }
    }
}
