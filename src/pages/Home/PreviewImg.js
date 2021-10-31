import { thumbStr2Image } from './utils';

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

class PreviewService {
  _index = 0
  _wrapper = null
  _imgs = []
  constructor(imgs) {
    const stack = [];
    imgs.forEach((originImg) => {
      originImg.cropImgs.forEach((thumbUrl) => {
        stack.push({
          thumbUrl,
          originImg: { thumbUrl: originImg.thumbUrl, name: originImg.name },
        })
      })
    })
    this._imgs = stack;
    this._wrapper = document.createElement('div');
    Object.keys(previewStyle.wrapper).forEach((key) => {
      this._wrapper.style[key] = previewStyle.wrapper[key]
    })
    this._showImg();
    document.addEventListener('keydown', this._listenKeydownEvent, false)
    document.body.appendChild(this._wrapper)
  }

  _getCurrentImg = () => {
    return this._imgs[this._index]
  }

  _listenKeydownEvent = (event) => {
    const keyName = event.key
    switch (keyName) {
      case 'Escape':
        // stack.push({ type: 'Quit' });
        this._hidePreview()
        break
      case '1':
        this._imgs[this._index] = {
          ...this._imgs[this._index],
          checkType: 'True',
          checkTime: Date.now(),
        }
        this._nextPreview()
        break
      case '2':
        this._imgs[this._index] = {
          ...this._imgs[this._index],
          checkType: 'False',
          checkTime: Date.now(),
        }
        this._nextPreview()
        break
      default:
        break
    }
  }

  _showImg = async () => {
    const img = this._getCurrentImg();
    if (!img) return;
    
    const newImg = await thumbStr2Image(img.thumbUrl);
    newImg.style.width = '70%'
    this._wrapper.replaceChildren(newImg)
  }

  _nextPreview = () => {
    this._index += 1;
    if (!this._getCurrentImg()) {
      this._hidePreview()
      return
    }

    this._showImg(this._imgs[this._index]);
  }

  _hidePreview = () => {
    document.body.removeChild(this._wrapper);
    document.removeEventListener('keydown', this._listenKeydownEvent)
    this._exportImgs()
  }

  _exportImgs = () => {
    console.log(this._imgs)
  }
}

export default PreviewService