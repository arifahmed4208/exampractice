import { collection, query, where, orderBy, limit, startAfter, getDocs, setDoc, doc, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';

export const getQuestions = async (difficulty, subject, lastLoadedId, pageSize) => {
  let q = query(
    collection(db, 'exam_questions'),
    where('difficulty_level', '==', difficulty),
    where('subject', '==', subject),
    orderBy('id'),
    limit(pageSize)
  );

  if (lastLoadedId) {
    q = query(q, startAfter(lastLoadedId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTotalQuestionsCount = async (difficulty, subject) => {
  const q = query(
    collection(db, 'exam_questions'),
    where('difficulty_level', '==', difficulty),
    where('subject', '==', subject),
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const saveProgress = async (userId, questionId, selectedOptionId) => {
  await setDoc(doc(db, 'my_progress', `${userId}_${questionId}`), {
    userId,
    questionId,
    selectedOptionId,
    timestamp: new Date()
  });
};


export const getProgress = async (userId) => {
  const q = query(collection(db, 'my_progress'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};