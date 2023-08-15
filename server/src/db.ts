import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../service-account.json";

initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;

// matchesRef.doc("2579048").set({
//   homeTeam: "9INE",
//   awayTeam: "forZe",
// });
// matchesRef.doc("2579089").set({
//   homeTeam: "ECSTATIC",
//   awayTeam: "forZe",
// });
// matchesRef.doc("2578928").set({
//   homeTeam: "forZe",
//   awayTeam: "ECSTATIC",
// });
