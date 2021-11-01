#include "contract.h"

#include "Shaders/app_common_impl.h"

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
                Env::DocGroup action("generate");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("seed", "Seed");
            }
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
            }
            {
                Env::DocGroup action("withdraw");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("seed", "Seed to get money for");
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

PubKey GetKey(const ContractID &cid, uint64_t seed) {
    SeedAndCid id;
    id.cid = cid;
    PubKey key;
    Env::DerivePk(key, &id, sizeof(SeedAndCid));
    return key;
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
        _POD_(this_user_pk) = GetKey(cid, nft.seed);

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

uint64_t GenerateSeed(const ContractID &cid, AssetID aid, uint64_t seed) {
    NFTGenerator::SaveNewSeed request;

// TODO: Contract-based seed generation

    request.nft.nft_asset_id = aid;
    request.nft.seed = seed;
    request.nft.holder = GetKey(cid, seed);
    Env::GenerateKernel(&cid, NFTGenerator::SaveNewSeed::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "set new seed to nft-generator", 0);
    return seed;
}

void SetSeedPrice(const ContractID &cid, uint64_t seed, NFTGenerator::Price price, AssetID aid) {
    PubKey holder = GetKey(cid, seed);
    NFTGenerator::SetPrice args;
    args.updated_nft.seed = seed;
    args.updated_nft.holder = holder;
    _POD_(args.updated_nft.price) = price;
    _POD_(args.updated_nft.nft_asset_id) = aid;

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

void BuySeed(ContractID cid, uint64_t seed, NFTGenerator::Price price) {
    NFTGenerator::Buy args;
    args.seed = seed;
    args.buyer = GetKey(cid, seed);
    args.price = price;

    FundsChange fc;
    fc.m_Consume = true;
    fc.m_Amount = price.amount;
    fc.m_Aid = price.asset_id;

    Env::GenerateKernel(&cid, args.s_iMethod, &args, sizeof(args), &fc, 1, nullptr, 0, "gallery buy seed", 0);

    Env::DocAddNum("price.amount", price.amount);
    Env::DocAddNum("price.asset_id", price.asset_id);
}

void Withdraw(const ContractID &contract_id, Amount amount, AssetID asset_id, uint64_t seed) {
    NFTGenerator::Withdraw request;
    request.value = amount;
    request.key.asset_id = asset_id;
    request.key.user = GetKey(contract_id, seed);

    FundsChange fc;
    fc.m_Amount = request.value;
    fc.m_Aid = request.key.asset_id;
    fc.m_Consume = false;

    PersonalID id;
    id.cid = contract_id;

    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&contract_id, NFTGenerator::Withdraw::s_iMethod, &request, sizeof(request),
                        &fc, 1, &sig, 1, "withdraw", 0);
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
                                nullptr, 0, "create nft-generator", 0);
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
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else if (Env::Strcmp(role, "user") == 0) {
        if (Env::Strcmp(action, "generate") == 0) {
            ContractID cid;
            AssetID aid;
            uint64_t seed;
            Env::DocGet("cid", cid);
            Env::DocGet("aid", aid);
            Env::DocGet("seed", seed);
            Env::DocAddNum("New seed: ", GenerateSeed(cid, aid, seed));
        } else if (Env::Strcmp(action, "set_price") == 0) {
            ContractID gallery_CID;
            uint64_t seed;
            NFTGenerator::Price price;
            AssetID aid;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("seed", seed);
            Env::DocGetBlob("price", &price, sizeof(price));
            Env::DocGet("aid", aid);
            SetSeedPrice(gallery_CID, seed, price, aid);
        } else if (Env::Strcmp(action, "buy") == 0) {
            ContractID gallery_CID;
            uint64_t seed;
            NFTGenerator::Price price;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("seed", seed);
            Env::DocGetBlob("price", &price, sizeof(price));
            Env::DocAddNum("right from js: price.amount", price.amount);
            Env::DocAddNum("right from js: price.asset_id", price.asset_id);
            BuySeed(gallery_CID, seed, price);
        } else if (Env::Strcmp(action, "withdraw") == 0) {
            ContractID gallery_CID;
            Amount amount;
            AssetID aid;
            uint64_t seed;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("amount", amount);
            Env::DocGet("aid", aid);
            Env::DocGet("seed", seed);
            Withdraw(gallery_CID, amount, aid, seed);
        } else if (Env::Strcmp(action, "get_key") == 0) {
            ContractID cid;
            uint64_t seed;
            Env::DocGet("cid", cid);
            Env::DocGet("seed", seed);
            PubKey pk = GetKey(cid, seed);
            Env::DocAddBlob("key", &pk, sizeof(pk));
        } else if (Env::Strcmp(action, "get_user_seeds") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            GetUserSeeds(cid);
        } else {
            Env::DocAddText("error", "Invalid action");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}
