import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import DownloadPage from '../pages/DownloadPage.vue';
import Download from '../utils/download';

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
    {
        path: '/download/:videoId/:resolution/:extension',
        name: 'DownloadFormat',
        beforeEnter: (to, from, next) => {
            const { videoId, resolution, extension } = to.params;
            Download.FromYoutubeAPI(videoId, resolution, extension)
                .then((data) => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${videoId}.${extension}`);
                    document.body.appendChild(link);
                    link.click();
                    next({ name: 'Download', params: { videoId } });
                })
                .catch((error) => {
                    console.error(error);
                    next({ name: 'Home' });
                });
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;