import { APIResponse } from 'beamApiProps';
import {
  ResTXComment,
  ResTXStatus,
  WidgetTxDescription
} from '../../../constants/api';
import { Tags } from '../../../constants/html';
import { Beam } from '../../../logic/beam/api_handler';
import BaseComponent from '../../base/base.component';

export default class WidgetProps extends BaseComponent {
  value: ResTXComment | false;

  mainDesc = new BaseComponent(Tags.DIV, ['title']);

  constructor() {
    super(Tags.DIV, ['tx-infoblock']);
    Beam.addObservers(this);
    this.value = false;
    this.mainDesc.innerHTML = '...';
    const gemPuzzle = new BaseComponent(Tags.DIV, ['value']);
    gemPuzzle.innerHTML = 'Gem-Puzzle';
    this.append(this.mainDesc, gemPuzzle);
  }

  inform = (res: APIResponse): void => {
    const status = res.result?.comment || null;
    if (status !== null && status !== this.value) {
      if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
        if (!this.classList.contains('active')) this.classList.add('active');
        this.value = status;
        switch (this.value) {
          case ResTXComment.CHECKIN_SOLUTION:
            this.mainDesc.innerHTML = WidgetTxDescription.CHECK;
            break;
          case ResTXComment.CREATE_NEW_GAME:
            this.mainDesc.innerHTML = WidgetTxDescription.NEW_BET;
            break;
          case ResTXComment.GIVING_YOU_REWARD:
            this.mainDesc.innerHTML = WidgetTxDescription.CLAIM_REWARD;
            break;
          case ResTXComment.DONATING:
            this.mainDesc.innerHTML = WidgetTxDescription.DONATE;
            break;
          default:
            break;
        }
      } else {
        this.classList.remove('active');
        this.value = false;
        this.mainDesc.innerHTML = '...';
      }
    }
  };
}
