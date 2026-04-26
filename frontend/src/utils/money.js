export default function fixMoney(amount) {
    const format = (money, unit) => {
        return money.toFixed(1).replace(/\.0$/, "")  + unit;
    }


    if (amount >= 1e7) return format(amount / 1e7, "Cr")
    else if (amount >= 1e5) return format(amount / 1e5, "Lakh")
    else if (amount >= 1e3) return format(amount / 1e3, "k")
    return amount.toString();
}