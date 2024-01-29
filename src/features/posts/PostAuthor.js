import { Link } from "react-router-dom";

const PostAuthor = ({ author }) => {
  return (
    <span>
      {author ? (
        <Link to={`/users/${author.id}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};
export default PostAuthor;
