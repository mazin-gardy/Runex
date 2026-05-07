import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Session = {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  distance: number;
  duration: number;
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

const VIBE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Social:    { bg: '#EEEDFE', border: '#534AB7', text: '#3C3489' },
  Tempo:     { bg: '#FAEEDA', border: '#BA7517', text: '#633806' },
  Beginner:  { bg: '#E1F5EE', border: '#1D9E75', text: '#085041' },
  Intervals: { bg: '#FBEAF0', border: '#D4537E', text: '#72243E' },
};

export default function SessionCard({ session, onClose, onJoin }: SessionCardProps) {
  const vibe = VIBE_COLORS[session.vibe] ?? VIBE_COLORS.Social;
  const capacityPercent = (session.current_count / session.max_capacity) * 100;

  return (
    <View style={styles.card}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={[styles.vibeBadge, { backgroundColor: vibe.bg, borderColor: vibe.border }]}>
          <Text style={[styles.vibeBadgeText, { color: vibe.text }]}>{session.vibe}</Text>
        </View>
        {session.is_locked && (
          <View style={styles.fullBadge}>
            <Text style={styles.fullBadgeText}>Full</Text>
          </View>
        )}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>

        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{session.title}</Text>
            <Text style={styles.host}>Hosted by {session.host}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.date}>{session.date}</Text>
            <Text style={styles.time}>{session.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{session.distance} km</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Est. time</Text>
            <Text style={styles.statValue}>{session.duration} min</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pace</Text>
            <Text style={styles.statValue}>{session.pace}</Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.capacityRow}>
          <Text style={styles.capacityText}>
            {session.current_count} of {session.max_capacity} joined
          </Text>
          <View style={styles.capacityBarBg}>
            <View style={[
              styles.capacityBarFill,
              {
                width: `${capacityPercent}%` as any,
                backgroundColor: session.is_locked ? '#E24B4A' : '#1D9E75',
              }
            ]} />
          </View>
        </View>

        {/* Location */}
        <Text style={styles.location}>📍 {session.location}</Text>

        {/* Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.joinBtn, session.is_locked && styles.joinBtnDisabled]}
            disabled={session.is_locked}
            onPress={() => {
              if (!session.is_locked) {
                onJoin?.(session.id);
                Alert.alert('Request sent!', 'The host will review your request.');
              }
            }}
          >
            <Text style={[styles.joinBtnText, session.is_locked && styles.joinBtnTextDisabled]}>
              {session.is_locked ? 'Session full' : 'Request to join'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  topBar: {
    height: 50,
    backgroundColor: '#f0f0ee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  vibeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  vibeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fullBadge: {
    backgroundColor: '#FCEBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E24B4A',
  },
  fullBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#791F1F',
  },
  closeBtn: {
    marginLeft: 'auto' as any,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    color: '#555',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  host: {
    fontSize: 12,
    color: '#888',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f5f5f3',
    borderRadius: 10,
    padding: 10,
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityText: {
    fontSize: 12,
    color: '#888',
  },
  capacityBarBg: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f3',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
  },
  joinBtn: {
    flex: 2,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#534AB7',
  },
  joinBtnDisabled: {
    backgroundColor: '#f5f5f3',
  },
  joinBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EEEDFE',
  },
  joinBtnTextDisabled: {
    color: '#888',
  },
});