#ifndef ENABLE_UNIT_TESTS_
#	include "Shaders/common.h"
#	include "Shaders/app_common_impl.h"
#	include "contract.h"
#else
#	include <gtest/gtest.h>
#endif	// ENABLE_UNIT_TESTS_

#include "board.h"

#include <algorithm>
#include <bitset>
#include <iostream>
#include <random>

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
	Env::DocAddText("error", msg);
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

	uint64_t permutation_num = distrib(gen);

	GemPuzzle::NewGameParams params;

	uint32_t tmp;
	Env::DocAddGroup("");
	Env::DocGetNum32("cancel_previous_game", &tmp);
	params.cancel_previous_game = !!tmp;

	Env::DerivePk(params.player, &cid, sizeof(cid));
	params.height = hdr.m_Height;
	params.permutation_num = permutation_num;

	Env::DocAddNum64("permutation", permutation_num);
	Env::DocCloseGroup();

	Env::GenerateKernel(&cid, GemPuzzle::NewGameParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game", 0);
}

bool read_cur_game_info(const ContractID& cid, GemPuzzle::GameInfo& game_info)
{
	PubKey player;
	Env::DerivePk(player, &cid, sizeof(cid));

	Env::Key_T<PubKey> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = player;

	return Env::VarReader::Read_T(k, game_info);
}

bool read_game_result(const ContractID& cid, GemPuzzle::GameResult& game_result)
{
	PubKey player;
	Env::DerivePk(player, &cid, sizeof(cid));

	Env::Key_T<PubKey> k1;
	k1.m_Prefix.m_Cid = cid;
	k1.m_KeyInContract = player;

	GemPuzzle::GameInfo game_info;
	bool is_read = Env::VarReader::Read_T(k1, game_info);

	if (!is_read) {
		On_error("You don't have any active game. Create new game first.");
		return false;
	}

	Env::Key_T<uint64_t> k2;
	k2.m_Prefix.m_Cid = cid;
	k2.m_KeyInContract = game_info.game_id;

	return Env::VarReader::Read_T(k2, game_result);
}

void On_action_check_solution(const ContractID& cid)
{
	GemPuzzle::CheckSolutionParams params;
	Env::DocGetText("solution", params.solution, sizeof(params.solution));
	Env::DerivePk(params.player, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, GemPuzzle::CheckSolutionParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0, "Checking solution", 0);
}

void On_action_create_contract(const ContractID& unused)
{
	Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0, nullptr, 0, "Create GemPuzzle contract", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
	Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0, "Destroy GemPuzzle contract", 0);
}

void On_action_view_contracts(const ContractID& unused)
{
	EnumAndDumpContracts(GemPuzzle::s_SID);
}

void On_action_view_current_game_board(const ContractID& cid)
{
	GemPuzzle::GameInfo game_info;
	bool is_read = read_cur_game_info(cid, game_info);
	if (!is_read) {
		On_error("You don't have any active game. Create new game first");
		return;
	}

	GemPuzzle::Board board(game_info.ngparams.permutation_num);
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

void On_action_view_check_result(const ContractID& cid)
{
	GemPuzzle::GameResult game_result;
	bool is_read = read_game_result(cid, game_result);

	if (!is_read) {
		return On_error("You haven't sent any solution yet.");
	}

	char verdict[VERDICT_BUF_SIZE];
	switch (game_result.verdict) {
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
		Env::DocAddNum32("moves", game_result.moves_num);
		Env::DocAddNum64("time (min)", game_result.time);
	}
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
            }
            {
                Env::DocGroup grMethod("destroy_contract");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_contracts");
            }
        }
        {
            Env::DocGroup grRole("player");
            {
                Env::DocGroup grMethod("new_game");
                Env::DocAddText("cid", "ContractID");
				Env::DocAddText("cancel_previous_game", "uint32");
            }
            {
                Env::DocGroup grMethod("check_solution");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("solution", "string");
            }
            {
                Env::DocGroup grMethod("view_current_game_board");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_check_result");
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
		{"view_current_game_board", On_action_view_current_game_board},
		{"view_check_result", On_action_view_check_result},
	};

	const std::vector<std::pair<const char *, Action_func_t>> VALID_MANAGER_ACTIONS = {
		{"create_contract", On_action_create_contract},
		{"destroy_contract", On_action_destroy_contract},
		{"view_contracts", On_action_view_contracts},
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

TEST(CheckSolutionTest, BoardRotations) {
	uint32_t moves_num;

	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "FFFF", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 4);
	ASSERT_EQ(check_solution(_permutation_to_num({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}), "BBBB", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 4);

	// 4 8 12 15
	// 3 7 11 14
	// 2 6 10 13
	// 1 5 9 *
	ASSERT_EQ(check_solution(_permutation_to_num({4, 8, 12, 15, 3, 7, 11, 14, 2, 6, 10, 13, 1, 5, 9}), "FRRR", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 4);

	// 13 9 5 1
	// 14 10 6 2
	// 15 11 7 3
	// 12 8 4 *
	ASSERT_EQ(check_solution(_permutation_to_num({13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3, 12, 8, 4}), "BDDD", moves_num), GemPuzzle::Verdict::WIN);
	ASSERT_EQ(moves_num, 4);
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
