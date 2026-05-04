export default function fixMoney(amount) {
    if (amount == null || isNaN(amount)) return "0";
    
    const num = Number(amount);
    
    const format = (money, unit) => {
        // Use toFixed(2) to prevent rounding 1.25 Cr to 1.3 Cr
        return money.toFixed(2).replace(/\.?0+$/, "") + " " + unit;
    }

    if (num >= 1e7) return format(num / 1e7, "Cr");
    else if (num >= 1e5) return format(num / 1e5, "Lakh");
    else if (num >= 1e3) return format(num / 1e3, "k");
    
    return num.toString();
}