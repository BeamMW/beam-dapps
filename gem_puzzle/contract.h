#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 3c60081ebf36031044a5ffad3b93a03a78c5deab5b9a5c6351e02d17c9a65a55
	static const ShaderID s_SID = {0x3c,0x60,0x08,0x1e,0xbf,0x36,0x03,0x10,0x44,0xa5,0xff,0xad,0x3b,0x93,0xa0,0x3a,0x78,0xc5,0xde,0xab,0x5b,0x9a,0x5c,0x63,0x51,0xe0,0x2d,0x17,0xc9,0xa6,0x5a,0x55};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct InitialParams {
		static const uint32_t METHOD = 0;
		Amount max_bet;
		Amount multiplier;
		Height free_time;
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
