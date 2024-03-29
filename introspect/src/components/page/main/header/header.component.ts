import {
  BaseComponent, DropButton, Button, FlexContainer, HeaderInfo
} from '@components/shared';
import { Tags } from '@constants/html-elements';
import { AC } from '@logic/action-creators';
import { STORE } from '@logic/controllers';
import './header.scss';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const headerDrop = new DropButton({
      mainSelector: 'header__app',
      labelSelector: 'header__app-label'
    });
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
    const infoFlex = new FlexContainer(headerDrop, new HeaderInfo());
    const btnFlex = new FlexContainer(btn);
    infoFlex.classList.add('header-information');
    this.append(infoFlex, btnFlex);
  }
}
