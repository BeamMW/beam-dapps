#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: ff31db917ddc15db9f740d2676c344a136955582da6009a1d7670fcdc3f5a5fe
static const ShaderID s_SID = {0xff,0x31,0xdb,0x91,0x7d,0xdc,0x15,0xdb,0x9f,0x74,0x0d,0x26,0x76,0xc3,0x44,0xa1,0x36,0x95,0x55,0x82,0xda,0x60,0x09,0xa1,0xd7,0x67,0x0f,0xcd,0xc3,0xf5,0xa5,0xfe};

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
