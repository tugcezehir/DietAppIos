import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('../../assets/images/home-banner.jpg')}
        style={styles.headerImage}
      />
      <ThemedText type="title">Hoş Geldiniz!</ThemedText>
      <ThemedText>Diyet ve Kalori Takip Uygulaması</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '90%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
}); 