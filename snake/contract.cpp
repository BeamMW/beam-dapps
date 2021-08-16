
#include "../common.h"
#include "../Math.h"
#include "contract.h"

BEAM_EXPORT void Ctor(Rewards::Params& params)
{
    const char* meta = "snake token";
    params.aid = Env::AssetCreate(meta, sizeof(meta) - 1);
    params.begin_height = Env::get_Height();
    params.score = 0;
    Env::Halt_if(!params.aid);
    Env::SaveVar_T(0, params);
}

BEAM_EXPORT void Dtor(void *)
{
    
}

BEAM_EXPORT void Method_2(const Snake::Score& s){
    Snake::Params params;
    params = Env::LoadVar_T(0, params);
    s.amount = Env::LoadVar_T(0, params.score);
    s.amount += 1;
    s.height = Env::get_Height();
    Env::SaveVar_T((uint8_t) 0, s);
}

BEAM_EXPORT void Method_3(const Snake::Take& t){
    Height current_height = Env::get_Height();
    Snake::Params init_params;
    Snake::Score score;
    Env::LoadVar_T(0, init_params);
    Snake::AccountData ac{};
    bool is_loaded = Env::LoadVar_T(t.receiver, ac);
    Env::LoadVar_T((uint8_t) 0, score);
    if (current_height - score.height == score.amount) {
        Env::AssetEmit(init_params.aid, init_params.token_amount, true);
        Strict::Add(ac.balance, init_params.token_amount);
        ac.last_time_received = cur_height;
        Env::SaveVar_T(t.m_Player, ac);
        Env::FundsUnlock(init_params.aid, init_params.tokens_amount);
    }
    Env::AddSig(t.m_Player);
}


