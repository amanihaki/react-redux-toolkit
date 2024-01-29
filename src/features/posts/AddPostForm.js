import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useAddNewPostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const { data: users, isSuccess } = useGetUsersQuery("getUsers");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, body: content, userId }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  let usersOptions;
  if (isSuccess) {
    usersOptions = users.ids.map((id) => (
      <MenuItem key={id} value={id}>
        {users.entities[id].name}
      </MenuItem>
    ));
  }

  return (
    <Box my={5}>
      <Typography mb={6} variant="h4">
        Add a New Post
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
          variant="contained"
          fullWidth
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
          size="large"
        >
          Save Post
        </Button>
      </Stack>
    </Box>
  );
};
export default AddPostForm;
