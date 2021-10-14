import { RC } from '../logic/beam/request_creators';
import { InnerTexts } from '../constants/html_elements';
import { ShaderProps } from '../constants/variables';
import { BEAM } from '../controllers/beam.controller';

export const dragoverHandler = (e: DragEvent): void => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.formUpload');
  target?.classList.add('hover');
};

export const dragleaveHandler = (e: DragEvent): void => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.formUpload');
  target?.classList.remove('hover');
};

export const inputHandler = async (
  e:any,
  span: HTMLElement
): Promise<void> => {
  e.preventDefault();
  const target = (<Element>e.target).closest('.upload');
  target?.classList.remove('active');
  target?.classList.add('drop');
  console.dir(e.path[0]);
  const uploadDragFiles = <FileList> e instanceof DragEvent
    ? e.dataTransfer?.files
    : e.path[0].files;
  const files = (await uploadDragFiles[0]?.arrayBuffer()) as ArrayBuffer;
  BEAM.callApi(RC.createForm(files));
  if (
    uploadDragFiles[0]
    && uploadDragFiles[0].size > ShaderProps.MAX_FILE_SIZE
  ) {
    span.textContent = InnerTexts.DROP_SIZE_ERROR_TXT;
    target?.classList.add('error');
  } else {
    target?.classList.remove('active');
    span.textContent = uploadDragFiles[0]?.name as string;
  }
};
