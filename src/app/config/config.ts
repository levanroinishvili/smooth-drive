
export const CONFIG = {
    /**
     * How long should the higher value be frozen
     * without being replaced by lower values.
     * A higher value always instantly replaces previous lower value.
     */
    freezeHighValue: 500, // milliseconds

    minAcceleration: 0.5, // acceleration with magnitude below this is ignored
    maxAcceleration: 9.8, // maximum allowed acceleration
}
