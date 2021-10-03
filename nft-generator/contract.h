#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "../common.h"

namespace NFTGenerator {

    static const ShaderID SID = { 0x0e,0xfa,0xb3,0x7b,0x8c,0xe4,0x27,0x0f,0x36,0x85,0x8c,0x0e,0x45,0x9b,0x09,0x5e,0x70,0x4d,0x0c,0x5e,0xb9,0xb1,0x1d,0xdc,0x68,0xa7,0x0a,0xb1,0x9e,0xf6,0x61,0xb4 };

    static const ContractID gallery_CID = { 0x65,0x9a,0xb5,0x83,0x4c,0x97,0xe8,0x2c,0x13,0xe2,0xab,0x8b,0xdf,0xf4,0x6a,0xd3,0xd6,0x13,0x91,0x5d,0xb6,0x87,0xed,0x2a,0xf5,0x75,0xc8,0xda,0x0d,0xc6,0xbc,0x4a };

#pragma pack (push, 1)

    struct ComplexKey {
        AssetID aid;
        ContractID cid;
    };

    struct ComplexKeyWithSeed {
        ComplexKey key;
        uint64_t seed;
    };

    struct SaveNewSeed {
        static constexpr uint64_t
        s_iMethod = 2;

        ComplexKey key;
        uint64_t seed;
        PubKey holder;
    };

    struct AddExhibit // struct from gallery to add pic
    {
        static const uint32_t s_iMethod = 3;

        PubKey m_pkArtist;
        uint32_t m_Size;
        // followed by the data
    };

#pragma pack (pop)
}

#endif //BEAM_CONTRACT_H
