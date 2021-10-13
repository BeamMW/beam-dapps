import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import { SVG } from '../../constants/svg.icons';
import { ReqID } from '../../constants/variables';
import { BEAM } from '../../controllers/beam.controller';
import BaseComponent from '../shared/base/base.component';
import fileImage from '../../assets/icon/file.svg';
import './header.scss';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    BEAM.addObservers(this);
    const app = new BaseComponent(Tags.DIV, ['header__app']);
    const img = new BaseComponent(Tags.IMG, ['header__img']);
    const info = new BaseComponent(Tags.DIV, ['header__info']);
    const infoTitles = new BaseComponent(Tags.DIV, ['info__titles']);
    const titlesStatus = new BaseComponent(Tags.DIV, ['info__titles-status']);
    const titlesId = new BaseComponent(Tags.SPAN, ['info__titles-id']);
    const titlesName = new BaseComponent(Tags.SPAN, ['info__titles-name']);
    const infoData = new BaseComponent(Tags.SPAN, ['info__data']);
    const dataStatus = new BaseComponent(Tags.DIV, ['info__data-status']);
    const dataId = new BaseComponent(Tags.SPAN, ['info__data-id']);
    const dataName = new BaseComponent(Tags.SPAN, ['info__data-name']);
    const svgIcon = new BaseComponent(Tags.DIV, ['header__app-icon']);
    const fake = new BaseComponent(Tags.DIV, ['header__app-fake-icon']);
    img.setAttributes({
      src: fileImage
    });
    svgIcon.innerHTML = `${SVG.iconCloseSmall}`;
    titlesStatus.textContent = 'Connect to contract status:';
    titlesId.textContent = 'ID shaders:';
    titlesName.textContent = 'Name:';
    dataStatus.textContent = 'connected';
    dataId.textContent = '38234c93434ebb572a22bab82799f9ffa0ddfcc9e0687a2a9a61ce055bdd5c42';
    dataName.textContent = 'Test DAPP';
    app.append(fake, img, svgIcon);
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
