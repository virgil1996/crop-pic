import JSZip from 'jszip';
import { base642Image, removeBase64Prefix, removeFileExt } from './utils';
import dayjs from 'dayjs';
import FileSave from 'file-saver';

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

  _exportImgs = async () => {
    const map = {}
    this._imgs.forEach((img) => {
      const uid = img.originUid
      if (!map[uid]) {
        map[uid] = { uid, url: img.originUrl, name: img.originName, cropImgs: [img] }
      } else {
        map[uid].cropImgs.push(img)
      }
    })
    const zip = new JSZip();
    Object.keys(map).forEach(key => {
      const img = map[key]
      const fold = zip.folder(removeFileExt(img.name))
      fold.file(img.name, removeBase64Prefix(img.url), { base64: true })
      img.cropImgs.forEach((crop) => {
        fold.file(crop.name, removeBase64Prefix(crop.url), { base64: true })
      })
      const json = {
        originImg: img.name,
        cropImgs: img.cropImgs.map((crop) => ({
          name: crop.name,
          checkType: crop.checkType,
          checkTime: crop.checkTime ? dayjs(crop.checkTime).format('HH:mm:ss') : ''
        }))
      }
      const csvList = [["name", "result", "time"]]
      json.cropImgs.forEach((item) => {
        csvList.push([item.name, item.checkType, item.checkTime])
      })
      fold.file('result.json', JSON.stringify(json))
      const csv = csvList.map((cols) => cols.map(col => `"${col}"`).join(',')).join('\n')
      fold.file('result.csv', csv)
    });
    const content = await zip.generateAsync({ type: 'blob' })
    FileSave.saveAs(content, `${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.zip`)
  }
}

export default PreviewService