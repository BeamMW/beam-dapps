#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 9c13f76319b16ca6b5280b893e8507923383066689f07035cfd3272234230d01
	static const ShaderID s_SID = {0x9c,0x13,0xf7,0x63,0x19,0xb1,0x6c,0xa6,0xb5,0x28,0x0b,0x89,0x3e,0x85,0x07,0x92,0x33,0x83,0x06,0x66,0x89,0xf0,0x70,0x35,0xcf,0xd3,0x27,0x22,0x34,0x23,0x0d,0x01};

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
		uint64_t permutation_num;
		Verdict verdict;
		uint32_t moves_num;
		Height time;
		PubKey player;
	};

	struct GameInfo {
		NewGameParams ngparams;
	};

	struct AccountInfo {
		GameInfo game_info;
		GameResult game_result;
		Amount pending_rewards;
		bool has_active_game;
	};

#pragma pack(pop)
}
