import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import { ReqID } from '../../../constants/variables';
import { ApiHandler } from '../../../utils/api_handlers';
import BaseComponent from '../../BaseComponent/base.component';
import './header.scss';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const app = new BaseComponent(Tags.DIV, ['header__app']);
    const info = new BaseComponent(Tags.DIV, ['header__info']);
    const infoTitles = new BaseComponent(Tags.DIV, ['info__titles']);
    const titlesStatus = new BaseComponent(Tags.DIV, ['info__titles-status']);
    const titlesId = new BaseComponent(Tags.SPAN, ['info__titles-id']);
    const titlesName = new BaseComponent(Tags.SPAN, ['info__titles-name']);
    const infoData = new BaseComponent(Tags.SPAN, ['info__data']);
    const dataStatus = new BaseComponent(Tags.DIV, ['info__data-status']);
    const dataId = new BaseComponent(Tags.SPAN, ['info__data-id']);
    const dataName = new BaseComponent(Tags.SPAN, ['info__data-name']);
    titlesStatus.element.textContent = 'Connect to contract status:';
    titlesId.element.textContent = 'ID shaders:';
    titlesName.element.textContent = 'Name:';
    dataStatus.element.textContent = 'connected';
    dataId.element.textContent = '38234c93434ebb572a22bab82799f9ffa0ddfcc9e0687a2a9a61ce055bdd5c42';
    dataName.element.textContent = 'Test DAPP';
    infoTitles.append(titlesStatus, titlesId, titlesName);
    infoData.append(dataStatus, dataId, dataName);

    info.append(infoTitles, infoData);
    this.append(app, info);
  }

  inform = (res: APIResponse): void => {
    if (res.id === ReqID.FORM_GENERATOR) {
      console.log(JSON.parse(res.result.output));
    }
  };
}
