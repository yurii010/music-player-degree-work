const DefaultPlaylist = (props) => {
  const { name, photo } = props;

  return (
    <div>
      <img src={photo} alt={name} width="50" /><br />
      <span>{name}</span>
    </div>
  );
};

export default DefaultPlaylist;