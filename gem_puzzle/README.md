# Gem Puzzle (15 puzzle)
The 15 puzzle (also called Gem Puzzle, Boss Puzzle, Game of Fifteen, Mystic Square and many others) is a sliding puzzle having 15 square tiles numbered 1–15 in a 4x4 frame, leaving one unoccupied tile position. Tiles in the same row or column of the open position can be moved by sliding them horizontally or vertically, respectively. The goal of the puzzle is to place the tiles in numerical order.
## Implementation features
In this particular implementation of this game there are two additional moves: move the whole board clockwise and counterclockwise.  
Ex.:  
| 1 | 2 | 3 | 4 |   
| 5 | 6 | 7 | 8 |  
| 9 |10|11|12|  
|13|14|15| * |  

After clockwise rotation:  

|13| 9 | 5 | 1 |  
|14|10| 6 | 2 |  
|15|11| 7 | 3 |  
| * |12| 8 | 4 |  
## How to play (cli)
1. Create new game:
```bash
./beam-wallet-masternet -n <your_local_node_address> shader --shader_app_file=<path_to_app.wasm>  --shader_args="action=new_game,cid=596f78d9d2ef4d12b0387e9c191ee45f43ca328f2a17b91664884f4847071c6f"
```
Note: if you already start new game and can't solve it, you can generate another game. To do this add `cancel_previous_game=1` to application shader parameters.

2. Show you current game board:
```bash
./beam-wallet-masternet -n <your_local_node_address> shader --shader_app_file=<path_to_app.wasm>  --shader_args="action=view_current_game_board,cid=596f78d9d2ef4d12b0387e9c191ee45f43ca328f2a17b91664884f4847071c6f"
```

3. Solve it :)
  
4. Send your solution as a string in the following format:  
```
U -- move empty cell up;  
D -- move empty cell down;  
L -- move empty cell left;  
R -- move empty cell right;  
F -- rotate board clockwise;  
B -- rotate board counterclockwise.  
```
Ex.:  
```bash
./beam-wallet-masternet -n <your_local_node_address> shader --shader_app_file=<path_to_app.wasm>  --shader_args="action=check_solution,solution=uuubrrrdldrd,cid=596f78d9d2ef4d12b0387e9c191ee45f43ca328f2a17b91664884f4847071c6f"
```
