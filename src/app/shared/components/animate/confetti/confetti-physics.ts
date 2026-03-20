/**
 * Confetti physics layer.
 *
 * Contains all motion / lifecycle / derived simulation calculations.
 * No rendering, no scene logic, no side effects.
 */

import type { ConfettiConfig } from '@shared/components/animate/confetti/confetti-core';
import {
  calculateGravity,
  calculateSpawnRate,
} from '@shared/components/animate/confetti/confetti-core';

/**
 * boom.position.y = fallingHeight + areaHeight - fallingSpeed
 */
export function calculateEmitterHeight(
  fallingHeight: ConfettiConfig['fallingHeight'],
  areaHeight: ConfettiConfig['areaHeight'],
  fallingSpeed: ConfettiConfig['fallingSpeed']
): number {
  return fallingHeight + areaHeight - fallingSpeed;
}

/**
 * Approximate lifetime for particles to travel from spawn height down past -fallingHeight.
 */
export function calculateParticleLife(
  fallingHeight: ConfettiConfig['fallingHeight'],
  areaHeight: ConfettiConfig['areaHeight'],
  fallingSpeed: ConfettiConfig['fallingSpeed'],
  radius: ConfettiConfig['radius']
): number {
  const emitterHeight = calculateEmitterHeight(
    fallingHeight,
    areaHeight,
    fallingSpeed
  );

  const travelDistance =
    emitterHeight + fallingHeight + radius;

  return Math.max(
    2.5,
    travelDistance / Math.max(fallingSpeed, 0.0001)
  );
}

export function calculateSpawnWindow(
  rate: ConfettiConfig['rate']
): number {
  const spawnRate = Math.max(
    calculateSpawnRate(rate),
    0.0001
  );

  return 1 / spawnRate;
}

/**
 * Number of simultaneous booms that can exist during one full particle lifetime.
 */
export function calculateBoomCount(
  rate: ConfettiConfig['rate'],
  fallingHeight: ConfettiConfig['fallingHeight'],
  areaHeight: ConfettiConfig['areaHeight'],
  fallingSpeed: ConfettiConfig['fallingSpeed'],
  radius: ConfettiConfig['radius']
): number {
  return Math.max(
    1,
    Math.ceil(
      calculateParticleLife(
        fallingHeight,
        areaHeight,
        fallingSpeed,
        radius
      ) /
        Math.max(calculateSpawnWindow(rate), 0.0001)
    ) + 1
  );
}

export function calculateTotalParticleCount(
  amount: ConfettiConfig['amount'],
  rate: ConfettiConfig['rate'],
  fallingHeight: ConfettiConfig['fallingHeight'],
  areaHeight: ConfettiConfig['areaHeight'],
  fallingSpeed: ConfettiConfig['fallingSpeed'],
  radius: ConfettiConfig['radius']
): number {
  const particlesPerBoom = Math.max(
    1,
    Math.floor(amount)
  );

  return (
    particlesPerBoom *
    calculateBoomCount(
      rate,
      fallingHeight,
      areaHeight,
      fallingSpeed,
      radius
    )
  );
}

/**
 * Gravity + variation range
 */
export function calculateGravityRange(
  fallingSpeed: ConfettiConfig['fallingSpeed']
) {
  const gravity = calculateGravity(fallingSpeed);

  return {
    gravity,
    gravityMin: gravity * 0.85,
    gravityMax: gravity * 1.15,
  };
}
