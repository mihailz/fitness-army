export interface IRoute {
  label: string;
  link: string;
  icon: string;
  actionRoute: boolean;
  children?: IRoute[];
}

