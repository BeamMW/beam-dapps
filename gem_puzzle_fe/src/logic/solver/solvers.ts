export default class NPuzzleSolver {
  grid: any[];

  fixed: any[];

  numbers: any[];

  solution: any[];

  originalGrid: number[][];

  constructor(toSolve: number[][]) {
    this.grid = [];
    this.fixed = [];
    this.numbers = [];
    this.solution = [];
    this.originalGrid = toSolve;
  }

  setupSolver = (): void => {
    this.numbers = [];
    this.fixed = [];
    this.grid = [];
    for (let i = 0; i < this.originalGrid.length; i++) {
      this.fixed[i] = [];
      this.grid[i] = [];
      for (let j = 0; j < this.originalGrid.length; j++) {
        const num = this.originalGrid[i]?.[j] as number;
        this.grid[i][j] = num;
        this.fixed[i][j] = false;
        this.numbers[num] = { x: j, y: i };
      }
    }
  };

  solve = (): any[] | null => {
    this.setupSolver();
    try {
      this.solveGrid(this.grid.length);
    } catch (err: any) {
      console.log(err.message);
      return null;
    }
    return this.solution;
  };

  solveGrid = (size: number): void => {
    if (size > 2) {
      // pattern solve nxn squares greater than 2x2
      this.solveRow(size); // solve the upper row first
      this.solveColumn(size); // solve the left column next
      this.solveGrid(size - 1); // now we can solve the sub (n-1)x(n-1) puzzle
    } else if (size === 2) {
      this.solveRow(size); // solve the row like normal
      // rotate last two numbers if they arent in place
      if (this.grid[this.grid.length - 1][this.grid.length - size] === 0) {
        this.swapE({ x: this.grid.length - 1, y: this.grid.length - 1 });
      }
    } // smaller than 2 is solved by definition
  };

  solveRow = (size: number): void => {
    const rowNumber = this.grid.length - size;
    // using row number here because this is also our starting column
    for (let i = rowNumber; i < this.grid.length - 2; i++) {
      const number = rowNumber * this.grid.length + (i + 1);
      // calculate the number that is suppose to be at this position
      this.moveNumberTowards(number, { x: i, y: rowNumber });
      this.fixed[rowNumber][i] = true;
    }
    const secondToLast = rowNumber * this.grid.length + this.grid.length - 1;
    const last = secondToLast + 1;
    // position second to last number
    this.moveNumberTowards(secondToLast, {
      x: this.grid.length - 1,
      y: rowNumber
    });
    // position last number
    this.moveNumberTowards(last, { x: this.grid.length - 1, y: rowNumber + 1 });
    // double check to make sure they are in the right position
    if (
      this.numbers[secondToLast].x !== this.grid.length - 1
      || this.numbers[secondToLast].y !== rowNumber
      || this.numbers[last].x !== this.grid.length - 1
      || this.numbers[last].y !== rowNumber + 1
    ) {
      // the ordering has messed up
      this.moveNumberTowards(secondToLast, {
        x: this.grid.length - 1,
        y: rowNumber
      });
      this.moveNumberTowards(last, { x: this.grid.length - 2, y: rowNumber });
      this.moveEmptyTo({ x: this.grid.length - 2, y: rowNumber + 1 });
      // the numbers will be right next to each other
      const pos = { x: this.grid.length - 1, y: rowNumber + 1 };
      // square below last one in row
      const moveList = [
        'ul',
        'u',
        '',
        'l',
        'dl',
        'd',
        '',
        'l',
        'ul',
        'u',
        '',
        'l',
        'ul',
        'u',
        '',
        'd'
      ];
      this.applyRelativeMoveList(pos, moveList);
      // now we reversed them, the puzzle is solveable!
    }
    // do the special
    this.specialTopRightRotation(rowNumber);
    // now the row has been solved :D
  };

  solveColumn = (size:number):void => {
    const colNumber = this.grid.length - size;
    // use column number as this is the starting row
    for (let i = colNumber; i < this.grid.length - 2; i++) {
      const number = i * this.grid.length + 1 + colNumber;
      this.moveNumberTowards(number, { x: colNumber, y: i });
      this.fixed[i][colNumber] = true;
    }
    const secondToLast = (
      this.grid.length - 2
    ) * this.grid.length + 1 + colNumber;
    const last = secondToLast + this.grid.length;
    // position second to last number
    this.moveNumberTowards(secondToLast, {
      x: colNumber,
      y: this.grid.length - 1
    });
    // position last number
    this.moveNumberTowards(last, { x: colNumber + 1, y: this.grid.length - 1 });
    // double check to make sure they are in the right position
    if (
      this.numbers[secondToLast].x !== colNumber
      || this.numbers[secondToLast].y !== this.grid.length - 1
      || this.numbers[last].x !== colNumber + 1
      || this.numbers[last].y !== this.grid.length - 1
    ) {
      // this happens because the ordering of the
      // two numbers is reversed, we have to reverse them
      this.moveNumberTowards(secondToLast, {
        x: colNumber,
        y: this.grid.length - 1
      });
      this.moveNumberTowards(last, { x: colNumber, y: this.grid.length - 2 });
      this.moveEmptyTo({ x: colNumber + 1, y: this.grid.length - 2 });
      // the numbers will be stacked and the empty
      // should be to the left of the last number
      const pos = { x: colNumber + 1, y: this.grid.length - 1 };
      const moveList = [
        'ul',
        'l',
        '',
        'u',
        'ur',
        'r',
        '',
        'u',
        'ul',
        'l',
        '',
        'u',
        'ul',
        'l',
        '',
        'r'
      ];
      this.applyRelativeMoveList(pos, moveList);
      // now the order has been officially reversed
    }
    // do the special
    this.specialLeftBottomRotation(colNumber);
    // now the column is solved
  };

  applyRelativeMoveList = (pos:any, list: any[]):void => {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === 0) {
        this.swapE(pos);
      } else {
        this.swapE(this.offsetPosition(pos, list[i]));
      }
    }
  };

  moveNumberTowards = (num:any, dest:any):void => {
    // dont bother if the piece is in the right place,
    // it can cause odd things to happen with the space
    if (this.numbers[num].x === dest.x
      && this.numbers[num].y === dest.y) return; // dont bother
    // choose where we want the empty square
    this.makeEmptyNeighborTo(num);
    // now empty will be next to our number and thats all we need
    // const counter = 1;
    while (this.numbers[num].x !== dest.x || this.numbers[num].y !== dest.y) {
      const direction = this.getDirectionToProceed(num, dest);
      if (!this.areNeighbors(num, 0)) {
        throw new Error('cannot rotate without empty');
      }
      if (direction === 'u' || direction === 'd') {
        this.rotateVertical(num, direction === 'u');
      } else {
        this.rotateHorizontal(num, direction === 'l');
      }
    }
  };

  rotateHorizontal = (num:any, leftDirection:any):void => {
    const side = leftDirection ? 'l' : 'r';
    const other = leftDirection ? 'r' : 'l';
    const empty = this.numbers[0];
    const pos = this.numbers[num];
    if (empty.y !== pos.y) {
      // the empty space is above us
      const location = empty.y < pos.y ? 'u' : 'd';
      if (
        !this.moveable(this.offsetPosition(pos, location + side))
        || !this.moveable(this.offsetPosition(pos, location))
      ) {
        this.swapE(this.offsetPosition(pos, location + other));
        this.swapE(this.offsetPosition(pos, other));
        this.proper3By2RotationHorizontal(pos, leftDirection);
      } else {
        this.swapE(this.offsetPosition(pos, location + side));
        this.swapE(this.offsetPosition(pos, side));
      }
    } else if (
      (empty.x < pos.x && !leftDirection)
      || (empty.x > pos.x && leftDirection)
    ) {
      // its on the opposite that we want it on
      this.proper3By2RotationHorizontal(pos, leftDirection);
    }
    // now it is in the direction we want to go so just swap
    this.swapE(pos);
  };

  proper3By2RotationHorizontal = (
    pos: any,
    leftDirection: any
  ):void => {
    const side = leftDirection ? 'l' : 'r';
    const other = leftDirection ? 'r' : 'l';
    let location = 'u'; // assume up as default
    if (
      this.moveable(this.offsetPosition(pos, `d${side}`))
      && this.moveable(this.offsetPosition(pos, 'd'))
      && this.moveable(this.offsetPosition(pos, `d${other}`))
    ) {
      location = 'd';
    } else if (
      !this.moveable(this.offsetPosition(pos, `u${side}`))
      || !this.moveable(this.offsetPosition(pos, 'u'))
      || !this.moveable(this.offsetPosition(pos, `u${other}`))
    ) {
      throw new Error('unable to move up all spots fixed');
    }
    this.swapE(this.offsetPosition(pos, location + other));
    this.swapE(this.offsetPosition(pos, location));
    this.swapE(this.offsetPosition(pos, location + side));
    this.swapE(this.offsetPosition(pos, side));
  };

  rotateVertical = (num:any, upDirection:any):void => {
    const toward = upDirection ? 'u' : 'd';
    const away = upDirection ? 'd' : 'u';
    const empty = this.numbers[0];
    const pos = this.numbers[num];
    if (empty.x !== pos.x) {
      // its to the right or left
      const side = empty.x < pos.x ? 'l' : 'r';
      if (
        !this.moveable(this.offsetPosition(pos, toward + side))
        || !this.moveable(this.offsetPosition(pos, side))
      ) {
        this.swapE(this.offsetPosition(pos, away + side));
        this.swapE(this.offsetPosition(pos, away));
        this.proper2By3RotationVertical(pos, upDirection);
      } else {
        this.swapE(this.offsetPosition(pos, toward + side));
        this.swapE(this.offsetPosition(pos, toward));
      }
    } else if (
      (empty.y < pos.y && !upDirection)
      || (empty.y > pos.y && upDirection)
    ) {
      // its in the opposite direction we want to go
      this.proper2By3RotationVertical(pos, upDirection);
    }
    // now the empty is in the direction we need to go
    // so just swap with it
    this.swapE(pos);
  };

  proper2By3RotationVertical = (
    pos:any,
    upDirection:any
  ):void => {
    const toward = upDirection ? 'u' : 'd';
    const away = upDirection ? 'd' : 'u';
    let side = 'r'; // default to right column usage
    if (
      this.moveable(this.offsetPosition(pos, `${toward}l`))
      && this.moveable(this.offsetPosition(pos, 'l'))
      && this.moveable(this.offsetPosition(pos, `${away}l`))
    ) {
      side = 'l';
    } else if (
      !this.moveable(this.offsetPosition(pos, `${toward}r`))
      || !this.moveable(this.offsetPosition(pos, 'r'))
      || !this.moveable(this.offsetPosition(pos, `${away}r`))
    ) {
      throw new Error(
        'Unable to preform move, the puzzle is quite possibly unsolveable'
      );
    }
    this.swapE(this.offsetPosition(pos, away + side));
    this.swapE(this.offsetPosition(pos, side));
    this.swapE(this.offsetPosition(pos, toward + side));
    this.swapE(this.offsetPosition(pos, toward));
  };

  specialTopRightRotation = (top:any):void => {
    // lock the two pieces
    this.fixed[top][this.grid.length - 1] = true;
    this.fixed[top + 1][this.grid.length - 1] = true;
    // preform the swap
    const topRight = { x: this.grid.length - 1, y: top };
    this.moveEmptyTo(this.offsetPosition(topRight, 'l'));
    this.swapE(topRight);
    this.swapE(this.offsetPosition(topRight, 'd'));
    // lock proper pieces and unlock extra from next row
    this.fixed[top + 1][this.grid.length - 1] = false;
    this.fixed[topRight.y][topRight.x - 1] = true;
  };

  specialLeftBottomRotation = (left:any):void => {
    // lock the two pieces
    this.fixed[this.grid.length - 1][left] = true;
    this.fixed[this.grid.length - 1][left + 1] = true;
    // preform the swap
    const leftBottom = { x: left, y: this.grid.length - 1 };
    this.moveEmptyTo(this.offsetPosition(leftBottom, 'u'));
    this.swapE(leftBottom);
    this.swapE(this.offsetPosition(leftBottom, 'r'));
    // lock proper pieces and unlock extras from next column
    this.fixed[this.grid.length - 1][left + 1] = false;
    this.fixed[leftBottom.y - 1][leftBottom.x] = true;
  };

  getDirectionToProceed = (num:any, dest:any):string => {
    const cur = this.numbers[num];
    const diffx = dest.x - cur.x;
    const diffy = dest.y - cur.y;
    // case 1, we need to move left and are not being blocked
    if (diffx < 0 && this.moveable({ x: cur.x - 1, y: cur.y })) {
      return 'l';
    }
    // case 2, we need to move right and are not being blocked
    if (diffx > 0 && this.moveable({ x: cur.x + 1, y: cur.y })) {
      return 'r';
    }
    // case 3, we need to move up
    if (diffy < 0 && this.moveable({ x: cur.x, y: cur.y - 1 })) {
      return 'u';
    }
    // case 4, we need to move down
    if (diffy > 0 && this.moveable({ x: cur.x, y: cur.y + 1 })) {
      return 'd';
    }
    throw new Error(
      'There is no valid move, the puzzle was incorrectly shuffled'
    );
  };

  makeEmptyNeighborTo = (num:any):void => {
    const gotoPos = this.numbers[num];
    let counter = 1;
    while (
      (this.numbers[0].x !== gotoPos.x || this.numbers[0].y !== gotoPos.y)
      && !this.areNeighbors(0, num)
    ) {
      this.movingEmptyLoop(gotoPos);
      counter++;
      if (counter > 100) {
        throw new Error(
          // eslint-disable-next-line max-len
          'Infinite loop hit while solving the puzzle, it is quite likely this puzzle is invalid'
        );
      }
    }
  };

  moveEmptyTo = (pos:any):void => {
    // check to see if the pos is a fixed number
    if (this.fixed[pos.y][pos.x]) {
      throw new Error('cannot move empty to a fixed position');
    }
    let counter = 1;
    while (this.numbers[0].x !== pos.x || this.numbers[0].y !== pos.y) {
      this.movingEmptyLoop(pos);
      counter++;
      if (counter > 100) {
        console.log('problem trying to move the piece');
        break;
      }
    }
  };

  movingEmptyLoop = (pos:any):void => {
    const empty = this.numbers[0];
    const diffx = empty.x - pos.x;
    const diffy = empty.y - pos.y;
    if (diffx < 0 && this.canSwap(empty, this.offsetPosition(empty, 'r'))) {
      this.swap(empty, this.offsetPosition(empty, 'r'));
    } else if (
      diffx > 0
      && this.canSwap(empty, this.offsetPosition(empty, 'l'))
    ) {
      this.swap(empty, this.offsetPosition(empty, 'l'));
    } else if (
      diffy < 0
      && this.canSwap(empty, this.offsetPosition(empty, 'd'))
    ) {
      this.swap(empty, this.offsetPosition(empty, 'd'));
    } else if (
      diffy > 0
      && this.canSwap(empty, this.offsetPosition(empty, 'u'))
    ) {
      this.swap(empty, this.offsetPosition(empty, 'u'));
    }
  };

  offsetPosition = (pos:any, direction:any):any => {
    if (direction === 'u') {
      return { x: pos.x, y: pos.y - 1 };
    } if (direction === 'd') {
      return { x: pos.x, y: pos.y + 1 };
    } if (direction === 'l') {
      return { x: pos.x - 1, y: pos.y };
    } if (direction === 'r') {
      return { x: pos.x + 1, y: pos.y };
    } if (direction === 'ul') {
      return { x: pos.x - 1, y: pos.y - 1 };
    } if (direction === 'ur') {
      return { x: pos.x + 1, y: pos.y - 1 };
    } if (direction === 'dl') {
      return { x: pos.x - 1, y: pos.y + 1 };
    } if (direction === 'dr') {
      return { x: pos.x + 1, y: pos.y + 1 };
    }
    return pos;
  };

  areNeighbors = (first:any, second:any):any => {
    const num1 = this.numbers[first];
    const num2 = this.numbers[second];
    return (
      (Math.abs(num1.x - num2.x) === 1 && num1.y === num2.y)
      || (Math.abs(num1.y - num2.y) === 1 && num1.x === num2.x)
    );
  };

  moveable = (pos:any):any => this.validPos(pos) && !this.fixed[pos.y][pos.x];

  validPos = (pos:any):any => !(
    pos.x < 0
      || pos.x >= this.grid.length
      || pos.y < 0
      || pos.y >= this.grid.length
  );

  canSwap = (pos1:any, pos2:any):boolean => {
    if (!this.validPos(pos1) || !this.validPos(pos2)) {
      return false;
    }
    const num1 = this.grid[pos1.y][pos1.x];
    const num2 = this.grid[pos2.y][pos2.x];
    if (!this.areNeighbors(num1, num2)) {
      return false;
    }
    // check fixed positions
    return !(this.fixed[pos1.y][pos1.x] || this.fixed[pos2.y][pos2.x]);
  };

  swapE = (pos:any):void => {
    this.swap(this.numbers[0], pos);
  };

  swap = (pos1:any, pos2:any):void => {
    const num1 = this.grid[pos1.y][pos1.x];
    const num2 = this.grid[pos2.y][pos2.x];
    // guard against illegal moves
    if (!this.areNeighbors(num1, num2)) {
      throw new Error('These numbers are not neighbors and cannot be swapped');
    }
    if (num1 !== 0 && num2 !== 0) {
      throw new Error('You must swap with an empty space');
    }
    const oldPos1 = this.numbers[num1];
    this.numbers[num1] = this.numbers[num2];
    this.numbers[num2] = oldPos1;
    this.grid[pos1.y][pos1.x] = num2;
    this.grid[pos2.y][pos2.x] = num1;
    this.solution.push({
      empty: num1 === 0 ? pos1 : pos2,
      piece: num1 === 0 ? pos2 : pos1,
      number: num1 === 0 ? num2 : num1
    });
  };
}
