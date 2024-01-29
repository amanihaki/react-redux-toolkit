import { Link } from "react-router-dom";
import { Typography, Box, Card, Avatar, CardHeader } from "@mui/material";

import { useGetUsersQuery } from "./usersSlice";
import Loading from "../../components/Loading";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("getUsers");

  let content;
  if (isLoading) {
    content = <Loading />;
  } else if (isSuccess) {
    const renderedUsers = users.ids.map((userId) => (
      <Card variant="outlined" sx={{ mb: 2 }} key={userId}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }} aria-label="recipe">
              {users.entities[userId].name.charAt()}
            </Avatar>
          }
          title={
            <Link to={`/users/${userId}`}>{users.entities[userId].name}</Link>
          }
          subheader={users.entities[userId].email}
        />
      </Card>
    ));

    content = (
      <Box my={5}>
        <Typography mb={6} variant="h4">
          Users
        </Typography>

        <ul>{renderedUsers}</ul>
      </Box>
    );
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return content;
};

export default UsersList;
