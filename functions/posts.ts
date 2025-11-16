import {doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit} from "firebase/firestore";
import { db } from "./firebase";
import { Post , Latest50PostsResponse} from "./types";

export async function makePost(post : Post){
    post.createdAt = new Date();
    const postsCollection = collection(db, "posts");
    const docRef = await addDoc(postsCollection, post);
    return docRef.id;
}

export async function getPostById(id: string): Promise<Post | null> {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
        return postSnap.data() as Post;
    } else {
        return null;
    }
}


export async function getLatest50Posts(): Promise<Latest50PostsResponse> {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
        posts.push(doc.data() as Post);
    });
    return { posts };
}