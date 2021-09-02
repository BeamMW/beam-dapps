#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: bd1dc028b06dec34f5a7176f2e23932bb4aa49f4c671644b9c058a53586c2b0c
	static const ShaderID s_SID = {0xbd,0x1d,0xc0,0x28,0xb0,0x6d,0xec,0x34,0xf5,0xa7,0x17,0x6f,0x2e,0x23,0x93,0x2b,0xb4,0xaa,0x49,0xf4,0xc6,0x71,0x64,0x4b,0x9c,0x05,0x8a,0x53,0x58,0x6c,0x2b,0x0c};

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
