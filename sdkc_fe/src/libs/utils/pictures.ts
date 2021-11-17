export const hexEncodeU8A = (arr:Uint8Array) => arr
  .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const hexDecodeU8A = (str:string) => new Uint8Array(
  str.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) as number[]
);

export const uploadArtwork = (file: any): string | void => {
  let name = file[0].name.split('.')[0];
  name = [name[0].toUpperCase(), name.substring(1)].join('');

  try {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const aver = Uint8Array.from([1]);
      const aname = new TextEncoder().encode(name);
      const asep = Uint8Array.from([0, 0]);
      const aimg = new Uint8Array(reader.result as ArrayBuffer);
      const hex = [
        hexEncodeU8A(aver),
        hexEncodeU8A(aname),
        hexEncodeU8A(asep),
        hexEncodeU8A(aimg)
      ].join('');
      return hex;
    };
  } catch (err) {
    console.error(err);
  }
};

export default {
  hexEncodeU8A,
  hexDecodeU8A,
  uploadArtwork
};
