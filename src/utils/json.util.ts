import { GeneratedQuestion } from "@/interfaces/question.interface";
import { TypeQuestion } from "@/enums/question.enum";

export interface BackendQuestion {
  id: string;
  type: TypeQuestion;
  statement: string;
}

const JsonUtils = {
  parseQuestionFromBackend: (item: BackendQuestion): GeneratedQuestion => {
    try {
      const parsed = JSON.parse(item.statement as string);
      return {
        id: item.id as string,
        type: item.type as TypeQuestion,
        statement: parsed.statement || "",
        options: parsed.options || parsed.answers || parsed.choices || [],
      };
    } catch {
      return {
        id: item.id as string,
        type: item.type as TypeQuestion,
        statement: item.statement || "",
        options: [],
      };
    }
  },
};

export default JsonUtils;
