import { map, of, OperatorFunction, scan, switchMap, timer, Timestamp, timestamp } from "rxjs";
import { NumericKeys } from "../types/helpers";

export const throttleHighValue = <T>(time: number, key: NumericKeys<T>): OperatorFunction<T, T> => source => {
    return source.pipe(
        timestamp(),
        scan(
            ({max}, next) => {
                return {
                    max: max.expires > next.timestamp && max.value[key] > next.value[key]
                        ? max :
                        {...next, expires: next.timestamp + time}, // New max value with expiration
                    next // Always keep the latest value
                }
            },
            {
                max: {value: null as T, expires: -Infinity},
                next: {value: null, timestamp: -Infinity} as Timestamp<T>,
            }
        ),
        switchMap(({max, next}) => {
            return max.value[key] > next.value[key]
                ? timer(max.expires - next.timestamp).pipe(map(() => next.value))
                : of(next.value)
        }),
    )
}
