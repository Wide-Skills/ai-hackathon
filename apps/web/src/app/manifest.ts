import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Umurava AI",
    short_name: "Umurava AI",
    description: "Talent Screening Platform",
    start_url: "/",
    display: "standalone",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
