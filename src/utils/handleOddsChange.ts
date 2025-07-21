const oddsDecimalToFraction = (decimal: number, tolerance = 1.0E-6): string => {
    if (!decimal || decimal <= 0) return "0/0";

    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    do {
        const a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    return `${h1}/${k1}`;
}

const handleOddsTypeChange = (odds?: number | undefined, selectedOddsType?: string): string => {
    const oddsValue = odds || (1.5 + Math.random() * 2);
    switch (selectedOddsType) {
        case "decimal":
            return (oddsValue + 1).toFixed(2);
        case "fractional":
            return oddsDecimalToFraction(oddsValue, 0.05);
        case "american":
            if (oddsValue >= 1.0) {
                return `${Math.round(oddsValue * 100)}`;
            }
            return `${Math.round(-100 / oddsValue)}`;
        case "hk":
            return oddsValue.toFixed(2);
        default:
            console.warn("Unknown odds type:", selectedOddsType);
            return oddsValue.toFixed(2);
    }
}

export { handleOddsTypeChange };