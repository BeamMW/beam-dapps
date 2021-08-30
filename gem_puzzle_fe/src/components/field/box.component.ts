export class Box {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getTopBox = ():Box | null => {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  };

  getRightBox = ():Box | null => {
    if (this.x === 3) return null;
    return new Box(this.x + 1, this.y);
  };

  getBottomBox = ():Box | null => {
    if (this.y === 3) return null;
    return new Box(this.x, this.y + 1);
  };

  getLeftBox = ():Box | null => {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  };

  getNextdoorBoxes = ():Box[] => [
    this.getTopBox(),
    this.getRightBox(),
    this.getBottomBox(),
    this.getLeftBox()
  ].filter((box) => box !== null) as Box[];

  getRandomNextdoorBox = ():void => {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return (
      nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)]
      && console.log(nextdoorBoxes)
    );
  };
}

const solution: any = [];
let empty = new Box(3, 3);

export function swapBoxes(grid: any, box1: any, box2: any):void {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
  console.log(temp);
}

export function emptyBox(grid: any) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        const prev: Box = empty;
        empty = new Box(i, j);
        if (empty.x > prev.x) {
          solution.push('d');
          console.log('D');
        }
        if (empty.x < prev.x) {
          solution.push('u');
          console.log('U');
        }
        if (empty.y > prev.y) {
          solution.push('r');
          console.log('R');
        }
        if (empty.y < prev.y) {
          solution.push('l');
          console.log('L');
        }
        console.log(solution.join(''));
      }
    }
  }
}

export const isSolved = (grid: any):boolean => {
  emptyBox(grid);
  console.log(empty);
  return (
    grid[0][0] === 1
    && grid[0][1] === 2
    && grid[0][2] === 3
    && grid[0][3] === 4
    && grid[1][0] === 5
    && grid[1][1] === 6
    && grid[1][2] === 7
    && grid[1][3] === 8
    && grid[2][0] === 9
    && grid[2][1] === 10
    && grid[2][2] === 11
    && grid[2][3] === 12
    && grid[3][0] === 13
    && grid[3][1] === 14
    && grid[3][2] === 15
    && grid[3][3] === 0
  );
};
