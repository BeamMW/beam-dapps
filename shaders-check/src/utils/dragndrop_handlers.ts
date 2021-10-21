export const dragoverHandler = (e: Event): void => {
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
};
