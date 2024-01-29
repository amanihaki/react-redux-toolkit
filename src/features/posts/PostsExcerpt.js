import { Link } from "react-router-dom";

import {
  CardHeader,
  IconButton,
  Card,
  Typography,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { useGetPostsQuery } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

const PostsExcerpt = ({ postId }) => {
  const { post } = useGetPostsQuery("getPosts", {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  const { user: author } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading }) => ({
      user: data?.entities[post.userId],
    }),
  });
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" sx={{ bgcolor: "primary.main" }}>
            {author?.name.charAt()}
          </Avatar>
        }
        action={
          <IconButton size="small">
            <Link to={`posts/edit/${post.id}`}>
              <EditIcon sx={{ color: "#aaa" }} />
            </Link>
          </IconButton>
        }
        title={<PostAuthor author={author} />}
        subheader={<TimeAgo timestamp={post.date} />}
      />

      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.body.substring(0, 100)}...
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <ReactionButtons post={post} />
      </CardActions>
    </Card>
  );
};

export default PostsExcerpt;
