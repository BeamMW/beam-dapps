#include "contract.h"
#include "../Math.h"

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

    Env::Halt_if(!m.price.amount || (r.price.amount < m.price.amount));

    Env::FundsLock(m.price.asset_id, r.price.amount);

    NFTGenerator::Payout::Key pok;
    pok.seed = r.seed;
    pok.asset_id = m.price.asset_id;

    _POD_(pok.user) = m.holder;
    PayoutMove(pok, m.price.amount, true);

    _POD_(pok.user) = r.buyer;
    PayoutMove(pok, r.price.amount - m.price.amount, true);

    _POD_(m.holder) = r.buyer;
    _POD_(m.price.amount).SetZero(); // not for sale until new owner sets the price
    Env::SaveVar_T(r.seed, m);
}

BEAM_EXPORT void Method_5(const NFTGenerator::Withdraw &r) {
    PayoutMove(r.key, r.value, false);
    Env::FundsUnlock(r.key.asset_id, r.value);
    Env::AddSig(r.key.user);
}

BEAM_EXPORT void Method_6(const NFTGenerator::CheckPrepare &r) {
    NFTGenerator::NFT m;
    Env::Halt_if(!Env::LoadVar_T(r.seed, m));
    Env::AddSig(m.holder);

    if (m.nft_asset_id) {
        // destroy it
        Env::Halt_if(!Env::AssetDestroy(m.nft_asset_id));
        m.nft_asset_id = 0;
    } else {
        // 1st call. Don't checkout, only prepare
        static const char szMeta[] = "STD:SCH_VER=1;N=NFT-Gallery NFT;SN=Gall;UN=GALL;NTHUN=unique";
        m.nft_asset_id = Env::AssetCreate(szMeta, sizeof(szMeta) - 1);
    }

    Env::SaveVar_T(r.seed, m);
}

BEAM_EXPORT void Method_7(const NFTGenerator::CheckOut &r) {
    NFTGenerator::NFT m;
    Env::Halt_if(!Env::LoadVar_T(r.seed, m) || !m.nft_asset_id);
    Env::AddSig(m.holder);

    Env::Halt_if(!Env::AssetEmit(m.nft_asset_id, 1, 1));
    Env::FundsUnlock(m.nft_asset_id, 1);

    _POD_(m.holder).SetZero();
    _POD_(m.price).SetZero();

    Env::SaveVar_T(r.seed, m);
}

BEAM_EXPORT void Method_8(const NFTGenerator::CheckIn &r) {
    NFTGenerator::NFT m;
    Env::Halt_if(!Env::LoadVar_T(r.seed, m) || !_POD_(m.holder).IsZero());

    Env::FundsLock(m.nft_asset_id, 1);
    Env::Halt_if(!Env::AssetEmit(m.nft_asset_id, 1, 0));

    _POD_(m.holder) = r.user;
    Env::SaveVar_T(r.seed, m);
}
