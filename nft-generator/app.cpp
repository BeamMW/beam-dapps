#include <random>

#include "contract.h"

void Method_0() {
    Env::DocGroup root("");
    {
        Env::DocGroup roles("roles");
        {
            Env::DocGroup role("user");
            {
                Env::DocGroup method("generate");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("holder", "Holder PubKey");
            }
            {
                Env::DocGroup method("gallery_send");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("holder", "Holder PubKey");
                Env::DocAddText("seed", "Seed to send");
            }
            {
                Env::DocGroup method("set_price");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("aid", "AssetID");
                Env::DocAddText("holder", "Holder PubKey");
                Env::DocAddText("seed", "Seed to send");
                Env::DocAddText("price", "New price");
            }
            {
                Env::DocGroup method("buy");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("holder", "Holder PubKey");
                Env::DocAddText("seed", "Seed to send");
                Env::DocAddText("price", "New price");
            }
            {
                Env::DocGroup method("withdraw");
                Env::DocAddText("cid", "ContractID");
                Env::DocAddText("amount", "Amount");
                Env::DocAddText("aid", "AssetID");
            }
        }
        {
            Env::DocGroup role("manager");
            {
                Env::DocGroup method("create");
            }
            {
                Env::DocGroup method("destroy");
                Env::DocAddText("cid", "ContractID");
            }
            {
                Env::DocGroup method("view");
            }
            {
                Env::DocGroup method("seeds");
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
    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    _POD_(start_key.m_KeyInContract.key.key) = GetKeyByCID(cid);
    start_key.m_KeyInContract.key.asset_id = aid;
    start_key.m_KeyInContract.seed = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.seed = static_cast<uint64_t>(-1);

    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> key;
    PubKey holder;
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, holder);) {
        if (key.m_KeyInContract.seed == seed) {
            return true;
        }
    }

    return false;
}

void GetAllSeeds(const ContractID &cid) {
    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = cid;
    _POD_(start_key.m_KeyInContract.key.key) = GetKeyByCID(cid);
    start_key.m_KeyInContract.key.asset_id = 0;
    start_key.m_KeyInContract.seed = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.key.asset_id = static_cast<AssetID>(-1);

    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> key;
    PubKey holder;
    Env::DocGroup seeds("seeds");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, holder);) {
        Env::DocAddNum("AssetID", key.m_KeyInContract.key.asset_id);
        Env::DocAddNum("Seed", key.m_KeyInContract.seed);
        Env::DocAddBlob_T("Holder", holder);
    }
}

uint64_t GenerateSeed(const ContractID &cid, AssetID aid, const PubKey &holder) {
    NFTGenerator::SaveNewSeed request;

    std::random_device rd;
    std::mt19937_64 generator(rd());
    std::uniform_int_distribution<uint32_t> uniform_distro(0, UINT32_MAX);
    uint64_t seed;

    do {
        seed = MergeNumbers(uniform_distro(generator), uniform_distro(generator));
    } while (!IsSeedAlreadyGenerated(cid, aid, seed));  // TODO: More deterministic algorithm

    request.nft.nft_asset_id = aid;
    request.nft.seed = seed;
    request.nft.holder = holder;
    Env::GenerateKernel(&cid, NFTGenerator::SaveNewSeed::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "set new seed to nft-generator", 0);
    return seed;
}

void SendSeedFromContract(const ContractID &gallery_cid, uint64_t seed, PubKey artist, AssetID aid) {
    NFTGenerator::SaveNewSeed args;
    args.nft.seed = seed;
    args.nft.holder = artist;
    args.nft.nft_asset_id = aid;

    SigRequest sig;
    sig.m_pID = &artist;
    sig.m_nID = sizeof(artist);

    Env::GenerateKernel(&gallery_cid, NFTGenerator::SaveNewSeed::s_iMethod,
                        &args, sizeof(args), nullptr, 0,
                        &sig, 0, "send new seed to gallery", 0);
}

void SetSeedPrice(const ContractID &gallery_cid, uint64_t seed, PubKey holder, NFTGenerator::Price price, AssetID aid) {

    // TODO: Add check if holder can change price of the seed

    NFTGenerator::SetPrice args;
    args.updated_nft.seed = seed;
    args.updated_nft.holder = holder;
    args.updated_nft.price = price;
    args.updated_nft.nft_asset_id = aid;

    SigRequest sig;
    sig.m_pID = &holder;
    sig.m_nID = sizeof(holder);

    Env::GenerateKernel(&gallery_cid, NFTGenerator::SetPrice::s_iMethod,
                        &args, sizeof(args), nullptr, 0,
                        &sig, 0, "set price for seed in gallery", 0);
}

void BuySeed(ContractID cid, int64_t seed, PubKey buyer, NFTGenerator::Price price) {

    // TODO: need to include some checking if seed is available to buy
//    auto id_ = Utils::FromBE(id);
//
//    Gallery::Masterpiece m;
//    if (!ReadItem(cid, id_, m))
//        return;
//
//    if (!m.m_Price.m_Amount) {
//        OnError("not for sale");
//        return;
//    }

    NFTGenerator::Buy args;
    args.seed = seed;
    args.buyer = buyer;
    args.price = price;

    FundsChange fc;
    fc.m_Consume = true;
    fc.m_Amount = price.amount;
    fc.m_Aid = price.asset_id;

    Env::GenerateKernel(&cid, args.s_iMethod, &args, sizeof(args), &fc, 1, nullptr, 0, "gallery buy seed", 0);
}

void Withdraw(const ContractID &contract_id, Amount amount, AssetID asset_id) {
    NFTGenerator::Withdraw request;
    request.value = amount;
    request.key.asset_id = asset_id;
    request.key.user = GetKeyByCID(contract_id);

    FundsChange fc;
    fc.m_Amount = request.value;
    fc.m_Aid = request.key.asset_id;
    fc.m_Consume = true;

    PersonalID id;
    id.cid = contract_id;

    SigRequest sig;
    sig.m_pID = &id;
    sig.m_nID = sizeof(id);

    Env::GenerateKernel(&contract_id, NFTGenerator::Withdraw::s_iMethod, &request, sizeof(request),
                        &fc, 1, &sig, 1, "withdraw", 0);
}

void Method_1() {
    Env::DocGroup root("");

    char role[0x10], method[0x10];

    if (!Env::DocGetText("role", role, sizeof(role))) {
        Env::DocAddText("error", "Not providing role");
        return;
    }

    if (!Env::DocGetText("method", method, sizeof(method))) {
        Env::DocAddText("error", "Not providing method");
        return;
    }

    if (Env::Strcmp(role, "manager") == 0) {
        if (Env::Strcmp(method, "create") == 0) {
            Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0,
                                nullptr, 0, "create nft-generator", 0);
        } else if (Env::Strcmp(method, "destroy") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0,
                                "destroy nft-generator", 0);
        } else if (Env::Strcmp(method, "view") == 0) {
//            EnumAndDumpContracts(NFTGenerator::s_SID);
        } else if (Env::Strcmp(method, "seeds") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            GetAllSeeds(cid);
        } else {
            Env::DocAddText("error", "Invalid method");
        }
    } else if (Env::Strcmp(role, "user") == 0) {
        if (Env::Strcmp(method, "generate") == 0) {
            ContractID cid;
            AssetID aid;
            PubKey holder;
            Env::DocGet("cid", cid);
            Env::DocGet("aid", aid);
            Env::DocGet("holder", holder);
            Env::DocAddNum("New seed: ", GenerateSeed(cid, aid, holder));
        } else if (Env::Strcmp(method, "gallery_send") == 0) {
            ContractID gallery_CID;
            AssetID aid;
            uint64_t seed;
            PubKey holder;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("holder", holder);
            Env::DocGet("seed", seed);
            Env::DocGet("aid", aid);
            SendSeedFromContract(gallery_CID, seed, holder, aid);
        } else if (Env::Strcmp(method, "set_price") == 0) {
            ContractID gallery_CID;
            AssetID aid;
            uint64_t seed;
            PubKey holder;
            NFTGenerator::Price price;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("holder", holder);
            Env::DocGet("seed", seed);
            Env::DocGetBlob("price", &price, sizeof(price));
            Env::DocGet("aid", aid);
            SetSeedPrice(gallery_CID, seed, holder, price, aid);
        } else if (Env::Strcmp(method, "buy") == 0) {
            ContractID gallery_CID;
            uint64_t seed;
            PubKey buyer;
            NFTGenerator::Price price;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("seed", seed);
            Env::DocGet("holder", buyer);
            Env::DocGetBlob("price", &price, sizeof(price));
            BuySeed(gallery_CID, seed, buyer, price);
        } else if (Env::Strcmp(method, "withdraw") == 0) {
            ContractID gallery_CID;
            Amount amount;
            AssetID aid;
            Env::DocGet("cid", gallery_CID);
            Env::DocGet("amount", amount);
            Env::DocGet("aid", aid);
            Withdraw(gallery_CID, amount, aid);
        } else {
            Env::DocAddText("error", "Invalid method");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}
