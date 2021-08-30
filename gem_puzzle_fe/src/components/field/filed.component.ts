// import { BoardType } from 'beamApiProps';
import { BoardType } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
// import BaseComponent from '../base/base.component';
// import Main from '../../components/main/main.component'

import './field.scss';

let empty: any 
export class Box {
  x: any;
  y: any;
  constructor(x: any, y: any) {
    this.x = x;
    this.y = y;
  }
  getEmptyBox(){
    if(this.x === 3 && this.y === 3){
      console.log(`empty ${this.x} , ${this.y}`)
    }
  }
  getTopBox() {
    if (this.y === 0) return null;
        return new Box(this.x, this.y - 1);
  }
  
  getRightBox() {
    if (this.x === 3) return null;
      return new Box(this.x + 1, this.y);
  }
  
  getBottomBox() {
    if (this.y === 3) return null;
    return new Box(this.x, this.y + 1);
  }
  
  getLeftBox() {
    if (this.x === 0) return null;
    
    return new Box(this.x - 1, this.y);
  }
  
  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox()
    ].filter(box => box !== null);
  }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)]&&console.log(nextdoorBoxes);;
    
  }
}
function swapBoxes(grid:any, box1:any, box2:any) {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
  console.log(temp);
};
function emptyBox(grid:any){
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if(grid[i][j] === 0) {
         empty = new Box(i,j)
         console.log(empty)
      }
    }
  }
}


const isSolved = (grid: any) => {
  emptyBox(grid)
  console.log(empty);
  return (
    grid[0][0] === 1 &&
    grid[0][1] === 2 &&
    grid[0][2] === 3 &&
    grid[0][3] === 4 &&
    grid[1][0] === 5 &&
    grid[1][1] === 6 &&
    grid[1][2] === 7 &&
    grid[1][3] === 8 &&
    grid[2][0] === 9 &&
    grid[2][1] === 10 &&
    grid[2][2] === 11 &&
    grid[2][3] === 12 &&
    grid[3][0] === 13 &&
    grid[3][1] === 14 &&
    grid[3][2] === 15 &&
    grid[3][3] === 0
  );
};

// function getRandomGrid():any{
//   let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

//   // Shuffle
//   let blankBox: Box | null | undefined = new Box(3, 3);
//   for (let i = 0; i < 1000; i++) {
//     const randomNextdoorBox:any = blankBox?.getRandomNextdoorBox();
//     swapBoxes(grid, blankBox, randomNextdoorBox);
//     blankBox = randomNextdoorBox;
//   }

//   if (isSolved(grid)) return getRandomGrid();
//   console.log(grid)
//   return grid;
// };
export class State {
  grid: any;
  move: any;
  time: any;
  status: any;
  
  constructor(grid: any, move: any, time: any, status: any) {
    this.grid = grid;
    this.move = move;
    this.time = time;
    this.status = status;
  }

  static ready(board: any) {
    return new State(
      board,
      0,
      0,
      "ready"
    );
  }

  static start = (board: BoardType | undefined) =>{
    return new State(board, 0, 0, "playing");
  }
}
export class Field {
  static tickId: any;
  [x: string]: any;
  state: any;
  tickId: any;
  constructor(state:any) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);

  }
  static ready = (board: BoardType)=> {
      return new Field(State.start(board));
  }

  tick() {
    this.setState({ time: this.state.time + 1 });
  }

  setState(newState: { time: any; }) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleClickBox(box: { getNextdoorBoxes: () => any; }) {
    return () => {
      const nextdoorBoxes = box.getNextdoorBoxes();
      console.log(nextdoorBoxes);
      
      const blankBox = nextdoorBoxes.find(
        (        nextdoorBox: { y: string | number; x: string | number; }) => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
        );
        if (blankBox) {
          
          const newGrid = [...this.state.grid];
          swapBoxes(newGrid, box, blankBox);
          if (isSolved(newGrid)) {
            clearInterval(Field.tickId);
            this.setState({
              // @ts-ignore: Object is possibly 'null'.
              status: "won",
              grid: newGrid,
              move: this.state.move + 1
            });
          } else {
            this.setState({
              // @ts-ignore: Object is possibly 'null'.
              grid: newGrid,
              move: this.state.move + 1
            });
          }
      }
      // @ts-ignore: Object is possibly 'null'.
    }  }

  render() {
    const { grid, move, time, status } = this.state;

    // Render grid
    const main = document.querySelector('.main')
    const newGrid: any = document.createElement(Tags.DIV)
    newGrid.classList.add('field')
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const button = document.createElement(Tags.BUTTON);
        main?.append(newGrid)
        button.classList.add('button')
        if (status === "playing") {
          // @ts-ignore: Object is possibly 'null'.
          button.addEventListener("click", this.handleClickBox(new Box(j, i)));
        }
        
        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        // console.log(newGrid)
          // @ts-ignore: Object is possibly 'null'.
        // console.log(this.main)
        // @ts-ignore: Object is possibly 'null'.
        
        newGrid.appendChild(button);
      }
    }
    // @ts-ignore: Object is possibly 'null'.
          document.querySelector(".field").replaceWith(newGrid);

    // Render button
    const newButton:any = document.createElement(Tags.BUTTON);
    if (status === "ready") newButton.textContent = "Play";
    if (status === "playing") newButton.textContent = "Reset";
    if (status === "won") alert('YOU WIN');
    newButton.addEventListener("click", () => {
      clearInterval(Field.tickId);
      Field.tickId = setInterval(this.tick, 1000);
      this.setState(State.start(this.board));
    });
    document.querySelector(".footer button")?.replaceWith(newButton);
// @ts-ignore: Object is possibly 'null'.
    // Render move
    document.getElementById("move").textContent = `Move: ${move}`;
// @ts-ignore: Object is possibly 'null'.
    // Render time
    document.getElementById("time").textContent = `Time: ${time}`;
// @ts-ignore: Object is possibly 'null'.
    // Render message
    
    if (status === "won") {
      // @ts-ignore: Object is possibly 'null'.
      document.querySelector(".message").textContent = "You win!";
    } else {
      // @ts-ignore: Object is possibly 'null'.
      document.querySelector(".message").textContent = "";
    }
  }
}

