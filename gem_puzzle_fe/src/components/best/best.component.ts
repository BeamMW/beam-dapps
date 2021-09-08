import { Tags } from '../../constants/html_tags';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
import TxBoard from '../txboard/txboard.component';
import './best.scss';

export class Best extends BaseComponent {
  constructor(top: any []) {
    super(Tags.DIV, ['top']);
    // this.sort(top)
    this.initTableTime(top);
  }

  initTableTime = (top: any []):void => {
    this.removeAll();
    const best = new BaseComponent(Tags.TABLE, ['top__best']);
    const { pKey } = AppStateHandler.getState();
    const trHeader = new BaseComponent(Tags.TR);
    const thPos = new BaseComponent(Tags.TH);
    const thAcc = new BaseComponent(Tags.TH);
    const thTime = new BaseComponent(Tags.TH);
    const thMoves = new BaseComponent(Tags.TH);
    const thPermutation = new BaseComponent(Tags.TH);
    trHeader.classList.add('thHeader');
    thPos.element.textContent = '№';
    thAcc.element.textContent = 'Account';
    thTime.element.textContent = 'Time';
    thMoves.element.textContent = 'Moves';
    thPermutation.element.textContent = 'Permutation';
    thTime.element.classList.add('active', 'use');
    thMoves.element.classList.add('use');
    best.append(trHeader);
    trHeader.append(thPos, thAcc, thTime, thMoves, thPermutation);
    top?.sort((obj1: any, obj2: any) => obj1.time - obj2.time)
      .forEach((el: any, idx: any):void => {
        const tdN = new BaseComponent(Tags.TD);
        const tr = new BaseComponent(Tags.TR);
        tdN.element.textContent = idx + 1;
        tr.append(tdN);

        const entries = Object.entries(el);
        entries.forEach((key) => {
          const td = new BaseComponent(Tags.TD);
          if (key[1]) {
            td.element.textContent = `${key[1]}`;
            if (key[1] === pKey) {
              tr.element.style.background = 'rgba(62, 102, 251, .7)';
            }
            tr.append(td);
          }
          best.append(tr);
          this.append(best);
        });
      });

    thMoves.element.addEventListener('click', () => {
      this.initTableMove(top);
    });
    thTime.element.addEventListener('click', () => {
      this.initTableTime(top);
    });
  };

  initTableMove = (top: any):void => {
    this.removeAll();
    const best = new BaseComponent(Tags.TABLE, ['top__best']);
    const { pKey } = AppStateHandler.getState();
    const trHeader = new BaseComponent(Tags.TR);
    const thPos = new BaseComponent(Tags.TH);
    const thAcc = new BaseComponent(Tags.TH);
    const thTime = new BaseComponent(Tags.TH);
    const thMoves = new BaseComponent(Tags.TH);
    const thPermutation = new BaseComponent(Tags.TH);
    trHeader.classList.add('thHeader');
    thPos.element.textContent = '№';
    thAcc.element.textContent = 'Account';
    thTime.element.textContent = 'Time';
    thMoves.element.textContent = 'Moves';
    thPermutation.element.textContent = 'Permutation';
    thMoves.element.classList.add('active', 'use');
    thTime.element.classList.add('use');
    best.append(trHeader);
    trHeader.append(thPos, thAcc, thTime, thMoves, thPermutation);
    top?.sort((obj1: any, obj2: any) => obj1.moves - obj2.moves)
      // eslint-disable-next-line array-callback-return
      .forEach((el: any, idx: any) => {
        const tdN = new BaseComponent(Tags.TD);
        const tr = new BaseComponent(Tags.TR);
        tdN.element.textContent = idx + 1;
        tr.append(tdN);
        const entries = Object.entries(el);
        entries.forEach((key) => {
          const td = new BaseComponent(Tags.TD);
          if (key[1]) {
            td.element.textContent = `${key[1]}`;
            if (key[1] === pKey) {
              tr.element.style.background = 'rgba(62, 102, 251, .7)';
            }
            tr.append(td);
          }
          best.append(tr);
          this.append(best);
        });
      });

    thMoves.element.addEventListener('click', () => {
      this.initTableMove(top);
      console.log(2);
    });
    thTime.element.addEventListener('click', () => {
      this.initTableTime(top);
      console.log(1);
    });
  };

  initLoader = (txid?: string): void => {
    const args = [new Loader()];
    if (txid) {
      args.unshift(new TxBoard(txid));
    }
    this.removeAll();
    this.append(...args);
  };
}
