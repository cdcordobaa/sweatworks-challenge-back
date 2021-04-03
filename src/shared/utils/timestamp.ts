export const convertTimestampToDate = (timestamp: number) => {
    return new Date(timestamp * 1000);
};
