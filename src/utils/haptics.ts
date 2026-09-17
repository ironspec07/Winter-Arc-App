/**
 * Haptic Feedback Engine using Navigator Vibration API
 * Provides tactile physical feedback on mobile devices for micro-interactions
 * and habit completions, with graceful fallback for unsupported devices.
 */

export const isVibrationSupported = (): boolean => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Trigger a brief, crisp tactile click (e.g. stepper tap, quick increment pill, tab switch)
 */
export function triggerHapticTap(intensity: number = 10): void {
  if (!isVibrationSupported()) return;
  try {
    navigator.vibrate(intensity);
  } catch {
    // Silently continue if restricted by browser security policies
  }
}

/**
 * Trigger a satisfying double-pulse haptic feedback when a habit is completed or checked off
 */
export function triggerHapticCompletion(): void {
  if (!isVibrationSupported()) return;
  try {
    // Crisp double-tap: vibrate 18ms, pause 35ms, vibrate 25ms
    navigator.vibrate([18, 35, 25]);
  } catch {
    // Silently ignore
  }
}

/**
 * Trigger a celebratory multi-pulse haptic pattern when all 9 habits are completed (100% Elite Day)
 */
export function triggerHapticGrandCelebration(): void {
  if (!isVibrationSupported()) return;
  try {
    // Triumphant burst: 30ms on, 40ms off, 35ms on, 40ms off, 55ms on
    navigator.vibrate([30, 40, 35, 40, 55]);
  } catch {
    // Silently ignore
  }
}

/**
 * Trigger a subtle alert haptic when unchecking or removing progress
 */
export function triggerHapticRevert(): void {
  if (!isVibrationSupported()) return;
  try {
    navigator.vibrate(12);
  } catch {
    // Silently ignore
  }
}
