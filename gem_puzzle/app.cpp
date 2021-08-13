#include "Shaders/common.h"
#include "contract.h"

#include <random>

void On_action_new_game(const ContractID& cid)
{
	//Height cur_height = Env::get_Height();
	BlockHeader::Info hdr;
	hdr.m_Height = Env::get_Height();
	Env::get_HdrInfo(hdr);

	uint64_t seed = 0;
	Env::Memcpy(&seed, &hdr.m_Hash.m_p, 32);
	Env::DocAddNum64("Debug_seed", seed);
	// TODO: seed * game_number
	
	std::mt19937_64 gen(seed);
	std::uniform_int_distribution<uint64_t> distrib(2, (uint64_t)tgamma(15 + 1));

	uint64_t permutation_num = distrib(gen);

	GemPuzzle::NewGameParams params;

	Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game", 0);

	Env::DocAddNum64("permutation", permutation_num);
	// TODO: add game_number
}

export void Method_0()
{
}

export void Method_1()
{
	
}
