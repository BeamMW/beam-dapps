import {
  takePendingRewards,
  cancelGame,
  startGame
} from '../logic/beam_api/request_creators';
import { MenuBtn, Routes } from './app_constants';

export const menuProps = [
  {
    key: MenuBtn.CONTINUE,
    title: 'CONTINUE',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.PLAY}`);
    }
  },
  {
    key: MenuBtn.NEW,
    icon: `<svg width="25" height="31" xmlns="http://www.w3.org/2000/svg">
    <g fill-rule="nonzero" fill="none">
        <path fill="#FF6326" d="M24.703 7.107H15.6v4.58h-4.714v5.616h13.817l-3.082-5.098z"/>
        <path fill="#FF9F00" d="M4.356 3.307h13.06v10.197H4.356z"/>
        <path fill="#FFD321" d="M6.256 0h-3.8v1.816h.992v24.977h1.816V1.816h.992z"/>
        <path d="M4.505 25.885h-.298A4.211 4.211 0 0 0 0 30.092V31h8.712v-.908a4.211 4.211 0 0 0-4.207-4.207z" fill="#FFAF00"/>
        <path fill="#FF3838" d="M17.416 13.504h-6.53v3.8z"/>
        <path fill="#FFE470" d="M24.703 7.107H15.6v4.58h-4.714v5.616h13.817l-3.082-5.098z"/>
        <path fill="#DBC35D" d="M17.416 13.504h-6.53v3.8z"/>
        <path fill="#FDBF00" d="M10.886 3.307h6.53v10.197h-6.53z"/>
    </g>
</svg>
`,
    title: 'NEW GAME',
    handler: startGame
  },
  {
    key: MenuBtn.BEST,
    icon: `<svg width="29" height="31" xmlns="http://www.w3.org/2000/svg">
    <g fill-rule="nonzero" fill="none">
        <circle fill="#FFD321" cx="14.206" cy="12.308" r="12.308"/>
        <g fill="#FFE470">
            <path d="M4.235 19.51 0 26.85l4.943-.262L7.189 31l3.917-6.792a12.296 12.296 0 0 1-6.871-4.699zM24.202 19.473a12.3 12.3 0 0 1-6.853 4.723L21.279 31l2.246-4.412 4.943.262-4.266-7.377z"/>
        </g>
        <circle fill="#FF9F00" cx="14.206" cy="12.308" r="8.922"/>
        <path d="M20.32 11.344a.466.466 0 0 0-.255-.793l-3.521-.513a.46.46 0 0 1-.348-.256L14.62 6.591a.465.465 0 0 0-.836 0l-1.568 3.191a.485.485 0 0 1-.348.256l-3.521.513a.466.466 0 0 0-.256.793l2.544 2.484a.47.47 0 0 1 .135.409l-.598 3.503a.465.465 0 0 0 .677.488l3.149-1.654a.455.455 0 0 1 .433 0l3.149 1.654a.467.467 0 0 0 .677-.488l-.604-3.503a.46.46 0 0 1 .134-.409l2.533-2.484z" fill="#FFF"/>
    </g>
</svg>`,
    title: 'LEADERBOARD',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.BEST}`);
    }
  },
  {
    key: MenuBtn.OPTIONS,
    icon: `<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.545 1a2 2 0 0 1 1.982 1.73l.086.631c.046.338.005.667-.106.966.894.23 1.74.583 2.519 1.04a2 2 0 0 1 .6-.732l.512-.386a2 2 0 0 1 2.619.182l.762.762a2 2 0 0 1 .178 2.625l-.385.507c-.2.262-.45.461-.728.594.468.79.83 1.65 1.07 2.561a1.942 1.942 0 0 1 .904-.082l.636.089a2 2 0 0 1 1.722 1.98v1.078a2 2 0 0 1-1.73 1.982l-.63.086c-.301.041-.596.013-.867-.072a10.049 10.049 0 0 1-1.04 2.585 1.92 1.92 0 0 1 .656.559l.387.512a2 2 0 0 1-.182 2.619l-.763.762a2 2 0 0 1-2.624.178l-.507-.385a1.993 1.993 0 0 1-.535-.615 9.806 9.806 0 0 1-2.537 1.064 1.92 1.92 0 0 1 .058.822l-.089.635A2 2 0 0 1 14.533 27h-1.078a2 2 0 0 1-1.982-1.73l-.086-.631a1.993 1.993 0 0 1 .065-.843 9.773 9.773 0 0 1-2.522-1.08 1.949 1.949 0 0 1-.556.649l-.512.386a2 2 0 0 1-2.619-.182l-.762-.762a2 2 0 0 1-.178-2.625l.385-.507c.198-.26.446-.457.72-.59a10.043 10.043 0 0 1-1.026-2.577 1.96 1.96 0 0 1-.94.094l-.636-.089a2 2 0 0 1-1.722-1.98v-1.078a2 2 0 0 1 1.73-1.982l.63-.086c.343-.047.676-.004.978.11A10.03 10.03 0 0 1 5.483 8.94a1.973 1.973 0 0 1-.788-.625l-.387-.512a2 2 0 0 1 .182-2.619l.763-.762a2 2 0 0 1 2.624-.178l.507.385c.276.21.482.477.614.772a9.799 9.799 0 0 1 2.51-1.058 1.997 1.997 0 0 1-.11-.985l.089-.635A2 2 0 0 1 13.467 1h1.078zm-.505 16.29c1.737 0 3.152-1.434 3.152-3.212 0-1.778-1.415-3.213-3.152-3.213s-3.152 1.435-3.152 3.213 1.415 3.212 3.152 3.212z" fill-rule="nonzero" stroke="#8DA1AD" stroke-width="2" fill="none"/>
</svg>
`,
    title: 'SETTING',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.OPTIONS}`);
    }
  },
  {
    key: MenuBtn.RETURN,
    title: 'RETURN TO MAIN',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.RETURN}`);
    }
  },
  {
    key: MenuBtn.CANCEL,
    title: 'CANCEL GAME',
    handler: cancelGame
  }
  // ,
  // {
  //   key: MenuBtn.TAKE_REWARD,
  //   title: 'TAKE REWARD',
  //   handler: takePendingRewards
  // }
];
