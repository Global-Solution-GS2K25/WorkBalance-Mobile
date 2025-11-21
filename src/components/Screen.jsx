import React from 'react';
import { StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export default function Screen({
  children,
  scrollable = false,
  keyboard = false,
  contentStyle,
  gradient = ['#0f172a', '#111827', '#05060a'],
}) {
  const insets = useSafeAreaInsets();
  const Wrapper = scrollable ? ScrollView : View;

  const wrapperProps = scrollable
    ? {
        style: styles.flex,
        contentContainerStyle: [
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
          contentStyle,
        ],
        showsVerticalScrollIndicator: false,
      }
    : {
        style: [
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
          contentStyle,
        ],
      };

  const content = (
    <Wrapper
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  );

  const inner = keyboard ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>{inner}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

