#ifndef SNAKE_H
#define SNAKE_H

#include <vector>

enum class Direction
{
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
};

class SnakeBody
{
public:
    SnakeBody();
    SnakeBody(int x, int y);
    int getX() const;
    int getY() const;
    bool operator == (const SnakeBody& snakeBody);
private:
    int mX;
    int mY;
};

class Snake
{
public:
    Snake(int gameBoardWidth, int gameBoardHeight, int initialSnakeLength);
    void setRandomSeed();
    void initializeSnake();
    bool isPartOfSnake(int x, int y);
    void senseFood(SnakeBody food);
    bool hitWall();
    bool touchFood();
    bool hitSelf();
    bool checkCollision();
    bool changeDirection(Direction newDirection);
    std::vector<SnakeBody>& getSnake();
    int getLength();
    SnakeBody createNewHead();
    bool moveFoward();

private:
    const int mGameBoardWidth;
    const int mGameBoardHeight;
    const int mInitialSnakeLength;
    Direction mDirection;
    SnakeBody mFood;
    std::vector<SnakeBody> mSnake;
};

#endif
