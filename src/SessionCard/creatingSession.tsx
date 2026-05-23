import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
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

const VIBE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Social:    { bg: '#2a2860', border: '#534AB7', text: '#a8a4f8' },
  Tempo:     { bg: '#2e2010', border: '#BA7517', text: '#f0a830' },
  Beginner:  { bg: '#0e2820', border: '#1D9E75', text: '#4ade80' },
  Intervals: { bg: '#2e1020', border: '#D4537E', text: '#f472b6' },
};

const AVATAR_COLORS = ['#534AB7', '#1D9E75', '#BA7517', '#D4537E'];

export default function CreateSession({
  onClose,
  onCreated,
  routeDistance,
  routeDuration,
}: CreateSessionProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vibe, setVibe] = useState('Social');
  const [maxCapacity, setMaxCapacity] = useState(10);

  const selectedVibe = VIBE_COLORS[vibe];

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Add a title', 'What is your session called?');
      return;
    }

    onCreated?.({
      id: Date.now().toString(),
      title: title.trim(),
      date: formatDate(date),
      time: formatTime(date),
      vibe,
      distance: routeDistance ?? 0,
      duration: routeDuration ?? 0,
      max_capacity: maxCapacity,
      current_count: 1,
      is_locked: false,
      host: 'You',
      location: 'Melbourne',
      pace: 'Easy',
      sport: 'Running',
    });

    onClose();
  };

  return (
    <View flex={1} backgroundColor="#0a0a0a" justifyContent="center" padding="$4">

      {/* THE CARD — compact like your sketch */}
      <Card
        backgroundColor="#1c1c1e"
        borderRadius="$8"
        borderWidth={0.5}
        borderColor="rgba(255,255,255,0.08)"
        overflow="hidden"
        padding="$4"
      >
        {/* Title input — centred at top */}
        <YStack alignItems="center" marginBottom="$4">
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
            fontSize={20}
            fontWeight="700"
            textAlign="center"
            width="60%"
            padding={0}
            paddingBottom="$2"
            focusStyle={{ borderWidth: 0, borderBottomWidth: 0.5, borderBottomColor: selectedVibe.border }}
          />
        </YStack>

        {/* KM and Date row */}
        <XStack justifyContent="space-between" alignItems="flex-end" marginBottom="$4">
          {/* KM */}
          <YStack>
            <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={0.5} marginBottom="$1">
              KM
            </Text>
            <Text fontSize={22} fontWeight="700" color="white">
              {routeDistance ? `${routeDistance}` : '--'}
            </Text>
            <View
              height={0.5}
              width={60}
              backgroundColor="rgba(255,255,255,0.15)"
              marginTop="$1"
            />
          </YStack>

          {/* Vibe badge — centre */}
          <View
            backgroundColor={selectedVibe.bg}
            borderColor={selectedVibe.border}
            borderWidth={0.5}
            borderRadius="$10"
            paddingHorizontal="$3"
            paddingVertical="$1"
          >
            <Text fontSize={12} fontWeight="700" color={selectedVibe.text}>
              {vibe}
            </Text>
          </View>

          {/* Date */}
          <YStack alignItems="flex-end">
            <Text fontSize={11} color="rgba(255,255,255,0.3)" letterSpacing={0.5} marginBottom="$1">
              DATE
            </Text>
            <Button
              chromeless
              padding={0}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text fontSize={22} fontWeight="700" color="white">
                {formatDate(date)}
              </Text>
            </Button>
            <View
              height={0.5}
              width={80}
              backgroundColor="rgba(255,255,255,0.15)"
              marginTop="$1"
            />
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

        {/* Vibe selector */}
        <XStack gap="$2" marginBottom="$4" justifyContent="center">
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
                <Text
                  fontSize={11}
                  fontWeight="600"
                  color={vibe === v ? vc.text : 'rgba(255,255,255,0.3)'}
                >
                  {v}
                </Text>
              </Button>
            );
          })}
        </XStack>

        {/* Profile avatars + capacity */}
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
          {/* Stacked avatars */}
          <XStack alignItems="center">
            {AVATAR_COLORS.map((color, index) => (
              <View
                key={index}
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor={color}
                borderWidth={2}
                borderColor="#1c1c1e"
                marginLeft={index > 0 ? -10 : 0}
                alignItems="center"
                justifyContent="center"
                zIndex={10 - index}
              >
                <Text fontSize={12} fontWeight="700" color="white">
                  {['MC', 'JR', 'TW', 'PN'][index]}
                </Text>
              </View>
            ))}
          </XStack>

          {/* Max capacity stepper */}
          <XStack alignItems="center" gap="$3">
            <Button
              size="$2"
              circular
              backgroundColor="rgba(255,255,255,0.06)"
              borderWidth={0}
              onPress={() => setMaxCapacity(prev => Math.max(2, prev - 1))}
            >
              <Text color="white" fontSize={16}>−</Text>
            </Button>
            <Text fontSize={16} fontWeight="700" color="white" minWidth={24} textAlign="center">
              {maxCapacity}
            </Text>
            <Button
              size="$2"
              circular
              backgroundColor="rgba(255,255,255,0.06)"
              borderWidth={0}
              onPress={() => setMaxCapacity(prev => Math.min(50, prev + 1))}
            >
              <Text color="white" fontSize={16}>+</Text>
            </Button>
          </XStack>
        </XStack>

        {/* Bottom row — Create and Share */}
        <XStack gap="$3" alignItems="center">
          <Button
            flex={1}
            size="$5"
            borderRadius="$10"
            backgroundColor={selectedVibe.border}
            borderWidth={0}
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            onPress={handleCreate}
          >
            <Text fontSize={15} fontWeight="700" color="white">
              Create
            </Text>
          </Button>

          {/* Share button */}
          <Button
            size="$5"
            circular
            backgroundColor="rgba(255,255,255,0.06)"
            borderWidth={0}
            onPress={() => {}}
          >
            <Text fontSize={18}>↑</Text>
          </Button>
        </XStack>

      </Card>

      {/* Cancel */}
      <Button
        chromeless
        marginTop="$4"
        onPress={onClose}
        alignSelf="center"
      >
        <Text color="rgba(255,255,255,0.3)" fontSize={15}>Cancel</Text>
      </Button>

    </View>
  );
}