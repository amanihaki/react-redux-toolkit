import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useGetPostsQuery } from "./postsSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const {
    post,
    isLoading: isLoadingPosts,
    isSuccess,
  } = useGetPostsQuery("getPosts", {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
      post: data?.entities[postId],
      isLoading,
      isSuccess,
    }),
  });

  const { data: users, isSuccess: isSuccessUsers } =
    useGetUsersQuery("getUsers");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle(post.title);
      setContent(post.body);
      setUserId(post.userId);
    }
  }, [isSuccess, post?.title, post?.body, post?.userId]);

  if (isLoadingPosts) return <p>Loading...</p>;

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await updatePost({
          id: post?.id,
          title,
          body: content,
          userId,
        }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  let usersOptions;
  if (isSuccessUsers) {
    usersOptions = users.ids.map((id) => (
      <MenuItem key={id} value={id}>
        {users.entities[id].name}
      </MenuItem>
    ));
  }

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post?.id }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
  };

  return (
    <Box my={5}>
      <Typography mb={6} variant="h4">
        Edit Post
      </Typography>
      <Stack gap={4}>
        <TextField
          required
          type="text"
          id="postTitle"
          label="Title"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
          variant="outlined"
        />
        <TextField
          required
          id="postAuthor"
          value={userId}
          onChange={onAuthorChanged}
          label="Author"
          variant="outlined"
          select
        >
          <MenuItem value=""></MenuItem>

          {usersOptions}
        </TextField>

        <TextField
          required
          id="postContent"
          label="Content"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <Button
          size="large"
          type="button"
          onClick={onSavePostClicked}
          variant="contained"
          fullWidth
          disabled={!canSave}
        >
          Save Post
        </Button>
        <Button
          size="large"
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
          variant="outlined"
          color="error"
          fullWidth
        >
          Delete Post
        </Button>
      </Stack>
    </Box>
  );
};

export default EditPostForm;
