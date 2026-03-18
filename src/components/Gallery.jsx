import React, {
  useReducer,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import useFetchPhotos from "../hooks/Fetchphotos";
// searching
const Search = React.memo(({ search, onChange }) => {

  return (
    <div className="mb-4 flex justify-center">
      <input
        type="text"
        placeholder="Search by author"
        value={search}
        onChange={onChange}
        className="border p-2 rounded w-full max-w-md"
      />
    </div>
  );
});

function Gallery() {
  const { photos, loading } = useFetchPhotos();
  const [search, setSearch] = useState("");

  //  reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_PHOTOS":
        return action.payload;

      case "TOGGLE_FAV":
        const updated = state.map((photo) =>
          photo.id === action.id
            ? { ...photo, isFaverate: !photo.isFaverate }
            : photo,
        );
        localStorage.setItem("photos", JSON.stringify(updated)); // persist
        return updated;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, []);

  // localStorage
  useEffect(() => {
    const storedPhotos = localStorage.getItem("photos");
    if (storedPhotos && state.length === 0) {
      dispatch({ type: "SET_PHOTOS", payload: JSON.parse(storedPhotos) });
    } else if (photos.length > 0 && state.length === 0) {
      dispatch({ type: "SET_PHOTOS", payload: photos });
      localStorage.setItem("photos", JSON.stringify(photos));
    }
  }, [photos, state.length]);
  // useCallback
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);
  // usememo
  const filteredPhotos = useMemo(() => {
    return state.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase()),
    );
  }, [state, search]);
  console.log(state);

  // loader
  if (loading || state.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-center py-4">Gallery Task</h1>

      {/* Search Component */}
      <Search search={search} onChange={handleSearchChange} />

      {/* Photos Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={photo.download_url}
              alt={photo.author}
              className="w-full h-48 object-cover"
            />
            <div className="flex items-center justify-between p-3">
              <p className="text-sm font-medium">{photo.author}</p>
              <button
                onClick={() => dispatch({ type: "TOGGLE_FAV", id: photo.id })}
                className="text-xl"
              >
                {photo.isFaverate ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
