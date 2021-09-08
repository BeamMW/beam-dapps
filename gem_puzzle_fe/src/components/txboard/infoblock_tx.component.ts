import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import BaseComponent from '../base/base.component';
import { ReqID } from '../../constants/api_constants';
import './txboard.scss';

type TxInfoPropsType = {
  value: string,
  key: keyof APIResponse['result'],
  title: string
};

export default class InfoBlockTX extends BaseComponent {
  value: BaseComponent;

  key: keyof APIResponse['result'];

  constructor({ value, key, title }:TxInfoPropsType) {
    super(Tags.DIV, ['tx-infoblock']);
    ApiHandler.addObservers(this);
    const titleSpan = new BaseComponent(Tags.SPAN, ['title']);
    titleSpan.innerHTML = title;
    this.value = new BaseComponent(Tags.SPAN, ['value']);
    this.key = key;
    this.value.innerHTML = value;
    this.append(titleSpan, this.value);
  }

  inform = (res: APIResponse): void => {
    if (res.id === ReqID.TX_STATUS) {
      this.value.innerHTML = res.result[this.key];
    }
  };
}
