import SVG from './svg.data';

export default [
  {
    name: 'clear',
    classes: (action: string):[string, string] => ['clear', `clear-${action}`],
    icon: SVG.iconCancel
  },
  {
    name: 'execute',
    classes: (
      action: string
    ):[string, string] => ['submit', `submit-${action}`],
    icon: SVG.iconDone,
    type: 'submit'
  }
];
