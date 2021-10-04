#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "../common.h"

namespace NFTGenerator {

    static const ShaderID SID = {0x0e, 0xfa, 0xb3, 0x7b, 0x8c, 0xe4, 0x27, 0x0f, 0x36, 0x85, 0x8c, 0x0e, 0x45, 0x9b,
                                 0x09, 0x5e, 0x70, 0x4d, 0x0c, 0x5e, 0xb9, 0xb1, 0x1d, 0xdc, 0x68, 0xa7, 0x0a, 0xb1,
                                 0x9e, 0xf6, 0x61, 0xb4};

#pragma pack (push, 1)

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

        NFT nft;
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
