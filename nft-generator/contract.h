#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "../common.h"

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



#ifndef HOST_BUILD

namespace {
    bool operator==(const Secp_point_data& lhs, const Secp_point_data& rhs) {
        for (uint32_t i = 0; i < 32; ++i) {
            if (lhs.X.m_p[i] != rhs.X.m_p[i]) {
                return false;
            }
        }

        return lhs.Y == rhs.Y;
    }
}

#endif


#endif //BEAM_CONTRACT_H

