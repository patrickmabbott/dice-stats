export function coalesce(value, valueIfNull) {
    return value === null || value === undefined ? valueIfNull : value;
}