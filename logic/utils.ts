export const formatStringError = (stringError: string): string => {
    const stringErrorSplit = stringError.split("*");
    if (stringErrorSplit.length !== 3) {
        return stringError;
    }
    return `${stringErrorSplit[0]}<span class="text-red-500">${stringErrorSplit[1]}</span>${stringErrorSplit[2]}`;
};
