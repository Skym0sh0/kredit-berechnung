const currencyFormat = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
})

export const formatMoney = (value?: number): string => {
    if (value === undefined)
        return ""

    if (Number.isNaN(value))
        return "-"

    return currencyFormat.format(value)
}

export const formatPercent = (value ?: number, precision: number = 2): string => {
    if (value === undefined)
        return ''

    if (Number.isNaN(value))
        return "-"

    return new Intl.NumberFormat('de-DE', {
        style: 'percent',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    }).format(value)
}