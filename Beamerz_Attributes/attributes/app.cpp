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