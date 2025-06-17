import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Animated, Easing, Dimensions, Text, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

// VKİ kategorileri
const vkiCategories = [
  { range: '< 16.0', category: 'Aşırı zayıf', description: 'Ciddi sağlık sorunlarına yol açabilecek düzeyde yetersiz kilo', color: '#E3A2ED' },
  { range: '16.0 – 16.9', category: 'Çok zayıf', description: 'Normalin oldukça altında, dikkat gerektirir', color: '#C9A1FF' },
  { range: '17.0 – 18.4', category: 'Zayıf', description: 'Kilo almak gerekebilir', color: '#A1C9FF' },
  { range: '18.5 – 24.9', category: 'Normal kilolu', description: 'Sağlıklı kilo aralığı', color: '#A1FFDB' },
  { range: '25.0 – 29.9', category: 'Fazla kilolu', description: 'Dikkat edilmeli, egzersiz ve diyet önerilir', color: '#FFFEA1' },
  { range: '30.0 – 34.9', category: '1. Derece obez (Hafif)', description: 'Sağlık riskleri başlar', color: '#FFCFA1' },
  { range: '35.0 – 39.9', category: '2. Derece obez (Orta)', description: 'Ciddi sağlık riskleri mevcut', color: '#FFA1A1' },
  { range: '≥ 40.0', category: '3. Derece obez (Morbid)', description: 'Acil müdahale gerektiren düzeyde obezite', color: '#FF7373' }
];

export default function VkiResultsScreen() {
  const params = useLocalSearchParams<{ age: string, height: string, weight: string, gender: string }>();
  const { age, height, weight, gender } = params;

  const [vki, setVki] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState('#A1FFDB');
  const [showCalorieInfo, setShowCalorieInfo] = useState(false);
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const tableItemsAnim = useRef(vkiCategories.map(() => new Animated.Value(0))).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const router = useRouter();

  useEffect(() => {
    calculateVKI();

    // Giriş animasyonları
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // Progress animasyonu
    setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: vki > 50 ? 1 : vki / 50,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }, 500);

    // Tablo öğeleri için kademeli animasyon
    tableItemsAnim.forEach((anim, index) => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }).start();
      }, 1000 + index * 100);
    });

    // Dönen animasyon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Kalp atışı animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ])
    ).start();

  }, [height, weight, age, gender, router]);
  
  const calculateVKI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // cm'den m'ye çevirme
      const weightInKg = parseFloat(weight);
      
      if (heightInMeters > 0 && weightInKg > 0) {
        // VKİ = ağırlık (kg) / boy (m)²
        const vkiValue = weightInKg / (heightInMeters * heightInMeters);
        setVki(vkiValue);
        
        // VKİ kategorisini belirle
        determineCategory(vkiValue);
      }
    }
  };
  
  const determineCategory = (vkiValue: number) => {
    if (vkiValue < 16) {
      setCategory(vkiCategories[0].category);
      setDescription(vkiCategories[0].description);
      setCategoryColor(vkiCategories[0].color);
    } else if (vkiValue < 17) {
      setCategory(vkiCategories[1].category);
      setDescription(vkiCategories[1].description);
      setCategoryColor(vkiCategories[1].color);
    } else if (vkiValue < 18.5) {
      setCategory(vkiCategories[2].category);
      setDescription(vkiCategories[2].description);
      setCategoryColor(vkiCategories[2].color);
    } else if (vkiValue < 25) {
      setCategory(vkiCategories[3].category);
      setDescription(vkiCategories[3].description);
      setCategoryColor(vkiCategories[3].color);
    } else if (vkiValue < 30) {
      setCategory(vkiCategories[4].category);
      setDescription(vkiCategories[4].description);
      setCategoryColor(vkiCategories[4].color);
    } else if (vkiValue < 35) {
      setCategory(vkiCategories[5].category);
      setDescription(vkiCategories[5].description);
      setCategoryColor(vkiCategories[5].color);
    } else if (vkiValue < 40) {
      setCategory(vkiCategories[6].category);
      setDescription(vkiCategories[6].description);
      setCategoryColor(vkiCategories[6].color);
    } else {
      setCategory(vkiCategories[7].category);
      setDescription(vkiCategories[7].description);
      setCategoryColor(vkiCategories[7].color);
    }
  };

  const renderCategoryTable = () => {
    return vkiCategories.map((item, index) => (
      <Animated.View 
        key={index} 
        style={[
          styles.tableRow, 
          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
          category === item.category && styles.highlightedRow,
          {
            opacity: tableItemsAnim[index],
            transform: [
              { translateX: tableItemsAnim[index].interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })},
            ],
            backgroundColor: category === item.category 
              ? `${item.color}55` // Semi-transparent version of category color
              : (index % 2 === 0 ? '#FFF5F9' : '#FFEBF5')
          }
        ]}
      >
        <ThemedText style={[styles.tableCell, styles.rangeCellText]}>{item.range}</ThemedText>
        <ThemedText style={[styles.tableCell, styles.categoryCellText]}>{item.category}</ThemedText>
        <ThemedText style={[styles.tableCell, styles.descriptionCellText]}>{item.description}</ThemedText>
      </Animated.View>
    ));
  };

  const goToCalorieInfo = () => {
    // Buton animasyonu
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
    ]).start(() => {
      // calorieInfo sayfasına yönlendir
      try {
        router.push('/calorieInfo');
      } catch (error) {
        console.error("calorieInfo'ya yönlendirme hatası:", error);
        Alert.alert('Hata', 'Kalori bilgilerine gidilirken bir sorun oluştu.');
      }
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // VKI değerine bağlı olarak renk değişimi
  const progressColor = progressAnim.interpolate({
    inputRange: [0, 0.3, 0.4, 0.6, 0.8, 1],
    outputRange: [
      '#E3A2ED', // 0-15 (çok zayıf)
      '#A1C9FF', // 15-20 (normal)
      '#A1FFDB', // 20-25 (normal)
      '#FFFEA1', // 25-30 (fazla kilolu)
      '#FFCFA1', // 30-40 (obez)
      '#FF7373', // 40+ (morbid obez)
    ],
  });

  // Döndürme animasyonu için interpolate
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.mainContainer}>
      {/* Arka plan desenleri */}
      <View style={styles.backgroundPatterns}>
        <Animated.View 
          style={[
            styles.patternCircle, 
            styles.patternCircle1,
            { transform: [{ rotate: spin }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.patternCircle, 
            styles.patternCircle2,
            { transform: [{ rotate: spin }] }
          ]} 
        />
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
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateY }
                ]
              }
            ]}
          >
            <ThemedText type="title" style={{color: '#FF69B4'}}>VKİ Sonucunuz</ThemedText>
          </Animated.View>

          <Animated.View 
            style={[
              styles.resultCard,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateY }
                ],
                borderColor: categoryColor,
              }
            ]}
          >
            <View style={styles.resultCircleContainer}>
              <Animated.View 
                style={[
                  styles.resultCircle,
                  {
                    backgroundColor: categoryColor,
                    transform: [{ scale: pulseAnim }]
                  }
                ]}
              >
                <ThemedText style={styles.vkiValue}>
                  {vki.toFixed(1)}
                </ThemedText>
                <ThemedText style={styles.vkiUnit}>kg/m²</ThemedText>
              </Animated.View>
            </View>
            
            <View style={styles.categoryContainer}>
              <ThemedText style={[styles.categoryText, { color: categoryColor }]}>
                {category}
              </ThemedText>
              <ThemedText style={styles.descriptionText}>
                {description}
              </ThemedText>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressWidth,
                      backgroundColor: progressColor,
                    }
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <ThemedText style={styles.progressLabel}>0</ThemedText>
                <ThemedText style={styles.progressLabel}>50+</ThemedText>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Boy</ThemedText>
                <ThemedText style={styles.statValue}>{height} cm</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Kilo</ThemedText>
                <ThemedText style={styles.statValue}>{weight} kg</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Yaş</ThemedText>
                <ThemedText style={styles.statValue}>{age}</ThemedText>
              </View>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.tableContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateY }
                ]
              }
            ]}
          >
            <ThemedText style={styles.tableTitle}>VKİ Kategorileri</ThemedText>
            <View style={styles.tableHeader}>
              <ThemedText style={[styles.tableHeaderText, styles.rangeHeaderText]}>Aralık</ThemedText>
              <ThemedText style={[styles.tableHeaderText, styles.categoryHeaderText]}>Kategori</ThemedText>
              <ThemedText style={[styles.tableHeaderText, styles.descriptionHeaderText]}>Açıklama</ThemedText>
            </View>
            {renderCategoryTable()}
          </Animated.View>

          <Animated.View style={{
            opacity: fadeAnim,
            transform: [
              { scale: buttonScale }
            ]
          }}>
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={goToCalorieInfo}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF5AAB', '#FF4BA1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <ThemedText style={styles.nextButtonText}>Kalori Bilgilerine Git</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <ThemedText style={styles.disclaimer}>
            * Bu sonuçlar sadece bilgilendirme amaçlıdır. Kesin sonuçlar için bir sağlık uzmanına başvurun.
          </ThemedText>
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
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#A1FFDB',
  },
  resultCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#A1FFDB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  vkiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vkiUnit: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    marginTop: -5,
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A1FFDB',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A1FFDB',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabel: {
    color: '#666',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginTop: 5,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rangeHeaderText: {
    flex: 1,
    paddingLeft: 15,
  },
  categoryHeaderText: {
    flex: 1.5,
  },
  descriptionHeaderText: {
    flex: 3,
    paddingRight: 15,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  tableRowEven: {
    backgroundColor: '#FFF5F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFEBF5',
  },
  highlightedRow: {
    borderWidth: 2,
    borderColor: '#FF69B4',
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
  },
  tableCell: {
    fontSize: 14,
  },
  rangeCellText: {
    flex: 1,
    paddingLeft: 10,
    fontWeight: '500',
  },
  categoryCellText: {
    flex: 1.5,
    fontWeight: 'bold',
  },
  descriptionCellText: {
    flex: 3,
    paddingRight: 10,
    color: '#555',
  },
  nextButton: {
    borderRadius: 15,
    marginVertical: 10,
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
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginVertical: 15,
    fontStyle: 'italic',
  },
}); 