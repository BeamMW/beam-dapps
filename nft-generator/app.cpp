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
        }
    }
}

uint64_t MergeNumbers(uint32_t upper, uint32_t lower) {
    return (static_cast<uint64_t>(upper) << 32) + lower;
}

uint64_t GenerateSeed(const ContractID& cid, AssetID aid) {
    NFTGenerator::SaveNewSeed request;
    _POD_(request.key) = cid;

    std::random_device rd;
    std::mt19937_64 generator(rd());
    std::uniform_int_distribution<uint32_t> uniform_distro(0, UINT32_MAX);
    uint64_t seed = MergeNumbers(uniform_distro(generator),
                                 uniform_distro(generator));
    request.key.aid = aid;
    request.seed = seed;
    request.state = NFTGenerator::State::NEW;
    Env::GenerateKernel(&cid, NFTGenerator::SaveNewSeed::s_iMethod,
                        &request, sizeof(request), nullptr, 0,
                        nullptr, 0, "set new seed to nft-generator", 0);
    return seed;
}

void Method_1() {
    Env::DocGroup root("");

    char role[0x10], method[0x10];

    if (!Env::DocGetText("role", role)) {

    }

    if (!Env::DocGetText("method", method)) {

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
        } else {
            Env::DocAddText("error", "Invalid method");
        }
    } else if (Env::Strcmp(role, "user") == 0) {
        if (Env::Strcmp(method, "set") == 0) {
            ContractID cid;
            AssetID aid;
            Env::DocGet("cid", cid);
            Env::DocGet("aid", aid);
            Env::DocAddNum("New seed: ", GenerateSeed(cid, aid));
        } else {
            Env::DocAddText("error", "Invalid method");
        }
    } else {
        Env::DocAddText("error", "Invalid role");
    }
}
