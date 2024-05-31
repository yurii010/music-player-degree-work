import moment from "moment";

export default seconds => {
    if (seconds === undefined) {
        return "00:00";
    } else {
        const duration = moment.duration(seconds, 'seconds');
        const hours = duration.hours();
        const minutes = duration.minutes();
        const format = hours > 0 ? `${hours} год ${minutes} хв` : `${minutes} хв`;
        if (duration.seconds() > 0) {
            return `${format} ${duration.seconds()} сек`;
        } else {
            return format;
        }
    }
};
