

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

export const randomCropImg2ThumbUrl = (img, cropOptions) => {
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  const [left, top, width, height] = getRandomArea(img.naturalWidth, img.naturalWidth, { ...cropOptions });
  ctx.drawImage(img, left, top, width, height, 0, 0, 500, 300);
  return cvs.toDataURL();
  // const newImg = new Image();
  // newImg.src = cvs.toDataURL();
  // return newImg;
}

export const thumbStr2Image = (str) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = str
    img.onload = () =>  resolve(img)
    img.onerror = () => reject()
  })
}

// lastModified: 1635579765044
// lastModifiedDate: Sat Oct 30 2021 15:42:45 GMT+0800 (中国标准时间) {}
// name: "4.jpg"
// originFileObj: File {uid: 'rc-upload-1635657573144-3', name: '4.jpg', lastModified: 1635579765044, lastModifiedDate: Sat Oct 30 2021 15:42:45 GMT+0800 (中国标准时间), webkitRelativePath: 'images/4.jpg', …}
// percent: 0
// size: 289024
// thumbUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMg
// type: "image/jpeg"
// uid: "rc-upload-1635657573144-3"
export const cropImages = (files, cropOptions) => {
  return Promise.all(files.map(async (file) => {
    const img = await thumbStr2Image(file.thumbUrl)
    const cropImgs = Array.from({ length: cropOptions.cropCount }).map(() => {
      return randomCropImg2ThumbUrl(img, cropOptions)
    })
    return { ...file, cropImgs }
  }))
}

