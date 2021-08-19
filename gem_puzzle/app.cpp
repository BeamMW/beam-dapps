#ifndef ENABLE_UNIT_TESTS_
#	include "Shaders/common.h"
#	include "contract.h"
#else
#	include <gtest/gtest.h>
#endif	// ENABLE_UNIT_TESTS_

#include <algorithm>
#include <bitset>
#include <iostream>
#include <random>

constexpr size_t SOLUTION_BUF_SIZE = 8192;
constexpr uint8_t BOARD_SIZE = 4;
constexpr uint8_t PERMUTATION_LEN = BOARD_SIZE * BOARD_SIZE - 1;

constexpr uint64_t factorial(uint8_t n)
{
	return (n == 0 ? 1 : n * factorial(n - 1));
}

#ifndef ENABLE_UNIT_TESTS_
void On_action_new_game(const ContractID& cid)
{
	BlockHeader::Info hdr;
	hdr.m_Height = Env::get_Height();
	Env::get_HdrInfo(hdr);

	uint64_t seed = 0;
	Env::Memcpy(&seed, &hdr.m_Hash.m_p, 32);
#ifdef DEBUG
	Env::DocAddNum64("Debug_seed", seed);
#endif // DEBUG
	
	std::mt19937_64 gen(seed);
	std::uniform_int_distribution<uint64_t> distrib(1, factorial(PERMUTATION_LEN) - 1);

	uint64_t permutation_num = distrib(gen);

	GemPuzzle::NewGameParams params;

	uint32_t tmp;
	Env::DocGetNum32("cancel_previous_game", &tmp);
	params.cancel_previous_game = !!tmp;

	Env::DerivePk(params.player, &cid, sizeof(cid));
	params.height = hdr.m_Height;
	params.permutation_num = permutation_num;

	Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game", 0);

	Env::DocAddNum64("permutation", permutation_num);
}
#endif // ENABLE_UNIT_TESTS_

bool check_solution(uint64_t permutation_num, const char* solution, uint32_t& moves_num)
{
	class Board {
	public:
		enum Moves { RIGHT, LEFT, UP, DOWN, CLOCKWISE, COUNTERCLOCKWISE };

		Board(uint64_t permutation_num)
		{
			std::bitset<PERMUTATION_LEN + 1> used;
			for (uint8_t i = 0; i < BOARD_SIZE; ++i) {
				for (uint8_t j = 0; j < BOARD_SIZE; ++j) {
					if (i * BOARD_SIZE + j == PERMUTATION_LEN) { // empty block
						board[i][j] = 0;
						empty_cell = { j, i };
					} else {
						uint64_t cur_factorial = factorial(PERMUTATION_LEN - (i * BOARD_SIZE + j) - 1);
						auto numbers_before = permutation_num / cur_factorial;
						permutation_num %= cur_factorial;
						size_t free_numbers = 0;
						for (size_t k = 1; k <= PERMUTATION_LEN; ++k) {
							if (!used.test(k)) {
								++free_numbers;
								if (free_numbers == numbers_before + 1) {
									board[i][j] = k;
									used.set(k);
									break;
								}
							}
						}
					}
				}
			}
#ifdef DEBUG
			for (size_t i = 0; i < BOARD_SIZE; ++i) {
				for (size_t j = 0; j < BOARD_SIZE; ++j) {
					std::cout << (int)this->board[i][j] << " ";
				}
				std::cout << std::endl;
			}
#endif // DEBUG
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
			case CLOCKWISE: case COUNTERCLOCKWISE: {
				for (size_t i = 0; i < BOARD_SIZE / 2; ++i)
					for (size_t j = i; j < BOARD_SIZE - i - 1; ++j) {
						std::swap(board[i][j], m == CLOCKWISE ? board[j][BOARD_SIZE - i - 1] : board[BOARD_SIZE - j - 1][i]);
						std::swap(board[i][j], board[BOARD_SIZE - i - 1][BOARD_SIZE - j - 1]);
						std::swap(board[i][j], m == CLOCKWISE ? board[BOARD_SIZE - j - 1][i] : board[j][BOARD_SIZE - i - 1]);
					}
				std::swap(empty_cell.x, empty_cell.y);
				(m == CLOCKWISE ? empty_cell.x : empty_cell.y) = BOARD_SIZE - (m == CLOCKWISE ? empty_cell.x : empty_cell.y) - 1;
				break;
			}
			default:
				break;
			}
#ifdef DEBUG
			for (size_t k = 0; k < BOARD_SIZE; ++k) {
				for (size_t j = 0; j < BOARD_SIZE; ++j) {
					std::cout << (int)this->board[k][j] << " ";
				}
				std::cout << std::endl;
			}
#endif // DEBUG
		}

	private:
		uint8_t board[BOARD_SIZE][BOARD_SIZE];
		struct {
			uint8_t x;
			uint8_t y;
		} empty_cell;
	} board(permutation_num);

	moves_num = 0;
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
		++moves_num;
	}
	return board.is_solved();
}

#ifndef ENABLE_UNIT_TESTS_
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
#endif // ENABLE_UNIT_TESTS_

#ifdef ENABLE_UNIT_TESTS_
uint64_t _permutation_to_num(const std::vector<int>& permutation) {
	std::bitset<PERMUTATION_LEN + 1> used;
	uint64_t res = 0;
	for (size_t i = 0; i < permutation.size(); ++i) {
		uint64_t cur_factorial = factorial(permutation.size() - i - 1);
		res += cur_factorial * (permutation[i] - 1 - (used << (permutation.size() - permutation[i] + 1)).count());
		used.set(permutation[i]);
	}
	return res;
}

TEST(FactorialTest, ZeroInput) {
	ASSERT_EQ(factorial(0), 1);
}

TEST(FactorialTest, PositiveInput) {
	ASSERT_EQ(factorial(1), 1);
	ASSERT_EQ(factorial(2), 2);
	ASSERT_EQ(factorial(3), 6);
	ASSERT_EQ(factorial(4), 24);
	ASSERT_EQ(factorial(15), 1307674368000);
}

TEST(CheckSolutionTest, BoardRotations) {
	uint32_t moves_num;

	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "FFFF", moves_num));
	ASSERT_EQ(moves_num, 4);
	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "BBBB", moves_num));
	ASSERT_EQ(moves_num, 4);

	// 4 8 12 15
	// 3 7 11 14
	// 2 6 10 13
	// 1 5 9 *
	ASSERT_TRUE(check_solution(_permutation_to_num({4, 8, 12, 15, 3, 7, 11, 14, 2, 6, 10, 13, 1, 5, 9}), "FRRR", moves_num));
	ASSERT_EQ(moves_num, 4);

	// 13 9 5 1
	// 14 10 6 2
	// 15 11 7 3
	// 12 8 4 *
	ASSERT_TRUE(check_solution(_permutation_to_num({13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3, 12, 8, 4}), "BDDD", moves_num));
	ASSERT_EQ(moves_num, 4);
}

TEST(CheckSolutionTest, ValidMoves) {
	uint32_t moves_num;

	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "UDUD", moves_num));
	ASSERT_EQ(moves_num, 4);
	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "LR", moves_num));
	ASSERT_EQ(moves_num, 2);
	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "ULDRULDRULDR", moves_num));
	ASSERT_EQ(moves_num, 12);
}

TEST(CheckSolutionTest, AlreadySolved) {
	uint32_t moves_num;

	ASSERT_TRUE(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "", moves_num));
	ASSERT_EQ(moves_num, 0);
}

int main()
{
	testing::InitGoogleTest();
	return RUN_ALL_TESTS();
}
#endif // ENABLE_UNIT_TESTS_
