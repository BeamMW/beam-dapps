import program from 'commander';

export default (beam) => {
  program
  .option('-a, --api <string>', 'set api link', '')
  .option('-c, --cid <string>', 'set cid', '')
  .option('-s, --shader [file]', 'wasm file', '')
	
program.parse(process.argv);
const options = program.opts();
const { api, cid, shader } = options;

if (api) {
  beam.api = api;
}
if (cid) {
  beam.cid = cid;
}
if (shader) {
	beam.wasm = shader;
}
}