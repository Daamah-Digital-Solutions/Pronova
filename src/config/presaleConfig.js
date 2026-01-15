/**
 * Presale Frontend Configuration
 *
 * This file controls UI/marketing countdown elements ONLY.
 * It does NOT affect actual presale buying logic.
 * Smart contracts remain the source of truth for purchases.
 *
 * To change countdown dates:
 * Option 1: Set environment variables (requires rebuild)
 *   REACT_APP_PHASE1_START, REACT_APP_PHASE1_END
 *   REACT_APP_PHASE2_START, REACT_APP_PHASE2_END
 *   REACT_APP_PHASE3_START, REACT_APP_PHASE3_END
 *
 * Option 2: Edit the fallback dates below (requires rebuild)
 */

// Phase configuration with env var support
export const PRESALE_CONFIG = {
  phases: {
    1: {
      name: 'Phase 1 - Early Bird',
      startDate: new Date(process.env.REACT_APP_PHASE1_START || '2026-01-15T00:00:00Z'),
      endDate: new Date(process.env.REACT_APP_PHASE1_END || '2026-02-14T23:59:59Z'),
      displayPrice: '$0.80',
      bonus: '15%',
    },
    2: {
      name: 'Phase 2 - Growth',
      startDate: new Date(process.env.REACT_APP_PHASE2_START || '2026-02-15T00:00:00Z'),
      endDate: new Date(process.env.REACT_APP_PHASE2_END || '2026-03-16T23:59:59Z'),
      displayPrice: '$1.00',
      bonus: '10%',
    },
    3: {
      name: 'Phase 3 - Final',
      startDate: new Date(process.env.REACT_APP_PHASE3_START || '2026-03-17T00:00:00Z'),
      endDate: new Date(process.env.REACT_APP_PHASE3_END || '2026-04-15T23:59:59Z'),
      displayPrice: '$1.50',
      bonus: '5%',
    },
  },
};

/**
 * Get the current phase based on configured dates
 * Automatically determines which phase is active
 * @returns {number} Current phase number (1, 2, or 3)
 */
export const getCurrentPhase = () => {
  const now = new Date();

  // Check each phase to see if we're within its date range
  for (const [phaseNum, phase] of Object.entries(PRESALE_CONFIG.phases)) {
    if (now >= phase.startDate && now <= phase.endDate) {
      return parseInt(phaseNum);
    }
  }

  // If before phase 1, show phase 1
  if (now < PRESALE_CONFIG.phases[1].startDate) {
    return 1;
  }

  // If after phase 3, show phase 3
  if (now > PRESALE_CONFIG.phases[3].endDate) {
    return 3;
  }

  // Default to phase 1
  return 1;
};

/**
 * Get the current phase configuration
 * @returns {Object} Current phase config object
 */
export const getCurrentPhaseConfig = () => {
  const phase = getCurrentPhase();
  return {
    phaseNumber: phase,
    ...PRESALE_CONFIG.phases[phase],
  };
};

/**
 * Get the next phase price (for display)
 * @param {number} currentPhase - Current phase number
 * @returns {string} Next phase price string
 */
export const getNextPhasePrice = (currentPhase) => {
  if (currentPhase === 1) return '$1.00';
  if (currentPhase === 2) return '$1.50';
  return '$2.00'; // Expected listing price
};

/**
 * Calculate time remaining until phase end
 * @param {Date} endDate - Phase end date
 * @returns {Object} Time remaining object with days, hours, minutes, seconds
 */
export const calculateTimeRemaining = (endDate) => {
  const now = new Date();
  const difference = endDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
};
