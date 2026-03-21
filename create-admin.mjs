import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "mpiti-web",
  appId: "1:224432144817:web:4f9ac1cbd689ae2bf43d90",
  apiKey: "AIzaSyDICqBqEgiBO1CjKYIRt2-jGTXrw8K-6Eg",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@mpiti.edu.in", "Admin@1234");
    console.log("Created user with UID: " + userCredential.user.uid);
    await setDoc(doc(db, "roles_admin", userCredential.user.uid), { role: 'admin', email: "admin@mpiti.edu.in" });
    console.log("Admin role set successfully!");
  } catch(e) {
    console.error("Error creating user:", e.message);
  }
  process.exit(0);
}
run();
