#include "contract.h"

#include "Shaders/app_common_impl.h"

namespace NFTGenerator {

#include "contract_sid.i"

}

BEAM_EXPORT void Method_0() {
    Env::DocGroup root("");
    {
        Env::DocGroup roles("roles");
        {
            Env::DocGroup role("user");
            {
                Env::DocGroup action("set_price");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("seed", "Seed to send");
                Env::DocAddText("price", "New price");
            }
            {
                Env::DocGroup action("buy");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("seed", "Seed to send");
                Env::DocAddText("price", "New price");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup action("withdraw");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup action("get_key");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("seed", "seed");
            }
            {
                Env::DocGroup action("get_user_seeds");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup action("balance");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup action("generate");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("oracle_cid", "ContractID");
            }
            {
                Env::DocGroup action("try_get_value");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("oracle_cid", "ContractID");
                Env::DocAddText("id_in_requester", "Request id of given user");
            }
            {
                Env::DocGroup action("check_and_get");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("oracle_cid", "ContractID");
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
            {
                Env::DocGroup action("seeds");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup action("owner_withdraw");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
            }
            {
                Env::DocGroup action("owner_balance");
                Env::DocAddText("cid", "ContractID");
            }
        }
    }
}

#pragma pack (push, 1)
struct PersonalID {
    ContractID cid;
    uint8_t context = 0;
};
struct SeedAndCid {
    ContractID cid;
};
#pragma pack (pop)

PubKey GetKeyByCID(const ContractID &cid) {
    PersonalID id;
    id.cid = cid;
    PubKey key;
    Env::DerivePk(key, &id, sizeof(id));
    return key;
}

uint64_t MergeNumbers(uint32_t upper, uint32_t lower) {
    return (static_cast<uint64_t>(upper) << 32) + lower;
}

bool IsSeedAlreadyGenerated(const ContractID &cid, AssetID aid, uint64_t seed) {
    Env::Key_T <NFTGenerator::ComplexKeyWithSeed> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    _POD_(start_key.m_KeyInContract.key.key) = GetKeyByCID(cid);
    start_key.m_KeyInContract.key.asset_id = aid;
    start_key.m_KeyInContract.seed = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.seed = static_cast<uint64_t>(-1);

    Env::Key_T <NFTGenerator::ComplexKeyWithSeed> key;
    PubKey holder;
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, holder);) {
        if (key.m_KeyInContract.seed == seed) {
            return true;
        }
    }

    return false;
}

PubKey GetKey(const ContractID &cid) {
    SeedAndCid id;
    id.cid = cid;
    PubKey key;
    Env::DerivePk(key, &id, sizeof(SeedAndCid));
    return key;
}

void CreateContract() {
    NFTGenerator::InitialParams params;
    Env::DerivePk(params.owner_key, &NFTGenerator::owner_public_key, sizeof(NFTGenerator::owner_public_key));
    Env::GenerateKernel(nullptr, NFTGenerator::InitialParams::s_iMethod, &params, sizeof(params), nullptr, 0,
                        nullptr, 0, "Create nft gallery contract", 0);
}

void GetAllSeeds(const ContractID &cid) {
    Env::Key_T <uint64_t> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    start_key.m_KeyInContract = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract = static_cast<uint64_t>(-1);

    Env::Key_T <uint64_t> key;
    NFTGenerator::NFT nft;
    Env::DocArray gr("seeds");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, nft);) {
        Env::DocGroup seeds("");
        Env::DocAddNum("aid", nft.price.asset_id);
        Env::DocAddNum("amount", nft.price.amount);
        Env::DocAddNum("seed", nft.seed);
        Env::DocAddBlob_T("holder", nft.holder);
    }
}

void OwnerWithdraw(const ContractID &cid, Amount amount, AssetID asset_id) {
    NFTGenerator::Withdraw request;
    request.value = amount;
    request.key.asset_id = asset_id;
    Env::DerivePk(request.key.user, &NFTGenerator::owner_public_key, sizeof(NFTGenerator::owner_public_key));

    FundsChange fc;
    fc.m_Amount = amount;
    fc.m_Aid = asset_id;
    fc.m_Consume = false;

    SigRequest sig;
    sig.m_pID = &NFTGenerator::owner_public_key;
    sig.m_nID = sizeof(NFTGenerator::owner_public_key);

    Env::GenerateKernel(&cid, NFTGenerator::Withdraw::s_iMethod, &request, sizeof(request),
                        &fc, 1, &sig, 1, "withdraw", 0);
}

Amount GetOwnerBalance(const ContractID &cid, AssetID aid) {
    Env::Key_T <NFTGenerator::Payout::Key> key;
    _POD_(key.m_Prefix.m_Cid) = cid;
    Env::DerivePk(key.m_KeyInContract.user, &NFTGenerator::owner_public_key, sizeof(NFTGenerator::owner_public_key));
    _POD_(key.m_KeyInContract.asset_id) = aid;

    NFTGenerator::Payout payout;
    _POD_(payout).SetZero();

    if (!Env::VarReader::Read_T(key, payout)) {
        return 0;
    }
    return payout.amount;
}

void GetUserSeeds(const ContractID &cid) {
    Env::Key_T <uint64_t> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    start_key.m_KeyInContract = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract = static_cast<uint64_t>(-1);

    Env::Key_T <uint64_t> key;
    NFTGenerator::NFT nft;
    Env::DocArray gr("seeds");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, nft);) {
        PubKey this_user_pk;
        _POD_(this_user_pk) = GetKey(cid);

        Secp_point *p = Env::Secp_Point_alloc(), *p2 = Env::Secp_Point_alloc();
        Env::Secp_Point_Import(*p, nft.holder);
        Env::Secp_Point_Import(*p2, this_user_pk);

        Secp_point_data pd, pd2;
        Env::Secp_Point_Export(*p, pd);
        Env::Secp_Point_Export(*p2, pd2);

        if (_POD_(pd) == pd2) {
            Env::DocGroup seeds("");
            Env::DocAddNum("aid", nft.price.asset_id);
            Env::DocAddNum("amount", nft.price.amount);
            Env::DocAddNum("seed", nft.seed);
            Env::DocAddBlob_T("holder", nft.holder);
        }

        Env::Secp_Point_free(*p);
        Env::Secp_Point_free(*p2);
    }
}

void SetSeedPrice(const ContractID &cid, uint64_t seed, NFTGenerator::Price price) {
    PubKey holder = GetKey(cid);
    NFTGenerator::SetPrice args;
    args.updated_nft.seed = seed;
    args.updated_nft.holder = holder;
    _POD_(args.updated_nft.price) = price;

    SeedAndCid id;
    id.cid = cid;
    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&cid, NFTGenerator::SetPrice::s_iMethod,
                        &args, sizeof(args), nullptr, 0,
                        &sig, 1, "set price for seed in gallery", 0);
    Env::DocAddBlob_T("holder", holder);
}

void BuySeed(ContractID cid, uint64_t seed, Amount price, AssetID asset_id) {
    NFTGenerator::Buy args;
    args.seed = seed;
    args.buyer = GetKey(cid);
    args.price = price;

    FundsChange fc;
    fc.m_Consume = true;
    fc.m_Amount = price;
    fc.m_Aid = asset_id;

    Env::GenerateKernel(&cid, args.s_iMethod, &args, sizeof(args), &fc, 1, nullptr, 0, "gallery buy seed", 0);

    Env::DocAddNum("price.amount", price);
    Env::DocAddNum("price.asset_id", asset_id);
}

void Withdraw(const ContractID &contract_id, Amount amount, AssetID asset_id) {
    NFTGenerator::Withdraw request;
    request.value = amount;
    request.key.asset_id = asset_id;
    request.key.user = GetKey(contract_id);

    FundsChange fc;
    fc.m_Amount = amount;
    fc.m_Aid = asset_id;
    fc.m_Consume = false;

    SeedAndCid id;
    id.cid = contract_id;

    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&contract_id, NFTGenerator::Withdraw::s_iMethod, &request, sizeof(request),
                        &fc, 1, &sig, 1, "withdraw", 0);
}

Amount GetBalance(const ContractID &cid, AssetID aid) {
    Env::Key_T <NFTGenerator::Payout::Key> key;
    _POD_(key.m_Prefix.m_Cid) = cid;
    _POD_(key.m_KeyInContract.user) = GetKey(cid);
    _POD_(key.m_KeyInContract.asset_id) = aid;

    NFTGenerator::Payout payout;
    _POD_(payout).SetZero();

    if (!Env::VarReader::Read_T(key, payout)) {
        return 0;
    }
    return payout.amount;
}

void RequestNewSeed(const ContractID &cid, const ContractID &oracle_cid) {
    NFTGenerator::RequestNewSeed request;
    request.oracle_cid = oracle_cid;
    request.user = GetKey(cid);
    request.seed_charge = NFTGenerator::seed_creation_charge_price;

    FundsChange fc;
    fc.m_Consume = true;
    fc.m_Amount = NFTGenerator::seed_creation_charge_price.amount;
    fc.m_Aid = NFTGenerator::seed_creation_charge_price.asset_id;

    Env::GenerateKernel(&cid, NFTGenerator::RequestNewSeed::s_iMethod, &request, sizeof(request),
                        &fc, 1, nullptr, 0, "Request new seed", 3'100'000);
}

void TryGetSeed(const ContractID &cid, const ContractID &oracle_cid, uint32_t id_in_requester) {
    NFTGenerator::TryGetSeed request;
    request.oracle_cid = oracle_cid;
    request.request_id.requester_key = GetKey(cid);
    request.request_id.id_in_requester = id_in_requester;

    SeedAndCid id;
    id.cid = cid;
    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&cid, NFTGenerator::TryGetSeed::s_iMethod, &request, sizeof(request),
                        nullptr, 0, &sig, 1, "Request new seed", 3'100'000);
}

void CheckValueAndGetIfThere(const ContractID &cid, const ContractID &oracle_cid) {
    // get all request id to check values for them
    Env::Key_T <NFTGenerator::SaveIDFromRequest> key, start_key, end_key;

    key.m_Prefix.m_Cid = cid; // actually idk should i or not initialize these fields for key
    key.m_KeyInContract.user = GetKey(cid);

    start_key.m_Prefix.m_Cid = cid; // initialize start_key fields to look up current request ids
    start_key.m_KeyInContract.user = GetKey(cid);
    Env::DocAddBlob_T("user key", start_key.m_KeyInContract.user);
    start_key.m_KeyInContract.id = 0;

    end_key = start_key; // end_key for current request ids
    end_key.m_KeyInContract.id = static_cast<uint32_t>(-1);

    uint32_t value;
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value);) {
        // if we found some request id, we check if oracle already saved value by this request id
        Env::Key_T <NFTGenerator::InternalKey> oracle_key;
        oracle_key.m_Prefix.m_Cid = oracle_cid;
        oracle_key.m_KeyInContract.key_type = NFTGenerator::KeyType::VALUE;
        oracle_key.m_KeyInContract.request_id.requester_key = GetKey(cid);
        oracle_key.m_KeyInContract.request_id.id_in_requester = value;

        uint64_t oracle_value;
        // if this Read_T is successful then oracle saved some values for us
        if (Env::VarReader::Read_T(oracle_key, oracle_value)) {
            TryGetSeed(cid, oracle_cid, value);
            Env::DocAddText("status", "found id");
        } else {
            Env::DocAddText("status", "did not find any id");
        }
    }
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
            CreateContract();
        } else if (Env::Strcmp(action, "destroy") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0,
                                "destroy nft-generator", 0);
        } else if (Env::Strcmp(action, "view") == 0) {
            EnumAndDumpContracts(NFTGenerator::s_SID);
        } else if (Env::Strcmp(action, "seeds") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            GetAllSeeds(cid);
        } else if (Env::Strcmp(action, "owner_withdraw") == 0) {
          ContractID cid;
          Amount amount;
          AssetID aid;
          Env::DocGet("cid", cid);
          Env::DocGet("amount", amount);
          Env::DocGet("aid", aid);
          OwnerWithdraw(cid, amount, aid);
        } else if (Env::Strcmp(action, "owner_balance") == 0) {
          ContractID cid;
          Env::DocGet("cid", cid);
          GetOwnerBalance(cid, 0);
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else if (Env::Strcmp(role, "user") == 0) {
        if (Env::Strcmp(action, "set_price") == 0) {
            ContractID gallery_CID;
            uint64_t seed;
            AssetID aid;
            Amount price;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("seed", seed);
            Env::DocGet("price", price);
            Env::DocGet("aid", aid);
            NFTGenerator::Price nft_price;
            nft_price.amount = price;
            nft_price.asset_id = aid;
            SetSeedPrice(gallery_CID, seed, nft_price);
        } else if (Env::Strcmp(action, "buy") == 0) {
            ContractID gallery_CID;
            uint64_t seed;
            Amount price;
            AssetID aid;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("seed", seed);
            Env::DocGet("price", price);
            Env::DocGet("aid", aid);
            Env::DocAddNum("right from js: price.amount", price);
            Env::DocAddNum("right from js: price.asset_id", aid);
            BuySeed(gallery_CID, seed, price, aid);
        } else if (Env::Strcmp(action, "withdraw") == 0) {
            ContractID gallery_CID;
            Amount amount;
            AssetID aid;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("amount", amount);
            Env::DocGet("aid", aid);
            Withdraw(gallery_CID, amount, aid);
        } else if (Env::Strcmp(action, "get_key") == 0) {
            ContractID cid;
            uint64_t seed;
            Env::DocGet("cid", cid);
            Env::DocGet("seed", seed);
            PubKey pk = GetKey(cid);
            Env::DocAddBlob("key", &pk, sizeof(pk));
        } else if (Env::Strcmp(action, "get_user_seeds") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            GetUserSeeds(cid);
        } else if (Env::Strcmp(action, "balance") == 0) {
            ContractID cid;
            AssetID aid;
            Env::DocGet("cid", cid);
            Env::DocGet("aid", aid);
            Env::DocAddNum("balance", GetBalance(cid, aid));
        } else if (Env::Strcmp(action, "generate") == 0) {
            ContractID cid;
            ContractID oracle_cid;
            Env::DocGet("cid", cid);
            Env::DocGet("oracle_cid", oracle_cid);
            RequestNewSeed(cid, oracle_cid);
        } else if (Env::Strcmp(action, "try_get_value") == 0) {
            ContractID cid;
            ContractID oracle_cid;
            uint32_t id_in_requester;
            Env::DocGet("cid", cid);
            Env::DocGet("oracle_cid", oracle_cid);
            Env::DocGet("id_in_requester", id_in_requester);
            TryGetSeed(cid, oracle_cid, id_in_requester);
        } else if (Env::Strcmp(action, "check_and_get") == 0) {
            ContractID cid;
            ContractID oracle_cid;
            Env::DocGet("cid", cid);
            Env::DocGet("oracle_cid", oracle_cid);
            CheckValueAndGetIfThere(cid, oracle_cid);
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}
