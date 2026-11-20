import React from "react";
import { Container } from "../index";
import PostForm from "../post-form/PostForm";

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
