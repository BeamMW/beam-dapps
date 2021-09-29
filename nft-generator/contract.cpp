#include "contract.h"

#pragma pack(push, 1)

struct ComplexKeyWithSeed {
    ComplexKey key;
    uint64_t seed;
};

#pragma pack(pop)

BEAM_EXPORT void Ctor(void*) {

}

BEAM_EXPORT void Dtor(void*) {

}

BEAM_EXPORT void Method_2(const SaveNewSeed& request) {
    Env::SaveVar_T(ComplexKeyWithSeed {
        .key = request.key,
        .seed = request.seed
    }, request.state);
}
