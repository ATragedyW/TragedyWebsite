// ========================================
// TRAGEDY // SIGNUP
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

const signupForm =
    document.getElementById("signupForm");

const usernameInput =
    document.getElementById("username");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const formMessage =
    document.getElementById("formMessage");

const signupButton =
    document.querySelector(".signup-button");


// ========================================
// SIGNUP
// ========================================

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        clearMessage();

        const username =
            usernameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ========================================
        // USERNAME VALIDATION
        // ========================================

        if (username.length < 3) {

            showError(
                "Username must be at least 3 characters."
            );

            return;
        }


        if (username.length > 20) {

            showError(
                "Username cannot exceed 20 characters."
            );

            return;
        }


        // Only letters, numbers and underscores

        const usernamePattern =
            /^[a-zA-Z0-9_]+$/;

        if (!usernamePattern.test(username)) {

            showError(
                "Username can only contain letters, numbers, and underscores."
            );

            return;
        }


        // ========================================
        // EMAIL VALIDATION
        // ========================================

        if (!email) {

            showError(
                "Enter your email address."
            );

            return;
        }


        // ========================================
        // PASSWORD VALIDATION
        // ========================================

        if (password.length < 8) {

            showError(
                "Password must be at least 8 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            showError(
                "Passwords do not match."
            );

            return;
        }


        // ========================================
        // CREATE ACCOUNT
        // ========================================

        setLoading(true);

        showMessage(
            "Creating your account...",
            "#777"
        );


        try {

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            username: username
                        }

                    }

                });


            // ========================================
            // SUPABASE ERROR
            // ========================================

            if (error) {

                console.error(
                    "Signup error:",
                    error
                );

                showError(error.message);

                return;
            }


            // ========================================
            // SUCCESS
            // ========================================

            console.log(
                "Signup successful:",
                data
            );


            // Supabase may require email confirmation.

            if (
                data.user &&
                !data.session
            ) {

                showSuccess(
                    "Account created. Check your email to confirm your account."
                );

            } else {

                showSuccess(
                    "Welcome to the chaos. Your account has been created."
                );

            }


            signupForm.reset();


        } catch (error) {

            console.error(
                "Unexpected signup error:",
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
// LOADING STATE
// ========================================

function setLoading(loading) {

    signupButton.disabled = loading;

    if (loading) {

        signupButton.textContent =
            "CREATING ACCOUNT...";

        signupButton.style.opacity =
            "0.6";

        signupButton.style.cursor =
            "not-allowed";

    } else {

        signupButton.textContent =
            "CREATE ACCOUNT";

        signupButton.style.opacity =
            "1";

        signupButton.style.cursor =
            "pointer";

    }

}


// ========================================
// MESSAGES
// ========================================

function clearMessage() {

    formMessage.textContent = "";

}


function showMessage(
    message,
    color
) {

    formMessage.textContent =
        message;

    formMessage.style.color =
        color;

}


function showError(message) {

    showMessage(
        message,
        "#ff3333"
    );

}


function showSuccess(message) {

    showMessage(
        message,
        "#38c977"
    );

}