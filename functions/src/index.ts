import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const {onSchedule} = require("firebase-functions/v2/scheduler");

admin.initializeApp();

const db = admin.firestore();

export const deleteExpiredDocuments = onSchedule("every 24 hours", async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure comparison starts from midnight today

  try {
    const snapshot = await db.collection("roles").where("filmingDates.end", "<", today).get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`${snapshot.size} expired documents deleted successfully.`);
  } catch (error) {
    console.error("Error deleting expired documents:", error);
  }

  return null;
});
