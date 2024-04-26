export type ExtractLabels<T extends string, U extends any[] = []> =
  T extends `${infer _Start}{${infer Label}}${infer Rest}`
  ? ExtractLabels<Rest extends '' ? never : Rest, [...U, Label]>
  : U[number];