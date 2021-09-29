#define Beamerz_admin_create(macro)
#define Beamerz_admin_view(macro)
#define Beamerz_admin_view_params(macro) macro(ContractID, cid)
#define Beamerz_admin_view_user(macro) macro(ContractID, cid)

#define Beamerz_admin_view_user(macro);
    macro(ContractID, cid);
    macro(PubKey, pkUser)

#define Beamerz_admin_set_user(macro);
    macro(ContractID, cid);
    macro(PubKey, pkUser);
    macro(uint32_t, bEnable) 

#define Beamerz_admin_view_balance(macro)
    macro(ContractID, cid);

#define Beamerz_admin_decide(macro);
    macro(ContractID, cid);
    macro(Beamerz::Attribute::ID, id);
    macro(uint32_t, bApprove)

#define BeamerzRole_admin(macro);
    macro(admin, create);
    macro(admin, view);
    macro(admin, view_params);
    macro(admin, view_users);
    macro(admin, view_user);
    macro(admin, set_user);
    macro(admin, view_balance);
    macro(admin, decide);

#define Beamerz_user_view(macro)
macro (ContractID, cid)
#define Beamerz_user_get_key(macro)
macro (ContractID, cid)
#define Beamerz_user_Upload(macro)
macro (ContractID, cid)

#define BeamerzRole_user(macro)
macro (user, view);
macro(user, get_key);
macro(user, upload);

#define Beamerz_user_view_item(macro);
macro (ContractID, cid);
macro(Beamerz::Attribute::ID, id)

#define Beamerz_user_view_all(macro);
macro (ContractID, cid)

#define Beamerz_user_set_price(macro);
macro (ContractID, cid);
macro (Beamerz:Attribute::, id);
macro (Amount, amount);
macro (AssetID, aid)

#define Beamerz_user_buy(macro);
macro (ContractID, cid);
macro (Beamerz::Attribute:ID, id)

#define Beamerz_user_view_balance(macro)
macro (ContractID, cid)

#define Beamerz_user_withdraw(macro);
macro (ContractID, cid);
macro (uint_32_t, nMaxCount);

#define BeamerzRole_user(macro);
    macro(user, view_item); 
    macro(user, view_all);
    macro(user, download);
    macro(user, set_price);
    macro(user, buy);
    macro(user, view_balance);
    macro(user, withdraw);


#define BeamerzRole_All(macro);
    macro (manager);
    macro (admin);
    macro (user);

