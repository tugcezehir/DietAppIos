import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, Platform, ScrollView, Alert, View, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const [inputFocus, setInputFocus] = useState({name: false, email: false, password: false, confirmPassword: false});
  
  // Animasyon değişkenleri
  const buttonScale = useState(new Animated.Value(1))[0];
  const inputShake = useState(new Animated.Value(0))[0];

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

  const handleRegister = () => {
    animateButton();
    
    if (!name || !email || !password || !confirmPassword) {
      shakeInputs();
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    
    if (password !== confirmPassword) {
      shakeInputs();
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }
    
    // Burada kayıt işlemleri yapılacak
    Alert.alert('Başarılı', 'Kaydınız tamamlandı!', [
      {
        text: 'Giriş Yap',
        onPress: () => {
          router.push('/(tabs)/login');
        }
      }
    ]);
  };

  return (
    <LinearGradient
      colors={['#FFEBF5', '#FFDAF0', '#FFB6E1']}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <ThemedText type="title" style={styles.logoText}>DietEnd</ThemedText>
          </View>
        </View>

        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.titleText}>Diyet Uygulaması</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitleText}>Hesap Oluştur</ThemedText>

          <Animated.View 
            style={[
              styles.inputWrapper,
              { transform: [{ translateX: inputShake }] }
            ]}
          >
            <TextInput
              style={[
                styles.input, 
                inputFocus.name && styles.inputFocused
              ]}
              placeholder="Ad Soyad"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#D687B1"
              onFocus={() => setInputFocus({...inputFocus, name: true})}
              onBlur={() => setInputFocus({...inputFocus, name: false})}
            />
            <View style={styles.inputIcon}>
              <ThemedText style={styles.iconText}>👤</ThemedText>
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
          
          <Animated.View 
            style={[
              styles.inputWrapper,
              { transform: [{ translateX: inputShake }] }
            ]}
          >
            <TextInput
              style={[
                styles.input, 
                inputFocus.confirmPassword && styles.inputFocused
              ]}
              placeholder="Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#D687B1"
              onFocus={() => setInputFocus({...inputFocus, confirmPassword: true})}
              onBlur={() => setInputFocus({...inputFocus, confirmPassword: false})}
            />
            <View style={styles.inputIcon}>
              <ThemedText style={styles.iconText}>🔐</ThemedText>
            </View>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Kayıt Ol</ThemedText>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginPromptText}>Zaten hesabınız var mı?</ThemedText>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <ThemedText style={styles.loginText}>Giriş Yap</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 105, 180, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitleText: {
    fontSize: 18,
    color: '#FF94CC',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    width: '100%',
  },
  input: {
    backgroundColor: '#FFE4F0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#FF69B4',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    borderWidth: 2,
    borderColor: '#FFCAE0',
    paddingLeft: 45,
    height: 55,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#FF1493',
    backgroundColor: '#FFF0F8',
    shadowOpacity: 0.2,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
    borderWidth: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  loginPromptText: {
    fontSize: 15,
    color: '#666',
  },
  loginButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 20, 147, 0.1)',
  },
  loginText: {
    color: '#C71585',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
