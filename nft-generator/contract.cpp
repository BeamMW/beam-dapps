#include "contract.h"
#include "Shaders/common.h"
#include "Shaders/Math.h"

BEAM_EXPORT void Ctor(void *) {

}

BEAM_EXPORT void Dtor(void *) {

}

BEAM_EXPORT void Method_2(const NFTGenerator::SaveNewSeed &request) {
    Env::SaveVar_T(request.nft.seed, request.nft);
}

BEAM_EXPORT void Method_3(const NFTGenerator::SetPrice &r) {
    NFTGenerator::NFT m;
    Env::Halt_if(!Env::LoadVar_T(r.updated_nft.seed, m));
    Env::Halt_if(!(r.updated_nft.holder == m.holder));

    _POD_(m) = r.updated_nft;
    Env::SaveVar_T(m.seed, m);

    Env::AddSig(m.holder);
}

void PayoutMove(const NFTGenerator::Payout::Key &key, Amount val, bool bAdd) {
    if (!val) {
        return;
    }

    NFTGenerator::Payout po;
    if (Env::LoadVar_T(key, po)) {
        if (bAdd) {
            Strict::Add(po.amount, val);
        } else {
            Strict::Sub(po.amount, val);

            if (!po.amount) {
                Env::DelVar_T(key);
                return;
            }
        }
    } else {
        Env::Halt_if(!bAdd);
        po.amount = val;
    }

    Env::SaveVar_T(key, po);
}


BEAM_EXPORT void Method_4(const NFTGenerator::Buy &r) {
    NFTGenerator::NFT m;
    Env::Halt_if(!Env::LoadVar_T(r.seed, m));

    Env::Halt_if(!m.price.amount || (r.price < m.price.amount));

    Env::FundsLock(m.price.asset_id, r.price);

    NFTGenerator::Payout::Key pok;
    pok.asset_id = m.price.asset_id;

    _POD_(pok.user) = m.holder;
    PayoutMove(pok, m.price.amount, true);

    _POD_(pok.user) = r.buyer;
    PayoutMove(pok, r.price - m.price.amount, true);

    _POD_(m.holder) = r.buyer;
    _POD_(m.price.amount).SetZero(); // not for sale until new owner sets the price
    Env::SaveVar_T(r.seed, m);
}

BEAM_EXPORT void Method_5(const NFTGenerator::Withdraw &r) {
    PayoutMove(r.key, r.value, false);
    Env::FundsUnlock(r.key.asset_id, r.value);
    Env::AddSig(r.key.user);
}

BEAM_EXPORT void Method_6(const NFTGenerator::RequestNewSeed &r) {
    NFTGenerator::Request get;
    get.request_id.requester_key = r.user;

    Env::Halt_if(!Env::RefAdd(r.oracle_cid));
    Env::CallFar_T(r.oracle_cid, get);
    Env::Halt_if(!Env::RefRelease(r.oracle_cid));

    Env::SaveVar_T(r.user, get.request_id.id_in_requester);
}

BEAM_EXPORT void Method_7(const NFTGenerator::TryGetSeed &r) {
    uint32_t id;
    Env::Halt_if(!Env::LoadVar_T(r.request_id.requester_key, id));

    NFTGenerator::TryGetValue try_get;
    try_get.request_id.requester_key = r.request_id.requester_key;
    try_get.request_id.id_in_requester = id;

    Env::Halt_if(!Env::RefAdd(r.oracle_cid));
    Env::CallFar_T(r.oracle_cid, try_get);
    Env::Halt_if(!Env::RefRelease(r.oracle_cid));

    NFTGenerator::NFT nft;
    nft.seed = try_get.value;
    nft.holder = r.request_id.requester_key;
    Env::SaveVar_T(try_get.value, nft);
}
