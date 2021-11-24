import { Upload, Button, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { uploadArtwork } from '@libs/utils';
import { UploadChangeParam } from 'antd/lib/upload/interface';

type UploaderProps = {
  uploadImage: (hex: string) => void
};

const Uploader = ({ uploadImage }: UploaderProps) => {
  const props = {
    withCredentials: false,
    showUploadList: false,
    beforeUpload: async (file:RcFile) => {
      if (file.type !== 'image/png') {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    },
    customRequest: () => {},
    onChange: async (info: UploadChangeParam) => {
      if (info.fileList[0].originFileObj) {
        const hex = await uploadArtwork(info.fileList[0].originFileObj);
        if (hex)uploadImage(hex);
        info.fileList.splice(0, 1);
      }
    }
  };
  return (
    <Upload {...props}>
      <Button>Upload png only</Button>
    </Upload>
  );
};

export default Uploader;
