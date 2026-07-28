import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authorizeMutation } from "@/lib/admin/auth";
import {
  isCategoryKey,
  MAX_UPLOAD_BYTES,
} from "@/lib/admin/constants";
import {
  getStagingPrefix,
  getStorageMode,
} from "@/lib/admin/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (getStorageMode() !== "blob") {
    return Response.json(
      { error: "El almacenamiento permanente no está configurado." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payload: { category?: unknown; csrf?: unknown };
        try {
          payload = JSON.parse(clientPayload ?? "{}") as typeof payload;
        } catch {
          throw new Error("Datos de carga inválidos.");
        }

        const csrf =
          typeof payload.csrf === "string" ? payload.csrf : undefined;
        if (!(await authorizeMutation(request, csrf))) {
          throw new Error("Sesión no autorizada.");
        }
        if (
          !isCategoryKey(payload.category) ||
          !pathname.startsWith(getStagingPrefix(payload.category))
        ) {
          throw new Error("Categoría de carga inválida.");
        }

        return {
          addRandomSuffix: true,
          allowedContentTypes: ["image/*", "application/octet-stream"],
          cacheControlMaxAge: 60,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          tokenPayload: JSON.stringify({ category: payload.category }),
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => undefined,
    });

    return Response.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo iniciar la carga.";
    return Response.json({ error: message }, { status: 400 });
  }
}
