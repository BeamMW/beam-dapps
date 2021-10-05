#define Beamerz_admin_create(macro)
#define Beamerz_admin_view(macro)
#define Beamerz_admin_view_params(macro) macro(ContractID, cid)
#define Beamerz_admin_view_user(macro) macro(ContractID, cid)

#define Beamerz_admin_view_user(macro) /
    macro(ContractID, cid) /
    macro(PubKey, pkUser)

#define Beamerz_admin_set_user(macro) /
    macro(ContractID, cid) /
    macro(PubKey, pkUser) /
    macro(uint32_t, bEnable) 

#define Beamerz_admin_view_balance(macro)
    macro(ContractID, cid) /

#define Beamerz_admin_decide(macro) /
    macro(ContractID, cid) /
    macro(Beamerz::Attribute::ID, id) /
    macro(uint32_t, bApprove)

#define BeamerzRole_admin(macro) /
    macro(admin, create) /
    macro(admin, view) /
    macro(admin, view_params) /
    macro(admin, view_users) /
    macro(admin, view_user) /
    macro(admin, set_user) /
    macro(admin, view_balance) /
    macro(admin, decide) /

#define Beamerz_user_view(macro)
macro (ContractID, cid)
#define Beamerz_user_get_key(macro)
macro (ContractID, cid)
#define Beamerz_user_Upload(macro)
macro (ContractID, cid)

#define BeamerzRole_user(macro)
macro (user, view) /
macro(user, get_key) /
macro(user, upload) /

#define Beamerz_user_view_item(macro) /
macro (ContractID, cid) /
macro(Beamerz::Attribute::ID, id)

#define Beamerz_user_view_all(macro) /
macro (ContractID, cid)

#define Beamerz_user_set_price(macro) /
macro (ContractID, cid) /
macro (Beamerz:Attribute::, id) /
macro (Amount, amount) /
macro (AssetID, aid)

#define Beamerz_user_buy(macro) /
macro (ContractID, cid) /
macro (Beamerz::Attribute:ID, id)

#define Beamerz_user_view_balance(macro)
macro (ContractID, cid)

#define Beamerz_user_withdraw(macro) /
macro (ContractID, cid) /
macro (uint_32_t, nMaxCount) /

#define BeamerzRole_user(macro) /
    macro(user, view_item) / 
    macro(user, view_all) /
    macro(user, download) /
    macro(user, set_price) /
    macro(user, buy) /
    macro(user, view_balance) /
    macro(user, withdraw) /


#define BeamerzRole_All(macro) /
    macro (manager) /
    macro (admin) /
    macro (user) /

BEAM_EXPORT void Method_0(macro)
{
    Env::DocGroup root("");

    {
        Env::DocGroup gr("roles");

#define THE_FIELD(type,name) Env::DocAddText(#name, #type);
#define THE_ROLE(name) { Env::DocGroup grRole(#name); BeamerzRole_##name(THE_METHOD) }
#define THE_METHOD(role,name) { Env::DocGroup grMethod(#name); Beamerz_##role##_##name(THE_FIELD)   }
  
  
        BeamerzRoles_All(THE_ROLE)
#undef THE_ROLE
#undef THE_METHOD
#undef THE_FIELD
    }
}

#define THE_FIELD(type, name) const type& name,
#define ON_METHOD(role, name) void On_##role##_##name(Beamerz_##role##_##name(THE_FIELD) int unsed = 0)

void OnError(const char* sz)
{
    Env::DocAddText("error", sz);
}

namespace KeyMaterial
{
    const char g_szAdmin[] = "Beamerz_key_admin";

    void Get_Admin(PubKey& pk) {
        Env::DeriverPk(pk, g_szAdmin, sizeof(g_szAdmin) - sizeof(char));
    }

#pragma pack (push, 1)

    const char g_szOwner[] = "Beamerz_key_owner";

    struct Owner
    {
        ContractID m_Cid;
        Beamerz::Attribute::ID m_ID;
        uint8_t m_pSeed[sizeof(g_szOwner) - sizeof(char)];

        void Set(const ContractID& cid)
        {
            _POD_(m_Cid) = cid;
            m_ID = 0;
            Env::Memcpy(m_pSeed, g_szOwner, sizeof(m_pSeed));
        }

        void Get(PubKey& pk) const {
            Env::DerivePk(pk, this, sizeof(*this));
        }
    };
#pragma pack (pop)

}