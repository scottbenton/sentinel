import { useParams } from "wouter";

export function useOrganizationId() {
  const orgId = useParams<{ organizationId: string }>().organizationId;
  if (!orgId) {
    throw new Error("Organization ID not found in URL");
  }
  const parsedOrgId = parseInt(orgId);
  if (isNaN(parsedOrgId)) {
    throw new Error("Invalid organization ID");
  }

  return parsedOrgId;
}
