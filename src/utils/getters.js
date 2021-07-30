export const getShortName = (name = '') => {
  const splitedName = name.split(' ');

  if (splitedName.length === 1) return splitedName[0].slice(0, 2);

  return splitedName.map((w) => w.charAt(0)).join('');
};
