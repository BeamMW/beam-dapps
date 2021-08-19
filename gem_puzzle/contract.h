#pragma once

namespace GemPuzzle {
	// SID: 
	static const ShaderID s_SID = {};

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
