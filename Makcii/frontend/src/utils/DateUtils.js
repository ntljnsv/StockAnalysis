const formatDate = (date) => {
    return date.toISOString().split('T')[0]
}

const getDate = (dayDistance, monthDistance, yearDistance) => {

    const today = new Date();
    let day = new Date();
    if (dayDistance) {
        day.setDate(today.getDate() - dayDistance);
    }
    if (monthDistance) {
        day.setMonth(today.getMonth() - monthDistance);
    }
    if (yearDistance) {
        day.setFullYear(today.getFullYear() - yearDistance);
    }

    return formatDate(day);
}


export { formatDate, getDate};