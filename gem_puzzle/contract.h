#pragma once

namespace GemPuzzle {
	// SID: 
	static const ShaderID s_SID = {};

#pragma pack(push, 1)

	struct NewGameParams {
		static const uint32_t METHOD = 2;
		Height height;
		PubKey player;
		uint64_t permutation_num;
		bool cancel_previous_game;
	};

	struct GameInfo {
		NewGameParams ngparams;
		// Will be completed later
	};

#pragma pack(pop)
}
