#include "contract.h"

#include "../app_common_impl.h"

namespace NFTGenerator {
    static const ShaderID s_SID = {0xc4, 0x9b, 0xd7, 0xc8, 0x36, 0x47, 0xa0, 0x84, 0x59, 0x32, 0x87, 0x79, 0x1f, 0x39,
                                   0x49, 0xa1, 0xd8, 0x84, 0xfa, 0x77, 0x34, 0x84, 0x26, 0xc1, 0xc0, 0x96, 0x25, 0xb8,
                                   0x6e, 0x53, 0x6f, 0xeb};
}

BEAM_EXPORT void Method_0() {
    Env::DocGroup root("");
    {
        Env::DocGroup roles("roles");
        {
            Env::DocGroup role("user");
            {
                Env::DocGroup action("get_requests");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup action("save_value");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("value", "Requested value");
                Env::DocAddText("key", "User key");
                Env::DocAddText("id", "Request id");
            }
        }
        {
            Env::DocGroup role("manager");
            {
                Env::DocGroup action("create");
            }
            {
                Env::DocGroup action("destroy");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup action("view");
            }
        }
    }
}

void GetRequests(const ContractID &cid) {
    Env::Key_T <oracle::InternalKey> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    start_key.m_KeyInContract.key_type = oracle::KeyType::REQUEST;
    start_key.m_KeyInContract.request_id.id_in_requester = 0;
    _POD_(start_key.m_KeyInContract.request_id.requester_key).SetZero();

    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.key_type = oracle::KeyType::VALUE;
    end_key.m_KeyInContract.request_id.id_in_requester = static_cast<uint32_t>(-1);
    _POD_(end_key.m_KeyInContract.request_id.requester_key).SetObject(0xff);

    Env::Key_T <oracle::InternalKey> key;
    oracle::OracleValue value;
    Env::DocArray gr("values");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value);) {
        Env::DocGroup val("");
        Env::DocAddBlob_T("internal_key", key.m_KeyInContract);
        Env::DocAddBlob_T("value", value);
    }
}

void SaveValue(const ContractID &cid, const oracle::OracleValue &value, const PubKey &key, uint32_t id) {
    oracle::SaveValue request;

    request.value = value;
    request.request_id.id_in_requester = id;
    request.request_id.requester_key = key;
    Env::GenerateKernel(&cid, oracle::SaveValue::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "save new value for request id", 0);
}

BEAM_EXPORT void Method_1() {
    Env::DocGroup root("");

    char role[0x10], action[0x10];

    if (!Env::DocGetText("role", role, sizeof(role))) {
        Env::DocAddText("error", "Not providing role");
        return;
    }

    if (!Env::DocGetText("action", action, sizeof(action))) {
        Env::DocAddText("error", "Not providing action");
        return;
    }

    if (Env::Strcmp(role, "manager") == 0) {
        if (Env::Strcmp(action, "create") == 0) {
            Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0,
                                nullptr, 0, "create random-oracle", 0);
        } else if (Env::Strcmp(action, "destroy") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0,
                                "destroy random-oracle", 0);
        } else if (Env::Strcmp(action, "view") == 0) {
            EnumAndDumpContracts(NFTGenerator::s_SID);
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else if (Env::Strcmp(role, "user") == 0) {
        if (Env::Strcmp(action, "get_requests") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            GetRequests(cid);
        } else if (Env::Strcmp(action, "save_value") == 0) {
            ContractID cid;
            oracle::OracleValue value;
            PubKey key;
            uint32_t id;
            Env::DocGet("cid", cid);
            Env::DocGet("value", value);
            Env::DocGet("key", key);
            Env::DocGet("id", id);
            SaveValue(cid, value, key, id);
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}