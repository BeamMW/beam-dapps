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

uint64_t MergeNumbers(uint32_t upper, uint32_t lower) {
    return (static_cast<uint64_t>(upper) << 32) + lower;
}

bool IsSeedAlreadyGenerated(const ContractID& cid, AssetID aid, uint64_t seed) {
    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = contract_id;
    _POD_(start_key.m_KeyInContract.key.cid) = cid;
    start_key.m_KeyInContract.key.aid = aid;
    start_key.m_KeyInContract.seed = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.seed = static_cast<uint64_t>(-1);

    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> key;
    NFTGenerator::State value;
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value); ) {
        if (key.m_KeyInContract.seed == seed) {
            return true;
        }
    }

    return false;
}

void GetAllSeeds(const ContractID& cid) {
    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> start_key, end_key;
    _POD_(start_key.m_Prefix.m_Cid) = contract_id;
    _POD_(start_key.m_KeyInContract.key.cid) = cid;
    start_key.m_KeyInContract.key.aid = 0;
    start_key.m_KeyInContract.seed = 0;
    _POD_(end_key) = start_key;
    end_key.m_KeyInContract.key.aid = static_cast<AssetID>(-1);

    Env::Key_T<NFTGenerator::ComplexKeyWithSeed> key;
    NFTGenerator::State value;
    Env::DocGroup seeds("seeds");
    for (Env::VarReader reader(start_key, end_key); reader.MoveNext_T(key, value); ) {
        Env::DocAddNum("AssetID", key.m_KeyInContract.key.aid);
        Env::DocAddNum("Seed", key.m_KeyInContract.seed);
        Env::DocAddNum("State", static_cast<uint32_t>(value));
    }
}

uint64_t GenerateSeed(const ContractID& cid, AssetID aid) {
    NFTGenerator::AddExhibit request;
    _POD_(request.key) = cid;

    std::random_device rd;
    std::mt19937_64 generator(rd());
    std::uniform_int_distribution<uint32_t> uniform_distro(0, UINT32_MAX);
    uint64_t seed;

    do {
        seed = MergeNumbers(uniform_distro(generator), uniform_distro(generator));
    } while (!IsSeedAlreadyGenerated(cid, aid, seed));  // TODO: More deterministic algorithm

    request.key.aid = aid;
    request.seed = seed;
    request.state = NFTGenerator::State::NEW;
    Env::GenerateKernel(&cid, NFTGenerator::SaveNewSeed::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "set new seed to nft-generator", 0);
    return seed;
}

void SendSeedFromContract(const ContractID& gallery_cid, AssetID aid, uint64_t seed, PubKey artist) {
    NFTGenerator::AddExhibit request;

    request.m_pkArtist = artist;
    // add picture to request idk how

    Env::GenerateKernel(&gallery_cid, NFTGenerator::AddExhibit::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "send new picture for gallery", 0);
}

void Method_1() {
    Env::DocGroup root("");

    char role[0x10], method[0x10];

    if (!Env::DocGetText("role", role)) {
        Env::DocAddText("error", "Not providing role");
        return;
    }

    if (!Env::DocGetText("method", method)) {
        Env::DocAddText("error", "Not providing method");
        return;
    }

    if (Env::Strcmp(role, "manager") == 0) {
        if (Env::Strcmp(method. "create") == 0) {
            Env::GenerateKernel(nullptr, 0, nullptr, 0, nullptr, 0,
                                nullptr, 0, "create nft-generator", 0);
        } else if (Env::Strcmp(method, "destroy") == 0) {
            ContractID cid;
            Env::DocGet("cid", cid);
            Env::GenerateKernel(&cid, 1, nullptr, 0, nullptr, 0, nullptr, 0,
                                "destroy nft-generator", 0);
        } else if (Env::Strcmp(method, "view") == 0) {
            EnumAndDumpContracts(NFTGenerator::SID);
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
            Env::DocGet("cid", cid);
            Env::DocGet("aid", aid);
            Env::DocAddNum("New seed: ", GenerateSeed(cid, aid));
        } else if (Env::Strcmp(method, "gallery_send") == 0) {
            AssetID aid;
            uint64_t seed;
            PubKey user_artist;
            Env::DocGet("user_artist", user_artist);
            Env::DocGet("seed", seed);
            Env::DocGet("aid", aid);
            Env::DocAddNum("New seed: ", SendSeedFromContract(gallery_CID, aid, seed, user_artist));
        } else {
            Env::DocAddText("error", "Invalid method");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}
