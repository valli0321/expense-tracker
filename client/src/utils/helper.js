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

export const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});

export const formatDate = (
    date,
    options = {
        day: "numeric",
        month: "short",
        year: "numeric",
    }
) => new Date(date).toLocaleDateString("en-IN", options);