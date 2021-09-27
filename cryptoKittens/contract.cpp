#include "../common.h"
#include "../Math.h"
#include "contract.h"
#include <utility>
#include <string_view>

BEAM_EXPORT void Ctor(CryptoKittens::StartGameParams& params)
{
	CryptoKittens::CurrentGameState st;

	st.heightOfNextGiveaway = Env::get_Height() + params.periodOfGiveaway;
	st.kittensAndOwners = {};

	// generating Zero kittens
	for (size_t i = 0; i < params.numberOfAllKittens; ++i)
	{
		st.allKittens.push(Kitten());
	}

	// generating kittens for giveaway
	for (size_t i = 0; i < params.numberOfKittensForGiveAway || !st.allKittens.empty(); ++i)
	{
		st.kittensForGiveaway.insert(std::make_pair(st.allKittens.front().id, st.allKittens.front()));
		st.allKittens.pop();
	}

	Env::SaveVar_T("StartGameParams", params);
	Env::SaveVar_T("CurrentGameState", st);
}

BEAM_EXPORT void Dtor(void*)
{
	Env::DelVar_T("CurrentGameState");
	Env::DelVar_T("StartGameParams");
}

BEAM_EXPORT void Method_2(const CryptoKittens::WithdrawKitten& r)
{
	CryptoKittens::CurrentGameState st;
	
	bool isLoaded = Env::LoadVar_T("CurrentGameState", st);
	Env::Halt_if(!isLoaded);
	
	//checking height
	Env::Halt_if(st.heightOfNextGiveaway != Env::get_Height());

	// checking if there are kittens for giveaway
	if (!st.kittensForGiveaway.empty())
	{
		// checking if the kitten (by id) is a part of kittens for giveaway
		auto kittenIt = st.kittensForGiveaway.find(r.kittenId);
		Env::Halt_if(kittenIt == st.kittensForGiveaway.end());

		// giving the kitten for player
		st.kittensAndOwners[1/*r.m_Account*/].push_back(st.kittensForGiveaway[r.kittenId]); 
		
		//deleting the kitten from kittens for giveaway
		st.kittensForGiveaway.erase(r.kittenId);
	}

	CryptoKittens::StartGameParams params;
	isLoaded = Env::LoadVar_T("StartGameParams", params);
	Env::Halt_if(!isLoaded);

	// generating new kittens for giveaway
	if (st.kittensForGiveaway.empty())
	{
		st.heightOfNextGiveaway = Env::get_Height() + params.periodOfGiveaway;
		
		for (size_t i = 0; i < params.numberOfKittensForGiveAway || !st.allKittens.empty(); ++i)
		{
			st.kittensForGiveaway.insert(std::make_pair(st.allKittens.front().id, st.allKittens.front()));
			st.allKittens.pop();
		}
	}

	Env::SaveVar_T("CurrentGameState", st);
}
