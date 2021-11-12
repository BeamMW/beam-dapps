import { ResponseResultType } from '@alltypes';
import { Colors, Tags, TreeIcons } from '@constants/html-elements';
import BaseComponent from '../base/base.component';
import './tree-builder.scss';

type TreeValue = string | number | ResponseResultType;

export default class TreeBuilder extends BaseComponent {
  constructor(result:ResponseResultType, isArray: boolean) {
    super(Tags.UL, ['data', 'list']);
    this.getStruct(result, isArray);
  }

  branchButtonHandler = (
    e: MouseEvent, component: BaseComponent
  ):void => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('active')) target.classList.remove('active');
    else target.classList.add('active');
    component.classList.toggle('visible');
  };

  nextBranchAttributes = (
    nextBranch: TreeBuilder, value: TreeValue
  ):BaseComponent[] => {
    const button = new BaseComponent(Tags.BUTTON, ['arrow']);
    const type = new BaseComponent(Tags.SPAN, ['type']);
    type.textContent = Array.isArray(value)
      ? TreeIcons.ARRAY
      : TreeIcons.OBJECT;
    button.element.addEventListener('click',
      (e: MouseEvent) => this.branchButtonHandler(e, nextBranch));
    return [type, button];
  };

  createNewBranch = (value: TreeValue):BaseComponent => {
    const component = new BaseComponent(Tags.LI);
    const isNextValueArray = Array.isArray(value);
    const nextBranch = new TreeBuilder(
      value as ResponseResultType, isNextValueArray
    );
    const attributes = this.nextBranchAttributes(nextBranch, value);
    component.append(...attributes, nextBranch);
    return component;
  };

  createNewValue = (value: TreeValue):BaseComponent => {
    const component = new BaseComponent(Tags.LI);
    const valueSpan = new BaseComponent(Tags.SPAN);
    valueSpan.textContent = typeof value === 'number'
      ? String(value)
      : `"${value}"`;
    component.append(valueSpan);
    component.style.color = typeof value === 'number'
      ? Colors.LIGHTGREEN
      : Colors.LIGHTRED;
    return component;
  };

  convertValue = (value: TreeValue):BaseComponent => (
    typeof value === 'object'
      ? this.createNewBranch(value)
      : this.createNewValue(value)
  );

  createKey = (key: string, isArray: boolean):BaseComponent => {
    const component = new BaseComponent(Tags.SPAN, ['key']);
    component.textContent = isArray
      ? `${key}:`
      : `"${key}":`;
    return component;
  };

  createBracket = (isArray: boolean, isOpen?: boolean):BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['bracket']);
    if (isOpen) {
      component.textContent = isArray ? '[' : '{';
    } else component.textContent = isArray ? ']' : '}';
    return component;
  };

  getStruct = (result:ResponseResultType, isArray: boolean):void => {
    const openBracket = this.createBracket(isArray, true);
    const closeBracket = this.createBracket(isArray);
    const output = Object.entries(result);
    output.forEach((param) => {
      const [key, value] = param;
      const keyComponent = this.createKey(key, isArray);
      const valueComponent = this.convertValue(<TreeValue>value);
      const comma = new BaseComponent(Tags.SPAN);
      comma.textContent = ',';
      valueComponent.insertFirst(keyComponent);
      this.append(valueComponent);
    });
    this.insertFirst(openBracket);
    this.append(closeBracket);
  };
}
