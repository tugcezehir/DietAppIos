import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface Food {
  YiyecekAdi: string;
  Kalori: number;
  Birim: string;
  id: string;
}

interface DailyReport {
  date: string;
  totalCalories: number;
}

export default function ReportScreen() {
  const [weeklyData, setWeeklyData] = useState<DailyReport[]>([]);
  const [maxCalories, setMaxCalories] = useState(0);

  const fetchWeeklyData = async () => {
    const today = new Date();
    const weekData: DailyReport[] = [];
    let maxCals = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      try {
        const dailyDataString = await AsyncStorage.getItem(dateKey);
        if (dailyDataString) {
          const dailyFoods: Food[] = JSON.parse(dailyDataString);
          const totalCalories = dailyFoods.reduce((sum, food) => sum + food.Kalori, 0);
          if(totalCalories > maxCals) maxCals = totalCalories;
          weekData.push({ date: dateKey, totalCalories });
        } else {
          weekData.push({ date: dateKey, totalCalories: 0 });
        }
      } catch (error) {
        console.error(`${dateKey} için veri alınırken hata:`, error);
        weekData.push({ date: dateKey, totalCalories: 0 });
      }
    }
    setWeeklyData(weekData.reverse()); // Tarihleri eskiden yeniye sırala
    setMaxCalories(maxCals > 2000 ? maxCals : 2000); // Grafik için makul bir tavan belirle
  };

  useFocusEffect(
    useCallback(() => {
      fetchWeeklyData();
    }, [])
  );

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Haftalık Rapor</ThemedText>
      <View style={styles.chartContainer}>
        {weeklyData.map((day, index) => (
          <View key={index} style={styles.barWrapper}>
            <View style={styles.barContainer}>
                <View 
                    style={[
                        styles.bar, 
                        { height: `${day.totalCalories / maxCalories * 100}%` }
                    ]} 
                />
            </View>
            <Text style={styles.dayLabel}>{getDayName(day.date)}</Text>
            <Text style={styles.calorieLabel}>{day.totalCalories}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <ThemedText>Son 7 Günlük Kalori Alımı</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 40,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 250,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: '100%',
    width: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: '#FF69B4',
    borderRadius: 5,
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
  calorieLabel: {
    fontSize: 10,
    color: '#555',
  },
  legend: {
      marginTop: 20,
  }
}); 