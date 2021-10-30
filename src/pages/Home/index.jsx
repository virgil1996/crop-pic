import React, { useRef } from 'react';
import { Button, Space, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { parseFile2Base64, randomCropImg, showPreview } from './utils';
import styles from './style';

const CropOptions = {
  cropCount: 10,
  minWidth: 0.2,
  maxWidth: 0.8,
  minHeight: 0.2,
  maxHeight: 0.8,
}

const Home = () => {
  const originImgRef = useRef()
  const imageListRef = useRef()

  const preview = () => {
    const childrens = imageListRef.current?.children
    if (childrens?.length === 0) return
    showPreview(childrens)
  }

  return (
    <Space direction="vertical">
      <Upload
        listType="picture"
        accept="image/*"
        beforeUpload={async (file) => {
          const str = await parseFile2Base64(file);
          const img = originImgRef.current;
          img.src = str;
          img.onload = () => {
            const frag = document.createDocumentFragment();
            [...Array(10)].forEach(() => {
              frag.appendChild(randomCropImg(img, CropOptions));
            })
            imageListRef.current.replaceChildren(frag);
          }
          return false;
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>上传图片</Button>
      </Upload>
      <img alt="" style={styles.originImg} ref={originImgRef} />
      <div style={styles.list} ref={imageListRef} />
      <Button onClick={preview}>预览</Button>
    </Space>
  )
}

export default Home;  