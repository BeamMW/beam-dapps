import { Tags } from '../../constants/html_tags';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
import './best.scss';

export class Best extends BaseComponent {
  constructor(top: any []) {
    super(Tags.TABLE, ['top']);
    // this.sort(top)
    this.initTableTime(top);
  }

  initTableTime = (top: any []):void => {
    this.removeAll();
    const { pKey } = AppStateHandler.getState();
    const trHeader = new BaseComponent(Tags.TR);
    const thPos = new BaseComponent(Tags.TH);
    const thAcc = new BaseComponent(Tags.TH);
    const thTime = new BaseComponent(Tags.TH);
    const thMoves = new BaseComponent(Tags.TH);
    const thPermutation = new BaseComponent(Tags.TH);
    trHeader.classList.add('thHeader');
    thPos.element.textContent = 'RANK';
    thAcc.element.textContent = 'PUBLIC KEY';
    thTime.element.textContent = 'Time';
    thMoves.element.textContent = 'Moves';
    thPermutation.element.textContent = 'Permutation';
    thTime.element.classList.add('active', 'use');
    thMoves.element.classList.add('use');
    this.append(trHeader);
    trHeader.append(thPos, thAcc, thTime, thMoves, thPermutation);
    top?.sort((obj1: any, obj2: any) => obj1.time - obj2.time)
      .forEach((el: any, idx: any):void => {
        const tdN = new BaseComponent(Tags.TD);
        const tr = new BaseComponent(Tags.TR);
        tr.element.classList.add('tRow');
        tdN.element.innerHTML = `<span>${idx + 1}</span>`;
        if (idx === 0) {
          tr.element.classList.add('leader');
          tdN.element.innerHTML += `<svg width="29" height="30" xmlns="http://www.w3.org/2000/svg">
          <g fill-rule="nonzero" fill="none">
              <circle fill="#FFD321" cx="13.748" cy="11.911" r="11.911"/>
              <g fill="#FFE470">
                  <path d="M4.098 18.88 0 25.984l4.783-.254L6.957 30l3.791-6.573a11.9 11.9 0 0 1-6.65-4.547zM23.421 18.844a11.903 11.903 0 0 1-6.632 4.571L20.593 30l2.173-4.27 4.783.254-4.128-7.14z"/>
              </g>
              <circle fill="#FF9F00" cx="13.748" cy="11.911" r="8.634"/>
              <path d="M19.665 10.978a.451.451 0 0 0-.248-.767l-3.407-.496a.444.444 0 0 1-.337-.248L14.15 6.378a.45.45 0 0 0-.81 0l-1.517 3.089a.469.469 0 0 1-.337.248l-3.407.496a.451.451 0 0 0-.248.767l2.462 2.404a.455.455 0 0 1 .13.396l-.579 3.39a.45.45 0 0 0 .656.472l3.047-1.6a.44.44 0 0 1 .42 0l3.047 1.6a.452.452 0 0 0 .655-.473l-.584-3.39a.444.444 0 0 1 .13-.395l2.45-2.404z" fill="#FFF"/>
          </g>
      </svg>`;
        }
        tr.append(tdN);

        const entries = Object.entries(el);
        entries.forEach((key) => {
          const td = new BaseComponent(Tags.TD);
          if (key[1]) {
            td.element.textContent = `${key[1]}`;
            if (key[1] === pKey) {
              tr.style.backgroundColor = 'rgba(0, 191, 74, 0.3)';
              tr.style.border = 'solid 2px #00bf4a';
            }
            tr.append(td);
          }
          this.append(tr);
          // this.append(best);
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
    const { pKey } = AppStateHandler.getState();
    const trHeader = new BaseComponent(Tags.TR);
    const thPos = new BaseComponent(Tags.TH);
    const thAcc = new BaseComponent(Tags.TH);
    const thTime = new BaseComponent(Tags.TH);
    const thMoves = new BaseComponent(Tags.TH);
    const thPermutation = new BaseComponent(Tags.TH);
    trHeader.classList.add('thHeader');
    thPos.element.textContent = 'RANK';
    thAcc.element.textContent = 'PUBLIC KEY';
    thTime.element.textContent = 'Time';
    thMoves.element.textContent = 'Moves';
    thPermutation.element.textContent = 'Permutation';
    thTime.element.classList.add('active', 'use');
    thMoves.element.classList.add('use');
    this.append(trHeader);
    trHeader.append(thPos, thAcc, thTime, thMoves, thPermutation);
    top?.sort((obj1: any, obj2: any) => obj1.moves - obj2.moves)
      .forEach((el: any, idx: any):void => {
        const tdN = new BaseComponent(Tags.TD);
        const tr = new BaseComponent(Tags.TR);
        tr.element.classList.add('tRow');
        tdN.element.textContent = idx + 1;
        if (idx === 0) {
          tr.element.classList.add('leader');
          tdN.element.innerHTML += `<svg width="29" height="30" xmlns="http://www.w3.org/2000/svg">
          <g fill-rule="nonzero" fill="none">
              <circle fill="#FFD321" cx="13.748" cy="11.911" r="11.911"/>
              <g fill="#FFE470">
                  <path d="M4.098 18.88 0 25.984l4.783-.254L6.957 30l3.791-6.573a11.9 11.9 0 0 1-6.65-4.547zM23.421 18.844a11.903 11.903 0 0 1-6.632 4.571L20.593 30l2.173-4.27 4.783.254-4.128-7.14z"/>
              </g>
              <circle fill="#FF9F00" cx="13.748" cy="11.911" r="8.634"/>
              <path d="M19.665 10.978a.451.451 0 0 0-.248-.767l-3.407-.496a.444.444 0 0 1-.337-.248L14.15 6.378a.45.45 0 0 0-.81 0l-1.517 3.089a.469.469 0 0 1-.337.248l-3.407.496a.451.451 0 0 0-.248.767l2.462 2.404a.455.455 0 0 1 .13.396l-.579 3.39a.45.45 0 0 0 .656.472l3.047-1.6a.44.44 0 0 1 .42 0l3.047 1.6a.452.452 0 0 0 .655-.473l-.584-3.39a.444.444 0 0 1 .13-.395l2.45-2.404z" fill="#FFF"/>
          </g>
      </svg>`;
        }
        tr.append(tdN);

        const entries = Object.entries(el);
        entries.forEach((key) => {
          const td = new BaseComponent(Tags.TD);
          if (key[1]) {
            td.element.textContent = `${key[1]}`;
            if (key[1] === pKey) {
              tr.style.backgroundColor = 'rgba(0, 191, 74, 0.3)';
              tr.style.border = 'solid 2px #00bf4a';
            }
            tr.append(td);
          }
          this.append(tr);
          // this.append(best);
        });
      });

    thMoves.element.addEventListener('click', () => {
      this.initTableMove(top);
    });
    thTime.element.addEventListener('click', () => {
      this.initTableTime(top);
    });
  };

  initLoader = (): void => {
    const args = [new Loader()];
    // if (txid) {
    //   args.unshift(new TxBoard(txid));
    // }
    this.removeAll();
    this.append(...args);
  };
}
