import { Tags } from '../../constants/html_tags';
import { Menu_btn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';

export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu', 'active']);
    for (var key in Menu_btn) {
      const btn_key = new Button();
      btn_key.element.classList.add(`btn_${key}`);
      btn_key.element.setAttribute('value', key);
      this.append(btn_key);
      btn_key.element.addEventListener('click', () => {
        this.element.classList.remove('active');
      });
    }
  }
}

// newGame && newGame.addEventListener( 'click',()=>{
//     console.log('fdfdf')
// })
