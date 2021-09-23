import { WinArgsType } from 'ComponentProps';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import './win.scss';

export class Win extends BaseComponent {
  constructor(props: WinArgsType) {
    super(Tags.DIV, ['winner']);
    this.initWinnerPopUp(props);
  }

  initWinnerPopUp = (props: WinArgsType):void => {
    const { verdict } = props;
    const entries = Object.entries(props);
    const domNodes = entries.map((prop) => {
      const wrapper = new BaseComponent(Tags.DIV);
      const title = new BaseComponent(Tags.SPAN);
      const value = new BaseComponent(Tags.SPAN);
      title.innerHTML = `${prop[0]}: `;
      value.innerHTML = `${prop[1]}`;
      wrapper.append(title, value);
      return wrapper;
    });
    this.removeAll();
    const winLabel = new BaseComponent(Tags.H1, ['winLabel']);
    winLabel.innerHTML = verdict === 'WIN' ? 'You WON' : 'You LOSE';
    winLabel.style.color = verdict === 'WIN' ? '#80ffdb' : '#80ffdb';
    this.append(winLabel, ...domNodes);
  };
}
