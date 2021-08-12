import { BaseComponent } from '../base.component.js';

export class ParamsInput extends BaseComponent {
	constructor(param) {
		super('input', ['params__input']);
		this.element.id = param[0];
		this.element.placeholder = param[0];
	}
}

export class ParamsLabel extends BaseComponent {
	constructor(role, dispatch, index) {
		super('label', ['params__label']);
		this.input = new ParamsInput(role, dispatch, index);
		this.element.setAttribute('for', role[0]);
		this.append(this.input);
	}
}

export class Params extends BaseComponent {
	constructor(obj, role, action, observer) {
		super('div', ['input__params']);
		observer(this);
		this.role = role;
		this.action = action;
		this.render(obj);
	}
	inform = obj => {
		this.role = obj.currentRole;
		this.action = obj.currentAction;
		this.render(obj.obj, obj.dispatch);
	};
	render = obj => {
		this.element.innerHTML = '';
		const title = new BaseComponent('div', ['params-title']);
		title.element.innerText = 'Params: ';
		const actions = Object.entries(obj.roles[this.role][this.action]);
		const valuesList = actions.map((el, i) => new ParamsLabel(el, i));
		if (valuesList.length) this.append(title, ...valuesList);
	};
}
