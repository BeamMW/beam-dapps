import { BaseComponent } from '../base.component.js';
import { setActionAC } from '../form.component.js'

export class ValueInput extends BaseComponent {
	constructor(action, currentAction, dispatch) {
		super('input', ['method__input']);
		this.element.id = action[0];
		this.element.checked = currentAction === action[0];
		this.element.setAttribute('type', 'radio');
		this.element.setAttribute('name', 'method');
    this.element.addEventListener('change', (e) => {
      if (e.target.checked){
        dispatch(setActionAC(this.element.id));
      }
    })
	}
}

export class ValueLabel extends BaseComponent {
	constructor(action, dispatch, index) {
		super('label', ['method__label', 'custom-radio']);
		this.input = new ValueInput(action, dispatch, index);
		const span = new BaseComponent('span', '');
		span.element.innerText = action[0];
		this.element.setAttribute('for', action[0]);
		this.append(this.input, span);
	}
}

export class Value extends BaseComponent {
	constructor(obj, role, action, dispatch, observe) {
		super('div', ['input__action-radio']);
		observe(this);
		this.role = role;
    this.action = action;
		this.render(obj, dispatch);
	}

	inform = obj => {
			this.role = obj.currentRole;
      this.action = obj.currentAction;
      this.render(obj.obj, obj.dispatch);
	};
	
	render = (obj, dispatch) => {
		this.element.innerHTML = '';
		const title = new BaseComponent('div', ['action-title']);
		title.element.innerText = 'Action: ';
		const actions = Object.entries(obj.roles[this.role]);
		const valuesList = actions.map((el) => new ValueLabel(el, this.action, dispatch));
		this.append(title, ...valuesList);
	};
}
