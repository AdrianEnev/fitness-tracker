const validateCredentialsLogin = async (
    email: string, password: string, t: any, 
    setLoginButtonDisabled: any, setIsLoginButtonDisabled: any
) => {

    if (email.length <= 0 || password.length <= 0) {
        setIsLoginButtonDisabled(false)
        return;
    }

    const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
    if (weirdCharPattern.test(password)) {
        alert(t('password-no-emojis'));
        setLoginButtonDisabled(false)
        return;
    }

    return true;

}

export default validateCredentialsLogin;