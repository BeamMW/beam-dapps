import { InnerTexts } from '../constants/html_elements';
import {
  APIMethods,
  ReqID,
  ShaderProps
} from '../constants/variables';
import { ApiHandler } from './api_handlers';

export const dragoverHandler = (e:DragEvent):void => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.chooseWasm__label');
  target?.classList.add('hover');
};

export const dragleaveHandler = (e:DragEvent):void => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.chooseWasm__label');
  target?.classList.remove('hover');
};

export const dropHandler = async (
  e: DragEvent, span:HTMLElement
):Promise<void> => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.chooseWasm__label');
  target?.classList.remove('hover');
  target?.classList.add('drop');
  const uploadDragFiles = e.dataTransfer?.files as FileList;
  const files = await uploadDragFiles[0]?.arrayBuffer() as ArrayBuffer;
  ApiHandler.initShader(files);
  ApiHandler.callApi(ReqID.FORM_GENERATOR, APIMethods.INVOKE_CONTRACT, {
    create_tx: false
  });
  if (uploadDragFiles[0]
    && uploadDragFiles[0].size > ShaderProps.MAX_FILE_SIZE) {
    span.textContent = InnerTexts.DROP_SIZE_ERROR_TXT;
    target?.classList.add('error');
  } span.textContent = uploadDragFiles[0]?.name as string;
};
