const formatterValue = (value) => {
  let stringValue = value.toString();
  const separators = { decimal: ',', thousand: '.' };

  if (stringValue.length === 0) {
    return stringValue;
  }

  if (stringValue.length === 1) {
    return `0${separators.decimal}0${stringValue}`;
  }

  if (stringValue.length === 2) {
    return `0${separators.decimal}${stringValue}`;
  }

  if (stringValue.length <= 5) {
    return `${stringValue.slice(0, stringValue.length - 2)}`
          + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  if (stringValue.length <= 8) {
    return `${stringValue.slice(0, stringValue.length - 5)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
        + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  if (stringValue.length <= 11) {
    return `${stringValue.slice(0, stringValue.length - 8)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 8, stringValue.length - 5)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
        + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  stringValue = stringValue.substring(0, 12);
  return `${stringValue.charAt(0)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 11, stringValue.length - 8)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 8, stringValue.length - 5)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
      + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
};

export default formatterValue;
