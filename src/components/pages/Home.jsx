import React, { useEffect, useState } from "react";
import appWriteService from "../../appwrite/conf";
import { Container } from "../index";
import PostCard from "../PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    appWriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  console.log(posts);

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No Posts created
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="flex flex-wrap">
            {posts
              .filter((post) => post != null)
              .map((post) => {
                <div key={post.$id} className="p-2 w-1/4">
                  <PostCard {...post} />
                </div>;
              })}
          </div>
        </Container>
      </div>
    );
  }
}

export default Home;
