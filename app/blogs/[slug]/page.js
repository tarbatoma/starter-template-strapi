import Image from "next/image";
import { notFound } from "next/navigation";
import { strapiFetch } from "@/lib/strapi";
import { getStrapiMedia } from "@/lib/media";

export default async function BlogPost({ params }) {
  const { slug } = params;

  let post = null;
  try {
    const data = await strapiFetch("/blogs", {
      query: { filters: { slug: { $eq: slug } }, populate: "*" },
      noCache: true,
    });
    post = data?.data?.[0] ?? null;
  } catch {}

  if (!post) return notFound();

  const cover = post.cover;
  const rawUrl =
    cover?.url ||
    cover?.formats?.large?.url ||
    cover?.data?.attributes?.url ||
    null;
  const imgUrl = getStrapiMedia(rawUrl);

  const alt =
    (typeof cover?.alternativeText === "string" && cover.alternativeText.trim()) ||
    (typeof post.title === "string" && post.title.trim()) ||
    "Blog image";

  return (
    <main className="container" style={{ padding: "24px 16px", maxWidth: 860 }}>
      <p style={{ opacity: 0.7, fontSize: 12 }}>{post.category?.name || "Uncategorized"}</p>
      <h1 style={{ marginTop: 6 }}>{post.title}</h1>

      {imgUrl && (
        <div style={{ marginTop: 16 }}>
          <Image
            src={imgUrl}
            alt={alt}
            width={1200}
            height={630}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}

      {post.excerpt && <p style={{ marginTop: 16, color: "#9aa0a6" }}>{post.excerpt}</p>}

      {post.content && (
        <div style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{post.content}</div>
      )}
    </main>
  );
}
