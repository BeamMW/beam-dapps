#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: f577b8137258518138042f5bae3b4ad2587fc3fa76948913cb68f5a5c3411b0a
	static const ShaderID s_SID = {0xf5,0x77,0xb8,0x13,0x72,0x58,0x51,0x81,0x38,0x04,0x2f,0x5b,0xae,0x3b,0x4a,0xd2,0x58,0x7f,0xc3,0xfa,0x76,0x94,0x89,0x13,0xcb,0x68,0xf5,0xa5,0xc3,0x41,0x1b,0x0a};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct InitialParams {
		static const uint32_t METHOD = 0;
		Amount max_bet;
		Amount multiplier;
		Height free_time;
		uint64_t last_used_game_id;
		uint32_t game_speed;
	};

	struct NewGameParams {
		static const uint32_t METHOD = 2;
		Height height;
		Amount bet;
		PubKey player;
		uint64_t permutation_num;
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

	struct TakePendingRewards {
		static const uint32_t METHOD = 5;
		PubKey player;
	};

	struct GameResult {
		Verdict verdict;
		uint32_t moves_num;
		Height time;
		PubKey player;
	};

	struct GameInfo {
		NewGameParams ngparams;
		uint64_t game_id;
	};

	struct AccountInfo {
		GameInfo game_info;
		GameResult game_result;
		Amount pending_rewards;
		bool has_active_game;
	};

#pragma pack(pop)
}
