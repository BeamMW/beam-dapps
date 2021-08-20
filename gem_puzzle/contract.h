#pragma once

namespace GemPuzzle {
	// SID: 4b323638d8f5854d0db755a308b2233d37a4feeba03ce483d51232eb59e8ddf1
static const ShaderID s_SID = {0x4b,0x32,0x36,0x38,0xd8,0xf5,0x85,0x4d,0x0d,0xb7,0x55,0xa3,0x08,0xb2,0x23,0x3d,0x37,0xa4,0xfe,0xeb,0xa0,0x3c,0xe4,0x83,0xd5,0x12,0x32,0xeb,0x59,0xe8,0xdd,0xf1};

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
		PubKey player;
		Verdict verdict;
	};

	struct GameInfo {
		NewGameParams ngparams;
		// Will be completed later
	};

#pragma pack(pop)
}
