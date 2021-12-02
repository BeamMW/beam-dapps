#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"

#include <algorithm>
#include <vector>
#include <utility>
#include <string_view>

namespace randomoracle {

#include "contract_sid.i"

}

using Action_func_t = void (*)(const ContractID &);
using Actions_map_t = std::vector <std::pair<std::string_view, Action_func_t>>;
using Roles_map_t = std::vector<std::pair<std::string_view, const Actions_map_t &>>;

constexpr size_t
ACTION_BUF_SIZE = 32;
constexpr size_t
ROLE_BUF_SIZE = 16;

void On_error(const char *msg) {
    Env::DocGroup root("");
    {
        Env::DocAddText("error", msg);
    }
}

template<typename T>
auto find_if_contains(const std::string_view str, const std::vector <std::pair<std::string_view, T>> &v) {
    return std::find_if(v.begin(), v.end(), [&str](const auto &p) {
        return str == p.first;
    });
}

void On_action_create_contract(const ContractID &unused) {
    randomoracle::InitialParams params;

    Env::GenerateKernel(nullptr, randomoracle::InitialParams::METHOD, &params, sizeof(params), nullptr, 0, nullptr, 0,
                        "Create randomoracle contract", 0);
}

void On_action_destroy_contract(const ContractID &cid) {
    Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0, "Destroy randomoracle contract", 0);
}

void On_action_view_contracts(const ContractID &unused) {
    EnumAndDumpContracts(randomoracle::s_SID);
}

void On_action_view_contract_params(const ContractID &cid) {
    Env::Key_T<int> k;
    k.m_Prefix.m_Cid = cid;
    k.m_KeyInContract = 0;

    randomoracle::InitialParams params;
    if (!Env::VarReader::Read_T(k, params))
        return On_error("Failed to read contract's initial params");

    Env::DocGroup gr("params");
}

void On_action_get_oracle_requests(const ContractID &cid) {
    Env::Key_T <randomoracle::InternalKey> start_key, end_key;
    start_key.m_Prefix.m_Cid = cid;
    start_key.m_KeyInContract.key_type = randomoracle::KeyType::REQUEST;
    _POD_(start_key.m_KeyInContract.request_id.requester_key).SetZero();
    start_key.m_KeyInContract.request_id.id_in_requester = 0;

    end_key = start_key;
    end_key.m_KeyInContract.key_type = randomoracle::KeyType::REQUEST;
    _POD_(end_key.m_KeyInContract.request_id.requester_key).SetObject(0xff);
    end_key.m_KeyInContract.request_id.id_in_requester = static_cast<uint32_t>(-1);

    Env::Key_T <randomoracle::InternalKey> key;
    key.m_Prefix.m_Cid = cid;
    Env::DocArray gr("values");
    randomoracle::Request value;
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value);) {
        Env::DocArray gr1("");
        Env::DocGroup val1("Key Info");
        Env::DocAddNum("key_type", static_cast<uint32_t>(key.m_KeyInContract.key_type));
        Env::DocAddBlob_T("request_id.requester_key", key.m_KeyInContract.request_id.requester_key);
        Env::DocAddBlob_T("request_id.id_in_requester", key.m_KeyInContract.request_id.id_in_requester);

        Env::DocGroup val2("Value Info");
        Env::DocAddNum("value.value_type", value.value_type);
        Env::DocAddNum("value.request_id.id_in_requester", value.request_id.id_in_requester);
        Env::DocAddBlob_T("value.request_id.requester_key", value.request_id.requester_key);
        Env::DocAddBlob_T("value.value_details", value.value_details);
    }
}

void On_action_save_value(const ContractID &cid) {
    randomoracle::SaveValue request;

    uint64_t value;
    PubKey key;
    uint32_t id;
    Env::DocGet("value", value);
    Env::DocGetBlob("key", &key, sizeof(key));
    Env::DocGet("id", id);

    request.value = value;
    request.key.key_type = randomoracle::KeyType::VALUE;
    request.key.request_id.id_in_requester = id;
    request.key.request_id.requester_key = key;

    Env::GenerateKernel(&cid, randomoracle::SaveValue::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "save new value for request id", 3'100'000);
}

BEAM_EXPORT void Method_0() {
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
            {
                Env::DocGroup grMethod("view_contract_params");
                Env::DocAddText("cid", "ContractID");
            }
        }
        {
            Env::DocGroup grRole("user");
            {
                Env::DocGroup grMethod("get_oracle_requests");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("save_value");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("value", "data");
                Env::DocAddText("key", "key");
                Env::DocAddText("id", "request id");
            }
        }
    }
}

BEAM_EXPORT void Method_1() {
    const Actions_map_t VALID_USER_ACTIONS = {
            {"get_oracle_requests",   On_action_get_oracle_requests},
            {"save_value",            On_action_save_value},
    };

    const Actions_map_t VALID_MANAGER_ACTIONS = {
            {"create_contract",      On_action_create_contract},
            {"destroy_contract",     On_action_destroy_contract},
            {"view_contracts",       On_action_view_contracts},
            {"view_contract_params", On_action_view_contract_params},
    };

    /* Add your new role's actions here */

    const Roles_map_t VALID_ROLES = {
            {"user",    VALID_USER_ACTIONS},
            {"manager", VALID_MANAGER_ACTIONS},
            /* Add your new role here */
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
