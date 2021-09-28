import { MenuButtonType } from 'ComponentProps';
import { Tags } from '../../../constants/tags';
import BaseComponent from '../../base/base.component';
import './button.scss';
import { toDOMParser } from '../../../utils/string_handlers';
import { buttonFromMenu } from '../../../constants/svg.icons';

export default class Button extends BaseComponent {
  value = false;

  titleDOM = new BaseComponent(Tags.DIV, ['titleDOM']);

  constructor({
    key, title, icon, handler
  }: MenuButtonType) {
    super(Tags.DIV, ['button', `btn_${key}`]);
    const bgSVG = toDOMParser(buttonFromMenu(key));
    bgSVG.classList.add('bgSvg');
    const titleDOMText = new BaseComponent(Tags.SPAN);
    const args: (BaseComponent | HTMLElement)[] = [titleDOMText];
    if (icon) {
      const iconDOM = toDOMParser(icon);
      args.unshift(iconDOM);
    }
    titleDOMText.innerHTML = title;
    this.element.addEventListener('click', () => {
      handler();
    });
    this.setAttributes({
      type: 'button'
    });
    this.titleDOM.append(...args);
    this.append(bgSVG, this.titleDOM);
  }

  public set setDisplay(value: boolean) {
    // this.style.display = value ? 'block' : '';
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
          ).onfinish = () => {
            this.style.opacity = '1';
          };
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
          this.style.opacity = '0';
        };
      }
    }
  }
}
