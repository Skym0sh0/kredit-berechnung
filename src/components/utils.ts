export const formatMoney = (value?: number): string => {
    if (value === undefined)
        return ""

    if (Number.isNaN(value))
        return "-"

    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value)
}

export const formatPercent = (value ?: number, precision: number = 2): string => {
    if (value === undefined)
        return ''

    if (Number.isNaN(value))
        return "-"

    return `${(value * 100).toFixed(precision)} %`
}