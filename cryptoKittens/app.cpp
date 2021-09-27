#include "../common.h"
#include "../app_common_impl.h"
#include "contract.h"
#include "shader_lib.cpp"

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

    Env::DocGetNum64("numberOfAllKittens", &params.numberOfAllKittens);
    if (params.numberOfAllKittens > 0)
    {
        return On_error("numberOfAllKittens must at least 1 kitten");
    }

    Env::DocGetNum64("numberOfKittensForGiveAway", &params.numberOfKittensForGiveAway);
    if (params.numberOfKittensForGiveAway >= params.numberOfAllKittens)
    {
        return On_error("numberOfKittensForGiveAway must be greater than or equal to numberOfAllKittens");
    }

    Env::DocGetNum32("periodOfGiveaway", &params.periodOfGiveaway);
    if (params.periodOfGiveaway < 0) // counted in blocks
    {
        return On_error("periodOfGiveaway must be at least 1 block");
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
    Env::Key_T<const char*> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = "StartGameParams";

    CryptoKittens::StartGameParams params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's initial params");

    Env::DocGroup gr("params");
    Env::DocAddNum64("numberOfAllKittens", params.numberOfAllKittens);
    Env::DocAddNum64("numberOfKittensForGiveAway", params.numberOfKittensForGiveAway);
    Env::DocAddNum32("periodOfGiveaway", params.periodOfGiveaway);
}

// PLAYER
void On_action_withdraw_kitten(const ContractID& cid, const CharacterId kittenId)
{
    if (kittenId < 0)
    {
        return On_error("kittenId must be positive");
    }

    CryptoKittens::WithdrawKitten params;
    Env::DerivePk(params.m_Account, &cid, sizeof(cid));
    params.kittenId = kittenId;
 
    Env::GenerateKernel(nullptr, CryptoKittens::StartGameParams::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Withdraw kitten from giveaway", 0);
}

void On_action_view_my_kittens(const ContractID& cid)
{
    Env::Key_T<const char*> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = "CurrentGameState";

    CryptoKittens::CurrentGameState params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's params");

    Env::DocGroup gr("myKittens");

    for (auto kittenIt = params.kittensAndOwners[1/*r.m_Account*/].cbegin();
        kittenIt != params.kittensAndOwners[1/*r.m_Account*/].cend();
        ++kittenIt)
    {
        Env::DocGroup kitten("");

        for (auto phenotypeIt = kittenIt->phenotype.setOfSigns.cbegin();
            phenotypeIt != kittenIt->phenotype.setOfSigns.cend(); ++phenotypeIt)
        {
         //   Env::DocAddText(phenotypeIt->first.c_str(), phenotypeIt->second.c_str());
        }
    }

}

void On_action_view_kittens_for_giveaway(const ContractID& cid)
{
    Env::Key_T<const char*> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = "CurrentGameState";

    CryptoKittens::CurrentGameState params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's params");

    Env::DocGroup gr("kittensForGiveaway");

    for (auto kittenIt = params.kittensForGiveaway.cbegin();
        kittenIt != params.kittensForGiveaway.cend();
        ++kittenIt)
    {
       // std::string_view tmp = std::to_string_view(kittenIt->first);
       // Env::DocGroup kitten(tmp.c_str());

       // for (auto phenotypeIt = kittenIt->second.phenotype.setOfSigns.cbegin(); 
       //     phenotypeIt != kittenIt->second.phenotype.setOfSigns.cend(); ++phenotypeIt)
       // {
           // Env::DocAddText(phenotypeIt->first.c_str(), phenotypeIt->second.c_str());
       // }
    }
}

void On_action_view_number_of_next_giveaway_block(const ContractID& cid)
{
    Env::Key_T<const char*> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = "CurrentGameState";

    CryptoKittens::CurrentGameState params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's initial params");

    Env::DocGroup gr("");
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
            Env::DocGroup grRole("manager");
            {
                {
                    Env::DocGroup grMethod("create_contract");
                    Env::DocAddText("numberOfAllKittens", "uin64");
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
                    Env::DocGroup grMethod("withdraw_kitten");
                    Env::DocAddText("cid", "ContractID");
                    Env::DocAddText("kittenId", "CharacterId");
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
auto find_if_contains(const char* str, const std::deque<std::pair<const char*, T>>& v) {
    return std::find_if(v.begin(), v.end(), [&str](const auto& p) {
        return !strcmp(str, p.first);
        });
}

BEAM_EXPORT void Method_1()
{
    const std::deque<std::pair<const char*, Action_func_t>> VALID_PLAYER_ACTIONS = {
        //{"withdraw_kitten", On_action_withdraw_kitten},
        {"view_my_kittens", On_action_view_my_kittens},
        {"view_kittens_for_giveaway", On_action_view_kittens_for_giveaway},
        {"view_number_of_next_giveaway_block", On_action_view_number_of_next_giveaway_block},
        {"get_my_pkey", On_action_get_my_pkey},
    };

    const std::deque<std::pair<const char*, Action_func_t>> VALID_MANAGER_ACTIONS = 
    {
        {"create_contract", On_action_create_contract},
        {"destroy_contract", On_action_destroy_contract},
        {"view_contracts", On_action_view_contracts},
        {"view_contract_params", On_action_view_contract_params}
    };

    const std::deque<std::pair<const char*, const std::deque<std::pair<const char*, Action_func_t>>&>> 
        VALID_ROLES = {
        {"player", VALID_PLAYER_ACTIONS},
        {"manager", VALID_MANAGER_ACTIONS}
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
    }
    else {
        On_error("Invalid action");
    }
}
