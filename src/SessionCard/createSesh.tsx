import React from 'react';
import { Alert } from 'react-native';
import {
  Button,
  Card,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

type Session = {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  distance: number;
  duration: number;
  sport: string;
  pace: string;
  location: string;
  vibe: string;
  current_count: number;
  max_capacity: number;
  is_locked: boolean;
};

type SessionCardProps = {
  session: Session;
  onClose: () => void;
  onJoin?: (id: string) => void;
};

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

export default function SessionCard({
  session,
  onClose,
  onJoin,
}: SessionCardProps) {
  const vibe = VIBE_COLORS[session.vibe] ?? VIBE_COLORS.Social;
  const capacityPercent = session.current_count / session.max_capacity;

  rreturn (
  <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>

    {/* Route banner — compact */}
    {routeDistance && (
      <XStack
        backgroundColor={selectedVibe.bg}
        borderColor={selectedVibe.border}
        borderWidth={0.5}
        borderRadius="$5"
        paddingHorizontal="$3"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="$3"
      >
        <Text fontSize={13} color={selectedVibe.text} fontWeight="600">
          📍 Route attached
        </Text>
        <Text fontSize={13} color="white" fontWeight="700">
          {routeDistance} km · {routeDuration} min
        </Text>
      </XStack>
    )}

    {/* THE CARD */}
    <Card
      backgroundColor="#252528"
      borderRadius="$8"
      borderWidth={0.5}
      borderColor="rgba(255,255,255,0.08)"
      overflow="hidden"
      padding="$4"
    >
      {/* Title input */}
      <YStack alignItems="center" marginBottom="$3">
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="rgba(255,255,255,0.25)"
          backgroundColor="transparent"
          borderWidth={0}
          borderBottomWidth={0.5}
          borderBottomColor="rgba(255,255,255,0.15)"
          borderRadius={0}
          color="white"
          fontSize={18}
          fontWeight="700"
          textAlign="center"
          width="60%"
          padding={0}
          paddingBottom="$2"
          focusStyle={{ borderWidth: 0, borderBottomWidth: 0.5 }}
        />
      </YStack>

      {/* KM and Date row */}
      <XStack justifyContent="space-between" alignItems="flex-end" marginBottom="$3">
        <YStack>
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={0.5} marginBottom="$1">
            KM
          </Text>
          <Text fontSize={20} fontWeight="700" color="white">
            {routeDistance ? `${routeDistance}` : '--'}
          </Text>
          <View height={0.5} width={50} backgroundColor="rgba(255,255,255,0.15)" marginTop="$1" />
        </YStack>

        <View
          backgroundColor={selectedVibe.bg}
          borderColor={selectedVibe.border}
          borderWidth={0.5}
          borderRadius="$10"
          paddingHorizontal="$3"
          paddingVertical="$1"
        >
          <Text fontSize={11} fontWeight="700" color={selectedVibe.text}>{vibe}</Text>
        </View>

        <YStack alignItems="flex-end">
          <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={0.5} marginBottom="$1">
            DATE
          </Text>
          <Button chromeless padding={0} onPress={() => setShowDatePicker(!showDatePicker)}>
            <Text fontSize={20} fontWeight="700" color="white">{formatDate(date)}</Text>
          </Button>
          <View height={0.5} width={70} backgroundColor="rgba(255,255,255,0.15)" marginTop="$1" />
        </YStack>
      </XStack>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="spinner"
          themeVariant="dark"
          minimumDate={new Date()}
          onChange={(event, selected) => {
            if (selected) setDate(selected);
            if (Platform.OS === 'android') setShowDatePicker(false);
          }}
        />
      )}

      {/* Vibe pills */}
      <XStack gap="$2" marginBottom="$3" justifyContent="center">
        {Object.keys(VIBE_COLORS).map(v => {
          const vc = VIBE_COLORS[v];
          return (
            <Button
              key={v}
              size="$2"
              borderRadius="$10"
              backgroundColor={vibe === v ? vc.bg : 'transparent'}
              borderWidth={0.5}
              borderColor={vibe === v ? vc.border : 'rgba(255,255,255,0.08)'}
              onPress={() => setVibe(v)}
              pressStyle={{ opacity: 0.7 }}
            >
              <Text fontSize={11} fontWeight="600" color={vibe === v ? vc.text : 'rgba(255,255,255,0.3)'}>
                {v}
              </Text>
            </Button>
          );
        })}
      </XStack>

      {/* Avatars and capacity */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom="$3">
        <XStack alignItems="center">
          {['#534AB7', '#1D9E75', '#BA7517', '#D4537E'].map((color, index) => (
            <View
              key={index}
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor={color}
              borderWidth={2}
              borderColor="#252528"
              marginLeft={index > 0 ? -8 : 0}
              alignItems="center"
              justifyContent="center"
              zIndex={10 - index}
            >
              <Text fontSize={10} fontWeight="700" color="white">
                {['MC', 'JR', 'TW', 'PN'][index]}
              </Text>
            </View>
          ))}
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Button size="$2" circular backgroundColor="rgba(255,255,255,0.06)" borderWidth={0}
            onPress={() => setMaxCapacity(prev => Math.max(2, prev - 1))}>
            <Text color="white" fontSize={14}>−</Text>
          </Button>
          <Text fontSize={14} fontWeight="700" color="white" minWidth={20} textAlign="center">
            {maxCapacity}
          </Text>
          <Button size="$2" circular backgroundColor="rgba(255,255,255,0.06)" borderWidth={0}
            onPress={() => setMaxCapacity(prev => Math.min(50, prev + 1))}>
            <Text color="white" fontSize={14}>+</Text>
          </Button>
        </XStack>
      </XStack>

      {/* Create and share buttons */}
      <XStack gap="$2" alignItems="center">
        <Button
          flex={1}
          size="$4"
          borderRadius="$10"
          backgroundColor={selectedVibe.border}
          borderWidth={0}
          pressStyle={{ opacity: 0.8 }}
          onPress={handleCreate}
        >
          <Text fontSize={14} fontWeight="700" color="white">Create</Text>
        </Button>
        <Button
          size="$4"
          circular
          backgroundColor="rgba(255,255,255,0.06)"
          borderWidth={0}
        >
          <Text fontSize={16}>↑</Text>
        </Button>
      </XStack>

    </Card>

    {/* Cancel */}
    <Button chromeless marginTop="$3" onPress={onClose} alignSelf="center">
      <Text color="rgba(255,255,255,0.3)" fontSize={14}>Cancel</Text>
    </Button>

  </View>
);