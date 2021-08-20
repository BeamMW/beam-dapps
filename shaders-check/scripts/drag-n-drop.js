import Utils from './utils.js';

export const init = (callback) => {
	const dropZone = document.querySelector('.chooseWasm__label');
	const dropZoneText = document.querySelector('.chooseWasm__text');
	const inputFiles = document.querySelector('.chooseWasm__input');
	const maxFileSize = 5000000;

	dropZone.ondragover = function () {
		this.classList.add('hover');
		return false;
	};
	dropZone.ondragleave = function () {
		this.classList.remove('hover');
		return false;
	};
	dropZone.addEventListener('drop', async function (e) {
		window.beam.apiResult$.subscribe(shader.onApiResult);
		// event - file droped 
		e.preventDefault();
		this.classList.remove('hover');
		this.classList.add('drop');
		const uploadDragFiles = e.dataTransfer.files;
		const files = await uploadDragFiles[0].arrayBuffer();
		callback(files);
		setInfo(files, uploadDragFiles)
	});
	inputFiles.addEventListener('change', async (e) => {
		e.preventDefault()
		const uploadDragFiles = e.path[0].files;
		const files = await uploadDragFiles[0].arrayBuffer();
		callback(files);
		setInfo(files, uploadDragFiles)
		// callback(files);
	})

	function setInfo(byte, shader){
		Utils.callApi('form-generator', 'invoke_contract', {
			contract: Array.from(new Uint8Array(byte)),
			create_tx: false
		});
		Utils.callApi('manager-view', 'invoke_contract', {
			contract: Array.from(new Uint8Array(byte)),
			create_tx: false,
			args: 'role=manager,action=view',
		});
		if (shader[0].size > maxFileSize) {
			dropZoneText.textContent = 'Размер превышает допустимое значение!';
			this.addClass('error');
			return false;
		} else 
		{dropZoneText.textContent = shader[0].name;
		Utils.setText('name__contract', shader[0].name.slice(0, -5))
		Utils.setText('lastModified__contract', shader[0].lastModified)
		Utils.setText('size__contract', shader[0].size)
		}
	}
};
