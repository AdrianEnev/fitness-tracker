import moment from "moment";

export const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return timeString;
}

export const getCurrentTimeWithMoment = () => {
    return moment().format('MM/DD/YYYY HH:mm:ss');
};

export const diffTime = (then: string, now: string) => {
    const ms = moment(now, 'MM/DD/YYYY HH:mm:ss').diff(moment(then, 'MM/DD/YYYY HH:mm:ss'));
    return Math.floor(ms / 1000); // Return difference in seconds
};
