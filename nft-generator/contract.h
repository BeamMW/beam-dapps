#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "Shaders/common.h"

namespace NFTGenerator {

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
    };

    struct SaveNewSeed {
        static constexpr uint64_t s_iMethod = 2;

        NFT nft;
    };

    struct Payout {
        struct Key {
            PubKey user;
            AssetID asset_id;
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
        Amount price;
    };

    struct Withdraw {
        static const uint32_t s_iMethod = 5;

        Payout::Key key;
        Amount value;
    };

#pragma pack (pop)
}



#ifndef HOST_BUILD

bool operator==(const Secp_point_data& lhs, const Secp_point_data& rhs) {
    for (uint32_t i = 0; i < 32; ++i) {
        if (lhs.X.m_p[i] != rhs.X.m_p[i]) {
            return false;
        }
    }

    return lhs.Y == rhs.Y;
}

#endif


#endif //BEAM_CONTRACT_H
