// @flow

export const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  if (randomColor[0].toLocaleLowerCase() === 'f') return generateRandomColor();
  return '#' + randomColor;
};
