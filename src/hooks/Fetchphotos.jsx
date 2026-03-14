import { useState, useEffect } from "react";
import axios from "axios";

function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // localStorage से check करो
        const storedPhotos = localStorage.getItem("photos");
        if (storedPhotos) {
          setPhotos(JSON.parse(storedPhotos));
          setLoading(false);
          return;
        }

        // API से fetch करो
        const res = await axios.get("https://picsum.photos/v2/list?limit=30");
        const data = res.data.map(photo => ({ ...photo, isFaverate: false }));

        setPhotos(data);
        localStorage.setItem("photos", JSON.stringify(data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { photos, loading };
}

export default useFetchPhotos;