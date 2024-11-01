
export function formatToBRLCurrency(value: string) {
    const numericValue = Number(value.replace(/\D/g, '')) / 100;
    return numericValue.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2 });
}