#pragma once
#include "Genetic/Kitten.h"
#include <map>
#include <deque>
#include <queue>

namespace CryptoKittens
{
	// SID: 2cb20033613becd6b318c260eab3d8d57e0a7a48adcfe2a3d3b1c7f43f960a36
	static const ShaderID s_SID = { 0x2c,0xb2,0x00,0x33,0x61,0x3b,0xec,0xd6,0xb3,0x18,0xc2,0x60,0xea,0xb3,0xd8,0xd5,0x7e,0x0a,0x7a,0x48,0xad,0xcf,0xe2,0xa3,0xd3,0xb1,0xc7,0xf4,0x3f,0x96,0x0a,0x36 };

#pragma pack (push, 1)
	struct StartGameParams
	{
		uint64_t numberOfAllKittens;
		uint64_t numberOfKittensForGiveAway;
		uint32_t periodOfGiveaway;
		static const uint32_t s_iMethod = 0;
	};

	using AllKittens = std::queue<Kitten>;
	using AccountKittens = std::deque<Kitten>;
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
