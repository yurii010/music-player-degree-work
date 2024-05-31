const DefaultPlaylist = (props) => {
  const { name, photo } = props;

  return (
    <div className="flex items-center justify-center">
      <img src={photo} alt={name} className="w-36 h-36 object-cover" />
      <div className="w-32 h-36 flex items-center justify-center transform rotate-90 -ml-12">
        <p className="text-xl text-white hover:text-blue-600">{name}</p>
      </div>
    </div>
  );
};

export default DefaultPlaylist;