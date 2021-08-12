import { BaseComponent } from '../base.component.js';
import { setRoleAC } from '../form.component.js';

export class RoleInput extends BaseComponent {
	constructor(role, dispatch, index) {
		super('input', ['roles__input']);
		this.element.id = role[0];
		this.element.checked = !index;
		this.element.setAttribute('type', 'radio');
		this.element.setAttribute('name', 'role');
		this.element.addEventListener('change', e => {
			if (e.target.checked) {
				dispatch(setRoleAC(this.element.id));
			}
		});
	}
}

export class RoleLabel extends BaseComponent {
	constructor(role, dispatch, index) {
		super('label', ['roles__label', 'custom-radio']);
		this.input = new RoleInput(role, dispatch, index);
		const span = new BaseComponent('span', '');
		span.element.innerText = role[0];
		this.element.setAttribute('for', role[0]);
		this.append(this.input, span);
	}
}

export class Role extends BaseComponent {
	constructor(obj, dispatch) {
		super('div', ['input__role']);
		this.element.innerText = 'Role: ';
		const roles = Object.entries(obj.roles);
		roles.forEach((el, i) => {
			this.element.appendChild(new RoleLabel(el, dispatch, i).element);
		});
	}
}
