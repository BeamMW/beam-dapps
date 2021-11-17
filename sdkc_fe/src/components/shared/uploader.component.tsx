import { message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { uploadArtwork } from '@libs/utils';

type UploaderProps = {
  uploadImage: (hex: string) => void
};

const Uploader = ({ uploadImage }: UploaderProps) => {
  const props = {
    beforeUpload: (file:RcFile) => {
      if (file.type !== 'image/png') {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    },
    onChange: (info:UploadChangeParam) => {
      const hex = uploadArtwork(info.fileList);
      console.log(hex);
      if (hex) uploadImage(hex);
    }
  };
  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload png only</Button>
    </Upload>
  );
};

export default Uploader;
