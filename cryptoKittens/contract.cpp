#include "../common.h"
#include "../Math.h"
#include "contract.h"
#include <utility>
#include <string_view>

BEAM_EXPORT void Ctor(CryptoKittens::StartGameParams& params)
{
	CryptoKittens::CurrentGameState currentGameState;

	currentGameState.numberOfLastKittensOfZeroGeneration = params.numberOfAllKittenOfZeroGeneration;
	currentGameState.numberOfLastKittensForGiveAway = params.numberOfKittensForGiveAway;
	currentGameState.heightOfNextGiveaway = Env::get_Height() + params.periodOfGiveaway;

	Env::SaveVar_T((uint8_t) CryptoKittens::StartGameParams::s_iMethod, params);
	Env::SaveVar_T((uint8_t) CryptoKittens::CurrentGameState::s_iMethod, currentGameState);
}

BEAM_EXPORT void Dtor(void*)
{
	Env::DelVar_T((uint8_t)CryptoKittens::StartGameParams::s_iMethod);
	Env::DelVar_T((uint8_t)CryptoKittens::CurrentGameState::s_iMethod);
}

BEAM_EXPORT void Method_2(const CryptoKittens::Play& params)
{
	std::deque<Kitten> kittens;
	Env::SaveVar_T(params.pubKey, kittens);
}

BEAM_EXPORT void Method_3(const CryptoKittens::WithdrawKitten& params)
{
	std::deque<Kitten> kittens;
	Env::LoadVar_T(params.pubKey, kittens);
	kittens.push_back(Kitten());
	Env::SaveVar_T(params.pubKey, kittens);

	CryptoKittens::CurrentGameState currentGameState;
	Env::LoadVar_T((uint8_t)CryptoKittens::CurrentGameState::s_iMethod, currentGameState);
	--currentGameState.numberOfLastKittensOfZeroGeneration;
	--currentGameState.numberOfLastKittensForGiveAway;

	if (currentGameState.numberOfLastKittensForGiveAway == 0)
	{
		CryptoKittens::StartGameParams startGameParams;
		Env::LoadVar_T((uint8_t)CryptoKittens::StartGameParams::s_iMethod, startGameParams);
		
		currentGameState.heightOfNextGiveaway = Env::get_Height() + startGameParams.periodOfGiveaway;

		if (currentGameState.numberOfLastKittensOfZeroGeneration != 0)
		{
			if (currentGameState.numberOfLastKittensOfZeroGeneration < startGameParams.numberOfKittensForGiveAway)
			{
				currentGameState.numberOfLastKittensForGiveAway = currentGameState.numberOfLastKittensOfZeroGeneration;
			}
			else
			{
				currentGameState.numberOfLastKittensForGiveAway = startGameParams.numberOfKittensForGiveAway;
			}
		}
	}

	Env::SaveVar_T((uint8_t)CryptoKittens::CurrentGameState::s_iMethod, currentGameState);
}
