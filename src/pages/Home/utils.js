// 生成 min~max 的随机数
const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

/**
 * 随机生成要裁剪的区域
 * 单位: 0 ~ 1
 * return [left, top, width, height]
 */
const getRandomArea = (width, height, { minWidth, minHeight, maxWidth, maxHeight }) => {
  const w = random(minWidth, maxWidth);
  const h = random(minHeight, maxHeight);
  const top = random(0, 1 - h);
  const left = random(0, 1 - w);
  return [left * width, top * height, w * width, h * height];
}

export const randomCropImg2Url = (img, cropOptions) => {
  const cvs = document.createElement('canvas');
  cvs.width = cvs.width * window.devicePixelRatio;
  cvs.height = cvs.height * window.devicePixelRatio;
  const ctx = cvs.getContext('2d');
  const [left, top, width, height] = getRandomArea(img.naturalWidth, img.naturalWidth, { ...cropOptions });
  ctx.drawImage(img, left, top, width, height, 0, 0, width, height);
  return cvs.toDataURL();
}

export const file2Base64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e);
  })
}

export const base642Image = (str) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = str
    img.onload = () => resolve(img)
    img.onerror = () => reject()
  })
}

const spliceFileName = (file, concatName) => {
  const splitFile = file.split('.')
  return `${splitFile[0]}${concatName}.${splitFile[1]}`
}

export const cropImages = (files, cropOptions) => {
  return Promise.all(files.map(async (file) => {
    const img = await base642Image(file.url)
    const cropImgs = Array.from({ length: cropOptions.cropCount }).map((_, index) => {
      return {
        url: randomCropImg2Url(img, cropOptions),
        name: spliceFileName(file.name, `_${index}`)
      }
    })
    return { ...file, cropImgs }
  }))
}

export const removeBase64Prefix = (str) => {
  return str.replace(/^data:image\/\w+;base64,/, '')
}

export const removeFileExt = (str) => {
  return str.split('.')[0]
}
