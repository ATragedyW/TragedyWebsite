// ========================================
// TRAGEDY // LOGIN
// ========================================


// ========================================
// SUPABASE
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

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const formMessage =
    document.getElementById("formMessage");

const loginButton =
    document.querySelector(".login-button");


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        formMessage.textContent = "";

        setLoading(true);


        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );

                showError(error.message);

                return;
            }


            console.log(
                "Logged in:",
                data.user
            );


            showSuccess(
                "Welcome back. Entering the chaos..."
            );


            // Send user back to main website

            setTimeout(() => {

                window.location.href = "/";

            }, 800);


        } catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            showError(
                "Something went wrong. Please try again."
            );


        } finally {

            setLoading(false);

        }

    }
);


// ========================================
// BUTTON STATE
// ========================================

function setLoading(loading) {

    loginButton.disabled = loading;

    if (loading) {

        loginButton.textContent =
            "ENTERING...";

        loginButton.style.opacity =
            "0.6";

    } else {

        loginButton.textContent =
            "ENTER";

        loginButton.style.opacity =
            "1";

    }

}


// ========================================
// MESSAGES
// ========================================

function showError(message) {

    formMessage.textContent =
        message;

    formMessage.style.color =
        "#ff3333";

}


function showSuccess(message) {

    formMessage.textContent =
        message;

    formMessage.style.color =
        "#38c977";

}