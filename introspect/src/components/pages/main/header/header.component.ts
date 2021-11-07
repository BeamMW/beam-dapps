import { Tags } from '../../../../constants/html_elements';
import { STORE } from '../../../../controllers';
import { AC } from '../../../../logic/store/action-creators';
import {
  BaseComponent, Button, DropButton, FlexContainer, HeaderInfo
} from '../../../shared';
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
    // const utxo = new Button({
    //   name: 'utxo',
    //   action: 'cid-setter',
    //   classes: (action:string) => [action]
    // });
    // utxo.element.addEventListener('click', () => {
    //   BEAM.callApi(RC.getUtxo());
    // });
    const infoFlex = new FlexContainer(headerDrop, new HeaderInfo());
    const btnFlex = new FlexContainer(btn);
    infoFlex.classList.add('header-information');
    this.append(infoFlex, btnFlex);
  }
}
