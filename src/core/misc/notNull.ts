export const notNull = <T>(value: T): value is NonNullable<T> => value != null
