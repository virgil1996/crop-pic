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

const previewStyle = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export const showPreview = (imgs) => {
  let index = 0;
  const wrapper = document.createElement('div')
  let stack = [];

  Object.keys(previewStyle.wrapper).forEach((key) => {
    wrapper.style[key] = previewStyle.wrapper[key]
  })

  const showImg = (img) => {
    const newImg = img.cloneNode(true);
    newImg.style.width = '70%'
    wrapper.replaceChildren(newImg)
  }

  const hidePreview = () => {
    document.body.removeChild(wrapper);
    document.removeEventListener('keydown', listenKeydownEvent)
    exportStack()
  }

  const exportStack = () => {
    console.log('stack', stack)
    stack = [];
  }

  const nextPreview = (img) => {
    index += 1;
    if (index < imgs.length) {
      showImg(imgs[index]);
    } else {
      hidePreview()
    }
  }

  const listenKeydownEvent = (event) => {
    const keyName = event.key
    switch (keyName) {
      case 'Escape':
        stack.push({ type: 'Quit' });
        hidePreview()
        break
      case '1':
        stack.push({ type: 'True', imgIndex: index })
        nextPreview()
        break
      case '2':
        stack.push({ type: 'False', imgIndex: index })
        nextPreview()
        break
      default:
        break
    }
  }

  document.addEventListener('keydown', listenKeydownEvent, false)

  showImg(imgs[index]);
  document.body.appendChild(wrapper)
}

