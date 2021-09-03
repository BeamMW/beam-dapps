#pragma once

#include <bitset>
#include <cstddef>
#include <cstdint>

constexpr uint64_t factorial(uint8_t n)
{
	return (n == 0 ? 1 : n * factorial(n - 1));
}

namespace GemPuzzle {
	class Board {
	public:
		static constexpr size_t BOARD_SIZE = 4;
		static constexpr uint8_t PERMUTATION_LEN = BOARD_SIZE * BOARD_SIZE - 1;

		enum Moves { RIGHT, LEFT, UP, DOWN };

		Board(uint64_t permutation_num);

		bool is_solved();
		bool is_solvable();
		bool move(Moves m);
		uint8_t get(size_t i, size_t j)
		{
			return board[i][j];
		}

	private:
		uint8_t board[BOARD_SIZE][BOARD_SIZE];
		struct {
			uint8_t x;
			uint8_t y;
		} empty_cell;
	};
}
