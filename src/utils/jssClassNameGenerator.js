
const escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g;
let classCounter = 0

export const generateClassId = (rule, styleSheet) => {
  classCounter += 1;

  // if (process.env.NODE_ENV === 'production') {
  //     return `c${classCounter}`;
  // }

  // return `${prefix}-${rule.key}-${classCounter}`;



  if (styleSheet && styleSheet.options.classNamePrefix) {
    let prefix = styleSheet.options.classNamePrefix;
    // Sanitize the string as will be used to prefix the generated class name.
    prefix = prefix.replace(escapeRegex, '-');

    if (prefix.match(/^Mui/)) {
      return `${prefix}-${rule.key}`;
    }

    return `${prefix}-${rule.key}-${classCounter}`;
  }

  return `${rule.key}-${classCounter}`;
};
const hashCode = (str) => {
  var hash = 0,
    i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}