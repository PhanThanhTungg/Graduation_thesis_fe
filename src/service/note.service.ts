import { get, post, patch, del } from "@/lib/request";
import {
  CreateNoteBodyType,
  CreateNoteResponseType,
  UpdateNoteBodyType,
  UpdateNoteResponseType,
  GetNotesByLessonResponseType,
  GetNotesByCourseResponseType,
  DeleteNoteResponseType,
  NoteWithLessonType,
} from "@/schema/note.schema";
import { showToast } from "@/lib/toast";

export const createNote = async (
  data: CreateNoteBodyType,
): Promise<NoteWithLessonType | undefined> => {
  const response = await post<CreateNoteResponseType>("/api/note", data);

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateNoteResponseType).data;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to create note";
    showToast("error", errorMessage);
    return undefined;
  }
};

export const getNotesByLessonId = async (
  lessonId: string,
): Promise<GetNotesByLessonResponseType["data"] | undefined> => {
  const response = await get<GetNotesByLessonResponseType>(
    `/api/note/lesson/${lessonId}`,
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as GetNotesByLessonResponseType).data;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get notes by lesson";
    showToast("error", errorMessage);
    return undefined;
  }
};

export const getNotesByCourseId = async (
  courseId: string | undefined,
): Promise<GetNotesByCourseResponseType["data"]["lessons"]> => {
  if (!courseId) {
    return [];
  }

  const response = await get<GetNotesByCourseResponseType>(
    `/api/note/course/${courseId}`,
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as GetNotesByCourseResponseType).data.lessons;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get notes by course";
    showToast("error", errorMessage);
    return [];
  }
};

/**
 * Cập nhật một note
 * @param noteId - ID của note cần cập nhật
 * @param data - Dữ liệu cần cập nhật (content, timestamp)
 * @returns Note với thông tin lesson sau khi được cập nhật, undefined nếu thất bại
 */
export const updateNote = async (
  noteId: string,
  data: UpdateNoteBodyType,
): Promise<NoteWithLessonType | undefined> => {
  const response = await patch<UpdateNoteResponseType>(
    `/api/note/${noteId}`,
    data,
  );

  if (response.status === 200) {
    return (response.payload as UpdateNoteResponseType).data;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update note";
    showToast("error", errorMessage);
    return undefined;
  }
};

/**
 * Xóa một note
 * @param noteId - ID của note cần xóa
 * @returns true nếu xóa thành công, false nếu thất bại
 */
export const deleteNote = async (noteId: string): Promise<boolean> => {
  const response = await del<DeleteNoteResponseType>(`/api/note/${noteId}`);

  if (response.status === 200) {
    return true;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to delete note";
    showToast("error", errorMessage);
    return false;
  }
};
