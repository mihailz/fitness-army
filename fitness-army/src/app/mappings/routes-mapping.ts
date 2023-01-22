import {IRoute} from "../model/route";

export const APPLICATION_ROUTES: IRoute[] = [
  {
    label: 'Home',
    link: 'home',
    icon: 'home',
    actionRoute: false
  },
  {
    label: 'Blogs',
    link: 'blogs',
    icon: 'grid_on',
    actionRoute: false
  },
  {
    label: 'Login',
    link: '/auth/login',
    icon: 'login',
    actionRoute: true
  },
  {
    label: 'Admin',
    link: '/admin',
    icon: 'admin_panel_settings',
    actionRoute: false
  }
];
