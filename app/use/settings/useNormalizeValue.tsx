// utils.ts
export const normalizeValue = (value: string | number) => {
    let normalizedValue = value;

    // If the value does not contain any digits, set it to 0
    if (!normalizedValue.toString().match(/\d+/)) {
        normalizedValue = 0;
    }

    // If the value is something like "0" or "0,0", set it to 0
    if (/^(0,?)*$/.test(normalizedValue.toString())) {
        normalizedValue = 0;
    }

    // If the value starts with 0 and looks like this "055" set to "55"
    if (normalizedValue.toString()[0] === '0' && normalizedValue.toString().length > 1 && !normalizedValue.toString().includes(',')) {
        normalizedValue = Number(normalizedValue.toString().slice(1));
    }

    // If the value contains more than 2 "," characters, set it to 0
    if (normalizedValue.toString().split(',').length > 2) {
        normalizedValue = 0;
    }

    // If the value starts with something like ",5", then set it to "0,5"
    if (normalizedValue.toString()[0] === ',' && normalizedValue.toString().length > 1) {
        normalizedValue = `0${normalizedValue}`;
    }

    // Replace comma with dot for decimal conversion
    normalizedValue = normalizedValue.toString().replace(',', '.');

    return normalizedValue;
};