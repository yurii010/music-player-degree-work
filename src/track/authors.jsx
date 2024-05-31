const Author = (props) => {
  const { author_name, author_photo } = props;

  return (
    <div className="flex flex-col justify-center m-3">
      <img src={author_photo} alt={author_name} className="w-36"/>
      <p className="text-3xl">{author_name}</p>
    </div>
  );
};

export default Author;