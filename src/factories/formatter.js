export const formatPricesToLocale = (price) => {
    return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const generateId = (data) => {
    let result = '';
    let length = data.trim().length * 3;

    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

    // console.log(result);
    return result;
}