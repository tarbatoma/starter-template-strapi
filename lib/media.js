export function getStrapiMedia(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = (process.env.STRAPI_API_URL || "").replace(/\/$/, "");
  return `${base}${url}`;
}
