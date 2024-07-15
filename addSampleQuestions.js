import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs/promises';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBXFGAVpObinRmMb0DcL_fW2mMzQ2voquA",
    authDomain: "exampracticebyaa.firebaseapp.com",
    projectId: "exampracticebyaa",
    storageBucket: "exampracticebyaa.appspot.com",
    messagingSenderId: "892700899290",
    appId: "1:892700899290:web:d66b3782d79c780927f2e3",
    measurementId: "G-90MKG9SXVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

async function readQuestionsFromFile(filename) {
    try {
      const data = await fs.readFile(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  async function addQuestionsToFirestore(questions) {
    for (const question of questions) {
      try {
        const docRef = await addDoc(collection(db, "exam_questions"), question);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  async function main() {
    const questions = await readQuestionsFromFile('questions.json');
    if (questions.length > 0) {
      await addQuestionsToFirestore(questions);
      console.log('All questions have been added to Firestore.');
    } else {
      console.log('No questions were found in the file.');
    }
  }

  main().catch(console.error);