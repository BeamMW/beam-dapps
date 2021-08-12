import { BaseComponent } from './base.component.js';
import { Role } from './methods/role-radio.component.js';
import { Value } from './methods/action.component.js';
import { Params } from './methods/params.component.js';
import { Submit } from './methods/submit.component.js';
import Utils from '../utils.js';

const SET_ROLE = 'SET_ROLE';
const SET_ACTION = 'SET_ACTION';

export const setRoleAC = payload => ({ action: SET_ROLE, payload });
export const setActionAC = payload => ({ action: SET_ACTION, payload });

export class Form extends BaseComponent {
	constructor(obj, shader) {
		super('form', ['form']);
		this.obj = obj;
    this.shader = shader;
		this.observers = [];
		const roles = Object.entries(this.obj.roles);
		const actions = Object.keys(roles[0][1]);
		this.currentRole = roles[0][0];
		this.currentAction = actions[0];
		this.role = new Role(this.obj, this.dispatch, this.addObserver);
		this.action = new Value(
			this.obj,
			this.currentRole,
      this.currentAction,
			this.dispatch,
			this.addObserver
		);
		this.params = new Params(
			this.obj,
			this.currentRole,
			this.currentAction,
			this.addObserver
		);
		const actionParamsWrapper = new BaseComponent('div', ['action-params']);
		actionParamsWrapper.append(this.action, this.params);
    this.submit = new Submit();
		this.append(this.submit, this.role, actionParamsWrapper);
    this.element.addEventListener('submit', this.onSubmit);
	}

	addObserver = element => this.observers.push(element);

	notifyAll = () => this.observers.forEach(subs => subs.inform(this));

	dispatch = obj => {
		this.reducer(obj);
	};

	reducer = obj => {
		const action = obj.action;
		switch (action) {
			case SET_ROLE:
				this.currentRole = obj.payload;
        this.currentAction = Object.keys(this.obj.roles[this.currentRole])[0];
				break;
			case SET_ACTION:
				this.currentAction = obj.payload;
				break;
			default:
				break;
		}
		this.notifyAll();
	};

  onSubmit = e => {
    e.preventDefault();
    const args = [];
		Utils.getById('output__place').innerHTML = 'loading...'
    Array.prototype.find.call(
      this.role.element.querySelectorAll('.roles__input'),
      el => el.checked && args.push(`role=${el.id}`)
    );
    Array.prototype.find.call(
      this.action.element.querySelectorAll('.method__input'),
      el => el.checked && args.push(`action=${el.id}`)
    );
    Array.prototype.forEach.call(
      this.params.element.querySelectorAll('.params__input'),
      el => el.value.length && args.push(`${el.id}=${el.value}`)
    );
    Utils.callApi('allMethods-view', 'invoke_contract', {
      create_tx: false,
      contract:  Array.from(new Uint8Array(this.shader)),
      args: args.join(','),
    });
  };
}
