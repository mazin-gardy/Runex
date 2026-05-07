import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />

      <Text style={styles.name}>Mazin Gardy</Text>
      <Text style={styles.username}>@runexuser</Text>

      <Text style={styles.bio}>
        Electrical engineering student building Runex.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Activity</Text>
        <Text style={styles.cardText}>Runs joined: 3</Text>
        <Text style={styles.cardText}>Sessions created: 1</Text>

          <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakLabel}>Day streak</Text>
          <Text style={styles.streakNumber}>7</Text>
        </View>
      </View>
    </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1f1f1f',
    borderWidth: 2,
    borderColor: '#eab308',
    marginBottom: 20,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  username: {
    color: '#a1a1aa',
    fontSize: 16,
    marginTop: 4,
    marginBottom: 14,
  },
  bio: {
    color: '#d4d4d8',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: '#151515',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#262626',
  },
  cardTitle: {
    color: '#eab308',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardText: {
    color: 'white',
    fontSize: 15,
    marginBottom: 8,
  },


  streakContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1a1a1a',
  borderRadius: 12,
  padding: 12,
  gap: 8,
},
streakEmoji: {
  fontSize: 24,
},
streakNumber: {
  fontSize: 28,
  fontWeight: '800',
  color: '#eab308',
},
streakLabel: {
  fontSize: 12,
  color: '#888',
},
});