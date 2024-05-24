const Album = (props) => {
  const { album_name, album_photo } = props;

  return (
    <div>
      <img src={album_photo} alt={album_name} width="50" />
      <span>{album_name}</span>
    </div>
  );
};

export default Album;
