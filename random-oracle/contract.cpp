#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "Shaders/Math.h"
#include "contract.h"

constexpr PubKey kOracleMaintainer; // Maintainer will change it to deploy it's own oracle.

namespace {
    oracle::RequestID GenerateNewRequestID(const PubKey& requester_key) { // Dummy
        uint32_t requester_id = 0;
        Env::LoadVar_T(requester_key, requester_id); // Will contain next request_id
        Env::SaveVar_T(requester_key, requester_id + 1);

        return {
            .requester_key = requester_key,
            .id_in_requester = requester_id
        };
    }

#pragma pack(push, 1)

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

BEAM_EXPORT void Ctor(void*) {
}

BEAM_EXPORT void Dtor(void*) {
//    Env::Halt(); // Not destroyable in future
}

BEAM_EXPORT void Method_2(oracle::Request& request) { // Aka Request
    auto request_id = GenerateNewRequestID(request.request_id.requester_key);
    InternalKey key;
    _POD_(key.request_id) = request_id;
    key.key_type = KeyType::REQUEST;
    Env::SaveVar_T(key, request);
    _POD_(request.request_id) = request_id;
}

BEAM_EXPORT void Method_3(oracle::TryGetValue& request) { // Aka TryGetValue
    oracle::OracleValue value;
    InternalKey key;
    key.key_type = KeyType::VALUE;
    _POD_(key.request_id) = request.request_id;
    Env::Halt_if(!Env::LoadVar_T(key, value));
    request.value = value;
    Env::DelVar_T(key);
    key.key_type = KeyType::REQUEST;
    Env::DelVar_T(key);
}

BEAM_EXPORT void Method_4(const oracle::SaveValue& request) { // Aka SaveValue
    InternalKey key;
    key.key_type = KeyType::VALUE;
    _POD_(key.request_id) = request.request_id;
    Env::SaveVar_T(key, request.value);
}
