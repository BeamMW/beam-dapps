import { BoardType } from 'beamApiProps';
import { CellToRender } from 'ComponentProps';

export class Box {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getTopBox = ():Box[] => {
    const topBox:Box[] = [];
    let { y } = this;
    while (y > 0) {
      topBox.push(new Box(this.x, y - 1));
      y--;
    }
    return topBox;
  };

  getRightBox = ():Box[] => {
    const rightBox:Box[] = [];
    let { x } = this;
    while (x < 3) {
      rightBox.push(new Box(x + 1, this.y));
      x++;
    }
    return rightBox;
  };

  getBottomBox = ():Box[] => {
    const bottomBox:Box[] = [];
    let { y } = this;
    while (y < 3) {
      bottomBox.push(new Box(this.x, y + 1));
      y++;
    }
    return bottomBox;
  };

  getLeftBox = ():Box[] => {
    const leftBox:Box[] = [];
    let { x } = this;
    while (x > 0) {
      leftBox.push(new Box(x - 1, this.y));
      x--;
    }
    return leftBox;
  };

  getNextdoorBoxes = ():Box[] => [
    ...this.getTopBox(),
    ...this.getRightBox(),
    ...this.getBottomBox(),
    ...this.getLeftBox()
  ];

  getRandomNextdoorBox = ():Box | void => {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return (
      nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)]
    );
  };
}

export const solution: ('u' | 'd' | 'r' | 'l')[] = [];

let empty = new Box(3, 3);

export function swapBoxes(
  grid: BoardType,
  f: { x: number, y: number },
  e: { x: number, y: number }
):CellToRender[] {
  const toRender:CellToRender[] = [];
  let { x, y } = e;
  if (f.y === e.y) {
    const eBox = grid[e.y] as number[];
    const k = e.x > f.x ? -1 : 1;
    while (x !== f.x) {
      eBox[x] = <number>eBox
        .splice(x + k, 1, <number>eBox[x])[0];
      toRender.push({
        index: <number>eBox[x] - 1,
        x,
        y,
        solution: k > 0 ? 'r' : 'l'
      });
      x += k;
    }
  }
  if (f.x === e.x) {
    const k = e.y > f.y ? -1 : 1;
    while (y !== f.y) {
      const eBox = grid[y] as number[];
      const fBox = grid[y + k] as number[];
      eBox[x] = <number>fBox
        .splice(x, 1, <number>eBox[x])[0];
      toRender.push({
        index: <number>eBox[x] - 1,
        x,
        y,
        solution: k > 0 ? 'd' : 'u'
      });
      y += k;
    }
  }
  return toRender;
}

export const emptyBox = (grid: BoardType):void => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i]?.[j] === 0) {
        const prev: Box = empty;
        empty = new Box(i, j);
        if (empty.x > prev.x) {
          solution.push('d');
        }
        if (empty.x < prev.x) {
          solution.push('u');
        }
        if (empty.y > prev.y) {
          solution.push('r');
        }
        if (empty.y < prev.y) {
          solution.push('l');
        }
      // solution
      }
    }
  }
};
export const isSolved = (grid: BoardType):boolean => (
  grid[0]?.[0] === 1
    && grid[0][1] === 2
    && grid[0][2] === 3
    && grid[0][3] === 4
    && grid[1]?.[0] === 5
    && grid[1][1] === 6
    && grid[1][2] === 7
    && grid[1][3] === 8
    && grid[2]?.[0] === 9
    && grid[2][1] === 10
    && grid[2][2] === 11
    && grid[2][3] === 12
    && grid[3]?.[0] === 13
    && grid[3][1] === 14
    && grid[3][2] === 15
    && grid[3][3] === 0
);
