import React from 'react';

const Dashboard = React.lazy(() => import('./components/dashboard'));

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
];

export default routes;
