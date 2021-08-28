#include "board.h"

namespace GemPuzzle {
	GemPuzzle::Board::Board(uint64_t permutation_num)
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

	bool GemPuzzle::Board::is_solved()
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

	bool GemPuzzle::Board::move(GemPuzzle::Board::Moves m)
	{
		auto old_empty_cell = empty_cell;
		const int8_t dx[] = { 1, -1, 0, 0 };
		const int8_t dy[] = { 0, 0, -1, 1 };

		switch (m) {
		case RIGHT: case LEFT: case UP: case DOWN:
			empty_cell.x += dx[static_cast<uint8_t>(m)];
			empty_cell.y += dy[static_cast<uint8_t>(m)];
			if (empty_cell.x >= BOARD_SIZE || empty_cell.y >= BOARD_SIZE)
				return false;
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
			return false;
		}
#ifdef DEBUG
		for (size_t k = 0; k < BOARD_SIZE; ++k) {
			for (size_t j = 0; j < BOARD_SIZE; ++j) {
				std::cout << (int)this->board[k][j] << " ";
			}
			std::cout << std::endl;
		}
#endif // DEBUG
		return true;
	}
}
