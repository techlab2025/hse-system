export function getLocalizedTitle(titles: { title_ar?: string; title_en?: string }): string {
    const lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"

    return lang === "ar" ? titles?.title_ar ?? "" : titles?.title_en ?? "";
}