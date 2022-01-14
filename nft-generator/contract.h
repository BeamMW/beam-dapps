#ifndef BEAM_CONTRACT_H
#define BEAM_CONTRACT_H

#include "Shaders/common.h"

namespace NFTGenerator {

#pragma pack (push, 1)

    const char owner_public_key[] = "owner_public_key";

    struct InitialParams {
        static const uint32_t s_iMethod = 0;

        PubKey owner_key;
    };

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

    constexpr Price seed_creation_charge_price = {
            .amount = 1'000'000,
            .asset_id = 0
    };

    struct NFT {
        uint64_t seed;
        PubKey holder;
        Price price;
    };

    struct Payout {
        struct Key {
            PubKey user;
            AssetID asset_id;
        };

        Amount amount;
    };

    struct SetPrice {
        static const uint32_t s_iMethod = 2;

        NFT updated_nft;
    };

    struct Buy {
        static const uint32_t s_iMethod = 3;

        uint64_t seed;
        PubKey buyer;
        Amount price;
    };

    struct Withdraw {
        static const uint32_t s_iMethod = 4;

        Payout::Key key;
        Amount value;
    };

    struct RequestNewSeed {
        static const uint32_t s_iMethod = 5;

        Price seed_charge;
        ContractID oracle_cid;
        PubKey user;
    };

    struct SaveIDFromRequest {
        PubKey user;
        uint32_t id;
    };

    struct RequestID {
        PubKey requester_key;
        uint32_t id_in_requester;
    };

    enum class KeyType {
        REQUEST,
        VALUE
    };

    struct InternalKey {
        KeyType key_type;
        RequestID request_id;
    };

    struct TryGetSeed {
        static const uint32_t s_iMethod = 6;

        ContractID oracle_cid;
        RequestID request_id;
        int64_t value;
    };

    // some structs for gallery to ask seed from oracle
    struct Request {
        static constexpr uint32_t
        s_iMethod = 2;

        uint32_t value_type;
        char value_details[1024];
        RequestID request_id;
    };

    struct TryGetValue {
        static constexpr uint32_t
        s_iMethod = 4;

        RequestID request_id;
        uint64_t value;
    };

#pragma pack (pop)
}


#ifndef HOST_BUILD

bool operator==(const Secp_point_data &lhs, const Secp_point_data &rhs) {
    for (uint32_t i = 0; i < 32; ++i) {
        if (lhs.X.m_p[i] != rhs.X.m_p[i]) {
            return false;
        }
    }

    return lhs.Y == rhs.Y;
}

#endif


#endif //BEAM_CONTRACT_H

