const getCurrentDate = (padStart: boolean): string => {

    if (padStart) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }else{
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        return `${day}-${month}-${year}`;
    }

};

export default getCurrentDate;