#pragma once

#include "../common.h"

namespace oracle {

    constexpr uint32_t
            kFeeInGroth = 0; // TODO: set real fee

#pragma pack(push, 1)

    struct RequestID {
        PubKey requester_key; // Some unique identifier of user. Sets by user of request.
        uint32_t id_in_requester; // Request id of given user
    };

    using OracleValue = uint64_t; // Always returns 8-byte number. If need more, send multiple requests

    struct Request {
        static constexpr uint32_t METHOD = 2;

        uint32_t value_type; // see mapping
        char value_details[1024]; // Maybe some details about value we need to send to oracle. 1 Kb
        RequestID request_id; // ID of given request. Needed further for request of value. Returned from contract
    };

    struct TryGetValue { // Will be halted, if value for request_id does not exists
        static constexpr uint32_t METHOD = 3;

        RequestID request_id;
        OracleValue value;
    };

    struct SaveValue {
        static constexpr uint32_t METHOD = 4;

        RequestID request_id;
        OracleValue value;
    };

    enum class KeyType {
        REQUEST,
        VALUE
    };

    struct InternalKey {
        KeyType key_type;
        oracle::RequestID request_id;
    };

#pragma pack(pop)
}
