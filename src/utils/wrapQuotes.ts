export const wrapQuotes = (pathStr: string) => {
  const escaped = pathStr
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\f/g, '\\f')
    .replace(/\\/g, '\\\\')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0');
  return `"${escaped}"`;
};
