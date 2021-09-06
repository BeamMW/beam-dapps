#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 4fc7a59cab98e128cb649c0fca5a8cb614f60de14b7647d1a12c587025d8ccc9
	static const ShaderID s_SID = {0x4f,0xc7,0xa5,0x9c,0xab,0x98,0xe1,0x28,0xcb,0x64,0x9c,0x0f,0xca,0x5a,0x8c,0xb6,0x14,0xf6,0x0d,0xe1,0x4b,0x76,0x47,0xd1,0xa1,0x2c,0x58,0x70,0x25,0xd8,0xcc,0xc9};

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
