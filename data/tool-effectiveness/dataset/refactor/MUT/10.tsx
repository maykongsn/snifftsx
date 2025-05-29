import { TDeDupeIssue } from "@plane/types";

type FormData = {
  name?: string;
  description_html?: string
  issueId?: string
}

export const useDebouncedDuplicateIssues = (
  workspaceSlug?: string,
  workspaceId?: string,
  projectId?: string,
  formData?: FormData
) => {
  const duplicateIssues: TDeDupeIssue[] = [];

  return { duplicateIssues };
};