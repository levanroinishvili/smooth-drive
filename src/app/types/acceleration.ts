export type Orientation = 'X' | 'Y' | 'Z'

/**
 *  Visual representation of the axis of the device.
 *  Notice that Z axis is reversed relative to device coordinate system.
 *  If holding device in landscape mode:
 * ```
 *   +X points to the right
 *   +Y points down
 *   +Z points AWAY FROM the user (unlike device coordinate system)
 *     _______________________
 *    /           ↑ Y         \
 *    |           │            |
 *    |           │          ↗Z|
 *    |           │       ↗    |
 *    |           │    ↗       |
 *    |           │ ↗        X |
 *    |────────── ○ ─────────⮕|
 *    |           │            |
 *    |           │            |
 *    |           │            |
 *    |           │            |
 *    |           │            |
 *    |           │            |
 *    \___________|___________/
 * ```
 */
export interface AccelerationSummary {
    magnitude: number
    orientation: Orientation
}

export interface AccelerationMeta extends AccelerationSummary {
    magnitudeAbs: number // Absolute value of the magnitude, [0, +∞[
    percent: number // Percentage of the maximum allowed acceleration, ]-∞, +∞[
    percentSafe: number // "Normalized" or "safe" percentage value, [-100, +100]
}
