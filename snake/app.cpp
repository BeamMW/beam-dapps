#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"


void OnError(const char* msg)
{
    Env::DocAddText("error", msg);
}

void DeriveMyPk(PubKey& pubKey, const ContractID& cid)
{
    Env::DerivePk(pubKey, &cid, sizeof(cid));
}

SnakeBody::SnakeBody()
{
}


SnakeBody::SnakeBody(int x, int y): mX(x), mY(y)
{
}

int SnakeBody::getX() const
{
    return mX;
}

int SnakeBody::getY() const
{
    return mY;
}

bool SnakeBody::operator == (const SnakeBody& snakeBody)
{
    return (this->getX() == snakeBody.getX() && this->getY() == snakeBody.getY());
}

Snake::Snake(int gameBoardWidth, int gameBoardHeight, int initialSnakeLength): mGameBoardWidth(gameBoardWidth), mGameBoardHeight(gameBoardHeight), mInitialSnakeLength(initialSnakeLength)
{
    this->initializeSnake();
    this->setRandomSeed();
}

void Snake::setRandomSeed()
{
    std::srand(std::time(nullptr));
}

void Snake::initializeSnake()
{
    int centerX = this->mGameBoardWidth / 2;
    int centerY = this->mGameBoardHeight / 2;

    for (int i = 0; i < this->mInitialSnakeLength; i ++)
    {
        this->mSnake.push_back(SnakeBody(centerX, centerY + i));
    }
    this->mDirection = Direction::Up;
}

bool Snake::isPartOfSnake(int x, int y)
{
    SnakeBody temp = SnakeBody(x, y);
    for (int i = 0; i < this->mSnake.size(); i ++)
    {
        if (this->mSnake[i] == temp)
        {
            return true;
        }
    }
    return false;
}


bool Snake::hitWall()
{
    SnakeBody& head = this->mSnake[0];
    int headX = head.getX();
    int headY = head.getY();
    if (headX <= 0 || headX >= this->mGameBoardWidth - 1)
    {
        return true;
    }
    if (headY <= 0 || headY >= this->mGameBoardHeight - 1)
    {
        return true;
    }
    return false;
}

bool Snake::hitSelf()
{
    SnakeBody& head = this->mSnake[0];
    for (int i = 1; i < this->mSnake.size(); i ++)
    {
        if (this->mSnake[i] == head)
        {
            return true;
        }
    }
    return false;
}


bool Snake::touchToken()
{
    SnakeBody newHead = this->createNewHead();
    if (this->mToken == newHead)
    {
        return true;
    }
    else
    {
        return false;
    }
}

void Snake::senseToken(SnakeBody token)
{
    this->mToken = token;
}

std::vector<SnakeBody>& Snake::getSnake()
{
    return this->mSnake;
}

bool Snake::changeDirection(Direction newDirection)
{
    switch (this->mDirection)
    {
        case Direction::Up:
        {
            if (newDirection == Direction::Left || newDirection == Direction::Right)
            {
                this->mDirection = newDirection;
                return true;
            }
            else
            {
                return false;
            }
        }
        case Direction::Down:
        {
            if (newDirection == Direction::Left || newDirection == Direction::Right)
            {
                this->mDirection = newDirection;
                return true;
            }
            else
            {
                return false;
            }
        }
        case Direction::Left:
        {
            if (newDirection == Direction::Up || newDirection == Direction::Down)
            {
                this->mDirection = newDirection;
                return true;
            }
            else
            {
                return false;
            }
        }
        case Direction::Right:
        {
            if (newDirection == Direction::Up || newDirection == Direction::Down)
            {
                this->mDirection = newDirection;
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    return false;
}


SnakeBody Snake::createNewHead()
{
    SnakeBody& head = this->mSnake[0];
    int headX = head.getX();
    int headY = head.getY();
    int headXNext;
    int headYNext;

    switch (this->mDirection)
    {
        case Direction::Up:
        {
            headXNext = headX;
            headYNext = headY - 1;
            break;
        }
        case Direction::Down:
        {
            headXNext = headX;
            headYNext = headY + 1;
            break;
        }
        case Direction::Left:
        {
            headXNext = headX - 1;
            headYNext = headY;
            break;
        }
        case Direction::Right:
        {
            headXNext = headX + 1;
            headYNext = headY;
            break;
        }
    }

    SnakeBody newHead = SnakeBody(headXNext, headYNext);

    return newHead;
}

bool Snake::moveFoward()
{
    if (this->touchToken())
    {
        SnakeBody newHead = this->mToken;
        this->mSnake.insert(this->mSnake.begin(), newHead);
        return true;
    }
    else
    {
        this->mSnake.pop_back();
        SnakeBody newHead = this->createNewHead();
        this->mSnake.insert(this->mSnake.begin(), newHead);
        return false;
    }
}

bool Snake::checkCollision()
{
    if (this->hitWall() || this->hitSelf())
    {
        return true;
    }
    else
    {
        return false;
    }
}


int Snake::getLength()
{
    return this->mSnake.size();
}

void initializeGame()
{
    this->mPtrSnake.reset(new Snake(this->mGameBoardWidth, this->mGameBoardHeight, this->mInitialSnakeLength));
    this->createRamdonFood();
    this->mPtrSnake->senseFood(this->mFood);
    this->mDifficulty = 0;
    this->mPoints = 0;
    this->mDelay = this->mBaseDelay;
}

void controlSnake() const
{
    int key;
    key = getch();
    switch(key)
    {
        case 'W':
        case 'w':
        case KEY_UP:
        {
            this->mPtrSnake->changeDirection(Direction::Up);
            break;
        }
        case 'S':
        case 's':
        case KEY_DOWN:
        {
            this->mPtrSnake->changeDirection(Direction::Down);
            break;
        }
        case 'A':
        case 'a':
        case KEY_LEFT:
        {
            this->mPtrSnake->changeDirection(Direction::Left);
            break;
        }
        case 'D':
        case 'd':
        case KEY_RIGHT:
        {
            this->mPtrSnake->changeDirection(Direction::Right);
            break;
        }
        default:
        {
            break;
        }
    }
}

void createRamdonFood()
{
    std::vector<SnakeBody> availableGrids;
    for (int i = 1; i < this->mGameBoardHeight - 1; i ++)
    {
        for (int j = 1; j < this->mGameBoardWidth - 1; j ++)
        {
            if(this->mPtrSnake->isPartOfSnake(j, i))
            {
                continue;
            }
            else
            {
                availableGrids.push_back(SnakeBody(j, i));
            }
        }
    }

    int random_idx = std::rand() % availableGrids.size();
    this->mFood = availableGrids[random_idx];
}

void On_action_new_game(const ContractID& cid)
{
    BlockHeader::Info hdr;
    hdr.m_Height = Env::get_Height();
    Env::get_HdrInfo(hdr);

    uint64_t seed = 0;
    Env::Memcpy(&seed, &hdr.m_Hash.m_p, 32);
    

    Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game", 0);
}

void On_action_create_contract(const ContractID& unused)
{
    Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0, nullptr, 0, "Create GemPuzzle contract", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
    Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0, "Destroy GemPuzzle contract", 0);
}

void On_action_view_contracts(const ContractID& unused)
{
    EnumAndDumpContracts(GemPuzzle::s_SID);
}

BEAM_EXPORT void Method_0()
{
    Env::DocGroup root("");

    {
        Env::DocGroup gr("roles");
        {
            Env::DocGroup grRole("manager");
            {
                Env::DocGroup grMethod("create_contract");
            }
            {
                Env::DocGroup grMethod("destroy_contract");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_contracts");
            }
        }
        {
            Env::DocGroup grRole("player");
            {
                Env::DocGroup grMethod("new_game");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("cancel_previous_game", "uint32");
            }
        }
    }
}

BEAM_EXPORT void Method_1()
{
    const std::vector<std::pair<const char *, Action_func_t>> VALID_PLAYER_ACTIONS = {
        {"new_game", On_action_new_game},
        {"touch_food", On_action_touch_food},
        {"check_win", On_action_view_check_win},
    };

    const std::vector<std::pair<const char *, Action_func_t>> VALID_MANAGER_ACTIONS = {
        {"create_contract", On_action_create_contract},
        {"destroy_contract", On_action_destroy_contract},
        {"view_contracts", On_action_view_contracts},
    };

    const std::vector<std::pair<const char *, const std::vector<std::pair<const char *, Action_func_t>>&>> VALID_ROLES = {
        {"player", VALID_PLAYER_ACTIONS},
        {"manager", VALID_MANAGER_ACTIONS},
    };

    char action[ACTION_BUF_SIZE], role[ROLE_BUF_SIZE];

    if (!Env::DocGetText("role", role, sizeof(role))) {
        return On_error("Role not specified");
    }
    
    auto it_role = find_if_contains(role, VALID_ROLES);

    if (it_role == VALID_ROLES.end()) {
        return On_error("Invalid role");
    }

    if (!Env::DocGetText("action", action, sizeof(action))) {
        return On_error("Action not specified");
    }

    auto it_action = find_if_contains(action, it_role->second);

    if (it_action != it_role->second.end()) {
        ContractID cid;
        Env::DocGet("cid", cid);
        it_action->second(cid);
    } else {
        On_error("Invalid action");
    }
}
