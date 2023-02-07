export interface IRoute {
  label: string;
  link: string;
  icon: string;
  children?: IRoute[];
}

