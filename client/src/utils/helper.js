export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if(!name)
        return;

    const words = name.trim().split(" ").filter(Boolean);

    return (
        (words[0]?.[0] || "") +
        (words.length > 1 ? parts.at(-1)[0] : "")
    ).toUpperCase();
}

export const addThousandsSeparator = (num) => {
    console.log(isNaN(num))
    if(num === null|| isNaN(num)) return "NA";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");
    return fractionalPart ? 
        `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

export const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});