import { HttpsError, onCall } from "firebase-functions/https";
import { deleteCollection, tokenSecret } from "./lib/deleteCollection";
import { checkIfUserIsAdmin } from "./lib/dashboardTransactions";
import * as logger from "firebase-functions/logger";

export const deleteOrganization = onCall(
  {
    memory: "2GiB",
    timeoutSeconds: 540,
    secrets: [tokenSecret],
  },
  async (context) => {
    if (!context.auth) {
      throw new HttpsError(
        "permission-denied",
        "Must be authenticated to initiate delete."
      );
    }

    const dashboardId = context.data.dashboardId;
    const organizationId = context.data.organizationId;

    if (!dashboardId || !organizationId) {
      throw new HttpsError(
        "invalid-argument",
        "Must provide dashboardId and organizationId."
      );
    }

    logger.info(
      `User ${context.auth.uid} has requested to delete organizationId ${organizationId} under dashboardId ${dashboardId}`
    );

    // Check if user can delete the meeting
    const canDelete = await checkIfUserIsAdmin(dashboardId, context.auth.uid);
    if (!canDelete) {
      throw new HttpsError(
        "permission-denied",
        "User does not have permission to delete this organization."
      );
    }

    const path = `dashboards/${dashboardId}/organizations/${organizationId}`;
    await deleteCollection(path);

    return {
      success: true,
    };
  }
);
