export interface TableColumn<T> {
  title: string;
  compare: (a: T, b: T) => any
}
