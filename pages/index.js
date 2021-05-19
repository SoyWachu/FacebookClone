import { getSession } from "next-auth/client";
import Head from "next/head";
import Login from "./Components/Login";
import Widgets from "./Components/Widgets";
import Sidebar from "./Components/Sidebar";
import Feed from "./Components/Feed";
import Header from "./Components/Header/Header";
import db from "firebase";

export default function Home({ session, posts }) {
  if (!session) return <Login />;

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Facebook</title>
      </Head>
      <Header />
      <main className="flex">
        <Sidebar />
        <Feed posts={posts} />
        <Widgets />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  //get the user
  const session = await getSession(context);

  const posts = await db.collection("posts").orderBy("timestamp", "desc").get();

  const docs = posts.docs.map((e) => ({
    id: postId,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
      session,
      posts: docs,
    },
  };
}
