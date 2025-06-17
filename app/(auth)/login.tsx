import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, View, Dimensions, Animated, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/app/auth/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputFocus, setInputFocus] = useState({email: false, password: false});
  const { login } = useAuth();
  
  // Animasyon değişkenleri
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputShake = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;
  
  // Giriş animasyonu
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Buton tıklama animasyonu
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Input hata animasyonu
  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(inputShake, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(inputShake, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(inputShake, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(inputShake, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = () => {
    animateButton();
    
    if (!email || !password) {
      shakeInputs();
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    
    // Geçici kontrol - gerçek uygulamada burası API çağrısı olmalı
    if (email === 'test@test.com' && password === '123456') {
      login(); // Context'teki login fonksiyonunu çağırıyoruz.
      // Yönlendirme artık _layout.tsx tarafından otomatik olarak yapılacak.
      // Alert veya router.push'a burada gerek yok.
    } else {
      shakeInputs();
      Alert.alert('Hata', 'E-posta veya şifre hatalı! Örnek giriş: test@test.com / 123456');
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Arka plan desenleri */}
      <View style={styles.backgroundPatterns}>
        <View style={[styles.patternCircle, styles.patternCircle1]} />
        <View style={[styles.patternCircle, styles.patternCircle2]} />
        <View style={[styles.patternCircle, styles.patternCircle3]} />
        <View style={[styles.patternSquare, styles.patternSquare1]} />
        <View style={[styles.patternSquare, styles.patternSquare2]} />
      </View>
      
      <LinearGradient
        colors={['rgba(255, 235, 245, 0.9)', 'rgba(255, 218, 240, 0.95)', 'rgba(255, 182, 225, 0.9)']}
        style={styles.backgroundGradient}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: moveAnim }]
              }
            ]}
          >
            <View style={styles.logoCircle}>
              <ThemedText type="title" style={styles.logoText}>DietEnd</ThemedText>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: moveAnim }]
              }
            ]}
          >
            <ThemedText type="title" style={styles.titleText}>Diyet Uygulaması</ThemedText>
            <ThemedText type="subtitle" style={styles.subtitleText}>Giriş Yap</ThemedText>

            <Animated.View 
              style={[
                styles.inputWrapper,
                { transform: [{ translateX: inputShake }] }
              ]}
            >
              <TextInput
                style={[
                  styles.input, 
                  inputFocus.email && styles.inputFocused
                ]}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#D687B1"
                onFocus={() => setInputFocus({...inputFocus, email: true})}
                onBlur={() => setInputFocus({...inputFocus, email: false})}
              />
              <View style={styles.inputIcon}>
                <ThemedText style={styles.iconText}>✉️</ThemedText>
              </View>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.inputWrapper,
                { transform: [{ translateX: inputShake }] }
              ]}
            >
              <TextInput
                style={[
                  styles.input, 
                  inputFocus.password && styles.inputFocused
                ]}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#D687B1"
                onFocus={() => setInputFocus({...inputFocus, password: true})}
                onBlur={() => setInputFocus({...inputFocus, password: false})}
              />
              <View style={styles.inputIcon}>
                <ThemedText style={styles.iconText}>🔒</ThemedText>
              </View>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF69B4', '#FF5AAB', '#FF4BA1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>Şifremi Unuttum</ThemedText>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <ThemedText style={styles.registerPromptText}>Hesabınız yok mu?</ThemedText>
              <Link href="/register" asChild>
                <TouchableOpacity style={styles.registerButton}>
                  <ThemedText style={styles.registerText}>Kayıt Ol</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundPatterns: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 150,
    backgroundColor: 'rgba(255, 182, 193, 0.2)',
  },
  patternCircle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  patternCircle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
  },
  patternCircle3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -30,
    backgroundColor: 'rgba(255, 20, 147, 0.1)',
  },
  patternSquare: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(255, 240, 245, 0.6)',
  },
  patternSquare1: {
    width: 100,
    height: 100,
    top: '20%',
    left: 20,
  },
  patternSquare2: {
    width: 70,
    height: 70,
    bottom: '10%',
    right: 30,
    backgroundColor: 'rgba(255, 182, 193, 0.25)',
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 105, 180, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 105, 180, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 18,
    color: '#FF94CC',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFE4F0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#FFCAE0',
    paddingLeft: 50,
    height: 60,
    color: '#333',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#FF1493',
    backgroundColor: '#FFF0F8',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  button: {
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#FF69B4',
    fontSize: 15,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  registerPromptText: {
    fontSize: 15,
    color: '#666',
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 20, 147, 0.1)',
  },
  registerText: {
    color: '#FF1493',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 