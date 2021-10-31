import { base642Image } from './utils';

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
      originImg.cropImgs.forEach((crop) => {
        stack.push({
          ...crop,
          originUid: originImg.uid,
          originUrl: originImg.url,
          originName: originImg.name,
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
    
    const newImg = await base642Image(img.url);
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
    const map = {}
    this._imgs.forEach((img) => {
      const uid = img.originUid
      if (!map[uid]) {
        map[uid] = { uid, url: img.originUrl, name: img.originName, cropImgs: [img] }
      } else {
        map[uid].cropImgs.push(img)
      }
    })
    const res = Object.keys(map).map(key => map[key]);
    console.log('res: ', res);
  }
}

export default PreviewService