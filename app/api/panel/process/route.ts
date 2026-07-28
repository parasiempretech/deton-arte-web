import { revalidatePath } from "next/cache";
import { authorizeMutation } from "@/lib/admin/auth";
import { isCategoryKey } from "@/lib/admin/constants";
import {
  processStagedBlob,
  UploadValidationError,
} from "@/lib/admin/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  if (!(await authorizeMutation(request, csrfToken))) {
    return Response.json({ error: "Sesión no autorizada." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      category?: unknown;
      pathname?: unknown;
      url?: unknown;
    };

    if (
      !isCategoryKey(body.category) ||
      typeof body.pathname !== "string" ||
      typeof body.url !== "string"
    ) {
      return Response.json(
        { error: "La carga temporal no es válida." },
        { status: 400 },
      );
    }

    const item = await processStagedBlob({
      category: body.category,
      pathname: body.pathname,
      url: body.url,
    });
    revalidatePath(`/${body.category}`);
    revalidatePath("/panel");

    return Response.json(
      { item },
      { headers: { "Cache-Control": "no-store" }, status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof UploadValidationError
        ? error.message
        : "No se pudo procesar la imagen.";
    return Response.json({ error: message }, { status: 400 });
  }
}
