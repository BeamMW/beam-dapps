#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"


void OnError(const char* msg)
{
    Env::DocAddText("error", msg);
}

void DeriveMyPk(PubKey& pubKey, const ContractID& cid)
{
    Env::DerivePk(pubKey, &cid, sizeof(cid));
}
