export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  BUGS: {
    LIST: '/bug/list-bugs',
    MY_BUGS: '/bug/my-bugs',
    CREATE: '/bug/create-bug',
    SEARCH: '/bug/search',
    ASSIGN: (id: string) => `/bug/${id}/assign`,
    STATUS: (id: string) => `/bug/${id}/status`,
    DETAILS: (id: string) => `/bug/${id}`,
  },
  LISTS: {
    ROLES: '/list/roles',
    SEVERITY_LEVELS: '/list/severity-levels',
    DEVELOPERS: '/list/developers',
    STATUSES: "/list/statuses",
  },
};
