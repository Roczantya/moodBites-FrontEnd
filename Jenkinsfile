pipeline {
    agent any

    tools {
        nodejs 'Node 24.15.0'
    }

    environment {
        // Definisikan SDK Root di tingkat atas agar berlaku untuk semua stage
        ANDROID_HOME     = '/opt/android-sdk'
        ANDROID_SDK_ROOT = '/opt/android-sdk'
        // Masukkan path tools Android langsung ke PATH global pipeline
        PATH             = "/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:${env.PATH}"
    }

    stages {
        stage('Environment Check') {
            steps {
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
                // 1. Generate ulang folder android secara bersih
                sh 'npx expo prebuild --platform android --clean'
                
                // 2. Salin kembali semua file native kustom ke folder android yang baru digenerate
                sh '''
                    echo "=== Menyalin kembali file Native HCE ==="
                    
                    # Definisikan path tujuan (sesuaikan dengan package name Anda)
                    PACKAGE_PATH="android/app/src/main/java/com/anonymous/moodBites"
                    RES_XML_PATH="android/app/src/main/res/xml"
                    
                    # Buat folder res/xml jika belum ada
                    mkdir -p $RES_XML_PATH
                    
                    # Salin file src Kotlin
                    cp native-extensions/HCEModule.kt $PACKAGE_PATH/
                    cp native-extensions/HCEModulePackage.kt $PACKAGE_PATH/
                    cp native-extensions/MyHostApduService.kt $PACKAGE_PATH/
                    cp native-extensions/MainApplication.kt $PACKAGE_PATH/
                    cp native-extensions/MainActivity.kt $PACKAGE_PATH/
                    
                    # Salin file XML APDU Service
                    cp native-extensions/apduservice.xml $RES_XML_PATH/
                    
                    # PENTING: Salin atau timpa AndroidManifest.xml Anda yang sudah dikonfigurasi NFC
                    cp native-extensions/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
                '''
            }
        }

        stage('Configure Gradle') {
            steps {
                // Sekarang file android/gradle.properties yang baru digenerate bisa dimodifikasi safely
                sh '''
                    cd android

                    grep -v "org.gradle.jvmargs\\|org.gradle.daemon\\|org.gradle.parallel\\|REACT_NATIVE_ARCHITECTURES\\|org.gradle.workers" gradle.properties > gradle.properties.tmp
                    mv gradle.properties.tmp gradle.properties

                    echo "REACT_NATIVE_ARCHITECTURES=arm64-v8a"                               >> gradle.properties
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
                sh '''
                    cd android
                    chmod +x gradlew
                    ./gradlew assembleRelease --no-daemon --max-workers=1
                '''
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
        
                        scp -i $SSH_KEY -o StrictHostKeyChecking=no \
                            "$APK_PATH" $SSH_USER@103.185.52.161:/var/www/landingPage/moodbites.apk
        
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

// comment