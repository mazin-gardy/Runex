import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface ButtonRouteProps {
  onPress: () => void;
  size?: number;
}

export default function ButtonRoute({
  onPress,
  size = 70,
}: ButtonRouteProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.8}>
      <View
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 60 60">
          <Path
            d="M 30,2 Q 24,20 30,30 Q 36,40 30,58"
            stroke="#ffffff"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          <Path
            d="M 2,30 Q 20,24 30,30 Q 40,36 58,30"
            stroke="#fcfcfc"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          <Circle cx="30" cy="2" r="4" fill="#ffffff" />
          <Circle cx="30" cy="58" r="4" fill="#f4f4f4" />
          <Circle cx="2" cy="30" r="4" fill="#ffffff" />
          <Circle cx="58" cy="30" r="4" fill="#ffffff" />

          <Circle cx="30" cy="30" r="6" fill="#f7f7f7" />
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e1d1b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});