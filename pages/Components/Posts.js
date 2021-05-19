import { useCollection } from "react-firebase-hooks/firestore";
import Post from "./Post";

export default function Posts({ posts }) {
  // const [realtimePosts, loading, error] = useCollection(
  //   db.collection("posts").orderBy("timestamp", "desc") //agarra todos los post de la db y los ordena de forma descendiente
  // );

  return (
    <div>
      {/* {
        realtimePosts ?
        realtimePosts?.docs.map((post) => (
        <Post
          key={post.id}
          name={post.data().name}
          message={post.data().message}
          email={post.data().email}
          timestamp={post.data().timestamp}
          image={post.data().image}
          postImage={post.data().postImage}
        />
      )): 
        posts.map(e => (
          <Post
          key={post.id}
          name={post.name}
          message={post.message}
          email={post.email}
          timestamp={post.timestamp}
          image={post.image}
          postImage={post.postImage}
        />
        )
      )} */}
    </div>
  );
}
