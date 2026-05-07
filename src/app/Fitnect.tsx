import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FRIEND_CARD_WIDTH = width * 0.82;
const COMMUNITY_CARD_WIDTH = width * 0.78;

const friends = [
  { id: 'add', name: 'Add', type: 'add' },
  { id: '1', name: 'You', type: 'user' },
  { id: '2', name: 'Alex', type: 'user' },
  { id: '3', name: 'Josh', type: 'user' },
  { id: '4', name: 'Matt', type: 'user' },
  { id: '5', name: 'Chris', type: 'user' },
];

const friendSessions = [
  {
    id: '1',
    title: 'Running with the boys',
    activity: 'Running · 5km · 6:30 AM',
    type: 'running',
    person: 'Alex',
  },
  {
    id: '2',
    title: 'Morning Ride',
    activity: 'Cycling · 20km · 7:00 AM',
    type: 'cycling',
    person: 'Josh',
  },
  {
    id: '3',
    title: 'Sunset Walk',
    activity: 'Walking · 3km · 5:00 PM',
    type: 'walking',
    person: 'Matt',
  },
];

const communitySports = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'running', label: 'Running', icon: 'run' },
  { id: 'cycling', label: 'Cycling', icon: 'bike' },
  { id: 'football', label: 'Football', icon: 'soccer' },
  { id: 'other', label: 'Others', icon: 'dots-horizontal-circle-outline' },
];

const communitySessions = [
  {
    id: '4',
    title: 'Runvo',
    subtitle: 'Run Club',
    activity: 'Running · 10km · 8:00 AM',
    members: 5,
    badge: 'RV',
    badgeStyle: 'shield',
    type: 'running',
  },
  {
    id: '5',
    title: 'FKC Riders',
    subtitle: 'Cycling Club',
    activity: 'Cycling · 25km · 7:30 AM',
    members: 6,
    badge: 'FKC',
    badgeStyle: 'square',
    type: 'cycling',
  },
  {
    id: '6',
    title: 'Richmond FC Fans',
    subtitle: 'Football Community',
    activity: 'Football · Match meetup · 6:00 PM',
    members: 9,
    badge: 'RFC',
    badgeStyle: 'circle',
    type: 'football',
  },
  {
    id: '7',
    title: 'Hedges',
    subtitle: 'Run Club',
    activity: 'Running · 8km · 7:00 AM',
    members: 4,
    badge: 'H',
    badgeStyle: 'circle',
    type: 'running',
  },
  {
    id: '8',
    title: 'Weekend Movers',
    subtitle: 'Multi-sport Group',
    activity: 'Mixed sports · Social sessions',
    members: 7,
    badge: 'WM',
    badgeStyle: 'square',
    type: 'other',
  },
];

function ActivityIcon({ type }: { type: string }) {
  let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'run';

  if (type === 'cycling') iconName = 'bike';
  if (type === 'walking') iconName = 'walk';
  if (type === 'football') iconName = 'soccer';
  if (type === 'other') iconName = 'dots-grid';

  return (
    <View style={styles.activityCircle}>
      <MaterialCommunityIcons name={iconName} size={22} color="white" />
    </View>
  );
}

function SportFilterIcon({ type }: { type: string }) {
  let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'apps';

  if (type === 'running') iconName = 'run';
  if (type === 'cycling') iconName = 'bike';
  if (type === 'football') iconName = 'soccer';
  if (type === 'other') iconName = 'dots-horizontal-circle-outline';

  return <MaterialCommunityIcons name={iconName} size={18} color="white" />;
}

function ClubBadge({
  label,
  variant,
}: {
  label: string;
  variant: 'shield' | 'square' | 'circle';
}) {
  if (variant === 'shield') {
    return (
      <View style={styles.shieldBadge}>
        <View style={styles.shieldInner}>
          <Text style={styles.shieldText}>{label}</Text>
        </View>
      </View>
    );
  }

  if (variant === 'circle') {
    return (
      <View style={styles.circleBadge}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.squareBadge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );
}

export default function CommunityScreen() {
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredFriendSessions = useMemo(() => {
    if (!normalizedQuery) return friendSessions;

    return friendSessions.filter(item =>
      [item.title, item.activity, item.person, item.type]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredCommunitySessions = useMemo(() => {
    let filtered = communitySessions;

    if (selectedSport !== 'all') {
      filtered = filtered.filter(item => item.type === selectedSport);
    }

    if (normalizedQuery) {
      filtered = filtered.filter(item =>
        [item.title, item.subtitle, item.activity, item.badge, item.type]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    return filtered;
  }, [normalizedQuery, selectedSport]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.52)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search friends or communities"
            placeholderTextColor="rgba(255,255,255,0.42)"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color="rgba(255,255,255,0.4)"
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsRow}
        >
          {friends.map(item => (
            <TouchableOpacity key={item.id} style={styles.friendItem}>
              <View
                style={[
                  styles.friendAvatar,
                  item.type === 'add' && styles.addAvatar,
                ]}
              >
                {item.type === 'add' ? (
                  <Ionicons name="add" size={28} color="white" />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={50}
                    color="white"
                  />
                )}
              </View>
              <Text style={styles.friendName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title="Friends" count={filteredFriendSessions.length} />
        <View style={styles.divider} />

        {filteredFriendSessions.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            snapToInterval={FRIEND_CARD_WIDTH + 14}
            decelerationRate="fast"
          >
            {filteredFriendSessions.map(session => (
              <TouchableOpacity key={session.id} style={styles.friendCard}>
                <View style={styles.friendCardTop}>
                  <View style={styles.friendTag}>
                    <Text style={styles.friendTagText}>{session.person}</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.cardTitle}>{session.title}</Text>
                  <Text style={styles.cardSubtitle}>{session.activity}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.metaLabel}>Profile</Text>
                    <View style={styles.profileIconWrap}>
                      <Ionicons
                        name="person-circle-outline"
                        size={40}
                        color="white"
                      />
                    </View>
                  </View>

                  <View style={styles.rightMeta}>
                    <Text style={styles.metaLabel}>Activity</Text>
                    <ActivityIcon type={session.type} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No friend sessions found</Text>
            <Text style={styles.emptyText}>Try another search term.</Text>
          </View>
        )}

        <SectionHeader
          title="Community"
          count={filteredCommunitySessions.length}
        />
        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportFiltersRow}
        >
          {communitySports.map(item => {
            const active = selectedSport === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.sportChip, active && styles.sportChipActive]}
                onPress={() => setSelectedSport(item.id)}
              >
                <SportFilterIcon type={item.id} />
                <Text
                  style={[
                    styles.sportChipText,
                    active && styles.sportChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredCommunitySessions.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            snapToInterval={COMMUNITY_CARD_WIDTH + 14}
            decelerationRate="fast"
          >
            {filteredCommunitySessions.map(session => (
              <TouchableOpacity key={session.id} style={styles.communityCard}>
                <View style={styles.communityTopRow}>
                  <View style={styles.communityTitleWrap}>
                    <Text style={styles.communityTitle}>{session.title}</Text>
                    <Text style={styles.communitySubtitle}>
                      {session.subtitle}
                    </Text>
                    <Text style={styles.cardSubtitle}>{session.activity}</Text>
                  </View>

                  <ClubBadge
                    label={session.badge}
                    variant={session.badgeStyle}
                  />
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.metaLabel}>Members</Text>
                    <View style={styles.memberRow}>
                      {[0, 1, 2].map(i => (
                        <View
                          key={i}
                          style={[
                            styles.memberAvatar,
                            { marginLeft: i === 0 ? 0 : -10 },
                          ]}
                        >
                          <Ionicons
                            name="person-circle-outline"
                            size={28}
                            color="white"
                          />
                        </View>
                      ))}
                      {session.members > 3 && (
                        <View style={styles.extraMembers}>
                          <Text style={styles.extraMembersText}>
                            +{session.members - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.rightMeta}>
                    <Text style={styles.metaLabel}>Activity</Text>
                    <ActivityIcon type={session.type} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No communities found</Text>
            <Text style={styles.emptyText}>
              Try another sport or search term.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 120,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 22,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0B0B0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    marginLeft: 10,
  },
  friendsRow: {
    paddingHorizontal: 16,
    gap: 18,
    paddingBottom: 8,
  },
  friendItem: {
    alignItems: 'center',
  },
  friendAvatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1.8,
    borderColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
  },
  addAvatar: {
    backgroundColor: '#080808',
  },
  friendName: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    marginTop: 8,
  },
  sectionHeader: {
    marginTop: 28,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.11)',
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 18,
  },
  sportFiltersRow: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    gap: 10,
  },
  sportChip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportChipActive: {
    backgroundColor: '#141414',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  sportChipText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '600',
  },
  sportChipTextActive: {
    color: 'white',
  },
  cardsRow: {
    paddingHorizontal: 16,
    paddingRight: 28,
    gap: 14,
  },
  friendCard: {
    width: FRIEND_CARD_WIDTH,
    minHeight: 220,
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 26,
    padding: 18,
    justifyContent: 'space-between',
  },
  communityCard: {
    width: COMMUNITY_CARD_WIDTH,
    minHeight: 230,
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 26,
    padding: 18,
    justifyContent: 'space-between',
  },
  friendCardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  friendTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  friendTagText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  communityTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  communitySubtitle: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  communityTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  communityTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 22,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
    marginBottom: 8,
  },
  rightMeta: {
    alignItems: 'flex-end',
  },
  profileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  activityCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  extraMembers: {
    marginLeft: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraMembersText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '600',
  },
  squareBadge: {
    minWidth: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#0F0F0F',
  },
  circleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  shieldBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
    padding: 4,
  },
  shieldInner: {
    flex: 1,
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgeText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },
  shieldText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
  },
  emptyState: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#090909',
  },
  emptyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
  },
});