export interface IGeoJsonObject {
  position: {
    x: number,
    y: number,
    type: string,
    coordinates: Array<number>,
  };
  timestamp: number;
}
