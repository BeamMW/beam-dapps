#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 54e3e586cb208ba525569c060bedc141bd7d5076691fbc060084ab0e08bc8c28
	static const ShaderID s_SID = {0x54,0xe3,0xe5,0x86,0xcb,0x20,0x8b,0xa5,0x25,0x56,0x9c,0x06,0x0b,0xed,0xc1,0x41,0xbd,0x7d,0x50,0x76,0x69,0x1f,0xbc,0x06,0x00,0x84,0xab,0x0e,0x08,0xbc,0x8c,0x28};

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
