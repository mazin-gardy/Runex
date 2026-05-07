import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type CreateSessionProps = {
  onClose: () => void;
  onCreated?: (session: any) => void;
  routeDistance?: number | null;
  routeDuration?: number | null;
};

const VIBES = ['Social', 'Tempo', 'Beginner', 'Intervals'];

const VIBE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Social:    { bg: '#EEEDFE', border: '#534AB7', text: '#3C3489' },
  Tempo:     { bg: '#FAEEDA', border: '#BA7517', text: '#633806' },
  Beginner:  { bg: '#E1F5EE', border: '#1D9E75', text: '#085041' },
  Intervals: { bg: '#FBEAF0', border: '#D4537E', text: '#72243E' },
};

export default function CreateSession({
  onClose,
  onCreated,
  routeDistance,
  routeDuration,
}: CreateSessionProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pace, setPace] = useState('Easy');
  const [vibe, setVibe] = useState('Social');
  const [maxCapacity, setMaxCapacity] = useState('10');

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please add a session title.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Missing location', 'Please add a location.');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Missing date', 'Please add a date.');
      return;
    }
    if (!time.trim()) {
      Alert.alert('Missing time', 'Please add a time.');
      return;
    }

    const session = {
      id: Date.now().toString(),
      title: title.trim(),
      location: location.trim(),
      date: date.trim(),
      time: time.trim(),
      pace,
      vibe,
      distance: routeDistance ?? 0,
      duration: routeDuration ?? 0,
      max_capacity: parseInt(maxCapacity) || 10,
      current_count: 1,
      is_locked: false,
      host: 'You',
    };

    onCreated?.(session);
    Alert.alert('Session created!', `${title} has been created.`);
    onClose();
  };

  return (
  <View style={styles.container}>

    {/* Header — fixed at top */}
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Create Session</Text>
      <TouchableOpacity onPress={handleCreate} style={styles.createBtn}>
        <Text style={styles.createBtnText}>Create</Text>
      </TouchableOpacity>
    </View>

    {/* Scrollable content */}
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={true}
    >
      {/* Route info */}
      {routeDistance && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>
            📍 Route attached · {routeDistance} km · {routeDuration} min
          </Text>
        </View>
      )}

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>SESSION TITLE</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Morning Tan Track Run"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Location */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>LOCATION</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Kings Domain, Melbourne"
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Date and Time */}
      <View style={styles.fieldRow}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>DATE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tue 11 Mar"
            placeholderTextColor="#666"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>TIME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 6:30 AM"
            placeholderTextColor="#666"
            value={time}
            onChangeText={setTime}
          />
        </View>
      </View>

      {/* Vibe */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>VIBE</Text>
        <View style={styles.vibeRow}>
          {VIBES.map(v => (
            <TouchableOpacity
              key={v}
              onPress={() => setVibe(v)}
              style={[
                styles.vibePill,
                {
                  backgroundColor: vibe === v ? VIBE_COLORS[v].bg : '#1a1a1a',
                  borderColor: vibe === v ? VIBE_COLORS[v].border : '#262626',
                }
              ]}
            >
              <Text style={[
                styles.vibePillText,
                { color: vibe === v ? VIBE_COLORS[v].text : '#888' }
              ]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pace */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>PACE</Text>
        <View style={styles.paceRow}>
          {['Easy', 'Moderate', 'Hard'].map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPace(p)}
              style={[styles.pacePill, pace === p && styles.pacePillActive]}
            >
              <Text style={[
                styles.pacePillText,
                pace === p && styles.pacePillTextActive,
              ]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Max capacity */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>MAX RUNNERS</Text>
        <View style={styles.capacityRow}>
          <TouchableOpacity
            style={styles.capacityBtn}
            onPress={() => setMaxCapacity(prev =>
              String(Math.max(2, parseInt(prev) - 1))
            )}
          >
            <Text style={styles.capacityBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.capacityValue}>{maxCapacity}</Text>
          <TouchableOpacity
            style={styles.capacityBtn}
            onPress={() => setMaxCapacity(prev =>
              String(Math.min(50, parseInt(prev) + 1))
            )}
          >
            <Text style={styles.capacityBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>CREATE SESSION</Text>
      </TouchableOpacity>

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelBtn: {
    padding: 4,
  },
  cancelBtnText: {
    color: '#888',
    fontSize: 15,
  },
  createBtn: {
    padding: 4,
  },
  createBtnText: {
    color: '#534AB7',
    fontSize: 15,
    fontWeight: '700',
  },
  scroll: {
  flex: 1,
},
scrollContent: {
  padding: 16,
  paddingBottom: 60,
  gap: 20,
},
  routeInfo: {
    backgroundColor: '#EEEDFE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#534AB7',
  },
  routeInfoText: {
    color: '#3C3489',
    fontSize: 13,
    fontWeight: '500',
  },
  field: {
    gap: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldLabel: {
    color: '#555',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#262626',
    color: '#ffffff',
    fontSize: 15,
    padding: 14,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  vibePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  paceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pacePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 0.5,
    borderColor: '#262626',
  },
  pacePillActive: {
    backgroundColor: '#ffffff',
  },
  pacePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  pacePillTextActive: {
    color: '#000000',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  capacityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    borderWidth: 0.5,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capacityBtnText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '300',
  },
  capacityValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});