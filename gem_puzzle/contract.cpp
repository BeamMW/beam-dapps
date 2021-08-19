#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"

export void Ctor()
{
}

export void Dtor()
{
}

export void Method_2(const GemPuzzle::NewGameParams& params)
{
	GemPuzzle::GameInfo cur_game_info;
	bool is_loaded = Env::LoadVar_T(params.player, cur_game_info);

	if (!is_loaded || params.cancel_previous_game) {
		cur_game_info.ngparams = params;
		Env::SaveVar_T(params.player, cur_game_info);
	} else {
		Env::Halt();
	}
}

export void Method_3(const GemPuzzle::CheckSolutionParams& params)
{
	if (params.verdict == GemPuzzle::Verdict::WIN) {
		Env::DelVar_T(params.player);
	}
}
