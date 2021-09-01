import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Main from '../main/main.component';

main: Main;

export class Win extends BaseComponent {
 constructor(){
    super(Tags.DIV, ['winner']);

 }   
}