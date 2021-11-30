import fs from 'fs';
import command from './commander.js';
import { BeamApi } from './beam-api.js';
import { startGeneral } from './uploader.js';

const folder = 'src/files/';
const beam = new BeamApi();
command(beam);
const list = fs.readdirSync('src/files/');

startGeneral(folder, list, beam);
