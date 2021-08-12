import { Form } from './components/form.component.js'

export const formGenerator = (obj, shader) => {
	const inputContainer = document.querySelector('.input__place');
	inputContainer.innerHTML = '';
	const form = new Form (obj, shader);
	inputContainer.append(form.element);
}
