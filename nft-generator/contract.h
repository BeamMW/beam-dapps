#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "../common.h"

namespace NFTGenerator {

    static const ShaderID s_SID = {0xcc, 0x54, 0x09, 0x65, 0xc3, 0x7c, 0x2d, 0xee, 0xf4, 0x85, 0xec, 0x2d, 0x44, 0x85,
                                   0x7f, 0x54, 0x13, 0x49, 0x75, 0x48, 0x15, 0x79, 0x20, 0x55, 0xef, 0x9f, 0xe8, 0x97,
                                   0xa6, 0x83, 0x50, 0xcc};

#pragma pack (push, 1)

    struct ComplexKey {
        PubKey key;
        AssetID asset_id;
    };

    struct ComplexKeyWithSeed {
        ComplexKey key;
        uint64_t seed;
    };

    struct Price {
        Amount amount;
        AssetID asset_id;
    };

    struct NFT {
        uint64_t seed;
        PubKey holder;
        Price price;
        AssetID nft_asset_id;
    };

    struct SaveNewSeed {
        static constexpr uint64_t s_iMethod = 2;

        NFT nft;
    };

    struct Payout {
        struct Key {
            PubKey user;
            AssetID asset_id;
            uint64_t seed;
        };

        Amount amount;
    };

    struct SetPrice {
        static const uint32_t s_iMethod = 3;

        NFT updated_nft;
    };

    struct Buy {
        static const uint32_t s_iMethod = 4;

        uint64_t seed;
        PubKey buyer;
        Price price;
    };

    struct Withdraw {
        static const uint32_t s_iMethod = 5;

        Payout::Key key;
        Amount value;
    };

    struct CheckPrepare {
        static const uint32_t s_iMethod = 6;

        uint64_t seed;
    };

    struct CheckOut {
        static const uint32_t s_iMethod = 7;

        uint64_t seed;
    };

    struct CheckIn {
        static const uint32_t s_iMethod = 8;

        uint64_t seed;
        PubKey user;
    };

#pragma pack (pop)
}

#endif //BEAM_CONTRACT_H
