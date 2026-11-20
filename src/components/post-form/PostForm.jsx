import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    //edit post
    if (post) {
      //upload new updated chosen image and delete old image from storage
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      if (file) {
        //dont wait till delete, can delete in parallel, hence no await
        appwriteService.deleteFile(post.featuredImage);
      }

      //pass data as is to update post, just change the new image url
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      //if post is updated, go to updated post url
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      //create new post
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        console.log("Image ID before saving:", data.featuredImage);

        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });

        console.log("Saved post:", dbPost);

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  //The watch() callback can run when any of these fields changes.
  //But you only want to generate a new slug when the title changes

  //   1. Component mounts
  // useEffect registers the watch subscription

  // 2. User types "React Tutorial"
  // React Hook Form detects the title change

  // 3. watch() callback executes
  // name === "title" → true

  // 4. slugTransform() executes
  // "React Tutorial" → "react-tutorial"

  // 5. setValue() updates slug
  // Slug field displays "react-tutorial"
  React.useEffect(() => {
    //     - value → an object containing the current values of the form fields.
    // - name → the name of the field that changed.
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    //     This creates a subscription that listens to form changes.
    // When the component unmounts, you should stop listening
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })} //image is mandatory when creating new post, and option when updating existing post
        />
        {post?.featuredImage ? (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        ) : (
          <p>Image ID is missing</p>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
