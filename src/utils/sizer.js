import { PixelRatio } from 'react-native';

const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();

const fontSizer = function (fontSize: number) {
  if (pixelRatio <= 1) {
    return fontSize;
  } else if (pixelRatio > 1 && pixelRatio <= 2) {
    return fontSize + 1;
  } else if (pixelRatio > 2 && pixelRatio <= 3) {
    return fontSize + 2;
  }
  return fontSize + 3;
};

const textBoxSizer = function (pixel: number) {
  return boxSizer((pixel * fontScale));
};

const boxSizer = function (boxSize: number) {
  let size;
  if (pixelRatio < 2) {
    size = boxSize;
  } else if (pixelRatio >= 2 && pixelRatio < 3) {
    size = (boxSize * 1.15);
  } else if (pixelRatio >= 3) {
    size = (boxSize * 1.35);
  } else {
    size = (boxSize * 1.2);
  }
  return Math.round(size);
};

module.exports = {
  fontSizer,
  boxSizer,
  textBoxSizer,
};
