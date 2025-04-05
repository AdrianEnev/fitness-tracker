/*
import i18next from "i18next";

const getLanguage = async (userInfoCollectionRef: any) => {
    try {
        const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'language'));
        if (docSnapshot.exists()) {
            const language = docSnapshot.data().language;
            //console.log(language)
            await i18next.changeLanguage(language);
           
        } else {
            console.log('Language document does not exist');
        }
    } catch (err) {
        console.error(err);
    }
}

export default getLanguage;*/