const API_KEY = import.meta.env.VITE_PIXABAY_KEY;

const MOCK_DATA = [
  {
    id: 1,
    city: "Kyoto",
    desc: "Ancient Temples & Zen Gardens",
    image:
      "https://pixabay.com/get/g74996928e08544f8f4139893d5f3088b68832a838507204439f029013c8f8510f27c813be60233488f2f986299b66236_1280.jpg",
  },
  {
    id: 2,
    city: "Iceland",
    desc: "Northern Lights & Glaciers",
    image: "https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg", // Using Pexels for extra stability
  },
  {
    id: 3,
    city: "Rome",
    desc: "The Eternal City & Colosseum",
    image:
      "https://cdn.pixabay.com/photo/2018/07/20/14/02/rome-3550739_1280.jpg",
  },
  {
    id: 4,
    city: "Cape Town",
    desc: "Table Mountain & Coastal Views",
    image:
      "https://cdn.pixabay.com/photo/2016/11/02/16/09/cape-town-1792040_1280.jpg",
  },
  {
    id: 5,
    city: "Jaipur",
    desc: "The Pink City & Royal Palaces",
    image:
      "https://cdn.pixabay.com/photo/2021/04/06/11/22/hawa-mahal-6156123_1280.jpg",
  },
  {
    id: 6,
    city: "Santorini",
    desc: "White Houses & Blue Domes",
    image:
      "https://cdn.pixabay.com/photo/2016/09/01/18/16/santorini-1636834_1280.jpg",
  },
  {
    id: 7,
    city: "New York",
    desc: "Manhattan Skyscrapers",
    image:
      "https://cdn.pixabay.com/photo/2014/05/03/01/03/manhattan-336691_1280.jpg",
  },
  {
    id: 8,
    city: "Bali",
    desc: "Tropical Paradise & Temples",
    image:
      "https://cdn.pixabay.com/photo/2017/02/14/08/51/bali-2065363_1280.jpg",
  },
];

export const searchDestinations = async (query) => {
  console.log(`Searching for: "${query}"`);

  if (!query || query.trim() === "") {
    return MOCK_DATA;
  }

  if (!API_KEY || API_KEY === "undefined" || API_KEY.length < 10) {
    console.warn("Using MOCK DATA (Key missing or invalid).");
    return MOCK_DATA.filter((d) =>
      d.city.toLowerCase().includes(query.toLowerCase()),
    );
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=10`,
    );

    if (!response.ok) {
      throw new Error(
        `Pixabay API Error: ${response.status} (Likely Invalid Key)`,
      );
    }

    const data = await response.json();

    if (!data.hits || data.hits.length === 0) {
      console.log("No API results, checking mock data...");
      return MOCK_DATA.filter((d) =>
        d.city.toLowerCase().includes(query.toLowerCase()),
      );
    }

    console.log("Found real data from Pixabay!");
    return data.hits.map((hit) => ({
      id: hit.id,
      city: query.charAt(0).toUpperCase() + query.slice(1),
      image: hit.webformatURL,
      desc: hit.tags,
    }));
  } catch (e) {
    console.error(e.message);
    return MOCK_DATA.filter((d) =>
      d.city.toLowerCase().includes(query.toLowerCase()),
    );
  }
};
