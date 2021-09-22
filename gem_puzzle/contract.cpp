#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "Shaders/Math.h"
#include "contract.h"

#include "board.h"

#include <utility>

constexpr Height DAY_IN_BLOCKS = 24 * 60;

GemPuzzle::Verdict check_solution(uint64_t permutation_num, const char* solution)
{
	GemPuzzle::Board board(permutation_num);

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
		default:
			return GemPuzzle::Verdict::ERROR;
		}
		if (!board.move(cur_move)) {
			return GemPuzzle::Verdict::ERROR;
		}
	}
	return board.is_solved() ? GemPuzzle::Verdict::WIN : GemPuzzle::Verdict::LOSE;
}

BEAM_EXPORT void Ctor(GemPuzzle::InitialParams& params)
{
	Env::FundsLock(params.prize_aid, params.prize_fund);
	Env::SaveVar_T(0, params);
}

BEAM_EXPORT void Dtor(void*)
{
	Env::DelVar_T(0);
}

BEAM_EXPORT void Method_2(const GemPuzzle::NewGameParams& params)
{
	GemPuzzle::InitialParams initial_params;
	Env::LoadVar_T(0, initial_params);

	GemPuzzle::AccountInfo acc_info;
	bool is_loaded = Env::LoadVar_T(params.player, acc_info);

	if (!is_loaded) {
		acc_info.pending_rewards = 0;
	}

	acc_info.game_info = params;
	acc_info.has_active_game = true;
	Env::SaveVar_T(params.player, acc_info);

	Env::FundsLock(initial_params.prize_aid, params.bet);
	Env::AddSig(params.player);
}

BEAM_EXPORT void Method_3(const GemPuzzle::CheckSolutionParams& params)
{
	GemPuzzle::InitialParams initial_params;
	Env::LoadVar_T(0, initial_params);

	GemPuzzle::AccountInfo acc_info;
	bool is_loaded = Env::LoadVar_T(params.player, acc_info);

	if (!is_loaded) {
		acc_info.pending_rewards = 0;
	}

	if (initial_params.max_bet) {
		if (!is_loaded || !acc_info.has_active_game) {
			Env::Halt();
		} else {
			Height cur_height = Env::get_Height();
			acc_info.game_result.verdict = check_solution(params.permutation_num, params.solution);
			acc_info.game_result.time = cur_height - acc_info.game_info.height;

			if (acc_info.game_result.verdict == GemPuzzle::Verdict::WIN) {
				// Protection from cheaters
				Height permutation_height;
				Env::LoadVar_T(std::make_pair(params.player, params.permutation_num), permutation_height);
				if (cur_height - permutation_height > DAY_IN_BLOCKS) {
					GemPuzzle::InitialParams initial_params;
					Env::LoadVar_T(0, initial_params);

					Amount reward = 0;
					if (acc_info.game_result.time <= initial_params.free_time) {
						reward = initial_params.multiplier * acc_info.game_info.bet;
					} else {
						Amount lost = (acc_info.game_result.time - initial_params.free_time) * initial_params.game_speed * acc_info.game_info.bet / 100;
						Amount max_earn = initial_params.multiplier * acc_info.game_info.bet;
						if (lost < max_earn) {
							reward = max_earn - lost;
						}
					}
					Strict::Add(acc_info.pending_rewards, reward);
					Strict::Sub(initial_params.prize_fund, reward);
					acc_info.has_active_game = false;
				}
				Env::SaveVar_T(std::make_pair(params.player, params.permutation_num), cur_height);
			}
		}
	} else {
		Height cur_height = Env::get_Height();
		acc_info.game_result.verdict = check_solution(params.permutation_num, params.solution);
		acc_info.game_result.time = cur_height - acc_info.game_info.height;
		if (acc_info.game_result.verdict == GemPuzzle::Verdict::WIN) {
			// Protection from cheaters
			Height permutation_height;
			Env::LoadVar_T(std::make_pair(params.player, params.permutation_num), permutation_height);
			if (cur_height - permutation_height > DAY_IN_BLOCKS) {
				Strict::Add(acc_info.pending_rewards, initial_params.prize_amount);
				Strict::Sub(initial_params.prize_fund, initial_params.prize_amount);
			}
			Env::SaveVar_T(std::make_pair(params.player, params.permutation_num), cur_height);
		}
	}
	Env::SaveVar_T(params.player, acc_info);
}

BEAM_EXPORT void Method_4(const GemPuzzle::TakePendingRewards& params)
{
	GemPuzzle::InitialParams initial_params;
	Env::LoadVar_T(0, initial_params);

	GemPuzzle::AccountInfo acc_info;
	bool is_loaded = Env::LoadVar_T(params.player, acc_info);

	if (is_loaded && acc_info.pending_rewards) {
		Env::FundsUnlock(initial_params.prize_aid, acc_info.pending_rewards);
		acc_info.pending_rewards = 0;
		Env::SaveVar_T(params.player, acc_info);
	}
}

BEAM_EXPORT void Method_5(const GemPuzzle::DonateParams& params)
{
	GemPuzzle::InitialParams initial_params;
	Env::LoadVar_T(0, initial_params);

	Strict::Add(initial_params.prize_fund, params.amount);
	Env::FundsLock(initial_params.prize_aid, params.amount);
	Env::AddSig(params.user);

	Env::SaveVar_T(0, initial_params);
}
