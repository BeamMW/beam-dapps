#pragma once
#include "Genetic/Kitten.h"
#include <map>
#include <vector>
#include <queue>

namespace CryptoKittens
{
    static const ShaderID s_SID = { 0xe3,0x21,0x90,0x44,0x42,0x00,0x0f,0xfd,0x2d,0x2f,0xf0,0x46,0x3f,0x8a,0x77,0x21,0x1b,0x82,0xe4,0x61,0xd3,0x97,0xe1,0xb2,0x20,0x8c,0xc9,0x3b,0xb6,0xa1,0x04,0x65 };

#pragma pack (push, 1)
	struct StartGameParams
	{
		uint64_t numberOfAllKittens;
		uint64_t numberOfKittensForGiveAway;
		uint32_t periodOfGiveaway;
		static const uint32_t s_iMethod = 0;
	};

	using AllKittens = std::queue<Kitten>;
	using AccountKittens = std::vector<Kitten>;
	using KittensAndOwners = std::map<int/*PubKey*/, AccountKittens>;
	using KittensForGiveaway = std::map<CharacterId, Kitten>;
	struct CurrentGameState
	{
		AllKittens allKittens;
		Height heightOfNextGiveaway;
		KittensAndOwners kittensAndOwners;
		KittensForGiveaway kittensForGiveaway;
	};

	struct WithdrawKitten
	{
		PubKey m_Account;
		CharacterId kittenId;
		static const uint32_t s_iMethod = 2;
	};
#pragma pack (pop)

}
