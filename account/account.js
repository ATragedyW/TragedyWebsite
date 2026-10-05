// ========================================
// TRAGEDY // ACCOUNT
// ========================================

const SUPABASE_URL = "https://gckhdwlyvsystwirgvmf.supabase.co";
const SUPABASE_KEY = "sb_publishable__gaBR077T17LOA3z6lpy0Q_GWPNrHmH";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// ELEMENTS
// ========================================

const loading =
    document.getElementById("accountLoading");

const content =
    document.getElementById("accountContent");

const usernameElement =
    document.getElementById("accountUsername");

const emailElement =
    document.getElementById("accountEmail");

const createdElement =
    document.getElementById("accountCreated");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// LOAD ACCOUNT
// ========================================

async function loadAccount() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        loading.textContent =
            "Unable to load account.";

        return;
    }


    // Not logged in

    if (!session) {

        window.location.href = "/login/";

        return;
    }


    const user = session.user;


    // Username stored during signup

    const username =
        user.user_metadata?.username ||
        "TRAGEDY USER";


    usernameElement.textContent =
        username.toUpperCase();


    emailElement.textContent =
        user.email || "—";


    // Account creation date

    if (user.created_at) {

        const createdDate =
            new Date(user.created_at);

        createdElement.textContent =
            createdDate.toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }


    // Show account

    loading.hidden = true;

    content.hidden = false;

}


// ========================================
// LOG OUT
// ========================================

logoutButton.addEventListener(
    "click",
    async () => {

        logoutButton.disabled = true;

        logoutButton.textContent =
            "LOGGING OUT...";


        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            logoutButton.disabled = false;

            logoutButton.textContent =
                "LOG OUT";

            return;
        }


        window.location.href = "/";

    }
);


// ========================================
// START
// ========================================

loadAccount();