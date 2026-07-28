import { revalidatePath } from "next/cache";
import { authorizeMutation } from "@/lib/admin/auth";
import { isCategoryKey } from "@/lib/admin/constants";
import {
  deleteManagedImage,
  getStorageMode,
  hideStaticImage,
  saveFilesystemUpload,
  UploadValidationError,
} from "@/lib/admin/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  if (!(await authorizeMutation(request, csrfToken))) {
    return Response.json({ error: "Sesión no autorizada." }, { status: 401 });
  }
  if (getStorageMode() !== "filesystem") {
    return Response.json(
      { error: "El almacenamiento del hosting no está disponible." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const category = formData.get("category");
    const file = formData.get("file");

    if (!isCategoryKey(category) || !(file instanceof File)) {
      return Response.json(
        { error: "Elegí una categoría y una imagen válida." },
        { status: 400 },
      );
    }

    const item = await saveFilesystemUpload(file, category);
    revalidatePath(`/${category}`);
    revalidatePath("/panel");

    return Response.json(
      { item },
      { headers: { "Cache-Control": "no-store" }, status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof UploadValidationError
        ? error.message
        : process.env.NODE_ENV === "development" && error instanceof Error
          ? `No se pudo procesar la imagen: ${error.message}`
        : "No se pudo procesar la imagen.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  if (!(await authorizeMutation(request, csrfToken))) {
    return Response.json({ error: "Sesión no autorizada." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      category?: unknown;
      id?: unknown;
      source?: unknown;
    };
    if (
      !isCategoryKey(body.category) ||
      typeof body.id !== "string" ||
      (body.source !== "managed" && body.source !== "static")
    ) {
      return Response.json({ error: "Imagen inválida." }, { status: 400 });
    }

    if (body.source === "static") {
      await hideStaticImage(body.category, body.id);
    } else {
      await deleteManagedImage(body.category, body.id);
    }

    revalidatePath(`/${body.category}`);
    revalidatePath("/panel");
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof UploadValidationError
        ? error.message
        : "No se pudo eliminar la imagen.";
    return Response.json({ error: message }, { status: 400 });
  }
}
