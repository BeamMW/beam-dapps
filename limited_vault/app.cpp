#include "../common.h"
#include "contract.h"
#include "../app_common_impl.h"

BEAM_EXPORT void Method_0() {
    Env::DocGroup root("");

    {
        Env::DocGroup gr("roles");
        {
            Env::DocGroup grRole("manager");
            {
                Env::DocGroup grMethod("create");
            }
            {
                Env::DocGroup grMethod("destroy");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view");
            }
            {
                Env::DocGroup grMethod("view_logs");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_accounts");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("view_account");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("pubKey", "PubKey");
            }
        }
        {
            Env::DocGroup grRole("my_account");
            {
                Env::DocGroup grMethod("view");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup grMethod("get_proof");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup grMethod("deposit");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup grMethod("withdraw");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup grMethod("set_limits");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("low_amount", "Low amount limit");
                Env::DocAddText("high_amount", "High amount limit");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup grMethod("set_limits");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
            }
        }
    }
}

void OnError(const char* sz)
{
    Env::DocAddText("error", sz);
}

void ManagerCreate() {
    Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0, nullptr, 0, "create manager limited vault", 0);
}

void ManagerDestroy(const ContractID& contract_id) {
    Env::GenerateKernel(&contract_id, 1, nullptr, 0, nullptr, 0, nullptr, 0, "destroy manager", 0);
}

void ViewLogs(const ContractID& contract_id) {
    Env::Key_T<LimitedVault::ComplexKey> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = contract_id;
    _POD_(start_key.m_KeyInContract).SetZero();
    _POD_(end_key.m_Prefix.m_Cid) = contract_id;
    _POD_(end_key.m_KeyInContract).SetObject(0xff);

    Env::LogReader logs_reader(start_key, end_key);

    Env::DocArray logs_array("logs");
    while (true) {
        Env::Key_T<LimitedVault::ComplexKey> key;
        Amount value;

        if (!logs_reader.MoveNext_T(key, value)) {
            break;
        }

        Env::DocGroup log_entry_group("");
        Env::DocAddNum("Height", logs_reader.m_Pos.m_Height);
        Env::DocAddNum("Pos", logs_reader.m_Pos.m_Pos);
        Env::DocAddBlob_T("Account", key.m_KeyInContract.key);
        Env::DocAddNum("AssetID", key.m_KeyInContract.asset_id);
        Env::DocAddNum("Amount", value);
    }
}

void ViewAccounts(const ContractID& contract_id) {
    Env::KeyPrefix start_prefix, end_prefix;
    _POD_(start_prefix.m_Cid) = contract_id;
    _POD_(end_prefix.m_Cid) = contract_id;
    end_prefix.m_Tag = KeyTag::Internal + 1;

    Env::VarReader account_reader(start_prefix, end_prefix);

    Env::DocArray accounts("accounts");
    Env::Key_T<LimitedVault::ComplexKey> key;
    Amount value;
    for (; account_reader.MoveNext_T(key, value); ) {
        Env::DocGroup account("");
        Env::DocAddBlob_T("Account", key.m_KeyInContract.key);
        Env::DocAddNum("AssetID", key.m_KeyInContract.asset_id);
        Env::DocAddNum("Amount", value);
    }
}

void ViewAccount(const ContractID& contract_id, const PubKey& pub_key) {
    Env::Key_T<LimitedVault::ComplexKey> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = contract_id;
    _POD_(start_key.m_KeyInContract.key) = pub_key;
    start_key.m_KeyInContract.asset_id = 0;
    _POD_(end_key.m_Prefix.m_Cid) = contract_id;
    _POD_(end_key.m_KeyInContract.key) = pub_key;
    end_key.m_KeyInContract.asset_id = static_cast<AssetID>(-1);

    Env::VarReader reader(start_key, end_key);
    Env::Key_T<LimitedVault::ComplexKey> key;
    Amount value;
    Env::DocArray accounts("accounts");
    for (; reader.MoveNext_T(key, value); ) {
        Env::DocGroup account("");
        Env::DocAddBlob_T("Account", key.m_KeyInContract.key);
        Env::DocAddNum("AssetID", key.m_KeyInContract.asset_id);
        Env::DocAddNum("Amount", value);
    }
}

#pragma pack (push, 1)
struct PersonalID
{
    ContractID cid;
    uint8_t context = 0;
};

struct LimitAmounts {
    Amount low_limit;
    Amount high_limit;
};
#pragma pack (pop)

PubKey GetKeyByCID(const ContractID& cid) {
    PersonalID id;
    id.cid = cid;
    PubKey key;
    Env::DerivePk(key, &id, sizeof(id));
    return key;
}

void ViewPersonal(const ContractID& cid) {
    PubKey key = GetKeyByCID(cid);
    ViewAccount(cid, key);
}

void GetProof(const ContractID& contract_id, const AssetID& asset_id) {
    Env::Key_T<LimitedVault::ComplexKey> key;
    _POD_(key.m_Prefix.m_Cid) = contract_id;
    _POD_(key.m_KeyInContract.key) = GetKeyByCID(contract_id);
    key.m_KeyInContract.asset_id = asset_id;
    const Amount* amount;
    uint32_t amount_size;
    const Merkle::Node* proof;
    uint32_t read_proofs = Env::VarGetProof(&key, sizeof(key),
                                            reinterpret_cast<const void**>(&amount),
                                            &amount_size, &proof);

    if (read_proofs > 0 && sizeof(*amount) == amount_size) {
        Env::DocAddNum("Amount", *amount);
        Env::DocAddBlob("Proof", proof, sizeof(*proof) * read_proofs);
    }
}

void Deposit(const ContractID& contract_id, Amount amount, AssetID asset_id) {
    LimitedVault::DepositRequest request;
    request.amount = amount;
    request.key.asset_id = asset_id;
    request.key.key = GetKeyByCID(contract_id);

    FundsChange fc;
    fc.m_Amount = request.amount;
    fc.m_Aid = request.key.asset_id;
    fc.m_Consume = true;

    Env::GenerateKernel(&contract_id, LimitedVault::DepositRequest::kMethodNumber, &request, sizeof(request),
                        &fc, 1, nullptr, 0, "deposit", 0);
}

void Withdraw(const ContractID& contract_id, Amount amount, AssetID asset_id) {
    LimitedVault::WithdrawRequest request;
    request.amount = amount;
    request.key.asset_id = asset_id;
    request.key.key = GetKeyByCID(contract_id);

    FundsChange fc;
    fc.m_Amount = request.amount;
    fc.m_Aid = request.key.asset_id;
    fc.m_Consume = false;

    PersonalID id;
    id.cid = contract_id;

    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&contract_id, LimitedVault::WithdrawRequest::kMethodNumber, &request, sizeof(request),
                        &fc, 1, &sig, 1, "withdraw", 0);
}

void SetLimits(const ContractID& contract_id, Amount low_amount, Amount high_amount, AssetID asset_id) {
    LimitedVault::SetLimitsRequest request;
    request.low_limit = low_amount;
    request.high_limit = high_amount;
    request.key.asset_id = asset_id;
    request.key.key = GetKeyByCID(contract_id);

    PersonalID id;
    id.cid = contract_id;

    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&contract_id, LimitedVault::SetLimitsRequest::kMethodNumber, &request, sizeof(request),
                        nullptr, 0, &sig, 1, "set limits", 0);
}

void GetLimits(const ContractID& contract_id, AssetID asset_id) {
    Env::Key_T<LimitedVault::LimitsKey> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = contract_id;
    _POD_(start_key.m_KeyInContract.key.key) = GetKeyByCID(contract_id);
    start_key.m_KeyInContract.key.asset_id = asset_id;
    start_key.m_KeyInContract.type = LimitedVault::LimitType::Low;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.type = LimitedVault::LimitType::Internal;

    Env::Key_T<LimitedVault::LimitsKey> key;
    Amount value;
    Env::DocArray("limits");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value); ) {
        Env::DocGroup("");
        Env::DocAddBlob_T("Account", key.m_KeyInContract.key.key);
        Env::DocAddBlob_T("Type", key.m_KeyInContract.type);
        Env::DocAddNum("Amount", value);
    }
}

BEAM_EXPORT void Method_1() {
    Env::DocGroup root("");

    char szRole[0x10], szAction[0x10];

    if (!Env::DocGetText("role", szRole, sizeof(szRole))) {
        return OnError("Role not specified");
    }

    if (!Env::DocGetText("action", szAction, sizeof(szAction))) {
        return OnError("Action not specified");
    }
    if (!Env::Strcmp(szRole, "manager")) {
        if (!Env::Strcmp(szAction, "create")) {
            ManagerCreate();
            return;
        }
        if (!Env::Strcmp(szAction, "destroy")) {
            ContractID contract_id;
            Env::DocGet("cid", contract_id);
            ManagerDestroy(contract_id);
            return;
        }
        if (!Env::Strcmp(szAction, "view")) {
            EnumAndDumpContracts(LimitedVault::s_SID);
            return;
        }
        if (!Env::Strcmp(szAction, "view_logs")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            ViewLogs(cid);
            return;
        }
        if (!Env::Strcmp(szAction, "view_accounts")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            ViewAccounts(cid);
            return;
        }
        if (!Env::Strcmp(szAction, "view_account")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            PubKey pub_key;
            Env::DocGet("pub_key", pub_key);
            ViewAccount(cid, pub_key);
            return;
        }
        return OnError("invalid Action");
    }
    if (!Env::Strcmp(szRole, "my_account")) {
        if (!Env::Strcmp(szAction, "view")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            ViewPersonal(cid);
            return;
        }
        if (!Env::Strcmp(szAction, "get_proof")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            AssetID asset_id;
            Env::DocGet("aid", asset_id);
            GetProof(cid, asset_id);
            return;
        }
        if (!Env::Strcmp(szAction, "deposit")) {
            ContractID cid;
            Env::DocGet("cid", cid);
            Amount amount;
            Env::DocGet("amount", amount);
            AssetID asset_id;
            Env::DocGet("aid", asset_id);
            Deposit(cid, amount, asset_id);
            return;
        }
        if (!Env::Strcmp(szAction, "withdraw")) {
            ContractID arg_cid;
            Env::DocGet("cid", arg_cid);
            Amount arg_amount;
            Env::DocGet("amount", arg_amount);
            AssetID arg_aid;
            Env::DocGet("aid", arg_aid);
            Withdraw(arg_cid, arg_amount, arg_aid);
            return;
        }
        if (!Env::Strcmp(szAction, "set_limits")) {
            ContractID arg_cid;
            Env::DocGet("cid", arg_cid);
            Amount low_limit;
            Env::DocGet("low_amount", low_limit);
            Amount high_limit;
            Env::DocGet("high_amount", high_limit);
            AssetID arg_aid;
            Env::DocGet("aid", arg_aid);
            SetLimits(arg_cid, low_limit, high_limit, arg_aid);
            return;
        }
        if (!Env::Strcmp(szAction, "get_limits")) {
            ContractID arg_cid;
            Env::DocGet("cid", arg_cid);
            AssetID arg_aid;
            Env::DocGet("aid", arg_aid);
            GetLimits(arg_cid, arg_aid);
            return;
        }
        return OnError("invalid Action");
    }

    OnError("unknown Role");
}
