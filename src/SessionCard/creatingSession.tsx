import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import {
  Button,
  Card,
  Input,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

type CreateSessionProps = {
  onClose: () => void;
  onCreated?: (session: any) => void;
  routeDistance?: number | null;
  routeDuration?: number | null;
};

const VIBES = ['Social', 'Tempo', 'Beginner', 'Intervals'];
const PACES = ['Easy', 'Moderate', 'Hard'];
const SPORTS = ['Running', 'Cycling', 'Walking', 'Hiking'];

const VIBE_COLORS: Record<string, {
  bg: string;
  border: string;
  text: string;
}> = {
  Social:    { bg: '#2a2860', border: '#534AB7', text: '#a8a4f8' },
  Tempo:     { bg: '#2e2010', border: '#BA7517', text: '#f0a830' },
  Beginner:  { bg: '#0e2820', border: '#1D9E75', text: '#4ade80' },
  Intervals: { bg: '#2e1020', border: '#D4537E', text: '#f472b6' },
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
  const [sport, setSport] = useState('Running');
  const [maxCapacity, setMaxCapacity] = useState(10);

  const selectedVibe = VIBE_COLORS[vibe];

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
      sport,
      distance: routeDistance ?? 0,
      duration: routeDuration ?? 0,
      max_capacity: maxCapacity,
      current_count: 1,
      is_locked: false,
      host: 'You',
    };

    onCreated?.(session);
    onClose();
  };

  return (
    <View flex={1} backgroundColor="#0a0a0a">

      {/* Header */}
      <XStack
        paddingHorizontal="$4"
        paddingTop="$14"
        paddingBottom="$4"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={0.5}
        borderBottomColor="rgba(255,255,255,0.06)"
      >
        <Button
          chromeless
          onPress={onClose}
          paddingHorizontal={0}
        >
          <Text color="rgba(255,255,255,0.4)" fontSize={15}>Cancel</Text>
        </Button>

        <Text fontSize={17} fontWeight="700" color="white">
          Create Session
        </Text>

        <Button
          chromeless
          onPress={handleCreate}
          paddingHorizontal={0}
        >
          <Text color={selectedVibe.text} fontSize={15} fontWeight="700">
            Create
          </Text>
        </Button>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 60 }}
      >

        {/* Route attached banner */}
        {routeDistance && (
          <Card
            backgroundColor={selectedVibe.bg}
            borderColor={selectedVibe.border}
            borderWidth={0.5}
            borderRadius="$6"
            paddingHorizontal="$4"
            paddingVertical="$3"
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={13} color={selectedVibe.text} fontWeight="600">
                📍 Route attached
              </Text>
              <XStack gap="$3">
                <YStack alignItems="center">
                  <Text fontSize={15} fontWeight="700" color="white">
                    {routeDistance} km
                  </Text>
                  <Text fontSize={10} color={selectedVibe.text}>Distance</Text>
                </YStack>
                <YStack alignItems="center">
                  <Text fontSize={15} fontWeight="700" color="white">
                    {routeDuration} min
                  </Text>
                  <Text fontSize={10} color={selectedVibe.text}>Est. time</Text>
                </YStack>
              </XStack>
            </XStack>
          </Card>
        )}

        {/* Title and location */}
        <Card
          backgroundColor="#1c1c1e"
          borderRadius="$8"
          borderWidth={0.5}
          borderColor="rgba(255,255,255,0.08)"
          overflow="hidden"
        >
          <YStack>
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderBottomWidth={0.5}
              borderBottomColor="rgba(255,255,255,0.06)"
            >
              <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} marginBottom="$2">
                SESSION TITLE
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Morning Tan Track Run"
                placeholderTextColor="rgba(255,255,255,0.2)"
                backgroundColor="transparent"
                borderWidth={0}
                color="white"
                fontSize={16}
                padding={0}
                focusStyle={{ borderWidth: 0 }}
              />
            </YStack>

            <YStack
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} marginBottom="$2">
                LOCATION
              </Text>
              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Kings Domain, Melbourne"
                placeholderTextColor="rgba(255,255,255,0.2)"
                backgroundColor="transparent"
                borderWidth={0}
                color="white"
                fontSize={16}
                padding={0}
                focusStyle={{ borderWidth: 0 }}
              />
            </YStack>
          </YStack>
        </Card>

        {/* Date and time */}
        <Card
          backgroundColor="#1c1c1e"
          borderRadius="$8"
          borderWidth={0.5}
          borderColor="rgba(255,255,255,0.08)"
          overflow="hidden"
        >
          <XStack>
            <YStack
              flex={1}
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderRightWidth={0.5}
              borderRightColor="rgba(255,255,255,0.06)"
            >
              <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} marginBottom="$2">
                DATE
              </Text>
              <Input
                value={date}
                onChangeText={setDate}
                placeholder="Tue 11 Mar"
                placeholderTextColor="rgba(255,255,255,0.2)"
                backgroundColor="transparent"
                borderWidth={0}
                color="white"
                fontSize={15}
                padding={0}
                focusStyle={{ borderWidth: 0 }}
              />
            </YStack>

            <YStack
              flex={1}
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} marginBottom="$2">
                TIME
              </Text>
              <Input
                value={time}
                onChangeText={setTime}
                placeholder="6:30 AM"
                placeholderTextColor="rgba(255,255,255,0.2)"
                backgroundColor="transparent"
                borderWidth={0}
                color="white"
                fontSize={15}
                padding={0}
                focusStyle={{ borderWidth: 0 }}
              />
            </YStack>
          </XStack>
        </Card>

        {/* Sport type */}
        <YStack gap="$2">
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} paddingHorizontal="$1">
            SPORT
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {SPORTS.map(s => (
              <Button
                key={s}
                size="$3"
                borderRadius="$10"
                backgroundColor={sport === s ? selectedVibe.bg : 'rgba(255,255,255,0.05)'}
                borderWidth={0.5}
                borderColor={sport === s ? selectedVibe.border : 'rgba(255,255,255,0.08)'}
                onPress={() => setSport(s)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontSize={13}
                  fontWeight="600"
                  color={sport === s ? selectedVibe.text : 'rgba(255,255,255,0.4)'}
                >
                  {s}
                </Text>
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Vibe */}
        <YStack gap="$2">
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} paddingHorizontal="$1">
            VIBE
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {VIBES.map(v => {
              const vibeColor = VIBE_COLORS[v];
              return (
                <Button
                  key={v}
                  size="$3"
                  borderRadius="$10"
                  backgroundColor={vibe === v ? vibeColor.bg : 'rgba(255,255,255,0.05)'}
                  borderWidth={0.5}
                  borderColor={vibe === v ? vibeColor.border : 'rgba(255,255,255,0.08)'}
                  onPress={() => setVibe(v)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text
                    fontSize={13}
                    fontWeight="600"
                    color={vibe === v ? vibeColor.text : 'rgba(255,255,255,0.4)'}
                  >
                    {v}
                  </Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>

        {/* Pace */}
        <YStack gap="$2">
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} paddingHorizontal="$1">
            PACE
          </Text>
          <Card
            backgroundColor="#1c1c1e"
            borderRadius="$8"
            borderWidth={0.5}
            borderColor="rgba(255,255,255,0.08)"
            overflow="hidden"
          >
            <XStack>
              {PACES.map((p, index) => (
                <Button
                  key={p}
                  flex={1}
                  size="$4"
                  borderRadius={0}
                  backgroundColor={pace === p ? selectedVibe.bg : 'transparent'}
                  borderWidth={0}
                  borderRightWidth={index < 2 ? 0.5 : 0}
                  borderRightColor="rgba(255,255,255,0.06)"
                  onPress={() => setPace(p)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text
                    fontSize={13}
                    fontWeight="600"
                    color={pace === p ? selectedVibe.text : 'rgba(255,255,255,0.35)'}
                  >
                    {p}
                  </Text>
                </Button>
              ))}
            </XStack>
          </Card>
        </YStack>

        {/* Max runners */}
        <YStack gap="$2">
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={1} paddingHorizontal="$1">
            MAX RUNNERS
          </Text>
          <Card
            backgroundColor="#1c1c1e"
            borderRadius="$8"
            borderWidth={0.5}
            borderColor="rgba(255,255,255,0.08)"
            paddingVertical="$3"
            paddingHorizontal="$4"
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Button
                size="$5"
                circular
                backgroundColor="rgba(255,255,255,0.06)"
                borderWidth={0}
                onPress={() => setMaxCapacity(prev => Math.max(2, prev - 1))}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text fontSize={22} fontWeight="300" color="white">−</Text>
              </Button>

              <YStack alignItems="center">
                <Text fontSize={36} fontWeight="700" color="white">
                  {maxCapacity}
                </Text>
                <Text fontSize={11} color="rgba(255,255,255,0.3)">
                  runners max
                </Text>
              </YStack>

              <Button
                size="$5"
                circular
                backgroundColor="rgba(255,255,255,0.06)"
                borderWidth={0}
                onPress={() => setMaxCapacity(prev => Math.min(50, prev + 1))}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text fontSize={22} fontWeight="300" color="white">+</Text>
              </Button>
            </XStack>
          </Card>
        </YStack>

        {/* Create button */}
        <Button
          size="$6"
          borderRadius="$10"
          backgroundColor={selectedVibe.border}
          borderWidth={0}
          marginTop="$2"
          pressStyle={{ opacity: 0.8, scale: 0.98 }}
          onPress={handleCreate}
        >
          <Text fontSize={16} fontWeight="700" color="white" letterSpacing={0.3}>
            Create Session
          </Text>
        </Button>

      </ScrollView>
    </View>
  );
}