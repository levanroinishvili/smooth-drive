/**
 * Maps a percentage of acceleration to a CSS color.
 * @param percent - The percentage of acceleration, can be negative or positive.
 * @return A CSS color string representing the acceleration level. E.g., 'green' or '#FF0000'.
 */
export const mapToColor = (percent: number): string => {
    const p = Math.abs(percent)
    if (p < 20) {
        return 'green'
    } else if (p < 50) {
        return 'orange'
    } else {
        return 'red'
    }
}