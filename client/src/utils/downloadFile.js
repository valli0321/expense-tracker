export const downloadFile = (
    response,
    fallbackName = "download.xlsx"
) => {
    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    // Extract filename from headers
    const disposition =
        response.headers["content-disposition"];

    let fileName = fallbackName;

    if (disposition) {
        const match =
            disposition.match(/filename="?(.+)"?/);

        if (match?.[1]) {
            fileName = match[1];
        }
    }

    link.href = url;

    link.setAttribute("download", fileName);

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};