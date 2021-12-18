#pragma once

#include <cstddef>

namespace randomoracle {
#pragma pack(push, 1)

    struct InitialParams {
        static const uint32_t METHOD = 0;
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

    struct Request {
        static constexpr uint32_t s_iMethod = 2;

        uint32_t value_type;
        char value_details[1024];
        RequestID request_id;
    };

    struct SaveValue {
        static constexpr uint32_t s_iMethod = 3;

        InternalKey key;
        uint64_t value;
        PubKey oracle_user_proof;
    };

    struct TryGetValue {
        static constexpr uint32_t s_iMethod = 4;

        RequestID request_id;
        uint64_t value;
    };

#pragma pack(pop)
}
