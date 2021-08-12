import { BaseComponent } from '../base.component.js';

export class Submit extends BaseComponent {
	constructor() {
		super('input', ['submit']);
		this.element.value = 'Send Request';
		this.element.setAttribute('type', 'submit');
	}
}
