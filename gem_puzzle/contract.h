#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 2c2da023826d3bfc62260bbf7f32b95c3103b5298e35a82db50d7693ccd65ecd
static const ShaderID s_SID = {0x2c,0x2d,0xa0,0x23,0x82,0x6d,0x3b,0xfc,0x62,0x26,0x0b,0xbf,0x7f,0x32,0xb9,0x5c,0x31,0x03,0xb5,0x29,0x8e,0x35,0xa8,0x2d,0xb5,0x0d,0x76,0x93,0xcc,0xd6,0x5e,0xcd};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct NewGameParams {
		static const uint32_t METHOD = 2;
		Height height;
		PubKey player;
		uint64_t permutation_num;
		bool cancel_previous_game;
	};

	struct CheckSolutionParams {
		static const uint32_t METHOD = 3;
		char solution[SOLUTION_BUF_SIZE];	
		PubKey player;
	};

	struct EndGameParams {
		static const uint32_t METHOD = 4;
		PubKey player;
	};

	struct GameResult {
		Verdict verdict;
		uint32_t moves_num;
		Height time;
	};

	struct GameInfo {
		NewGameParams ngparams;
		uint64_t game_id;
	};

#pragma pack(pop)
}
