import React, { useState } from 'react';
import { Button, Space, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { cropImages, file2Base64 } from './utils';
import PreviewService from './PreviewImg';
import AsyncButton from '../../components/AsyncButton';

const CropOptions = {
  cropCount: 10,
  minWidth: 0.2,
  maxWidth: 0.8,
  minHeight: 0.2,
  maxHeight: 0.8,
}

const Home = () => {
  const [fileList, setFileList] = useState([])

  const crop = async () => {
    if (fileList.length === 0) return;
    const list = await cropImages(fileList, CropOptions);
    new PreviewService(list)
  }

  return (
    <Space direction="vertical">
      <Upload
        listType="picture-card"
        accept="image/*"
        multiple
        directory
        beforeUpload={async (file) => {
          // FileReader 方法会把 file.name 给吞掉，所以要提前先存起来
          const name = file.name;
          const url = await file2Base64(file)
          file = { ...file, name, url }
          setFileList((old) => ([
            ...old,
            file
          ]))
          return false
        }}
        fileList={fileList}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
      <Space>
        <AsyncButton disabled={fileList.length === 0} onClick={crop}>裁剪</AsyncButton>
        <Button onClick={() => setFileList([])}>清空</Button>
      </Space>
    </Space>
  )
}

export default Home;  