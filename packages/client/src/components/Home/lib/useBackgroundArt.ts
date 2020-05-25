import { useEffect, useState } from 'react';

interface BackgroundArt {
  path: string;
  artistName: string;
  artistUrl: string;
}

const artMap: BackgroundArt[] = [
  {
    path: 'chris-barbalis-bmfulu-3Ano-unsplash.jpg',
    artistName: 'Chris Barbalis',
    artistUrl: 'https://unsplash.com/@cbarbalis',
  },
  {
    path: 'daniel-clay-enbQhSLA4FY-unsplash.jpg',
    artistName: 'Daniel Clay',
    artistUrl: 'https://unsplash.com/@doctor1980',
  },
  {
    path: 'ioana-cristiana-J2SS313SbMk-unsplash.jpg',
    artistName: 'Ioana Cristiana',
    artistUrl: 'https://unsplash.com/@yoyoqua',
  },
  {
    path: 'jakob-owens-BqSACXqDbBU-unsplash.jpg',
    artistName: 'Jakob Owens',
    artistUrl: 'https://unsplash.com/@jakobowens1',
  },
  {
    path: 'jane-duursma-CWEuo_qZsrI-unsplash.jpg',
    artistName: 'Jane Duursma',
    artistUrl: 'https://unsplash.com/@madebyjane',
  },
  {
    path: 'jean-philippe-delberghe-vlQnJZ5rOwY-unsplash.jpg',
    artistName: 'Jean Philippe Delberghe',
    artistUrl: 'https://unsplash.com/@jipy32',
  },
  {
    path: 'martin-courreges-_nrUXnPNNeg-unsplash.jpg',
    artistName: 'Martin Courreges',
    artistUrl: 'https://unsplash.com/@martincourreges',
  },
  {
    path: 'mec-rawlings-yDs3UCbhTX4-unsplash.jpg',
    artistName: 'Mec Rawlings',
    artistUrl: 'https://unsplash.com/@mec',
  },
];

export default function useBackgroundArt() {
  const [backgroundArt, setBackgroundArt] = useState<BackgroundArt>();

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * artMap.length);

    const art = artMap[randomNumber];

    const enhancedArt = {
      ...art,
      path: `${process.env.PUBLIC_URL}/backgrounds/${art.path}`,
    };

    setBackgroundArt(enhancedArt);
  }, []);

  return { backgroundArt };
}
