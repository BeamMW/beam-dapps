#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 255b3626ef95dc247b720188363f698e0fabe8198ada1153304e1613f80cffde
	static const ShaderID s_SID = {0x25,0x5b,0x36,0x26,0xef,0x95,0xdc,0x24,0x7b,0x72,0x01,0x88,0x36,0x3f,0x69,0x8e,0x0f,0xab,0xe8,0x19,0x8a,0xda,0x11,0x53,0x30,0x4e,0x16,0x13,0xf8,0x0c,0xff,0xde};

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
