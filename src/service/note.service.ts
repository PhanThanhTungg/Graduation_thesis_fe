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

/**
 * Tạo note mới cho một lesson
 * @param data - Dữ liệu note cần tạo (lessonId, content, timestamp)
 * @returns Note với thông tin lesson nếu thành công, undefined nếu thất bại
 */
export const createNote = async (
  data: CreateNoteBodyType
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

/**
 * Lấy tất cả notes của user trong một lesson cụ thể
 * @param lessonId - ID của lesson
 * @returns Object chứa thông tin lesson, danh sách notes và tổng số, undefined nếu thất bại
 */
export const getNotesByLessonId = async (
  lessonId: string
): Promise<GetNotesByLessonResponseType["data"] | undefined> => {
  const response = await get<GetNotesByLessonResponseType>(
    `/api/note/lesson/${lessonId}`,
    undefined
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

/**
 * Lấy tất cả notes của user trong một course cụ thể
 * @param courseId - ID của course
 * @returns Object chứa thông tin course, danh sách notes với lesson info và tổng số, undefined nếu thất bại
 */
export const getNotesByCourseId = async (
  courseId: string
): Promise<GetNotesByCourseResponseType["data"] | undefined> => {
  const response = await get<GetNotesByCourseResponseType>(
    `/api/note/course/${courseId}`,
    undefined
  );

  if (response.status === 200) {
    return (response.payload as GetNotesByCourseResponseType).data;
  } else {
    const errorMessage =
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get notes by course";
    showToast("error", errorMessage);
    return undefined;
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
  data: UpdateNoteBodyType
): Promise<NoteWithLessonType | undefined> => {
  const response = await patch<UpdateNoteResponseType>(
    `/api/note/${noteId}`,
    data
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
