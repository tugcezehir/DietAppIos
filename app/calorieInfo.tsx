import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

// Besinlerin kalori bilgileri
const foodData = {
  kahvalti: [
    { name: 'Yumurta (1 adet)', calories: 70 },
    { name: 'Beyaz Peynir (30g)', calories: 75 },
    { name: 'Kaşar Peyniri (30g)', calories: 110 },
    { name: 'Zeytin (5 adet)', calories: 30 },
    { name: 'Tereyağı (1 tatlı kaşığı)', calories: 35 },
    { name: 'Bal (1 tatlı kaşığı)', calories: 65 },
    { name: 'Reçel (1 tatlı kaşığı)', calories: 55 },
    { name: 'Ekmek (1 dilim)', calories: 70 },
    { name: 'Simit (1 adet)', calories: 250 },
    { name: 'Börek (1 adet)', calories: 300 },
    { name: 'Süt (1 bardak)', calories: 120 },
    { name: 'Domates (1 adet)', calories: 20 },
    { name: 'Salatalık (1 adet)', calories: 15 },
  ],
  ogle: [
    { name: 'Pilav (1 porsiyon)', calories: 330 },
    { name: 'Makarna (1 porsiyon)', calories: 300 },
    { name: 'Kırmızı Et (100g)', calories: 250 },
    { name: 'Tavuk (100g)', calories: 165 },
    { name: 'Balık (100g)', calories: 180 },
    { name: 'Salata (1 porsiyon)', calories: 50 },
    { name: 'Yoğurt (1 kase)', calories: 150 },
    { name: 'Çorba (1 kase)', calories: 100 },
    { name: 'Kuru Fasulye (1 porsiyon)', calories: 280 },
    { name: 'Nohut (1 porsiyon)', calories: 290 },
    { name: 'Patates Kızartması (1 porsiyon)', calories: 400 },
  ],
  aksam: [
    { name: 'Pilav (1 porsiyon)', calories: 330 },
    { name: 'Makarna (1 porsiyon)', calories: 300 },
    { name: 'Kırmızı Et (100g)', calories: 250 },
    { name: 'Tavuk (100g)', calories: 165 },
    { name: 'Balık (100g)', calories: 180 },
    { name: 'Salata (1 porsiyon)', calories: 50 },
    { name: 'Yoğurt (1 kase)', calories: 150 },
    { name: 'Çorba (1 kase)', calories: 100 },
    { name: 'Mantı (1 porsiyon)', calories: 350 },
    { name: 'İmam Bayıldı (1 porsiyon)', calories: 200 },
    { name: 'Zeytinyağlı Sarma (5 adet)', calories: 180 },
  ],
  aburcubur: [
    { name: 'Çikolata (1 küçük parça)', calories: 70 },
    { name: 'Gofret (1 adet)', calories: 120 },
    { name: 'Cips (1 paket)', calories: 450 },
    { name: 'Gazlı İçecek (1 kutu)', calories: 140 },
    { name: 'Meyve Suyu (1 bardak)', calories: 120 },
    { name: 'Badem (10 adet)', calories: 70 },
    { name: 'Ceviz (2 adet)', calories: 100 },
    { name: 'Fındık (10 adet)', calories: 90 },
    { name: 'Kuru Üzüm (1 avuç)', calories: 80 },
    { name: 'Kuru Kayısı (5 adet)', calories: 70 },
    { name: 'Dondurma (1 top)', calories: 150 },
    { name: 'Pasta (1 dilim)', calories: 300 },
    { name: 'Kurabiye (1 adet)', calories: 50 },
  ],
  meyveler: [
    { name: 'Elma (1 orta boy)', calories: 70 },
    { name: 'Armut (1 orta boy)', calories: 100 },
    { name: 'Muz (1 adet)', calories: 105 },
    { name: 'Portakal (1 orta boy)', calories: 60 },
    { name: 'Mandalina (1 adet)', calories: 40 },
    { name: 'Karpuz (1 dilim)', calories: 45 },
    { name: 'Kavun (1 dilim)', calories: 50 },
    { name: 'Çilek (1 kase)', calories: 45 },
    { name: 'Kiraz (1 kase)', calories: 85 },
    { name: 'Üzüm (1 kase)', calories: 100 },
    { name: 'Şeftali (1 adet)', calories: 60 },
    { name: 'Kayısı (1 adet)', calories: 17 },
    { name: 'Ananas (1 dilim)', calories: 40 },
    { name: 'Avokado (1/2 adet)', calories: 160 },
  ]
};

interface CalorieInfoProps {
  onBack?: () => void;
}

export default function CalorieInfoScreen({ onBack }: CalorieInfoProps = {}) {
  const [activeTab, setActiveTab] = useState('kahvalti');
  const [searchText, setSearchText] = useState('');
  
  const filteredFoods = searchText 
    ? Object.values(foodData).flat().filter(food => 
        food.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : foodData[activeTab as keyof typeof foodData];
  
  const renderFoodItem = ({ item }: { item: { name: string; calories: number } }) => (
    <View style={styles.foodItem}>
      <ThemedText style={styles.foodName}>{item.name}</ThemedText>
      <ThemedText style={styles.foodCalories}>{item.calories} kcal</ThemedText>
    </View>
  );

  const goBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{color: '#FF69B4'}}>Besin Kalori Bilgileri</ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Besin ara..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#D687B1"
        />
      </ThemedView>

      {!searchText && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'kahvalti' && styles.activeTabButton]}
            onPress={() => setActiveTab('kahvalti')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'kahvalti' && styles.activeTabText]}>
              Kahvaltı
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'ogle' && styles.activeTabButton]}
            onPress={() => setActiveTab('ogle')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'ogle' && styles.activeTabText]}>
              Öğle
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'aksam' && styles.activeTabButton]}
            onPress={() => setActiveTab('aksam')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'aksam' && styles.activeTabText]}>
              Akşam
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'aburcubur' && styles.activeTabButton]}
            onPress={() => setActiveTab('aburcubur')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'aburcubur' && styles.activeTabText]}>
              Atıştırmalık
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'meyveler' && styles.activeTabButton]}
            onPress={() => setActiveTab('meyveler')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'meyveler' && styles.activeTabText]}>
              Meyveler
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <ThemedView style={styles.foodListContainer}>
        <ThemedText style={styles.foodListTitle}>
          {searchText ? 'Arama Sonuçları' : activeTab === 'kahvalti' ? 'Kahvaltı Besinleri' :
                         activeTab === 'ogle' ? 'Öğle Yemeği Besinleri' :
                         activeTab === 'aksam' ? 'Akşam Yemeği Besinleri' :
                         activeTab === 'aburcubur' ? 'Atıştırmalıklar' : 'Meyveler'}
        </ThemedText>
        
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.name}
          scrollEnabled={false}
          style={styles.foodList}
          ListEmptyComponent={
            <ThemedText style={styles.emptyListText}>
              Aradığınız kriterlere uygun besin bulunamadı.
            </ThemedText>
          }
        />
      </ThemedView>

      <TouchableOpacity style={styles.button} onPress={goBack}>
        <ThemedText style={styles.buttonText}>Geri Dön</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF0F5', // Açık pembe arka plan
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFE4F0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFCAE0',
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFE4F0',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFCAE0',
    minWidth: '18%',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FF69B4',
    borderColor: '#FF1493',
  },
  tabText: {
    color: '#FF69B4',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
  },
  foodListContainer: {
    backgroundColor: '#FFE4F0',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFCAE0',
    marginBottom: 20,
  },
  foodListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
  },
  foodList: {
    maxHeight: 400,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCAE0',
  },
  foodName: {
    fontSize: 14,
    color: '#333',
    flex: 3,
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF1493',
    flex: 1,
    textAlign: 'right',
  },
  emptyListText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#FF69B4', // Hot pink buton
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 