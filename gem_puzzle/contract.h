#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 0c64724d9a4b65cbe692fd0eae0ad7a3cbb2bb6fb401a7ff41cd7fdf067d5d15
	static const ShaderID s_SID = {0x0c,0x64,0x72,0x4d,0x9a,0x4b,0x65,0xcb,0xe6,0x92,0xfd,0x0e,0xae,0x0a,0xd7,0xa3,0xcb,0xb2,0xbb,0x6f,0xb4,0x01,0xa7,0xff,0x41,0xcd,0x7f,0xdf,0x06,0x7d,0x5d,0x15};

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
