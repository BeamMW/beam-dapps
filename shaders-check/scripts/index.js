import Utils from './utils.js';
import { formGenerator } from './form-generator.js';
import { init } from './drag-n-drop.js';
import { errorInfo } from './error-form-generate.js';
const CONTRACT_ID =
	'50ab294a5ff6cedcfd74860898faf3f00967b9f1296c94f19dec24f2ab55595f';
const REJECTED_CALL_ID = -32021;
let array = [];
let classArray = [];
let count = [];

const isJson = str => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

const getStruct = (l, prevKey) => {
	const btnClasses = [];
	let item = '';
	count.push(0);
	for (let key in l) {
		const data = isJson(l[key]) ? JSON.parse(l[key]) : l[key];
		item +=
			typeof data !== 'object'
				? `
        <li><span class='key'>${key}:</span>${data}</li>
        `
				: `
        <li>
          <span class='key'>
            ${key}: </span> <span class='type'>${
						Array.isArray(data)
							? '[...]'
							: typeof data === 'object'
							? '{...}'
							: ''
				  }
          </span>
          <button class="btn-${key}${prevKey}">+</button>
          <ul class="list ul-${key}${prevKey}">${getStruct(data, key).item}</ul>
        </li>
            `;
		if (typeof data === 'object') {
			classArray.push(`${key}${prevKey}`);
		}
	}
	return { item, btnClasses };
};

class Shader {
	constructor() {
		this.timeout = undefined;
		this.pluginData = {
			contractId: undefined,
			bytes: null,
			name: null,
		};
	}

	depthCallback = bytes => {
		this.pluginData.bytes = bytes;
	};
	// `./${Utils.getById('chooseWasm').files[0].name}`
	// start = () => {
	// 	Utils.download(
	// 		`./${Utils.getById('chooseWasm').files[0].name}`,
	// 		(err, bytes, connectStatus) => {
	// 			if (err) {
	// 				let errTemplate = 'Failed to load shader,';
	// 				let errMsg = [errTemplate, err].join(' ');
	// 				Utils.setText('connectStatus', errMsg);
	// 				return console.log(errMsg);
	// 			}
	// 			Utils.setText('connectStatus', connectStatus);
	// 			Utils.setText(
	// 				'contractName',
	// 				`${Utils.getById('chooseWasm').files[0].name.slice(0, -5)}`
	// 			);

	// 			array = bytes;
	// 			this.pluginData.bytes = bytes;

	// 			Utils.callApi('manager-view', 'invoke_contract', {
	// 				contract: bytes,
	// 				create_tx: false,
	// 				args: 'role=manager,action=view',
	// 			});
	// 		}
	// 	);
	// };
	parseShaderResult = apiResult => {
		if (typeof apiResult.output != 'string') {
			throw 'Empty shader response';
		}
		let shaderOut = JSON.parse(apiResult.output);
		if (shaderOut.error) {
			throw ['Shader error: ', shaderOut.error].join('');
		}
		return shaderOut;
	};

	onApiResult = json => {
		try {
			console.log(json);
			const apiAnswer = JSON.parse(json);
			console.log(apiAnswer);
			if (apiAnswer.error) {
				if (apiAnswer.error.code == REJECTED_CALL_ID) {
					return;
				}
				throw apiAnswer.error;
			}

			const apiCallId = apiAnswer.id;
			const apiResult = apiAnswer.result;

			if (!apiResult) {
				throw 'Failed to call wallet API';
			}

			if (apiCallId == 'manager-view') {
				let shaderOut = this.parseShaderResult(apiResult);
							this.pluginData.contractId = shaderOut.contracts[0].cid;
							Utils.setText('contractId__contract', `${this.pluginData.contractId}`);
				if (!this.pluginData.contractId) {
					throw 'Failed to verify contract cid';
				}
				Utils.callApi('manager-params', 'invoke_contract', {
					create_tx: false,
					args: [
						'role=manager,action=view_params,cid=',
						this.pluginData.contractId,
					].join(''),
				});
				return;
			}

			if (apiCallId == 'form-generator') {
				let shaderOut = this.parseShaderResult(apiResult);
				Utils.getById('output__place').innerHTML = '';
				formGenerator(shaderOut, this.pluginData.bytes);
			}

			if (apiCallId == 'allMethods-view') {
				this.parseShaderResult(apiResult);
				classArray = [];
				const restruct = getStruct(apiResult, 'data');
				Utils.getById(
					'output__place'
				).innerHTML = `<ul class="list">${restruct.item}</ul>`;
				classArray.forEach(el => {
					const current = document.querySelector(`.btn-${el}`);
					if (current) {
						current.addEventListener('click', e => {
							e.target.innerHTML = e.target.innerHTML === '+' ? '-' : '+';
							const ul = document.querySelector(`.ul-${el}`);
							ul.classList.toggle('visible');
						});
					}
				});
			}
			Utils.setText('status__contract', 'OK');
			errorInfo(apiAnswer.error)
		} catch (err) {
			Utils.setText('status__contract', 'Error');
			errorInfo(err);
			return;
		}
	};
}

window.addEventListener('load', () => {
    if (window.beam !== undefined) {   
	let shader = new Shader();
		// window.beam.initializeShader(CONTRACT_ID, 'faucet');
		window.beam.apiResult$.subscribe(shader.onApiResult);
		console.log(window.beam.initializeShader)
        document.body.style.color = 'rgb(255, 255, 255)';
        document.body.style.backgroundImage = 'linear-gradient(rgba(57, 57, 57, 0.6) -174px, rgba(23, 23, 23, 0.6) 56px, rgba(23, 23, 23, 0.6))';  
        document.body.style.backgroundColor = 'rgb(50, 50, 50)';  
        // document.querySelector('.container').style.margin = '0 auto';
        // document.querySelector('.container').style.paddingTop = '25px';
        // document.querySelector('.container').style.width = '90%';
        
	init(shader.depthCallback);

    } else {
Utils.onLoad(async beamAPI2 => {
	let shader = new Shader();
	beamAPI2.api.callWalletApiResult.connect(shader.onApiResult);

	init(shader.depthCallback);
})
	}
	// window.beam.initializeShader(CONTRACT_ID, 'faucet');
	// window.beam.apiResult$.subscribe(shader.onApiResult);

	// Utils.getById('btn').addEventListener('click', e => {
	// 	shader.start();
	// 	e.preventDefault();
	// });

	// Utils.getById('chooseWasm').addEventListener('change', async e => {
	// 	const files = await e.target.files[0].arrayBuffer();
	// 	let byteArray = new Uint8Array(files);
	// 	let array = Array.from(byteArray);
	// 	Utils.callApi('allMethods-view', 'invoke_contract', {
	// 		contract: array,
	// 		create_tx: false,
	// 	});
	// });

	// Utils.getById('btnGetMethod').addEventListener('click', e => {
	// 	Utils.callApi('allMethods-view', 'invoke_contract', {
	// 		contract: array,
	// 		create_tx: false,
	// 	});
	// 	e.preventDefault();
	// });
});
