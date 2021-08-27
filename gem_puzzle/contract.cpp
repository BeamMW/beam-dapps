#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"

#include "board.h"

GemPuzzle::Verdict check_solution(uint64_t permutation_num, const char* solution, uint32_t& moves_num)
{
	GemPuzzle::Board board(permutation_num);

	moves_num = 0;
	for (auto i = 0; solution[i] != '\0'; ++i) {
		GemPuzzle::Board::Moves cur_move;
		switch (toupper(solution[i])) {
		case 'R':
			cur_move = GemPuzzle::Board::RIGHT;
			break;
		case 'L':
			cur_move = GemPuzzle::Board::LEFT;
			break;
		case 'U':
			cur_move = GemPuzzle::Board::UP;
			break;
		case 'D':
			cur_move = GemPuzzle::Board::DOWN;
			break;
		case 'F':
			cur_move = GemPuzzle::Board::CLOCKWISE;
			break;
		case 'B':
			cur_move = GemPuzzle::Board::COUNTERCLOCKWISE;
			break;
		default:
			return GemPuzzle::Verdict::ERROR;
		}
		if (!board.move(cur_move)) {
			return GemPuzzle::Verdict::ERROR;
		}
		++moves_num;
	} return board.is_solved() ? GemPuzzle::Verdict::WIN : GemPuzzle::Verdict::LOSE;
}

BEAM_EXPORT void Ctor(void* a)
{
	Env::SaveVar_T(0, (uint64_t)0);
}

BEAM_EXPORT void Dtor(void* a)
{
	Env::DelVar_T(0);
}

BEAM_EXPORT void Method_2(const GemPuzzle::NewGameParams& params)
{
	GemPuzzle::GameInfo cur_game_info;
	bool is_loaded = Env::LoadVar_T(params.player, cur_game_info);

	if (!is_loaded || params.cancel_previous_game) {
		if (is_loaded && params.cancel_previous_game) {
			Env::DelVar_T(cur_game_info.game_id);
			Env::DelVar_T(params.player);
		}
		Env::LoadVar_T(0, cur_game_info.game_id);
		++cur_game_info.game_id;
		cur_game_info.ngparams = params;
		Env::SaveVar_T(params.player, cur_game_info);
		Env::SaveVar_T(0, cur_game_info.game_id);
	} else {
		Env::Halt();
	}
}

BEAM_EXPORT void Method_3(const GemPuzzle::CheckSolutionParams& params)
{
	GemPuzzle::GameInfo cur_game_info;
	bool is_loaded = Env::LoadVar_T(params.player, cur_game_info);

	if (!is_loaded) {
		Env::Halt();
	} else {
		GemPuzzle::GameResult gr;
		gr.verdict = check_solution(cur_game_info.ngparams.permutation_num, params.solution, gr.moves_num);
		gr.time = Env::get_Height() - cur_game_info.ngparams.height;

		Env::SaveVar_T(cur_game_info.game_id, gr);
	}
}

BEAM_EXPORT void Method_4(const GemPuzzle::EndGameParams& params)
{
	GemPuzzle::GameInfo cur_game_info;
	bool is_loaded = Env::LoadVar_T(params.player, cur_game_info);

	if (is_loaded) {
		if (cur_game_info.game_id != 0) {
			Env::DelVar_T(cur_game_info.game_id);
		}
		Env::DelVar_T(params.player);
	}
}
