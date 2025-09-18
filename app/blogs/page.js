import Image from "next/image";
import Link from "next/link";
import { strapiFetch } from "@/lib/strapi";
import { getStrapiMedia } from "@/lib/media";
import styles from "./page.module.css";

export default async function BlogsPage() {
  try {
    const data = await strapiFetch("/blogs", {
      query: { sort: "publishedAt:desc", populate: "*" },
      noCache: true,
    });
    const items = data?.data ?? [];

    return (
      <main className={`${styles.page} container`}>
        <h1 className={styles.title}>Blogs</h1>

        <ul className={styles.list}>
          {items.length === 0 ? (
            <li className={styles.empty}>Niciun articol încă.</li>
          ) : (
            items.map((a) => {
              if (!a?.slug) return null;

              const cover = a?.cover;
              const rawUrl =
                cover?.url ||
                cover?.formats?.thumbnail?.url ||
                cover?.data?.attributes?.url ||
                null;
              const imgUrl = getStrapiMedia(rawUrl);

              const altText =
                (typeof cover?.alternativeText === "string" && cover.alternativeText.trim()) ||
                (typeof a?.title === "string" && a.title.trim()) ||
                "Blog image";

              return (
                <li key={a.id} style={{ listStyle: "none" }}>
                  <Link href={`/blogs/${a.slug}`} className={styles.card}>
                    <div className={styles.media}>
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={altText}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>

                    <div className={styles.body}>
                      <div className={styles.kicker}>
                        {a?.category?.name || "Uncategorized"}
                      </div>
                      <div className={styles.cardTitle}>{a?.title}</div>
                      {a?.excerpt && <p className={styles.excerpt}>{a.excerpt}</p>}
                      {Array.isArray(a?.tags) && a.tags.length > 0 && (
                        <div className={styles.tags}>
                          {a.tags.map((t) => (
                            <span key={t.id} className={styles.tag}>
                              #{t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </main>
    );
  } catch (e) {
    return (
      <main className={`${styles.page} container`}>
        <h1 className={styles.title}>Blogs</h1>
        <p style={{ color: "salmon" }}>Eroare la citirea din Strapi: {String(e.message)}</p>
      </main>
    );
  }
}
