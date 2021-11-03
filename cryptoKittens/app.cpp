#include "../common.h"
#include "../app_common_impl.h"
#include "contract.h"
#include <vector>

void On_error(const char* msg)
{
    Env::DocGroup root("");
    {
        Env::DocAddText("error", msg);
    }
}

// MANAGER
void On_action_create_contract(const ContractID& cid)
{
    CryptoKittens::StartGameParams params;

    Env::DocGetNum64("numberOfAllKittenOfZeroGeneration", &params.numberOfAllKittenOfZeroGeneration);
    if (params.numberOfAllKittenOfZeroGeneration < 1)
    {
        return On_error("numberOfAllKittenOfZeroGeneration must at least 1 kitten");
    }

    Env::DocGetNum64("numberOfKittensForGiveAway", &params.numberOfKittensForGiveAway);
    if (params.numberOfAllKittenOfZeroGeneration <= params.numberOfKittensForGiveAway)
    {
        return On_error("numberOfAllKittenOfZeroGeneration must be greater than or equal to numberOfKittensForGiveAway");
    }

    Env::DocGetNum32("periodOfGiveAway", &params.periodOfGiveaway);
    if (params.periodOfGiveaway < 1) // counted in blocks
    {
        return On_error("periodOfGiveAway must be at least 1 block");
    }

    Env::GenerateKernel(nullptr, CryptoKittens::StartGameParams::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create Cryptokittens contract", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
    Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0, "Destroy Cryptokittens contract", 0);
}

void On_action_view_contracts(const ContractID& cid)
{
    EnumAndDumpContracts(CryptoKittens::s_SID);
}

void On_action_view_contract_params(const ContractID& cid)
{
    Env::Key_T<uint8_t> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = (uint8_t) CryptoKittens::StartGameParams::s_iMethod;

    CryptoKittens::StartGameParams params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's initial params");

    Env::DocGroup gr("params");
    Env::DocAddNum64("numberOfAllKittenOfZeroGeneration", params.numberOfAllKittenOfZeroGeneration);
    Env::DocAddNum64("numberOfKittensForGiveAway", params.numberOfKittensForGiveAway);
    Env::DocAddNum32("periodOfGiveaway", params.periodOfGiveaway);
}

// PLAYER
void On_action_play(const ContractID& cid)
{
    CryptoKittens::Play params;
    Env::DerivePk(params.pubKey, &cid, sizeof(cid));

    Env::GenerateKernel(nullptr, CryptoKittens::Play::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Start game", 0);
}

void On_action_withdraw_kitten(const ContractID& cid)
{
    CryptoKittens::WithdrawKitten params;
    Env::DerivePk(params.pubKey, &cid, sizeof(cid));

    Env::Key_T<uint8_t> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = (uint8_t)CryptoKittens::CurrentGameState::s_iMethod;

    CryptoKittens::CurrentGameState currentParams;
    if (!Env::VarReader::Read_T(k, currentParams))
    {
        return On_error("Cann't read current game state");
    }

    if (Env::get_Height() < currentParams.heightOfNextGiveaway)
    {
        return On_error("Sorry it's time of giveaway");
    }

    if (currentParams.numberOfLastKittensForGiveAway == 0)
    {
        return On_error("Sorry all kittens were distributed");
    }

    Env::GenerateKernel(nullptr, CryptoKittens::WithdrawKitten::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Withdraw kitten from giveaway", 0);
}

void On_action_view_my_kittens(const ContractID& cid)
{
    //Kitten k;

    //std::deque<Kitten> l;
    //l.push_back(k);
    //l.push_back(k);


    //Env::DocGroup gr("params");
    //Env::DocAddNum64("size", l.size());

    Kitten k;
    Env::DocGroup gr("kitten");

    for (auto phenotypeIt = k.phenotype.setOfSigns.cbegin(); phenotypeIt != k.phenotype.setOfSigns.cend(); ++phenotypeIt)
    {
        Env::DocGroup gr("allele");

        Env::DocAddText("first", phenotypeIt->first.data());
        Env::DocAddText("second", phenotypeIt->second.data());
    }

    //Env::Key_T<const char*> k;
    //k.m_Prefix.m_Cid = cid;
    //k.m_KeyInContract = "CurrentGameState";

    //CryptoKittens::CurrentGameState params;
    //if (!Env::VarReader::Read_T(k, params))
    //    return On_error("Failed to read contract's params");

    //Env::DocGroup gr("myKittens");

    //for (auto kittenIt = params.kittensAndOwners[1/*r.m_Account*/].cbegin();
    //    kittenIt != params.kittensAndOwners[1/*r.m_Account*/].cend();
    //    ++kittenIt)
    //{
    //    Env::DocGroup kitten("");

    //    for (auto phenotypeIt = kittenIt->phenotype.setOfSigns.cbegin();
    //        phenotypeIt != kittenIt->phenotype.setOfSigns.cend(); ++phenotypeIt)
    //    {
    //        Env::DocAddText(phenotypeIt->first.c_str(), phenotypeIt->second.c_str());
    //    }
    //}

}

void On_action_view_number_kittens_for_giveaway(const ContractID& cid)
{
    Env::Key_T<uint8_t> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = (uint8_t)CryptoKittens::StartGameParams::s_iMethod;

    CryptoKittens::StartGameParams params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's initial params");

    Env::DocAddNum64("heightOfNextGiveaway", params.periodOfGiveaway);
}

void On_action_view_number_of_next_giveaway_block(const ContractID& cid)
{
    Env::Key_T<uint8_t> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = (uint8_t)CryptoKittens::CurrentGameState::s_iMethod;

    CryptoKittens::CurrentGameState params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's current params");

    Env::DocAddNum64("heightOfNextGiveaway", params.heightOfNextGiveaway);
}

void On_action_get_my_pkey(const ContractID& cid)
{
    PubKey my_key;
    Env::DerivePk(my_key, &cid, sizeof(cid));
    Env::DocGroup root("");
    {
        Env::DocAddBlob_T("My public key", my_key);
    }
}

BEAM_EXPORT void Method_0()
{
    Env::DocGroup root("");
    {
        Env::DocGroup gr("roles");
        {
            {
                Env::DocGroup grRole("manager");

                {
                    Env::DocGroup grMethod("create_contract");
                    Env::DocAddText("numberOfAllKittenOfZeroGeneration", "uin64");
                    Env::DocAddText("numberOfKittensForGiveAway", "uin64");
                    Env::DocAddText("periodOfGiveaway", "uin32");
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
                    Env::DocGroup grMethod("play");
                    Env::DocAddText("cid", "ContractID");
                }
                {
                    Env::DocGroup grMethod("withdraw_kitten");
                    Env::DocAddText("cid", "ContractID");
                }
                {
                    Env::DocGroup grMethod("view_my_kittens");
                    Env::DocAddText("cid", "ContractID");
                }
                {
                    Env::DocGroup grMethod("view_kittens_for_giveaway");
                    Env::DocAddText("cid", "ContractID");
                }
                {
                    Env::DocGroup grMethod("view_number_of_next_giveaway_block");
                    Env::DocAddText("cid", "ContractID");
                }
                {
                    Env::DocGroup grMethod("get_my_pkey");
                    Env::DocAddText("cid", "ContractID");
                }
            }
        }
    }
}

constexpr size_t ACTION_BUF_SIZE = 32;
constexpr size_t ROLE_BUF_SIZE = 16;

using Action_func_t = void (*)(const ContractID&);

template <typename T>
auto find_if_contains(const char* str, const std::vector<std::pair<const char*, T>>& v) 
{
    return std::find_if(v.begin(), v.end(), [&str](const auto& p) 
        {
            return !strcmp(str, p.first);
        }
    );
}

BEAM_EXPORT void Method_1()
{
    const std::vector<std::pair<const char*, Action_func_t>> VALID_PLAYER_ACTIONS = 
    {
        {"play", On_action_play},
        {"withdraw_kitten", On_action_withdraw_kitten},
        {"view_my_kittens", On_action_view_my_kittens},
        {"view_kittens_for_giveaway", On_action_view_number_kittens_for_giveaway},
        {"view_number_of_next_giveaway_block", On_action_view_number_of_next_giveaway_block},
        {"get_my_pkey", On_action_get_my_pkey}
    };

    const std::vector<std::pair<const char*, Action_func_t>> VALID_MANAGER_ACTIONS = 
    {
        {"create_contract", On_action_create_contract},
        {"destroy_contract", On_action_destroy_contract},
        {"view_contracts", On_action_view_contracts},
        {"view_contract_params", On_action_view_contract_params}
    };

    const std::vector<std::pair<const char*, const std::vector<std::pair<const char*, Action_func_t>>&>> VALID_ROLES = 
    {
        {"player", VALID_PLAYER_ACTIONS},
        {"manager", VALID_MANAGER_ACTIONS}
    };

    char action[ACTION_BUF_SIZE], role[ROLE_BUF_SIZE];

    if (!Env::DocGetText("role", role, sizeof(role))) 
    {
        return On_error("Role not specified");
    }

    auto it_role = find_if_contains(role, VALID_ROLES);

    if (it_role == VALID_ROLES.end()) 
    {
        return On_error("Invalid role");
    }

    if (!Env::DocGetText("action", action, sizeof(action))) 
    {
        return On_error("Action not specified");
    }

    auto it_action = find_if_contains(action, it_role->second);

    if (it_action != it_role->second.end()) 
    {
        ContractID cid;
        Env::DocGet("cid", cid);
        it_action->second(cid);
    }
    else 
    {
        On_error("Invalid action");
    }
}
