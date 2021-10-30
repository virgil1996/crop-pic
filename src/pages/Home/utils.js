export const parseFile2Base64 = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e);
    } catch (e) {
      reject(e);
    }
  })
}

// 生成 min~max 的随机数
const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

/**
 * 随机生成要裁剪的区域
 * 单位: 0 ~ 1
 * return [left, top, width, height]
 */
export const getRandomArea = (width, height, { minWidth, minHeight, maxWidth, maxHeight }) => {
  const w = random(minWidth, maxWidth);
  const h = random(minHeight, maxHeight);
  const top = random(0, 1 - h);
  const left = random(0, 1 - w);
  return [left * width, top * height, w * width, h * height];
}

export const randomCropImg = (img, cropOptions) => {
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  const [left, top, width, height] = getRandomArea(img.naturalWidth, img.naturalWidth, { ...cropOptions });
  ctx.drawImage(img, left, top, width, height, 0, 0, 500, 300);
  const newImg = new Image();
  newImg.src = cvs.toDataURL();
  return newImg;
}
