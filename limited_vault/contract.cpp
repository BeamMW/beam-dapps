#include "contract.h"
#include "../Math.h"

BEAM_EXPORT void Ctor(void*) { // Dummy constructor as needed
}

BEAM_EXPORT void Dtor(void*) { // Dummy destructor as needed
}

namespace {
  Amount GetBalanceByKey(LimitedVault::ComplexKey key) {
      Amount balance;
      return Env::LoadVar_T(key, balance) ? balance : 0;
  }

  void SaveBalance(LimitedVault::ComplexKey key, Amount balance) {
      Env::EmitLog_T(key, balance);

      if (balance > 0) {
          Env::SaveVar_T(key, balance);
      } else {
          Env::DelVar_T(key, balance);
      }
  }

  static constexpr Amount kDefaultLowLimit = 5;
  static constexpr Amount kDefaultHighLimit = 1000;
}

BEAM_EXPORT void Method_2(const LimitedVault::DepositRequest& deposit_request) { // Deposit
    Amount current_balance = GetBalanceByKey(deposit_request.key);
    Amount low_limit;
    LimitedVault::LimitsKey limits_key{.key=deposit_request.key, .type=LimitedVault::LimitType::Low};
    if (!Env::LoadVar_T(limits_key, low_limit)) {
        low_limit = kDefaultLowLimit;
    }
    Env::Halt_if(deposit_request.amount < low_limit);
    Amount high_limit;
    limits_key = LimitedVault::LimitsKey{.key=deposit_request.key, .type=LimitedVault::LimitType::High};
    if (!Env::LoadVar_T(limits_key, high_limit)) {
        high_limit = kDefaultHighLimit;
    }
    Env::Halt_if(deposit_request.amount > high_limit);
    Strict::Add(current_balance, deposit_request.amount);
    SaveBalance(deposit_request.key, current_balance);
    Env::FundsLock(deposit_request.key.asset_id, deposit_request.amount);
}

BEAM_EXPORT void Method_3(const LimitedVault::WithdrawRequest& withdraw_request) { // Withdraw
    Amount current_balance = GetBalanceByKey(withdraw_request.key);
    Strict::Sub(current_balance, withdraw_request.amount);
    SaveBalance(withdraw_request.key, current_balance);
    Env::FundsUnlock(withdraw_request.key.asset_id, withdraw_request.amount);
    Env::AddSig(withdraw_request.key.key);
}

BEAM_EXPORT void Method_4(const LimitedVault::SetLimitsRequest& set_request) { // Set Limits
    Env::SaveVar_T(LimitedVault::LimitsKey{.key=set_request.key, .type=LimitedVault::LimitType::Low}, set_request.low_limit);
    Env::SaveVar_T(LimitedVault::LimitsKey{.key=set_request.key, .type=LimitedVault::LimitType::High}, set_request.high_limit);
    Env::AddSig(set_request.key.key);
}
