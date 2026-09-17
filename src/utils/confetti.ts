import confetti from 'canvas-confetti';

/**
 * Fires a subtle, elegant celebration confetti burst for habit completion.
 * Styled with refined emerald, gold, cyan, and indigo particles.
 */
export function triggerCompletionConfetti(): void {
  const count = 50;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#06b6d4', '#6366f1'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    try {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    } catch {
      // Fallback silently if canvas-confetti is not supported in preview iframe
    }
  }

  // Multi-tier burst for natural depth
  fire(0.35, {
    spread: 50,
    startVelocity: 28,
    scalar: 0.85,
  });

  fire(0.3, {
    spread: 75,
    startVelocity: 38,
    decay: 0.92,
    scalar: 1.0,
  });

  fire(0.2, {
    spread: 105,
    decay: 0.9,
    scalar: 0.75,
  });
}
