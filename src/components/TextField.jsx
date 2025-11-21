import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

export default function TextField({
  label,
  hint,
  style,
  inputStyle,
  ...rest
}) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, inputStyle]}
        {...rest}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.xs / 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});

