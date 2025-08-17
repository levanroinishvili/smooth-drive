/**
 * Make all direct props of an object non-nullable
 */
export type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

/**
 * Extracts names of all numeric keys from a type.
 * E.g.:
 *   The following two lines are equivalent:
 *   type X = 'a' | 'e'
 *   type X = NumericKeys<{a: number, b: string, c: string | null, d?: number, e: 7}>
 */
export type NumericKeys<T> = Exclude<{
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T], undefined>
