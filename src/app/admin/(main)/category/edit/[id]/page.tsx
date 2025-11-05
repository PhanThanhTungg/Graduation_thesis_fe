import EditCategoryForm from "./EditCategoryForm";
import { Card } from "@/components/ui/card";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return <EditCategoryForm />;
}