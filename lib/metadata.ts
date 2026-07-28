import type { Metadata } from "next";

type PageMetadata = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      title: `${title} | Deton Arte`,
      description,
      url: path,
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: "Deton Arte",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Deton Arte`,
      description,
      images: ["/og.png"],
    },
  };
}
