import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import { BEAM } from '../../controllers/beam.controller';
import BaseComponent from '../shared/base/base.component';
import './header.scss';

export default class InfoBlock extends BaseComponent {
  constructor() {
    super(Tags.TABLE, ['header__info']);
    BEAM.addObservers(this);
    const titlesStatus = new BaseComponent(Tags.TD, ['info__titles']);
    const titlesId = new BaseComponent(Tags.TD, ['info__titles']);
    const titlesName = new BaseComponent(Tags.TD, ['info__titles']);
    const dataStatus = new BaseComponent(Tags.TD, ['info__data']);
    const dataId = new BaseComponent(Tags.TD, ['info__data']);
    const dataName = new BaseComponent(Tags.TD, ['info__data']);

    const trStatus = new BaseComponent(Tags.TR);
    const trId = new BaseComponent(Tags.TR);
    const trName = new BaseComponent(Tags.TR);

    titlesStatus.textContent = 'Connect to contract status:';
    titlesId.textContent = 'ID shaders:';
    titlesName.textContent = 'Name:';
    dataStatus.textContent = 'connected';
    dataId.textContent = '38234c93434ebb572a22bab82799f9ffa0ddfcc9e0687a2a9a61ce055bdd5c42';
    dataName.textContent = 'Test DAPP';

    trStatus.append(titlesStatus, dataStatus);
    trId.append(titlesId, dataId);
    trName.append(titlesName, dataName);
    this.append(trStatus, trId, trName);
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      console.log(res.error.code);
    }
  };
}
