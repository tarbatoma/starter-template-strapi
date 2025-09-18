// lib/strapi.js
const baseURL = (process.env.STRAPI_API_URL || "").replace(/\/$/, "");

// Recursively serialize an object into URLSearchParams using bracket notation.
// Example:
// { populate: '*', sort: 'publishedAt:desc', filters: { slug: { $eq: 'foo' } } }
// -> populate=*&sort=publishedAt%3Adesc&filters[slug][$eq]=foo
function serialize(obj, prefix, params) {
  Object.entries(obj).forEach(([key, value]) => {
    const k = prefix ? `${prefix}[${key}]` : key;
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(`${k}[]`, String(v)));
    } else if (typeof value === "object") {
      serialize(value, k, params);
    } else {
      params.append(k, String(value));
    }
  });
}

export async function strapiFetch(path, { query, noCache } = {}) {
  const pathname = `/api${path.startsWith("/") ? path : `/${path}`}`;
  const url = new URL(pathname, baseURL);

  if (query && typeof query === "object") {
    const params = new URLSearchParams();
    serialize(query, "", params);
    const qs = params.toString();
    if (qs) url.search = qs;
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: noCache ? "no-store" : "force-cache",
  });

  if (!res.ok) {
    let msg = "";
    try {
      msg = await res.text();
    } catch {}
    throw new Error(`Strapi error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}
