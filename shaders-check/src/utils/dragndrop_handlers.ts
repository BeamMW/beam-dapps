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
  e:any, callback: (files: ArrayBuffer, fileName: string) => void
): Promise<void> => {
  e.preventDefault();
  const uploadDragFiles = <FileList> e instanceof DragEvent
    ? e.dataTransfer?.files
    : e.path[0].files;
  const files = (await uploadDragFiles[0]?.arrayBuffer()) as ArrayBuffer;
  callback(files, uploadDragFiles[0]?.name as string);
  // if (
  //   uploadDragFiles[0]
  //   && uploadDragFiles[0].size > ShaderProps.MAX_FILE_SIZE
  // ) {
  //   span.textContent = InnerTexts.DROP_SIZE_ERROR_TXT;
  //   target?.classList.add('error');
  // } else {
  //   target?.classList.remove('active');
  //   span.textContent = uploadDragFiles[0]?.name as string;
  // }
};
