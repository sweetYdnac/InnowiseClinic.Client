export function getQueryString(data: { [key: string]: any }) {
    const params = [];
    for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            value.forEach((val, index) => {
                params.push(`${key}[${index}]=${encodeURIComponent(val)}`);
            });
        } else {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return params.join('&');
}
