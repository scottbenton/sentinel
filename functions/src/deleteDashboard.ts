import { HttpsError, onCall } from "firebase-functions/https";
import { deleteCollection, tokenSecret } from "./lib/deleteCollection";
import { checkIfUserIsAdmin } from "./lib/dashboardTransactions";
import * as logger from "firebase-functions/logger";

export const deleteDashboard = onCall(
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

    if (!dashboardId) {
      throw new HttpsError("invalid-argument", "Must provide dashboardId.");
    }

    logger.info(
      `User ${context.auth.uid} has requested to delete dashboard ${dashboardId}`
    );

    // Check if user can delete the meeting
    const canDelete = await checkIfUserIsAdmin(dashboardId, context.auth.uid);
    if (!canDelete) {
      throw new HttpsError(
        "permission-denied",
        "User does not have permission to delete this dashboard."
      );
    }

    const path = `dashboards/${dashboardId}`;
    await deleteCollection(path);

    return {
      success: true,
    };
  }
);
