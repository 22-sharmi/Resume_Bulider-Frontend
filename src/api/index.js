import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase.config";

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );
    const unsubcribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubcribe;
  });
};
