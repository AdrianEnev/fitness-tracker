import checkIsAccountLimitReached from "@use/settings/check/useCheckAccountLimitReached";
import checkUsernameNSFW from "@use/settings/check/useCheckUsernameNSFW";

const validateCredentialsRegister = async (
    username: string, email: string, password: string, 
    confirmPassword: string, t: any, setRegisterButtonDisabled: any
) => {

    if (email.length == 0 || password.length == 0 || confirmPassword.length == 0 || username.length == 0) {    
        return;
    }

    const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
    if (weirdCharPattern.test(password)) {
        alert(t('password-no-emojis'));
        setRegisterButtonDisabled(false)
        return;
    }

    if (password !== confirmPassword) {
        alert(t('passwords-not-match'));
        setRegisterButtonDisabled(false)
        return;
    }

    if (username.length <= 2) {
        alert(t('username-at-least-three-symbols'));
        setRegisterButtonDisabled(false)
        return;
    } 

    if (password.length <= 8) {
        alert(t('password-at-least-eight-symbols'));
        setRegisterButtonDisabled(false)
        return;
    }

    if (password === username) {
        alert(t('password-not-same-as-username'));
        setRegisterButtonDisabled(false)
        return;
    }
    
    if (await checkIsAccountLimitReached()) {
        alert(t('max-number-accounts-device'));
        setRegisterButtonDisabled(false)
        return;
    } 

    if (await checkUsernameNSFW(username)) {
        alert(t('nsfw-username'));
        setRegisterButtonDisabled(false)
        return;
    }

    return true;

}

export default validateCredentialsRegister;