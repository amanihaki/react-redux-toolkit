import { Link, useParams } from "react-router-dom";
import { Typography, MenuItem } from "@mui/material";

import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

import Loading from "../../components/Loading";

const UserPage = () => {
  const { userId } = useParams();

  const {
    user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
    error: errorUser,
  } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
      user: data?.entities[userId],
      isLoading,
      isSuccess,
      isError,
      error,
    }),
  });

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoading || isLoadingUser) {
    content = <Loading />;
  } else if (isSuccess && isSuccessUser) {
    const { ids, entities } = postsForUser;
    content = (
      <section>
        <Typography mb={6} variant="h4">
          {user.name}
        </Typography>
        <ol>
          {ids?.length === 0 ? (
            <Typography sx={{ bgcolor: "#f2f2f2" }} p={3} color="text.disabled">
              No available posts!
            </Typography>
          ) : (
            ids.map((id) => (
              <MenuItem key={id}>
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
              </MenuItem>
            ))
          )}
        </ol>
      </section>
    );
  } else if (isError || isErrorUser) {
    content = <p>{error || errorUser}</p>;
  }

  return content;
};

export default UserPage;
