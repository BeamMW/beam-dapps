#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 557e41370f4b08af58c214d291930d892240c7edc79d013087e8e462af31cbdb
	static const ShaderID s_SID = {0x55,0x7e,0x41,0x37,0x0f,0x4b,0x08,0xaf,0x58,0xc2,0x14,0xd2,0x91,0x93,0x0d,0x89,0x22,0x40,0xc7,0xed,0xc7,0x9d,0x01,0x30,0x87,0xe8,0xe4,0x62,0xaf,0x31,0xcb,0xdb};

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
