#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 781280726122f3df0b635353cf1247b53000055b22428778ae7859cd9451047c
	static const ShaderID s_SID = {0x78,0x12,0x80,0x72,0x61,0x22,0xf3,0xdf,0x0b,0x63,0x53,0x53,0xcf,0x12,0x47,0xb5,0x30,0x00,0x05,0x5b,0x22,0x42,0x87,0x78,0xae,0x78,0x59,0xcd,0x94,0x51,0x04,0x7c};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct InitialParams {
		static const uint32_t METHOD = 0;
		AssetID prize_aid;
		// Params for paid game
		Amount max_bet;
		Amount multiplier;
		Height free_time;
		uint32_t game_speed;
		// Params for free game
		Amount prize_amount;
	};

	struct NewGameParams {
		static const uint32_t METHOD = 2;
		PubKey player;
		// Params for paid game
		Height height;
		Amount bet;
	};

	struct CheckSolutionParams {
		static const uint32_t METHOD = 3;
		char solution[SOLUTION_BUF_SIZE];	
		PubKey player;
		uint64_t permutation_num;
	};

	struct TakePendingRewards {
		static const uint32_t METHOD = 4;
		PubKey player;
	};

	struct GameResult {
		Verdict verdict;
		Height time;
	};

	using GameInfo = NewGameParams;

	struct AccountInfo {
		GameInfo game_info;
		GameResult game_result;
		Amount pending_rewards;
		bool has_active_game;
	};

#pragma pack(pop)
}
