import { isCategoryKey } from "@/lib/admin/constants";
import { readLocalImage } from "@/lib/admin/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ category: string; file: string }> },
) {
  const { category, file } = await context.params;
  if (!isCategoryKey(category)) {
    return new Response(null, { status: 404 });
  }

  const image = await readLocalImage(category, file);
  if (!image) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(image), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/webp",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
