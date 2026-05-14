import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, horizontalPadding, radii, typography } from '../../theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** Use red styling for the confirm action (e.g. log out). */
  confirmTone?: 'default' | 'danger';
};

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = 'No',
  confirmLabel = 'Yes',
  onCancel,
  onConfirm,
  confirmTone = 'default',
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <Pressable
        style={[styles.backdrop, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
        onPress={onCancel}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}>
              <Text style={styles.btnSecondaryText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.btn,
                confirmTone === 'danger' ? styles.btnDanger : styles.btnPrimary,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.btnPrimaryText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: horizontalPadding,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.buttonFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  btnSecondary: {
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  btnPrimary: {
    backgroundColor: colors.accentGold,
  },
  btnDanger: {
    backgroundColor: colors.primaryRed,
  },
  btnPrimaryText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
