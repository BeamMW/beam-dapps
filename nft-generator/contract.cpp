#include "contract.h"

BEAM_EXPORT void Ctor(void*) {

}

BEAM_EXPORT void Dtor(void*) {

}

BEAM_EXPORT void Method_2(const SaveNewSeed& request) {
    Env::SaveVar_T(NFTGenerator::ComplexKeyWithSeed {
            .key = request.key,
            .seed = request.seed
    }, request.holder);
}
