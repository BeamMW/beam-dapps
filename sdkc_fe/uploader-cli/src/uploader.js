import fs from 'fs';
import { RC } from './request-creator.js';
import { uploadArtwork } from './picture.js';

export const txHandler = (beam, txid, resolve) => {
  setTimeout(async () => {
    const res = await beam
      .callApi(RC.checkTxStatus(txid))
      .catch(error => console.log(error));
			if (res.error) {
        process.stderr.write(`Tx status error: ${res.error.data}\n`);
        return txHandler(beam, txid, resolve);
      }
      if (res.result?.status_string) {
      switch (res.result.status_string) {
				case 'completed':
					process.stderr.write(`${txid} completed\n`);			
					return resolve(res.result.status_string || res);
				case 'in progress':
					process.stderr.write(`${txid} in progress\n`);
					return txHandler(beam, txid, resolve);
				default:
					throw new Error(`${txid} failed`);
			}
		}
	
    if (res.result?.status_string === 'in progress') {
      process.stderr.write(`${txid} ${res.result?.status_string}\n`);
      txHandler(beam, txid, resolve);
    } else {
      if (res.result?.status_string === 'failed') {
        throw new Error(`${txid} failed`);
			}
      else if (res.error) {
        process.stderr.write(`Tx status error: ${res.error.data}\n`);
        txHandler(beam, txid, resolve);
      } else resolve(res.result?.status_string || res);
    }
  }, 5000);
};

export const upload = async (beam, hex) => {
  const params = await beam
    .callApi(RC.getMyPKey())
    .catch(error => console.log(error));

  const { key } = JSON.parse(params.result.output);
  const upload = await beam
    .callApi(RC.uploadFile(key, hex))
    .catch(error => console.log(error));

  const { txid } = upload.result;
  return new Promise(resolve => txHandler(beam, txid, resolve));
};

export const startUploading = (folder, list, beam) => {
  const fileName = list.shift();
  const bytes = fs.readFileSync(`${folder}${fileName}`);
  const hex = uploadArtwork({ fileName, bytes });

  upload(beam, hex).then(() => {
    process.stderr.write(`${list.length} files left to upload\n`);
    if (list.length) startUploading(folder, list, beam);
    else console.log('all files uploaded');
  });
};

export const startAsyncUploading = (folder, list, beam) => {
  list.forEach(fileName => {
    const bytes = fs.readFileSync(`${folder}${fileName}`);
    const hex = uploadArtwork({ fileName, bytes });
    upload(beam, hex).then(data => {
      console.log(data);
    });
  });
};

export const startGeneral = (folder, list, beam) => {
  try {
    startUploading(folder, list, beam);
  } catch (error) {
    process.stderr.write(error.message);
    process.exit(1);
  }
};
