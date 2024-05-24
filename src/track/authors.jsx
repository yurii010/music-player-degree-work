const Author = (props) => {
  const { author_name, author_photo } = props;

  return (
    <div>
      <img src={author_photo} alt={author_name} width="50" />
      <span>{author_name}</span>
    </div>
  );
};

export default Author;