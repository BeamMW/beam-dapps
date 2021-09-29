#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "../common.h"

namespace NFTGenerator {

    static const ShaderID SID = { 0x0e,0xfa,0xb3,0x7b,0x8c,0xe4,0x27,0x0f,0x36,0x85,0x8c,0x0e,0x45,0x9b,0x09,0x5e,0x70,0x4d,0x0c,0x5e,0xb9,0xb1,0x1d,0xdc,0x68,0xa7,0x0a,0xb1,0x9e,0xf6,0x61,0xb4 };

#pragma pack (push, 1)

    struct ComplexKey {
        AssetID aid;
        ContractID cid;
    };

    enum class State {
        NEW,
        SOLD
    };

    struct SaveNewSeed {
        static constexpr uint64_t
        s_iMethod = 2;

        ComplexKey key;
        uint64_t seed;
        State state;
    };

#pragma pack (pop)
}

#endif //BEAM_CONTRACT_H
