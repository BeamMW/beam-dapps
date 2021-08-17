#include "Shaders/common.h"
#include "contract.h"

#include <algorithm>
#include <random>

constexpr size_t SOLUTION_BUF_SIZE = 8192;
constexpr size_t BOARD_SIZE = 4;
constexpr size_t PERMUTATION_LEN = BOARD_SIZE * BOARD_SIZE - 1;

constexpr uint64_t factorial(uint8_t n)
{
	return (n == 0 ? 1 : n * factorial(n - 1));
}

void On_action_new_game(const ContractID& cid)
{
	//Height cur_height = Env::get_Height();
	BlockHeader::Info hdr;
	hdr.m_Height = Env::get_Height();
	Env::get_HdrInfo(hdr);

	uint64_t seed = 0;
	Env::Memcpy(&seed, &hdr.m_Hash.m_p, 32);
	Env::DocAddNum64("Debug_seed", seed);
	// TODO: seed * game_number
	
	std::mt19937_64 gen(seed);
	std::uniform_int_distribution<uint64_t> distrib(2, factorial(PERMUTATION_LEN));

	uint64_t permutation_num = distrib(gen);

	GemPuzzle::NewGameParams params;

	Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game", 0);

	Env::DocAddNum64("permutation", permutation_num);
	// TODO: add game_number
}

bool check_solution(uint64_t permutation_num, const char* solution, uint32_t& moves_num)
{
	class Board {
	public:
		enum Moves { RIGHT, LEFT, UP, DOWN, CLOCKWISE, COUNTERCLOCKWISE };

		Board(uint64_t permutation_num)
		{
			bool used[PERMUTATION_LEN + 1];
			std::fill(used, used + PERMUTATION_LEN + 1, false);
			for (size_t i = 0; i < BOARD_SIZE; ++i) {
				for (size_t j = 0; j < BOARD_SIZE; ++j) {
					if (i * BOARD_SIZE + j == PERMUTATION_LEN) { // empty block
						board[i][j] = 0;
					} else {
						uint64_t cur_factorial = factorial(PERMUTATION_LEN - (i * BOARD_SIZE + j) - 1);
						auto numbers_before = permutation_num / cur_factorial;
						permutation_num %= cur_factorial;
						size_t free_numbers = 0;
						for (size_t k = 1; k <= PERMUTATION_LEN; ++k) {
							if (!used[k]) {
								++free_numbers;
								if (free_numbers == numbers_before + 1) {
									board[i][j] = k;
									used[k] = true;
								}
							}
						}
					}
				}
			}
		}

		bool is_solved()
		{
			uint8_t cur_value = 1;
			bool result = true;
			for (size_t i = 0; i < BOARD_SIZE; ++i)
				for (size_t j = 0; j < BOARD_SIZE; ++j) {
					if (i * BOARD_SIZE + j == PERMUTATION_LEN)
						cur_value = 0;
					result &= (board[i][j] == cur_value);
					++cur_value;
				}

			return result;
		}

		void move(Moves m)
		{
			auto old_empty_cell = empty_cell;
			const int8_t dx[] = { 1, -1, 0, 0 };
			const int8_t dy[] = { 0, 0, -1, 1 };

			// TODO: add error on invalid moves

			switch (m) {
			case RIGHT: case LEFT: case UP: case DOWN:
				empty_cell.x += dx[static_cast<uint8_t>(m)];
				empty_cell.y += dy[static_cast<uint8_t>(m)];
				std::swap(board[old_empty_cell.y][old_empty_cell.x], board[empty_cell.y][empty_cell.x]);
				break;
			case CLOCKWISE:
				for (size_t i = 0; i < BOARD_SIZE / 2; ++i)
					for (size_t j = i; j < BOARD_SIZE - i - 1; ++j) {
						std::swap(board[i][j], board[j][BOARD_SIZE - i - 1]);
						std::swap(board[i][j], board[BOARD_SIZE - i - 1][BOARD_SIZE - j - 1]);
						std::swap(board[i][j], board[BOARD_SIZE - j - 1][i]);
					}
				std::swap(empty_cell.x, empty_cell.y);
				empty_cell.x = BOARD_SIZE - empty_cell.x - 1;
				break;
			case COUNTERCLOCKWISE:
				for (size_t i = 0; i < BOARD_SIZE / 2; ++i)
					for (size_t j = i; j < BOARD_SIZE - i - 1; ++j) {
						std::swap(board[i][j], board[BOARD_SIZE - j - 1][i]);
						std::swap(board[i][j], board[BOARD_SIZE - i - 1][BOARD_SIZE - j - 1]);
						std::swap(board[i][j], board[j][BOARD_SIZE - i - 1]);
					}
				std::swap(empty_cell.x, empty_cell.y);
				empty_cell.y = BOARD_SIZE - empty_cell.y - 1;
				break;
			default:
				break;
			}
		}

	private:
		uint8_t board[BOARD_SIZE][BOARD_SIZE];
		struct {
			uint8_t x;
			uint8_t y;
		} empty_cell;
	} board(permutation_num);

	for (auto i = 0; solution[i] != '\0'; ++i) {
		Board::Moves cur_move;
		switch (toupper(solution[i])) {
		case 'R':
			cur_move = Board::RIGHT;
			break;
		case 'L':
			cur_move = Board::LEFT;
			break;
		case 'U':
			cur_move = Board::UP;
			break;
		case 'D':
			cur_move = Board::DOWN;
			break;
		case 'F':
			cur_move = Board::CLOCKWISE;
			break;
		case 'B':
			cur_move = Board::COUNTERCLOCKWISE;
			break;
		default:
			// TODO: add error
			return false;
		}
		board.move(cur_move);
	}
	return board.is_solved();
}

void On_action_check_solution(const ContractID& cid)
{
	uint32_t gameID = 0;
	Env::DocGetNum32("gameID", &gameID);

	char solution[SOLUTION_BUF_SIZE];
	Env::DocGetText("solution", solution, sizeof(solution));

	uint64_t permutation_num = 0;
	// TODO: read permutation and height by gameID
	uint32_t moves_num = 0;
	Env::DocAddGroup("");
	Env::DocAddText("verdict", check_solution(permutation_num, solution, moves_num) ? "win" : "lose");
	Env::DocAddNum32("moves", moves_num);

	// Env::get_Height()
	// TODO: calculate time

	//Env::DocAddNum64("time (min)", time);
	Env::DocCloseGroup();
}

export void Method_0()
{
}

export void Method_1()
{
	
}
