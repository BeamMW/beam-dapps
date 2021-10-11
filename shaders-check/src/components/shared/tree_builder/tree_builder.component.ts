import { ResponseResultType } from 'beamApiProps';
import { Tags, TreeIcons } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';

export class TreeBuilder extends BaseComponent {
  constructor(result:ResponseResultType) {
    super(Tags.UL, ['data', 'list']);
    this.getStruct(result);
  }

  getStruct = (result:ResponseResultType):void => {
    const output = Object.entries(result);
    output.forEach((param) => {
      const [key, value] = param;
      const li = new BaseComponent(Tags.LI);
      const keySpan = new BaseComponent(Tags.SPAN, ['key']);
      keySpan.element.innerText = `${key}:`;
      if (typeof value === 'object') {
        const nextBranch = new TreeBuilder(value as ResponseResultType);
        const button = new BaseComponent(Tags.BUTTON);
        const type = new BaseComponent(Tags.SPAN, ['type']);
        type.element.innerText = Array.isArray(value)
          ? TreeIcons.ARRAY
          : TreeIcons.OBJECT;
        button.element.innerHTML = TreeIcons.PLUS;
        button.element.addEventListener('click', (e:Event) => {
          const target = e.target as HTMLElement;
          target.innerHTML = target.innerHTML === TreeIcons.PLUS
            ? TreeIcons.MINUS
            : TreeIcons.PLUS;
          nextBranch.element.classList.toggle('visible');
        });
        li.append(keySpan, type, button, nextBranch);
      } else {
        const valueSpan = new BaseComponent(Tags.SPAN);
        valueSpan.element.innerText = String(value);
        li.append(keySpan, valueSpan);
      }
      this.append(li);
    });
  };
}
