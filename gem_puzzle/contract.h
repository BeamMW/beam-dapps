#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: e05f6f4cb5a3a4dfef4a8affc6c664a2768df93841e360cfef79db9d8d98443d
	static const ShaderID s_SID = {0xe0,0x5f,0x6f,0x4c,0xb5,0xa3,0xa4,0xdf,0xef,0x4a,0x8a,0xff,0xc6,0xc6,0x64,0xa2,0x76,0x8d,0xf9,0x38,0x41,0xe3,0x60,0xcf,0xef,0x79,0xdb,0x9d,0x8d,0x98,0x44,0x3d};

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
		uint32_t moves_num;
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
