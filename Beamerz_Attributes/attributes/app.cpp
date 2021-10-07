#define Beamerz_admin_create()
#define Beamerz_admin_view()
#define Beamerz_admin_view_params() (ContractID, cid)
#define Beamerz_admin_view_user (ContractID, cid)

#define Beamerz_admin_view_user() /
    (ContractID, cid) /
    (PubKey, pkUser)

#define Beamerz_admin_set_user() /
    (ContractID, cid) /
    (PubKey, pkUser) /
    (uint32_t, bEnable) 

#define Beamerz_admin_view_balance()
    (ContractID, cid) /

#define Beamerz_admin_decide() /
    (ContractID, cid) /
    (Beamerz::Attribute::ID, id) /
    (uint32_t, bApprove)

#define BeamerzRole_admin() /
    (admin, create) /
    (admin, view) /
    (admin, view_params) /
    (admin, view_users) /
    (admin, view_user) /
    (admin, set_user) /
    (admin, view_balance) /
    (admin, decide) /

#define Beamerz_user_view()
 (ContractID, cid)
#define Beamerz_user_get_key()
 (ContractID, cid)
#define Beamerz_user_Upload()
 (ContractID, cid)

#define BeamerzRole_user()
 (user, view) /
(user, get_key) /
(user, upload) /

#define Beamerz_user_view_item() /
 (ContractID, cid) /
(Beamerz::Attribute::ID, id)

#define Beamerz_user_view_all() /
 (ContractID, cid)

#define Beamerz_user_set_price() /
 (ContractID, cid) /
 (Beamerz:Attribute::, id) /
 (Amount, amount) /
 (AssetID, aid)

#define Beamerz_user_buy() /
 (ContractID, cid) /
 (Beamerz::Attribute:ID, id)

#define Beamerz_user_view_balance()
 (ContractID, cid)

#define Beamerz_user_withdraw() /
 (ContractID, cid) /
 (uint_32_t, nMaxCount) /

#define BeamerzRole_user() /
    (user, view_item) / 
    (user, view_all) /
    (user, download) /
    (user, set_price) /
    (user, buy) /
    (user, view_balance) /
    (user, withdraw) /


#define BeamerzRole_All() /
     (manager) /
     (admin) /
     (user) /

BEAM_EXPORT void Method_0()
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

ON_METHOD(admin, create)
{
    Beamerz::Init args;
    KeyMaterial::Get_Admin(args.m_pkAdmin);

     Env::GenerateKernel(nullptr, 0, &args, sizeof(args), nullptr, 0, nullptr, 0, "create Beamerz contract", 0);

}

ON_METHOD(admin, view)
{
    EnumAndDumpContracts(Attribute::s_SID);
}

struct StatePlus
    :public Beamerz::State
{
    bool Init(const ContractID& cid)
    {
        Env::Key_T<uint8_t> key;
        _POD_(key.m_Prefix.m_Cid) = cid;
        key.m_KeyInContract = Beamerz::State::s_Key;

        if (Env::VarReader::Read_T(key, Cast::Down<Beamerz::State>(*this)))
            return true;

        OnError("no such a contract");
        return false;
    }
};

void On_action_view_contract_params(const ContractID& cid)
{
    StatePlus s;
    if (!s.Init(cid))
        return;

    PubKey pk;
    KeyMaterial::Get_Admin(pk);

    uint32_t bIsAdmin = (_POD_(s.m_pkAdmin) == pk);

    Env::DocAddNum("Admin", bIsAdmin);
    Env::DocAddNum("Attributes", s.m_attributes);
}

#pragma pack (push, 0)
struct MyUser
    :public Attribute::User
{
    char m_szLabel[s_LabelMaxLen + 1];

    void Print()
    {
        Env::DocAddText("label", m_szLabel);
        Env::DocAddNum("hReg", m_hRegistered);
    }

    bool ReadNext(Env::VarReader& r, Env::Key_T<Attribute::User::Key>& key)
    {
        uint32_t nKey = sizeof(key), nVal = sizeof(*this);
        if (!r.MoveNext(&key, nKey, this, nVal, 0))
            return false;

        nVal -= sizeof(Attribute::User);
        m_szLabel[std::min(nVal, s_LabelMaxLen)] = 0;

        return true;
    }
};

#pragma pack (pop)

ON_METHOD(manager, view_Users)
{
    Env::Key_T<Attribute::User::Key> k0, k1;
    _POD_(k0.m_Prefix.m_Cid) = cid;
    _POD_(k1.m_Prefix.m_Cid) = cid;
    _POD_(k0.m_KeyInContract.m_pkUser).SetZero();
    _POD_(k1.m_KeyInContract.m_pkUser).SetObject(0xff);

    Env::DocArray gr0("Users");

    Env::VarReader r(k0, k1);
    while (true)
    {
        MyUser a;
        if (!a.ReadNext(r, k0))
            break;

        Env::DocGroup gr1("");

        Env::DocAddBlob_T("key", k0.m_KeyInContract.m_pkUser);
        a.Print();
    }
}

void PrintUsers(const ContractID& cid, const PubKey& pkUsers)
{
    Env::Key_T<Attribute::Users::Key> key;
    _POD_(key.m_Prefix.m_Cid) = cid;
    _POD_(key.m_KeyInContract.m_pkUser) = pkUsers;

    Env::VarReader r(key, key);

    MyUsers a;
    if (a.ReadNext(r, key))
        a.Print();
    else
        OnError("not found");
}

ON_METHOD(manager, view_Users)
{
    PrintUsers(cid, pkUsers);
}

ON_METHOD(manager, set_Users)
{
    struct {
        Attribute::ManageUsers args;
        char m_szLabel[Attribute::Users::s_LabelMaxLen + 1];
    } d;

    d.args.m_pkUsers = pkUsers;

    uint32_t nArgSize = sizeof(d.args);

    if (bEnable)
    {
        uint32_t nSize = Env::DocGetText("label", d.m_szLabel, _countof(d.m_szLabel)); // including 0-term
        if (nSize <= 1)
        {
            OnError("label required");
            return;
        }

        if (nSize > _countof(d.m_szLabel))
        {
            OnError("label too long");
            return;
        }

        d.args.m_LabelLen = nSize - 1;
        nArgSize += d.args.m_LabelLen;
    }
    else
        d.args.m_LabelLen = Attribute::Users::s_LabelMaxLen + 1;


    SigRequest sig;
    sig.m_pID = KeyMaterial::g_szAdmin;
    sig.m_nID = sizeof(KeyMaterial::g_szAdmin) - sizeof(char);

    Env::GenerateKernel(&cid, d.args.s_iMethod, &d.args, nArgSize, nullptr, 0, &sig, 1, "Attribute set Users", 0);
}