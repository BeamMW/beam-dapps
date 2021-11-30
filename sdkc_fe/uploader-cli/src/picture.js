export const hexEncodeU8A = (arr) => arr
  .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const uploadArtwork = ({fileName, bytes}) =>{
    const name = fileName.split('.')[0];
      const aver = Uint8Array.from([1]);
      const aname = new TextEncoder().encode(name);
      const asep = Uint8Array.from([0, 0]);
      const aimg = new Uint8Array(bytes);
      const hex = [
        hexEncodeU8A(aver),
        hexEncodeU8A(aname),
        hexEncodeU8A(asep),
        hexEncodeU8A(aimg),
      ].join('');
      return hex;
		}