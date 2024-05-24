import moment from "moment";

export default seconds => {
    if (seconds === undefined) {
        return "00:00";
    } else {
        const duration = moment.duration(seconds, 'seconds');
        const hours = duration.hours();
        const format = hours > 0 ? "HH:mm:ss" : "mm:ss";
        return moment.utc(seconds * 1000).format(format);
    }
};
