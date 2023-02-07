import {IRoute} from "../model/route";

export const APPLICATION_ROUTES: IRoute[] = [
  {
    label: 'Home',
    link: 'home',
    icon: 'home'
  },
  {
    label: 'Blogs',
    link: 'blogs',
    icon: 'grid_on'
  },
  {
    label: 'Login',
    link: '/auth/login',
    icon: 'login'
  },
  {
    label: 'Admin',
    link: '/admin',
    icon: 'admin_panel_settings',
    children: [
      {
        label: 'Users',
        link: '/admin',
        icon: 'user'
      },
      {
        label: 'Comments',
        link: '/admin/comments',
        icon: 'login'
      }
    ]
  }
];
