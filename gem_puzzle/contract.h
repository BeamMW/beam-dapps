#pragma once

#include <cstddef>

namespace GemPuzzle {
	// SID: 64fbac64ea9bc2087bb3d9068bee547a27c3be576fbdffa8d36a170fd5c30d23
	static const ShaderID s_SID = {0x64,0xfb,0xac,0x64,0xea,0x9b,0xc2,0x08,0x7b,0xb3,0xd9,0x06,0x8b,0xee,0x54,0x7a,0x27,0xc3,0xbe,0x57,0x6f,0xbd,0xff,0xa8,0xd3,0x6a,0x17,0x0f,0xd5,0xc3,0x0d,0x23};

	constexpr size_t SOLUTION_BUF_SIZE = 8192;

	enum Verdict { WIN, LOSE, ERROR };

#pragma pack(push, 1)

	struct InitialParams {
		static const uint32_t METHOD = 0;
		AssetID prize_aid;
		Amount prize_fund;
		// Params for paid game
		Amount max_bet;
		Amount min_bet;
		// Params for free game
		Amount prize_amount;
	};

	struct NewGameParams {
		static const uint32_t METHOD = 2;
		PubKey player;
		// Params for paid game
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

	using GameInfo = NewGameParams;
	using GameResult = Verdict;

	struct AccountInfo {
		GameInfo game_info;
		GameResult game_result;
		Amount pending_rewards;
		bool has_active_game;
	};

#pragma pack(pop)
}
