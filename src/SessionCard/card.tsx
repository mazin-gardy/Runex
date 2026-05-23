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

const AVATAR_COLORS = ['#534AB7', '#1D9E75', '#BA7517', '#D4537E'];
const AVATAR_INITIALS = ['MC', 'JR', 'TW', 'PN'];

export default function SessionCard({
  session,
  onClose,
  onJoin,
}: SessionCardProps) {
  const vibe = VIBE_COLORS[session.vibe] ?? VIBE_COLORS.Social;
  const capacityPercent = session.current_count / session.max_capacity;

  return (
    <Card
      borderRadius="$8"
      backgroundColor="#1c1c1e"
      overflow="hidden"
      borderWidth={0.5}
      borderColor="rgba(255,255,255,0.08)"
    >

      {/* Header */}
      <XStack
        paddingHorizontal="$4"
        paddingTop="$4"
        paddingBottom="$2"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <YStack flex={1} gap="$1">
          <View
            backgroundColor={vibe.bg}
            borderColor={vibe.border}
            borderWidth={0.5}
            borderRadius="$10"
            paddingHorizontal="$2"
            paddingVertical="$1"
            alignSelf="flex-start"
            marginBottom="$2"
          >
            <Text fontSize={11} fontWeight="700" color={vibe.text} letterSpacing={0.5}>
              {session.vibe.toUpperCase()}
            </Text>
          </View>

          <Text fontSize={20} fontWeight="700" color="white" letterSpacing={-0.5}>
            {session.title}
          </Text>
          <Text fontSize={13} color="rgba(255,255,255,0.45)">
            {session.host}
          </Text>
        </YStack>

        <YStack alignItems="flex-end" gap="$2">
          <Button
            size="$2"
            circular
            chromeless
            backgroundColor="rgba(255,255,255,0.08)"
            onPress={onClose}
          >
            <Text color="rgba(255,255,255,0.5)" fontSize={13}>✕</Text>
          </Button>
          <YStack alignItems="flex-end">
            <Text fontSize={13} fontWeight="600" color="rgba(255,255,255,0.7)">
              {session.date}
            </Text>
            <Text fontSize={12} color="rgba(255,255,255,0.4)">
              {session.time}
            </Text>
          </YStack>
        </YStack>
      </XStack>

      {/* Stats */}
      <XStack
        marginHorizontal="$4"
        marginVertical="$3"
        backgroundColor="rgba(255,255,255,0.05)"
        borderRadius="$6"
        padding="$3"
        gap="$2"
      >
        {[
          { label: 'Distance', value: `${session.distance} km` },
          { label: 'Est. time', value: `${session.duration} min` },
          { label: 'Pace', value: session.pace },
        ].map((stat, index) => (
          <YStack
            key={stat.label}
            flex={1}
            alignItems="center"
            borderRightWidth={index < 2 ? 0.5 : 0}
            borderRightColor="rgba(255,255,255,0.08)"
          >
            <Text fontSize={17} fontWeight="700" color="white">
              {stat.value}
            </Text>
            <Text fontSize={11} color="rgba(255,255,255,0.35)" marginTop="$1">
              {stat.label}
            </Text>
          </YStack>
        ))}
      </XStack>

      {/* Avatars and capacity */}
      <XStack
        marginHorizontal="$4"
        marginBottom="$3"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center">
          {Array.from({ length: Math.min(session.current_count, 4) }).map((_, index) => (
            <View
              key={index}
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor={AVATAR_COLORS[index]}
              borderWidth={2}
              borderColor="#1c1c1e"
              marginLeft={index > 0 ? -10 : 0}
              alignItems="center"
              justifyContent="center"
              zIndex={10 - index}
            >
              <Text fontSize={10} fontWeight="700" color="white">
                {AVATAR_INITIALS[index]}
              </Text>
            </View>
          ))}
          {session.current_count > 4 && (
            <View
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor="rgba(255,255,255,0.08)"
              borderWidth={2}
              borderColor="#1c1c1e"
              marginLeft={-10}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={10} fontWeight="700" color="rgba(255,255,255,0.5)">
                +{session.current_count - 4}
              </Text>
            </View>
          )}
        </XStack>

        <YStack alignItems="flex-end">
          <Text fontSize={13} fontWeight="600" color="white">
            {session.current_count}/{session.max_capacity}
          </Text>
          <Text fontSize={11} color={session.is_locked ? '#E24B4A' : '#4ade80'}>
            {session.is_locked ? 'Full' : `${session.max_capacity - session.current_count} left`}
          </Text>
        </YStack>
      </XStack>

      {/* Location */}
      <XStack marginHorizontal="$4" marginBottom="$3">
        <Text fontSize={13} color="rgba(255,255,255,0.35)">
          📍 {session.location}
        </Text>
      </XStack>

      {/* Action buttons */}
      <XStack
        paddingHorizontal="$4"
        paddingBottom="$4"
        gap="$3"
        alignItems="center"
      >
        <Button
          size="$4"
          circular
          backgroundColor="rgba(255,255,255,0.08)"
          borderWidth={0}
        >
          <Text fontSize={16}>↑</Text>
        </Button>

        <Button
          flex={1}
          size="$5"
          borderRadius="$10"
          backgroundColor={session.is_locked ? 'rgba(255,255,255,0.06)' : vibe.border}
          borderWidth={0}
          disabled={session.is_locked}
          pressStyle={{ opacity: 0.8, scale: 0.98 }}
          onPress={() => {
            if (!session.is_locked) {
              onJoin?.(session.id);
              Alert.alert('Request sent!', 'The host will review your request.');
            }
          }}
        >
          <Text
            color={session.is_locked ? 'rgba(255,255,255,0.3)' : 'white'}
            fontWeight="700"
            fontSize={15}
            letterSpacing={0.3}
          >
            {session.is_locked ? 'Session full' : 'Request to join'}
          </Text>
        </Button>

        <Button
          size="$4"
          circular
          backgroundColor="rgba(255,255,255,0.08)"
          borderWidth={0}
        >
          <Text fontSize={16} color="rgba(255,255,255,0.5)">···</Text>
        </Button>
      </XStack>

    </Card>
  );
}