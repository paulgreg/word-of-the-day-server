export const getDateStr = (d = new Date()) => {
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
}

export const convertDateToFR = (dateStr: string) => {
    const parts = dateStr.split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
}
