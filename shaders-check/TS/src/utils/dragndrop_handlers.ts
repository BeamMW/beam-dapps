import { BeamApiParams } from 'beamApiProps';
import {
  APIMethods, InnerTexts, ReqIds, ShaderProps
} from '../constants/variables';

type DropHandlerProps = {
  e: DragEvent;
  span: HTMLElement;
  initShader: (shader: ArrayBuffer) => void,
  callApi: (callid: string, method: string, params: BeamApiParams) => void
};

export const dragoverHandler = (e:DragEvent):boolean => {
  e.preventDefault();
  const target = e.target as Element;
  target.classList.add('hover');
  return false;
};

export const dragleaveHandler = (e:DragEvent):boolean => {
  e.preventDefault();
  const target = e.target as Element;
  target.classList.remove('hover');
  return false;
};

export const dropHandler = async (
  {
    e, initShader, callApi, span
  }:DropHandlerProps
):Promise<void | false> => {
  e.preventDefault();
  const target = e.target as Element;
  target.classList.remove('hover');
  target.classList.add('drop');
  const uploadDragFiles = e.dataTransfer?.files as FileList;
  const files = await uploadDragFiles[0]?.arrayBuffer() as ArrayBuffer;
  initShader(files);
  callApi(ReqIds.FORM_GENERATOR, APIMethods.INVOKE_CONTRACT, {
    create_tx: false
  });
  if (uploadDragFiles[0]
    && uploadDragFiles[0].size > ShaderProps.MAX_FILE_SIZE) {
    span.textContent = InnerTexts.DROP_SIZE_ERROR_TXT;
    target.classList.add('error');
    return false;
  } span.textContent = uploadDragFiles[0]?.name as string;
  return undefined;
};
