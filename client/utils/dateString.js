export const dateString = (value) => {
    const date = new Date(value);
    return date.toLocaleString();
}