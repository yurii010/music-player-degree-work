const Album = (props) => {
  const { album_name, album_photo } = props;

  return (
    <div className="flex flex-col justify-center m-3">
      <img src={album_photo} alt={album_name} className="w-36" />
      <p className="text-3xl text-white hover:text-blue-600">{album_name}</p>
    </div>
  );
};

export default Album;
