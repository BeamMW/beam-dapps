#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 8de22687499cde19824a00e21396d4a2780e8b44430547d6df7998413c90e66f
	static const ShaderID s_SID = {0x8d,0xe2,0x26,0x87,0x49,0x9c,0xde,0x19,0x82,0x4a,0x00,0xe2,0x13,0x96,0xd4,0xa2,0x78,0x0e,0x8b,0x44,0x43,0x05,0x47,0xd6,0xdf,0x79,0x98,0x41,0x3c,0x90,0xe6,0x6f};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct InitialParams {
		static const uint32_t METHOD = 0;
		AssetID prize_aid;
		Amount prize_fund;
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

	struct DonateParams {
		static const uint32_t METHOD = 5;
		Amount amount;
		PubKey user;
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
