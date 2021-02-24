import { Button, message, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState, useContext } from 'react';
import FormStatusIndicator from './form-status-indicator';
import { ServerStatusContext } from '../../utils/server-status-context';
import {
  postConfigUpdateToAPI,
  RESET_TIMEOUT,
  TEXTFIELD_PROPS_LOGO,
} from '../../utils/config-constants';
import {
  createInputStatus,
  StatusState,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../utils/input-statuses';

function getBase64(img: File | Blob, callback: (imageUrl: string | ArrayBuffer) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default function EditLogo() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const serverStatusData = useContext(ServerStatusContext);
  const { setFieldInConfigState, serverConfig } = serverStatusData || {};
  const currentLogo = serverConfig?.instanceDetails?.logo;

  const [submitStatus, setSubmitStatus] = useState<StatusState>(null);
  let resetTimer = null;

  const { apiPath, tip } = TEXTFIELD_PROPS_LOGO;

  const beforeUpload = (file) => {
    // TODO: File validation, cropping?
    return true;
  };

  const handleLogoChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setLogoUrl(imageUrl);
        setLoading(false);
      });

      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
    }
  };

  // Clear out any validation states and messaging
  const resetStates = () => {
    setSubmitStatus(null);
    clearTimeout(resetTimer);
    resetTimer = null;
  };

  // Post new logoUrl to api
  const handleLogoUpdate = async () => {
    if (logoUrl !== currentLogo) {
      setSubmitStatus(createInputStatus(STATUS_PROCESSING));

      await postConfigUpdateToAPI({
        apiPath,
        data: { value: logoUrl },
        onSuccess: () => {
          setFieldInConfigState({ fieldName: 'logo', value: logoUrl, path: '' });
          setSubmitStatus(createInputStatus(STATUS_SUCCESS));
        },
        onError: (msg: string) => {
          setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${msg}`));
        },
      });
      resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
    }
  };

  return (
    <div className="formfield-container logo-upload-container">
      <div className="label-side">
        <span className="formfield-label">Logo</span>
      </div>

      <div className="input-side">
        <div className="input-group">
          <img src={logoUrl || currentLogo || '/logo'} alt="avatar" className="logo-preview" />
          <Upload
            name="logo"
            listType="picture"
            className="avatar-uploader"
            showUploadList={false}
            // action="http://localhost:5000/tmp" TODO: set this to new Owncast logoUpload endpoint
            beforeUpload={beforeUpload}
            onChange={handleLogoChange}
          >
            {loading ? <LoadingOutlined /> : <Button icon={<UploadOutlined />} />}
          </Upload>
          <Button
            type="primary"
            size="small"
            className="submit-button"
            onClick={handleLogoUpdate}
            disabled={!logoUrl || logoUrl === currentLogo}
          >
            Update
          </Button>
        </div>
        <FormStatusIndicator status={submitStatus} />
        <p className="field-tip">{tip}</p>
      </div>
    </div>
  );
}
