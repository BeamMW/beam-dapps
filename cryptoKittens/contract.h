#pragma once
#include "Genetic/Kitten.h"
#include <map>
#include <unordered_map>
#include <vector>
#include <queue>

namespace CryptoKittens
{
	// SID: ecbaff8446e40a85dc72c3f5f979547b4c48fd49daf2582b0581d6a7724e5257
	static const ShaderID s_SID = { 0xec,0xba,0xff,0x84,0x46,0xe4,0x0a,0x85,0xdc,0x72,0xc3,0xf5,0xf9,0x79,0x54,0x7b,0x4c,0x48,0xfd,0x49,0xda,0xf2,0x58,0x2b,0x05,0x81,0xd6,0xa7,0x72,0x4e,0x52,0x57 };

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
	//using KittensAndOwners = std::unordered_map<int/*PubKey*/, AccountKittens>;
	using KittensAndOwners = std::map<int/*PubKey*/, AccountKittens>;
	using KittensForGiveaway = std::map<CharacterId, Kitten>;
	//using KittensForGiveaway = std::unordered_map<CharacterId, Kitten>;
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
