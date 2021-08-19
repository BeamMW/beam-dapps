#include "../common.h"
#include "../Math.h"
#include "contract.h"

BEAM_EXPORT void Ctor()
{
	// create all kinds of kittens

	// set height of new giveaway
	// set period of giveaway 
	// set duration of giveaway 
	
	// create map {kitten, public key of owner}

	// save this params - Env::SaveVar_T

}

BEAM_EXPORT void Dtor(void*)
{
	// delete saved earlier params - Env::DelVar_T
}

BEAM_EXPORT void Method_2(const CryptoKittens::WithdrawKitten& r)
{
	// check the current height
	// if current height isn't a part of
	// {the start block of giveaway; the last block of giveaway},
	//		exit, revert the transaction (halt)

	// load kittensForGiveaway - Env::LoadVarT

	// check if user hasn't got a kitten in this giveaway
	// - need to check birthDates of his kittens
	// if there is a kitten with birthBlock is a part of
	// {the start block of giveaway; the last block of giveaway},
	//		exit, revert the transaction (halt)
	
	// if count of kittensForGiveaway == 0
	// 	    new height of next giveaway (+period+duration) and save it
	//		generate new kittens for next giveaway
	// 	    save new kittensForGiveaway - Env::SaveVar_T
	// else	 
	// {
	//		if kitten from transaction is a part of kittensForGiveaway
	//		{
	//				if there is enough kittens of this kind for giveaway (>=1)
	// 				{
	// 					get current height and set it as kitten's birthBlock
	//					get user public key
	//					add to map{cats, users} new pair
	//					(number of kittens of  this kind for giveaway)-- 
	// 				}
	//				else  revert the transaction (halt)
	//		}
	//		else  revert the transaction (halt)
	// }
}
