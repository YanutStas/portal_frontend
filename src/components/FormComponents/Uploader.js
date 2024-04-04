import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Upload, message, theme, Image } from "antd";
import useGlobal from "../../stores/useGlobal";
import axios from "axios";
import config from "../../config";

const { Dragger } = Upload;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function Uploader({ form }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([])
  const { colorPrimaryText } = theme.useToken().token

  const previewFile = async (file) => {
    console.log(file)
    if(file?.name.includes('.pdf')) return window.open(file.url, '_blank');
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const onRemove = (event) => {
    console.log(event)
    console.log(fileList)
    setFileList(fileList.filter(item => item.uid !== event.uid))
  }
  const uploadProps = {

    beforeUpload: (file) => {
      const isPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
      if (!isPNG) {
        message.error(`${file.name} не поддерживающего формата`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },

    onRemove,
    listType: "text",
    fileList,
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onPreview: previewFile,

    customRequest({ file, onSuccess, onError }) {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("jwt");
      axios
        .post(`${config.backServer}/api/cabinet/upload-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then(async (response) => {
          const relativePath = response.data.files[0];
          const fileblob = await axios.get(`${config.backServer}/api/cabinet/get-file/${relativePath}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            responseType: 'blob'
          })
          if (!fileblob.data) throw new Error('Ошибка загрузка файла')
          const objectURL = window.URL.createObjectURL(fileblob.data)
          setFileList([...fileList, {
            crossOrigin: 'use-credentials',
            uid: relativePath,
            name: file.name,
            status: 'done',
            url: objectURL,
          }])
          onSuccess(relativePath, file);
          form.setFieldsValue({ fileDoc: relativePath });
          message.success(
            `${file.name} файл загружен успешно и сохранен по пути: ${relativePath}`
          );
        })
        .catch((error) => {
          console.error("Ошибка при загрузке файла", error);
          onError(error);
          message.error(`${file.name} файл не загрузился, попробуйте ещё раз.`);
        });
    },
  };


  return (
    <Form.Item
      label="Загрузить документ"
      name="fileDoc"
      rules={[
        {
          required: true,
          message: "Пожалуйста, загрузите файл",
        },
      ]}
    >
      <Dragger {...uploadProps}>
        <div>
          <InboxOutlined style={{ color: colorPrimaryText, fontSize: "48px" }} />
        </div>
        <p className="ant-upload-text">Файл размером не более 10МБ</p>
        <p className="ant-upload-hint">форматы PDF, JPEG, PNG</p>
      </Dragger>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </Form.Item>
  );
}
