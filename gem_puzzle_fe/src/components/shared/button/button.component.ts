import { MenuButtonType } from 'ComponentProps';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import './button.scss';

export default class Button extends BaseComponent {
  value = false;

  titleDOM = new BaseComponent(Tags.DIV, ['titleDOM']);

  constructor({
    key, title, icon, handler
  }: MenuButtonType) {
    super(Tags.DIV, ['button', `btn_${key}`]);

    const titleDOMText = new BaseComponent(Tags.SPAN);
    const args: (BaseComponent | HTMLElement)[] = [titleDOMText];
    if (icon) {
      const iconDOM = new BaseComponent(Tags.IMG);
      iconDOM.setAttributes({
        src: icon
      });
      args.unshift(iconDOM);
    }
    titleDOMText.innerHTML = title;
    if (handler) {
      this.element.addEventListener('click', () => {
        handler();
      });
    }
    this.setAttributes({
      type: 'button'
    });
    this.titleDOM.append(...args);
    this.append(this.titleDOM);
  }

  public set setDisplay(value: boolean) {
    if (value !== this.value) {
      this.value = value;
      if (value) {
        this.style.display = 'block';
        this.element.animate(
          [
            {
              height: 0,
              opacity: 0,
              marginBottom: '0'
            },
            {
              height: '60px',
              opacity: 0,
              marginBottom: '10px'
            }
          ],
          {
            duration: 180
          }
        ).onfinish = () => {
          this.style.height = '60px';
          this.style.marginBottom = '10px';
          this.element.animate(
            [
              {
                opacity: 0
              },
              {
                opacity: 1
              }
            ],
            {
              duration: 180
            }
          );
        };
      } else if (!value) {
        this.element.animate(
          [
            {
              height: '60px',
              opacity: 0,
              marginBottom: '10px'
            },
            {
              height: '0px',
              opacity: 0,
              marginBottom: '0'
            }
          ],
          {
            duration: 180
          }
        ).onfinish = () => {
          this.style.height = '0';
          this.style.display = 'none';
          this.style.marginBottom = '0';
        };
      }
    }
  }
}
