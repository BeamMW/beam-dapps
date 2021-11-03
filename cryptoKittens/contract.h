#pragma once
#include "Genetic/Kitten.h"
#include <map>
#include <deque>

namespace CryptoKittens
{
	// SID: d5a075cc4c36fa83c3873b2bf95a85f09371ded5fa8afb9428c934f762446bca
	static const ShaderID s_SID = { 0xd5,0xa0,0x75,0xcc,0x4c,0x36,0xfa,0x83,0xc3,0x87,0x3b,0x2b,0xf9,0x5a,0x85,0xf0,0x93,0x71,0xde,0xd5,0xfa,0x8a,0xfb,0x94,0x28,0xc9,0x34,0xf7,0x62,0x44,0x6b,0xca };

	#pragma pack (push, 1)
	struct StartGameParams
	{
		uint64_t numberOfAllKittenOfZeroGeneration;
		uint64_t numberOfKittensForGiveAway;
		uint32_t periodOfGiveaway;
		static const uint32_t s_iMethod = 0;
	};

	struct CurrentGameState
	{
		uint64_t numberOfLastKittensOfZeroGeneration;
		uint64_t numberOfLastKittensForGiveAway;
		Height heightOfNextGiveaway;
		static const uint32_t s_iMethod = 1;
	};

	struct Play
	{
		PubKey pubKey;
		static const uint32_t s_iMethod = 2;
	};

	struct WithdrawKitten
	{
		PubKey pubKey;
		static const uint32_t s_iMethod = 3;
	};
#pragma pack (pop)

}
