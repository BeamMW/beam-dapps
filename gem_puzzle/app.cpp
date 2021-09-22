#ifndef ENABLE_UNIT_TESTS_
#	include "Shaders/common.h"
#	include "Shaders/app_common_impl.h"
#	include "contract.h"
#else
#	include <gtest/gtest.h>
#endif	// ENABLE_UNIT_TESTS_

#include "board.h"

#include <bitset>
#include <iostream>
#include <random>
#include <vector>

#ifndef ENABLE_UNIT_TESTS_
using Action_func_t = void (*)(const ContractID&);
#else
namespace GemPuzzle {
	enum Verdict { WIN, LOSE, ERROR };
}
#endif // ENABLE_UNIT_TESTS_

constexpr size_t VERDICT_BUF_SIZE = 8;
constexpr size_t ACTION_BUF_SIZE = 32;
constexpr size_t ROLE_BUF_SIZE = 16;

void On_error(const char* msg)
{
#ifndef ENABLE_UNIT_TESTS_
	Env::DocGroup root("");
	{
		Env::DocAddText("error", msg);
	}
#else
	std::cerr << msg << std::endl;
#endif // ENABLE_UNIT_TESTS_
}

#ifndef ENABLE_UNIT_TESTS_
void On_action_new_game(const ContractID& cid)
{
	BlockHeader::Info hdr;
	hdr.m_Height = Env::get_Height();
	Env::get_HdrInfo(hdr);

	uint64_t seed = 0;
	Env::Memcpy(&seed, &hdr.m_Hash.m_p, 32);
	
	std::mt19937_64 gen(seed);
	std::uniform_int_distribution<uint64_t> distrib(1, factorial(GemPuzzle::Board::PERMUTATION_LEN) - 1);

	uint64_t permutation_num;
	do {
		permutation_num = distrib(gen);
	} while (!GemPuzzle::Board(permutation_num).is_solvable());

	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	GemPuzzle::InitialParams initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return On_error("Failed to read contract's initial params");

	uint32_t just_regenerate;
	if (!Env::DocGetNum32("just_regenerate", &just_regenerate)) {
		just_regenerate = 0;
	}

	if (initial_params.max_bet && !just_regenerate) {
		GemPuzzle::NewGameParams params;
		params.height = hdr.m_Height;

		if (!Env::DocGetNum64("bet", &params.bet)) {
			return On_error("Bet must be non-zero");
		}

		if (params.bet > initial_params.max_bet) {
			return On_error("Bet must be less or equal than contract's max_bet");
		}

		Env::DerivePk(params.player, &cid, sizeof(cid));

		SigRequest sig;
		sig.m_pID = &cid;
		sig.m_nID = sizeof(cid);

		FundsChange fc;
		fc.m_Amount = params.bet;
		fc.m_Aid = initial_params.prize_aid;
		fc.m_Consume = 1;

		Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), &fc, 1, &sig, 1, "Taking your bet...", 0);
	}

	GemPuzzle::Board board(permutation_num);
	Env::DocGroup root("");
	{
		Env::DocAddNum64("permutation", permutation_num);
		Env::DocAddArray("board");
		for (size_t i = 0; i < GemPuzzle::Board::BOARD_SIZE; ++i) {
			Env::DocAddArray("");
			for (size_t j = 0; j < GemPuzzle::Board::BOARD_SIZE; ++j) {
				Env::DocAddNum32("", board.get(i, j));	
			}
			Env::DocCloseArray();
		}
		Env::DocCloseArray();
	}
}

bool read_my_account_info(const ContractID& cid, GemPuzzle::AccountInfo& acc_info)
{
	PubKey player;
	Env::DerivePk(player, &cid, sizeof(cid));

	Env::Key_T<PubKey> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = player;

	return Env::VarReader::Read_T(k, acc_info);
}

void On_action_check_solution(const ContractID& cid)
{
	GemPuzzle::CheckSolutionParams params;
	Env::DocGetText("solution", params.solution, sizeof(params.solution));
	if (!Env::DocGetNum64("permutation", &params.permutation_num)) {
		return On_error("You must provide permutation number");
	}
	Env::DerivePk(params.player, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, GemPuzzle::CheckSolutionParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Checking your solution...", 0);
}

void On_action_create_contract(const ContractID& unused)
{
	GemPuzzle::InitialParams params;
	if (!Env::DocGetNum64("max_bet", &params.max_bet)) {
		params.max_bet = 0;
	}
	if (!Env::DocGetNum32("prize_aid", &params.prize_aid)) {
		params.prize_aid = 0;
	}
	if (!Env::DocGetNum64("prize_amount", &params.prize_amount)) {
		params.prize_amount = 0;
	}
	if (!Env::DocGetNum32("game_speed", &params.game_speed)) {
		params.game_speed = 0;
	}
	if (params.game_speed > 100) {
		return On_error("game_speed must be in percents (100% maximum)");
	}
	if (!Env::DocGetNum64("free_time", &params.free_time)) {
		params.free_time = 0;
	}
	if (!Env::DocGetNum64("multiplier", &params.multiplier)) {
		params.multiplier = 0;
	}

	Env::GenerateKernel(nullptr, GemPuzzle::InitialParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Creating GemPuzzle contract...", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
	Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0, "Destroying GemPuzzle contract...", 0);
}

void On_action_view_contracts(const ContractID& unused)
{
	EnumAndDumpContracts(GemPuzzle::s_SID);
}

void On_action_view_check_result(const ContractID& cid)
{
	GemPuzzle::AccountInfo acc_info;
	bool is_read = read_my_account_info(cid, acc_info);

	if (!is_read) {
		return On_error("You don't have any active game. Create new game first.");
	}

	char verdict[VERDICT_BUF_SIZE];
	switch (acc_info.game_result.verdict) {
	case GemPuzzle::Verdict::WIN:
		Env::Memcpy(verdict, "WIN", sizeof(verdict));
		break;
	case GemPuzzle::Verdict::LOSE:
		Env::Memcpy(verdict, "LOSE", sizeof(verdict));
		break;
	case GemPuzzle::Verdict::ERROR:
		Env::Memcpy(verdict, "ERROR", sizeof(verdict));
		break;
	}

	Env::DocGroup root("");
	{
		Env::DocAddText("verdict", verdict);
		Env::DocAddNum64("time (min)", acc_info.game_result.time);
	}
}

void On_action_take_pending_rewards(const ContractID& cid)
{
	GemPuzzle::TakePendingRewards params;
	Env::DerivePk(params.player, &cid, sizeof(cid));

	GemPuzzle::AccountInfo acc_info;
	bool is_read = read_my_account_info(cid, acc_info);

	if (!is_read || acc_info.pending_rewards == 0) {
		return On_error("You don't have any rewards.");
	}

	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	GemPuzzle::InitialParams initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return On_error("Failed to read contract's initial params");

	FundsChange fc;
	fc.m_Amount = acc_info.pending_rewards;
	fc.m_Aid = initial_params.prize_aid;
	fc.m_Consume = 0;

	Env::GenerateKernel(&cid, GemPuzzle::TakePendingRewards::METHOD, &params, sizeof(params), &fc, 1, nullptr, 0, "Giving you reward...", 0);
}

void On_action_get_my_info(const ContractID& cid)
{
	GemPuzzle::AccountInfo acc_info;
	bool is_read = read_my_account_info(cid, acc_info);
	if (!is_read) {
		acc_info.pending_rewards = 0;
	}

	Env::DocGroup root("");
	{
		Env::DocAddNum32("has_active_game", is_read && acc_info.has_active_game);
		Env::DocAddNum64("pending_rewards", acc_info.pending_rewards);
	}
}

void On_action_view_contract_params(const ContractID& cid)
{
	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	GemPuzzle::InitialParams params;
	if (!Env::VarReader::Read_T(k, params))
		return On_error("Failed to read contract's initial params");

	Env::DocGroup gr("params");
	Env::DocAddNum64("max_bet", params.max_bet);
	Env::DocAddNum64("prize_aid", params.prize_aid);
	Env::DocAddNum64("prize_amount", params.prize_amount);
	Env::DocAddNum64("multiplier", params.multiplier);
	Env::DocAddNum64("free_time", params.free_time);
	Env::DocAddNum32("game_speed", params.game_speed);
}

template <typename T>
auto find_if_contains(const char* str, const std::vector<std::pair<const char *, T>>& v) {
	return std::find_if(v.begin(), v.end(), [&str](const auto& p) {
		return !strcmp(str, p.first);
	});
}

BEAM_EXPORT void Method_0()
{
    Env::DocGroup root("");
    {
        Env::DocGroup gr("roles");
        {
            Env::DocGroup grRole("manager");
            {
                Env::DocGroup grMethod("create_contract");
                Env::DocAddText("max_bet", "Amount");
                Env::DocAddText("prize_aid", "AssetID");
                Env::DocAddText("prize_amount", "Amount");
                Env::DocAddText("multiplier", "Amount");
                Env::DocAddText("free_time", "Height");
				Env::DocAddText("game_speed", "uint32");
            }
            {
                Env::DocGroup grMethod("destroy_contract");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_contracts");
            }
			{
				Env::DocGroup grMethod("view_contract_params");
				Env::DocAddText("cid", "ContractID");
			}
        }
        {
            Env::DocGroup grRole("player");
            {
                Env::DocGroup grMethod("new_game");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("bet", "Amount");
                Env::DocAddText("just_regenerate", "uint32");
            }
            {
                Env::DocGroup grMethod("check_solution");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("solution", "string");
                Env::DocAddText("permutation", "uint64");
            }
            {
                Env::DocGroup grMethod("view_check_result");
                Env::DocAddText("cid", "ContractID");
            }
			{
				Env::DocGroup grMethod("take_pending_rewards");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("get_my_info");
				Env::DocAddText("cid", "ContractID");
			}
        }
    }
}

BEAM_EXPORT void Method_1()
{
	const std::vector<std::pair<const char *, Action_func_t>> VALID_PLAYER_ACTIONS = {
		{"new_game", On_action_new_game},
		{"check_solution", On_action_check_solution},
		{"view_check_result", On_action_view_check_result},
		{"take_pending_rewards", On_action_take_pending_rewards},
		{"get_my_info", On_action_get_my_info},
	};

	const std::vector<std::pair<const char *, Action_func_t>> VALID_MANAGER_ACTIONS = {
		{"create_contract", On_action_create_contract},
		{"destroy_contract", On_action_destroy_contract},
		{"view_contracts", On_action_view_contracts},
		{"view_contract_params", On_action_view_contract_params},
	};

	const std::vector<std::pair<const char *, const std::vector<std::pair<const char *, Action_func_t>>&>> VALID_ROLES = {
		{"player", VALID_PLAYER_ACTIONS},
		{"manager", VALID_MANAGER_ACTIONS},
	};

	char action[ACTION_BUF_SIZE], role[ROLE_BUF_SIZE];

	if (!Env::DocGetText("role", role, sizeof(role))) {
		return On_error("Role not specified");
	}
	
	auto it_role = find_if_contains(role, VALID_ROLES);

	if (it_role == VALID_ROLES.end()) {
		return On_error("Invalid role");
	}

	if (!Env::DocGetText("action", action, sizeof(action))) {
		return On_error("Action not specified");
	}

	auto it_action = find_if_contains(action, it_role->second); 

	if (it_action != it_role->second.end()) {
		ContractID cid;
		Env::DocGet("cid", cid); 
		it_action->second(cid);
	} else {
		On_error("Invalid action");
	}
}
#endif // ENABLE_UNIT_TESTS_

#ifdef ENABLE_UNIT_TESTS_
uint64_t _permutation_to_num(const std::vector<int>& permutation) {
	std::bitset<PERMUTATION_LEN + 1> used;
	uint64_t res = 0;
	for (size_t i = 0; i < permutation.size(); ++i) {
		uint64_t cur_factorial = factorial(permutation.size() - i - 1);
		res += cur_factorial * (permutation[i] - 1 - (used << (permutation.size() - permutation[i] + 1)).count());
		used.set(permutation[i]);
	}
	return res;
}

TEST(FactorialTest, ZeroInput) {
	ASSERT_EQ(factorial(0), 1);
}

TEST(FactorialTest, PositiveInput) {
	ASSERT_EQ(factorial(1), 1);
	ASSERT_EQ(factorial(2), 2);
	ASSERT_EQ(factorial(3), 6);
	ASSERT_EQ(factorial(4), 24);
	ASSERT_EQ(factorial(15), 1307674368000);
}

TEST(CheckSolutionTest, ValidMoves) {
	uint32_t moves_num;

	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "UDUD", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 4);
	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "LR", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 2);
	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "ULDRULDRULDR", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 12);
}

TEST(CheckSolutionTest, AlreadySolved) {
	uint32_t moves_num;

	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 0);
}

int main()
{
	testing::InitGoogleTest();
	return RUN_ALL_TESTS();
}
#endif // ENABLE_UNIT_TESTS_
