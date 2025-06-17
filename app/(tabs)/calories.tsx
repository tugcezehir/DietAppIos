import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// Veri yapısı için tip tanımı
interface Food {
  YiyecekAdi: string;
  Kalori: number;
  Birim: string;
}

// Eklenen yiyecekler için id ekliyoruz
interface SelectedFood extends Food {
  id: string;
}

const getTodayKey = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD formatında
};

export default function CaloriesScreen() {
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [evaluation, setEvaluation] = useState({ message: 'Hadi bir şeyler ekle!', color: 'gray' });

  // CSV verilerini yükle
  useEffect(() => {
    const loadCsvData = async () => {
      const asset = Asset.fromModule(require('../../assets/data/foods.csv'));
      if (!asset.downloaded) {
        await asset.downloadAsync();
      }
      const csvData = await (await fetch(asset.uri)).text();
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setAllFoods(results.data as Food[]);
        },
      });
    };
    loadCsvData();
  }, []);

  // Bugüne ait verileri AsyncStorage'dan yükle
  const loadTodaysFoods = async () => {
    try {
      const key = getTodayKey();
      const storedFoods = await AsyncStorage.getItem(key);
      if (storedFoods) {
        setSelectedFoods(JSON.parse(storedFoods));
      } else {
        setSelectedFoods([]);
      }
    } catch (e) {
      console.error("Bugünün yiyeceklerini yüklerken hata:", e);
    }
  };
  
  // Ekran her odaklandığında bugünün verilerini yükle
  useFocusEffect(
    useCallback(() => {
      loadTodaysFoods();
    }, [])
  );
  
  // Seçili yiyecekler değiştikçe toplam kaloriyi, değerlendirmeyi hesapla ve veriyi kaydet
  useEffect(() => {
    const total = selectedFoods.reduce((sum, food) => sum + food.Kalori, 0);
    setTotalCalories(total);
    setEvaluation(getEvaluation(total));
    
    // Veriyi kaydet
    const saveFoods = async () => {
        try {
            const key = getTodayKey();
            await AsyncStorage.setItem(key, JSON.stringify(selectedFoods));
        } catch(e) {
            console.error("Yiyecekleri kaydederken hata:", e);
        }
    };
    saveFoods();

  }, [selectedFoods]);

  const getEvaluation = (calories: number) => {
    const dailyGoal = 2000;
    if (calories === 0) return { message: 'Hadi, bugün ilk öğününü ekle!', color: 'gray' };
    if (calories < dailyGoal * 0.8) return { message: 'Harika gidiyorsun, hedefe uygun!', color: '#32CD32' }; // Yeşil
    if (calories <= dailyGoal) return { message: 'Hedefe yaklaşıyorsun, dengeli tercihler yapmaya devam et.', color: '#FFA500' }; // Turuncu
    return { message: 'Hedefi biraz aştın. Unutma, her gün yeni bir başlangıç!', color: '#DC143C' }; // Kırmızı
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = allFoods.filter((food) =>
        food.YiyecekAdi.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]); // Arama boşsa sonuç gösterme
    }
  };
  
  const addFood = (food: Food) => {
    const newFood: SelectedFood = { ...food, id: Date.now().toString() };
    setSelectedFoods([...selectedFoods, newFood]);
    setSearchQuery(''); // Eklendikten sonra aramayı temizle
    setFilteredFoods([]);
  };

  const removeFood = (id: string) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== id));
  };
  
  const renderSearchResultItem = ({ item }: { item: Food }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.YiyecekAdi} ({item.Kalori} kcal)</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addFood(item)}>
        <Text style={styles.addButtonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedFoodItem = ({ item }: { item: SelectedFood }) => (
    <View style={styles.foodItem}>
        <Text style={styles.foodName}>{item.YiyecekAdi} ({item.Kalori} kcal)</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFood(item.id)}>
            <Text style={styles.removeButtonText}>Sil</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{textAlign: 'center'}}>Kalori Takibi</ThemedText>
      <Image 
        source={require('../../assets/images/calories-banner.jpg')} 
        style={styles.headerImage}
      />
      
      <TextInput
        style={styles.searchBar}
        placeholder="Yiyecek ara..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {searchQuery.length > 0 && (
        <FlatList
          data={filteredFoods}
          renderItem={renderSearchResultItem}
          keyExtractor={(item) => item.YiyecekAdi}
          style={styles.searchResultsList}
        />
      )}
      
      <View style={styles.summaryContainer}>
        <ThemedText type="subtitle">Toplam Kalori: {totalCalories} kcal</ThemedText>
        <Text style={[styles.evaluationText, { color: evaluation.color }]}>
          {evaluation.message}
        </Text>
      </View>
      
      <ThemedText type="subtitle" style={styles.listHeader}>Bugün Eklenenler</ThemedText>
      <FlatList
        data={selectedFoods}
        renderItem={renderSelectedFoodItem}
        keyExtractor={(item) => item.id}
        style={styles.selectedList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  searchResultsList: {
    maxHeight: 150, // Arama sonuçları için maksimum yükseklik
    flexGrow: 0,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8
  },
  selectedList: {
    flex: 1,
    marginTop: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  summaryContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  evaluationText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listHeader: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  }
}); 