import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';

const WATER_KEY_PREFIX = '@water_intake_';
const getTodayKey = () => {
  const today = new Date();
  return `${WATER_KEY_PREFIX}${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export default function WaterScreen() {
  const [waterCount, setWaterCount] = useState(0);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    loadWaterCount();
  }, []);

  const loadWaterCount = async () => {
    try {
      const key = getTodayKey();
      const savedCount = await AsyncStorage.getItem(key);
      if (savedCount !== null) {
        setWaterCount(JSON.parse(savedCount));
      }
    } catch (error) {
      Alert.alert('Hata', 'Su verisi yüklenirken bir sorun oluştu.');
    }
  };

  const saveWaterCount = async (count: number) => {
    try {
      const key = getTodayKey();
      await AsyncStorage.setItem(key, JSON.stringify(count));
    } catch (error) {
      Alert.alert('Hata', 'Su verisi kaydedilirken bir sorun oluştu.');
    }
  };

  const handleWaterChange = (amount: number) => {
    const newCount = Math.max(0, waterCount + amount);
    setWaterCount(newCount);
    saveWaterCount(newCount);
  };

  const renderWaterGlasses = () => {
    const glasses = [];
    for (let i = 0; i < waterCount; i++) {
      glasses.push(
        <FontAwesome key={i} name="glass" size={40} color={tintColor} style={styles.glass} />
      );
    }
    return glasses;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>İçtiğim Su Miktarı</ThemedText>
      <ThemedText style={styles.subtitle}>Bugün içtiğin her bardak su için '+' tuşuna bas.</ThemedText>
      
      <View style={styles.glassesContainer}>
        {waterCount > 0 ? renderWaterGlasses() : (
            <ThemedText style={styles.emptyText}>Bugün henüz su içmedin.</ThemedText>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={() => handleWaterChange(-1)} style={[styles.button, {backgroundColor: tintColor}]}>
          <FontAwesome name="minus" size={24} color={backgroundColor} />
        </TouchableOpacity>
        
        <ThemedText style={styles.countText}>{waterCount} Bardak</ThemedText>

        <TouchableOpacity onPress={() => handleWaterChange(1)} style={[styles.button, {backgroundColor: tintColor}]}>
          <FontAwesome name="plus" size={24} color={backgroundColor} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  glassesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 150,
    marginBottom: 30,
    alignItems: 'center'
  },
  glass: {
    margin: 5,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.7
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 120,
    textAlign: 'center'
  },
}); 