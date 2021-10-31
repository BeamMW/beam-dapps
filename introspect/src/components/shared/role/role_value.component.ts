import { IOutput } from 'beamApiProps';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import './role.scss';
import { RoleLabel } from './role_label.component';
import { STORE } from '../../../controllers/store.controller';
import { AC } from '../../../logic/store/action-creators';
import { Button } from '../button/button.component';

export class Role extends BaseComponent {
  constructor(obj: IOutput) {
    super(Tags.DIV, ['roles']);
    if (obj.roles) {
      const roles = Object.entries(obj.roles);
      roles.forEach((el, i) => {
        this.append(new RoleLabel(el, i));
      });
    }
    const btn = new Button({
      name: 'Set Cid',
      action: 'cid-setter',
      classes: (action:string) => [action]
    });
    btn.element.addEventListener('click', () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText) {
        STORE.dispatch(AC.setDefaultCid(selectedText));
      }
    });
    this.append(btn);
  }
}
