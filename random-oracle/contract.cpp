#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "Shaders/Math.h"
#include "contract.h"


using namespace randomoracle;

BEAM_EXPORT void Ctor(InitialParams &params) {
    Env::SaveVar_T(0, params);
}

BEAM_EXPORT void Dtor(void *) {
    Env::DelVar_T(0);
}

BEAM_EXPORT void Method_2(randomoracle::Request &request) { // Aka Request
    uint32_t requester_id = 0;
    Env::LoadVar_T(request.request_id.requester_key, requester_id);
    requester_id += 1;
    Env::SaveVar_T(request.request_id.requester_key, requester_id);

    RequestID request_id;
    request_id.requester_key = request.request_id.requester_key;
    request_id.id_in_requester = requester_id;

    request.request_id.id_in_requester = requester_id;

    randomoracle::InternalKey key;
    key.request_id = request_id;
    key.key_type = randomoracle::KeyType::REQUEST;
    Env::SaveVar_T(key, request);
    request.request_id = request_id;
}

BEAM_EXPORT void Method_3(const randomoracle::SaveValue &request) {
    randomoracle::InternalKey key;
    key.key_type = randomoracle::KeyType::VALUE;
    _POD_(key.request_id) = request.request_id;

    Env::SaveVar_T(key, request.value);
}

BEAM_EXPORT void Method_4(randomoracle::TryGetValue &request) {
    randomoracle::InternalKey key;
    key.key_type = randomoracle::KeyType::VALUE;
    _POD_(key.request_id) = request.request_id;

    uint64_t value;
    Env::Halt_if(!Env::LoadVar_T(key, value)); // try to get value if it there
    request.value = value;
    Env::DelVar_T(key); // delete unused value

    // delete request
    key.key_type = randomoracle::KeyType::REQUEST;
    Env::DelVar_T(key);
}

BEAM_EXPORT void Method_5(const randomoracle::SaveValueButCooler &request) {
    Env::SaveVar_T(request.key, request.value);
}
