import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import DownloadPage from '../pages/DownloadPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/download/:videoId',
        name: 'Download',
        component: DownloadPage
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;