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
		// event - file droped 
		e.preventDefault();
		this.classList.remove('hover');
		this.classList.add('drop');
		const uploadDragFiles = e.dataTransfer.files;
		const files = await uploadDragFiles[0].arrayBuffer();
		callback(files);
		Utils.callApi('form-generator', 'invoke_contract', {
			contract: Array.from(new Uint8Array(files)),
			create_tx: false
		});
		Utils.callApi('manager-view', 'invoke_contract', {
							contract: Array.from(new Uint8Array(files)),
							create_tx: false,
							args: 'role=manager,action=view',
						});

		if (uploadDragFiles[0].size > maxFileSize) {
			dropZoneText.textContent = 'Размер превышает допустимое значение!';
			this.addClass('error');
			return false;
		} else 
		{dropZoneText.textContent = uploadDragFiles[0].name;
		Utils.setText('name__contract', `${uploadDragFiles[0].name.slice(0, -5)}`)
		Utils.setText('lastModified__contract', `${uploadDragFiles[0].lastModified}`)
		// Utils.setText('lastModifiedDate', `${uploadDragFiles[0].lastModifiedDate}`)
		Utils.setText('size__contract', `${uploadDragFiles[0].size}`)
		}
	});
	inputFiles.addEventListener('change', async (e) => {
		e.preventDefault()
		const uploadDragFiles = e.path[0].files;
		const files = await uploadDragFiles[0].arrayBuffer();
		callback(files);
		Utils.callApi('form-generator', 'invoke_contract', {
			contract: Array.from(new Uint8Array(files)),
			create_tx: false
		});
		Utils.callApi('manager-view', 'invoke_contract', {
			contract: Array.from(new Uint8Array(files)),
			create_tx: false,
			args: 'role=manager,action=view',
		});
		if (uploadDragFiles[0].size > maxFileSize) {
			dropZoneText.textContent = 'Размер превышает допустимое значение!';
			this.addClass('error');
			return false;
		} else 
		{dropZoneText.textContent = uploadDragFiles[0].name;
		Utils.setText('name__contract', `${uploadDragFiles[0].name.slice(0, -5)}`)
		Utils.setText('lastModified__contract', `${uploadDragFiles[0].lastModified}`)
		Utils.setText('size__contract', `${uploadDragFiles[0].size}`)
		}
		// callback(files);
	})
};
