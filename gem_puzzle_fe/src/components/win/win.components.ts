import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Header from '../header/header.component';
import Loader from '../loader/loader.component';
import './win.scss'

export class Win extends BaseComponent {
 [x: string]: any;
 constructor(){
    super(Tags.DIV, ['winner']);
    this.initWinnerPopUp()
 }   
 initWinnerPopUp=()=>{
    this.removeAll()
    const winLabel = new BaseComponent(Tags.H1,['winLabel'])
    winLabel.element.textContent = "You WON"
    this.append(winLabel)
 }
 initLoader = (txid: string): void => {
    this.removeAll();
    this.append(new Header(txid), new Loader());
  };
}