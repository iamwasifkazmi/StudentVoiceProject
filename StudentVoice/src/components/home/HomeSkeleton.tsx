import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii } from '../../theme';

function SkeletonBlock({
  style,
  width,
  height,
  radius,
}: {
  style?: object;
  width?: number | `${number}%`;
  height: number;
  radius?: number;
}) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.72,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          height,
          width: width ?? '100%',
          borderRadius: radius ?? radii.md,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}

function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <SkeletonBlock width={22} height={22} radius={radii.sm} />
      <SkeletonBlock width={28} height={20} radius={radii.sm} />
      <SkeletonBlock width="70%" height={12} radius={radii.pill} />
    </View>
  );
}

function ActionCardSkeleton() {
  return (
    <View style={styles.actionSkeleton}>
      <SkeletonBlock width="75%" height={16} radius={radii.sm} />
      <SkeletonBlock width="55%" height={12} radius={radii.sm} />
      <View style={styles.actionFooter}>
        <SkeletonBlock width={36} height={36} radius={18} />
      </View>
    </View>
  );
}

function RecentActivityCardSkeleton() {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityTop}>
        <View style={styles.titleRow}>
          <SkeletonBlock width={8} height={8} radius={4} />
          <SkeletonBlock style={styles.titleFlex} height={16} radius={radii.sm} />
        </View>
        <SkeletonBlock width={72} height={24} radius={radii.pill} />
      </View>
      <SkeletonBlock width="92%" height={13} radius={radii.sm} />
      <SkeletonBlock width="70%" height={13} radius={radii.sm} style={{ marginTop: 6 }} />
      <View style={styles.metaRow}>
        <SkeletonBlock width={14} height={14} radius={4} />
        <SkeletonBlock width={56} height={12} radius={radii.sm} />
        <View style={styles.chevSpacer} />
        <SkeletonBlock width={18} height={18} radius={4} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.wrap} accessibilityLabel="Loading home">
      <View style={styles.stats}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
      <View style={styles.actions}>
        <ActionCardSkeleton />
        <ActionCardSkeleton />
      </View>
      <View style={styles.sectionHead}>
        <SkeletonBlock width={120} height={18} radius={radii.sm} />
        <SkeletonBlock width={52} height={14} radius={radii.sm} />
      </View>
      <RecentActivityCardSkeleton />
      <RecentActivityCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    alignItems: 'stretch',
  },
  actionSkeleton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    minHeight: 120,
    justifyContent: 'flex-start',
    gap: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  actionFooter: {
    marginTop: 'auto',
    alignSelf: 'flex-end',
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  activityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  titleFlex: {
    flex: 1,
    marginRight: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  chevSpacer: {
    flex: 1,
  },
});
