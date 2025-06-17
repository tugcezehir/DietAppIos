import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, View, Animated, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/auth/AuthContext';

const { width, height } = Dimensions.get('window');

export default function UserProfileScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [inputFocus, setInputFocus] = useState({age: false, height: false, weight: false});
  
  const { logout } = useAuth();

  const router = useRouter();

  // Animasyon değişkenleri
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputShake = useRef(new Animated.Value(0)).current;

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

  const handleSaveProfile = () => {
    animateButton();
    
    if (!age || !height || !weight || !gender) {
      shakeInputs();
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    
    // Profil bilgilerini kaydetme işlemleri burada yapılabilir (örn. AsyncStorage, backend)
    // Şimdilik sadece yönlendirme yapıyoruz.

    // vkiResults sayfasına parametrelerle yönlendir
    try {
      router.push({
        pathname: '/vkiResults',
        params: { age, height, weight, gender },
      });
    } catch (error) {
      console.error("vkiResults'a yönlendirme hatası:", error);
      Alert.alert('Hata', 'Sonuçlar sayfasına gidilirken bir sorun oluştu.');
    }
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
          <ThemedText type="title" style={styles.titleText}>Profil Bilgileri</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitleText}>Kişisel bilgilerinizi giriniz</ThemedText>

          <Animated.View 
            style={[
              styles.inputWrapper,
              { transform: [{ translateX: inputShake }] }
            ]}
          >
            <TextInput
              style={[
                styles.input, 
                inputFocus.age && styles.inputFocused
              ]}
              placeholder="Yaş"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#D687B1"
              onFocus={() => setInputFocus({...inputFocus, age: true})}
              onBlur={() => setInputFocus({...inputFocus, age: false})}
            />
            <View style={styles.inputIcon}>
              <ThemedText style={styles.iconText}>🎂</ThemedText>
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
                inputFocus.height && styles.inputFocused
              ]}
              placeholder="Boy (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholderTextColor="#D687B1"
              onFocus={() => setInputFocus({...inputFocus, height: true})}
              onBlur={() => setInputFocus({...inputFocus, height: false})}
            />
            <View style={styles.inputIcon}>
              <ThemedText style={styles.iconText}>📏</ThemedText>
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
                inputFocus.weight && styles.inputFocused
              ]}
              placeholder="Kilo (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholderTextColor="#D687B1"
              onFocus={() => setInputFocus({...inputFocus, weight: true})}
              onBlur={() => setInputFocus({...inputFocus, weight: false})}
            />
            <View style={styles.inputIcon}>
              <ThemedText style={styles.iconText}>⚖️</ThemedText>
            </View>
          </Animated.View>

          <ThemedView style={styles.genderContainer}>
            <ThemedText style={styles.genderLabel}>Cinsiyet:</ThemedText>
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity 
                style={[styles.genderButton, gender === 'Kadın' && styles.selectedGender]} 
                onPress={() => setGender('Kadın')}
                activeOpacity={0.8}
              >
                <ThemedText style={gender === 'Kadın' ? styles.selectedGenderText : styles.genderButtonText}>
                  👩 Kadın
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.genderButton, gender === 'Erkek' && styles.selectedGender]} 
                onPress={() => setGender('Erkek')}
                activeOpacity={0.8}
              >
                <ThemedText style={gender === 'Erkek' ? styles.selectedGenderText : styles.genderButtonText}>
                  👨 Erkek
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSaveProfile}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Bilgileri Kaydet</ThemedText>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={logout}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.logoutButtonText}>Çıkış Yap</ThemedText>
          </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
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
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
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
    elevation: 8,
  },
  subtitleText: {
    fontSize: 18,
    color: '#FF94CC',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFE4F0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#FFCAE0',
    paddingLeft: 45,
    height: 55,
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
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FF69B4',
    fontWeight: 'bold',
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#FFE4F0',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFCAE0',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedGender: {
    backgroundColor: '#FF69B4',
    borderColor: '#FF1493',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  genderButtonText: {
    color: '#FF69B4',
    fontSize: 16,
  },
  selectedGenderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
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
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#DC143C',
    borderRadius: 25,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 