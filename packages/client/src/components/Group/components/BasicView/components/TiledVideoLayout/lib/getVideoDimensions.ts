// TODO: this is awful, write an algo that generates this
const dimensionMap: {
  [key: number]: { regular: number[]; wide: number[]; narrow: number[] };
} = {
  1: { regular: [1, 1], wide: [1, 1], narrow: [1, 1] },
  2: { regular: [1, 2], wide: [1, 2], narrow: [2, 1] },
  3: { regular: [2, 2], wide: [1, 3], narrow: [3, 1] },
  4: { regular: [2, 2], wide: [1, 4], narrow: [4, 1] },
  5: { regular: [2, 3], wide: [1, 5], narrow: [3, 2] },
  6: { regular: [2, 3], wide: [1, 6], narrow: [3, 2] },
  7: { regular: [3, 3], wide: [1, 7], narrow: [4, 2] },
  8: { regular: [3, 3], wide: [1, 8], narrow: [4, 2] },
  9: { regular: [3, 3], wide: [1, 9], narrow: [5, 2] },
  10: { regular: [3, 4], wide: [2, 5], narrow: [5, 2] },
  11: { regular: [3, 4], wide: [2, 6], narrow: [4, 3] },
  12: { regular: [3, 4], wide: [2, 6], narrow: [4, 3] },
};

export default function getVideoDimensions({
  count,
  width,
  height,
}: {
  count: number;
  width?: number;
  height?: number;
}) {
  if (!width || !height) {
    return { width: '100%', height: '100%' };
  }

  let [rows, columns] = dimensionMap[count]?.regular || [];

  if (width / height > 4.3) {
    [rows, columns] = dimensionMap[count]?.wide || [];
  }

  if (width / height < 1) {
    [rows, columns] = dimensionMap[count]?.narrow || [];
  }

  if (!rows || !columns) {
    return { width: '20%', height: '20%' };
  }

  const videoWidth = width / columns;
  const videoHeight = height / rows;

  if (count === 2 && width > height) {
    return {
      width: `${videoWidth}px`,
      height: `${videoWidth * 0.526}px`,
    };
  }

  return {
    width: `${videoWidth}px`,
    height: `${videoHeight}px`,
  };
}
