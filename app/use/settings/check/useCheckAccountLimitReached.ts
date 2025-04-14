import AsyncStorage from "@react-native-async-storage/async-storage";

// Pass array of asyncstorage emails to backend
// Compares asyncstorage to firebase, returns emails that are missing in firebase but exist in asyncstorage
// Returns empty array if no missing accounts were found
// Returns an array with the missing accounts from firebase if ones were found
const getMissingAccounts = async (asyncStorageEmails: any) => {

    try {
        const response = await fetch(`http://localhost:3000/api/users/matchAccounts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                asyncStorageEmails: asyncStorageEmails
            }),
        });

        if (!response.ok) {
            console.error("getMissingAccounts: error:", response.statusText);
            return null;
        }

        const data = await response.json();
        //console.log('backend response', data);
        return data;

    } catch (error) {
        console.error("getMissingAccounts: error:", error);
        return null;
    }
    
}

const getAsyncStorageEmails = async () => {

    // Retreive all keys from AsyncStorage containing 'username_'
    // Since only emails are stored this way, we can use this to count the number of accounts
    // First retreive all emails then check if firebase contains them inside authentication
    const keys = await AsyncStorage.getAllKeys();
    const usernameKeys = keys.filter(key => key.startsWith('username_'));

    // Retreive emails by removing 'username_' from the keys
    const emails = usernameKeys.map(key => key.replace('username_', ''));
    return emails;
}

const checkIsAccountLimitReached = async () => {

    let asyncStorageEmails = await getAsyncStorageEmails();
    //console.log('Async Storage emails: ', asyncStorageEmails);

    // First, check if firebase contains these emails, if one is missing in firebase, remove from asyncstorage as well. Then check if asyncstorage cotains more than 2 of these emails, if so, return false. If nothing is missing from firebase, just proceed with the check
    // This is done to prevent users from creating multiple accounts with the same email
    const missingAccounts = await getMissingAccounts(asyncStorageEmails);

    // No missing accounts found, check if asyncstorage contains more than 2 emails
    // If so, return true meaning account limit was reached
    if (missingAccounts.length == 0 && asyncStorageEmails.length > 2) {
        console.log('Account limit HAS been reached')
        return true;
    }

    // Missing accounts were found, meaning asyncstorage contains emails that are not in firebase
    // Remove missing emails found from asyncstorage
    if (missingAccounts.length > 0) {

        // Compare asyncstorage emails to firebase emails (missingAccounts), remove asyncstorage emails that are missing in firebase
        for (let i = 0; i < asyncStorageEmails.length; i++) {
            if (missingAccounts.includes(asyncStorageEmails[i])) {
                await AsyncStorage.removeItem(`username_${asyncStorageEmails[i]}`);
                console.log('Removed email from asyncstorage: ', asyncStorageEmails[i]);
            }
        }

    }

    // Missing accounts deleted, retreive new info
    asyncStorageEmails = await getAsyncStorageEmails();

    // Now proceed with the basic check, if asyncstorage contains more than 2 emails, return true
    if (asyncStorageEmails.length > 2) {
        console.log('Account limit HAS been reached')
        return true;
    }

    // Account limit was not reached
    console.log('Account limit has NOT been reached')
    return false;

}

export default checkIsAccountLimitReached;