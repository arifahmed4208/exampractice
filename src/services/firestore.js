import { collection, query, where, orderBy, limit, startAfter, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const getQuestions = async (difficulty, lastLoadedId, pageSize) => {
  let q = query(
    collection(db, 'exam_questions'),
    where('difficulty_level', '==', difficulty),
    orderBy('id'),
    limit(pageSize)
  );

  if (lastLoadedId) {
    q = query(q, startAfter(lastLoadedId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveProgress = async (userId, questionId, selectedOptionId) => {
  await setDoc(doc(db, 'my_progress', `${userId}_${questionId}`), {
    userId,
    questionId,
    selectedOptionId,
    timestamp: new Date()
  });
};