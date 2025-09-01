export function toCents(x){return Math.round(Number(x||0)*100)}
export function fromCents(c){return (Number(c||0)/100)}
export function fmtMoney(c){return fromCents(c).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
