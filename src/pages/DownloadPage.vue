<template>
    <Header />
    <main class="absolute inset-x-0 top-48 mx-auto px-4">
        <div class="flex flex-col justify-center items-center mb-4">
            <img :src="results.thumbnail" :alt="results.title" class="max-w-full rounded-lg lg:max-w-md">
            <h1 class="text-black mt-6 text-lg">
                {{ results.title }}
            </h1>
            <!-- Author -->
            <p class="text-gray-500 mt-2">{{ results.author }}</p>
            <!-- Duration -->
            <p class="text-gray-500 mt-2" v-if="!isLoading">
                Durasi: {{ formatDuration(results.length) }}
            </p>
            <!-- Views -->
            <p class="text-gray-500 mt-2" v-if="!isLoading">
                Penonton: {{ formatViews(results.views) }}
            </p>
        </div>

        <div v-if="isLoading" class="text-center mt-12 mb-4">Loading...</div>

        <div class="lg:max-w-6xl mx-auto border-solid border-2 mb-3 rounded-lg">
            <div class="border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li class="me-2">
                        <button @click="activeTab = 'video'"
                            :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 'video', 'hover:text-gray-600 hover:border-gray-300 border-transparent': activeTab !== 'video' }"
                            class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group">
                            <i class="w-4 h-6 me-2 text-lg ri-video-line"
                                :class="{ 'text-gray-400 group-hover:text-gray-500': activeTab !== 'video', 'text-blue-600': activeTab === 'video' }"></i>Video
                        </button>
                    </li>
                    <li class="me-2">
                        <button @click="activeTab = 'audio'"
                            :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 'audio', 'hover:text-gray-600 hover:border-gray-300 border-transparent': activeTab !== 'audio' }"
                            class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group"
                            aria-current="page">
                            <i class="w-4 h-6 me-2 text-lg ri-music-2-line"
                                :class="{ 'text-gray-400 group-hover:text-gray-500': activeTab !== 'audio', 'text-blue-600': activeTab === 'audio' }"></i>Audio
                        </button>
                    </li>
                    <li class="me-2">
                        <button @click="activeTab = 'description'"
                            :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 'description', 'hover:text-gray-600 hover:border-gray-300 border-transparent': activeTab !== 'description' }"
                            class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group">
                            <i class="w-4 h-6 me-2 text-lg ri-file-list-line"
                                :class="{ 'text-gray-400 group-hover:text-gray-500': activeTab !== 'description', 'text-blue-600': activeTab === 'description' }"></i>Deskripsi
                        </button>
                    </li>
                </ul>
            </div>
            <div class="p-4">
                <div v-if="activeTab === 'video'">
                    <p>{{ isLoading ? 'Loading...' : 'Kualitas Download' }}</p>
                    <!-- Download Option with any Resolutions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <template v-for="video in sortedVideos" :key="video.itag">
                            <!-- Filter hanya video yang memiliki tipe video -->
                            <div v-if="video.type === 'video'"
                                class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-full">
                                <!-- Content Container -->
                                <div class="flex flex-col items-center flex-grow mb-4">
                                    <!-- Resolution -->
                                    <div class="text-lg font-semibold text-gray-700 mb-2 text-center">
                                        {{ video.resolution }} (.{{ video.subtype }})
                                    </div>
                                    <!-- File Size -->
                                    <div class="text-gray-500 text-sm mb-4 text-center">{{
                                        formatFileSize(video._filesize) }}</div>
                                    <!-- Note -->
                                    <div class="text-sm text-gray-500 mb-4 text-center">
                                        <!-- Tooltip while hover -->
                                        <div class="relative inline-block">
                                            <i v-if="video.audio_codec"
                                                class="ri-volume-up-line text-lg text-green-400 cursor-pointer"
                                                @mouseover="showTooltip = video.itag"
                                                @mouseleave="showTooltip = null"></i>
                                            <i v-else class="ri-volume-mute-line text-lg text-red-400 cursor-pointer"
                                                @mouseover="showTooltip = video.itag"
                                                @mouseleave="showTooltip = null"></i>

                                            <!-- Tooltip Content -->
                                            <Transition name="fade" enter-active-class="transition-opacity duration-300"
                                                leave-active-class="transition-opacity duration-300"
                                                enter-class="opacity-0" enter-to-class="opacity-100"
                                                leave-class="opacity-100" leave-to-class="opacity-0">
                                                <div v-show="showTooltip === video.itag"
                                                    class="absolute bg-gray-700 text-white text-xs rounded-lg py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
                                                    role="tooltip">
                                                    {{ video.audio_codec ? 'Audio available' : 'No audio' }}
                                                    <div
                                                        class="absolute w-2.5 h-2.5 bg-gray-700 left-1/2 transform -translate-x-1/2 rotate-45 bottom-[-5px]">
                                                    </div>
                                                </div>
                                            </Transition>
                                        </div>
                                    </div>
                                </div>
                                <!-- Download Button -->
                                <button v-if="isDownloading != video.itag" @click="DownloadFile(results.video_id, video.itag)"
                                    class="bg-[#f1a452] text-white px-4 py-2 rounded w-full text-center hover:bg-[#f0d0ae] transition-colors duration-200 ease-in-out">
                                    Unduh
                                </button>
                                <button v-else disabled type="button" class="bg-[#f1a452] text-white px-4 py-2 rounded w-full hover:bg-[#f0d0ae] transition-colors duration-200 ease-in-out">
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>
                                    Mengunduh...
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
                <div v-if="activeTab === 'audio'">
                    <p>{{ isLoading ? 'Loading...' : 'Kualitas Download' }}</p>
                    <!-- Download Option with any Resolutions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <template v-for="video in sortedAudios" :key="video.itag">
                            <!-- Filter hanya video yang memiliki tipe audio -->
                            <div v-if="video.type === 'audio'"
                                class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                                <!-- Resolution -->
                                <div class="text-lg font-semibold text-gray-700 mb-2">{{ video.abr }}</div>
                                <!-- File Size -->
                                <div class="text-gray-500 text-sm mb-4">{{ formatFileSize(video._filesize) }}</div>
                                <!-- Download Button -->
                                <button v-if="isDownloading != video.itag" @click="DownloadFile(results.video_id, video.itag)"
                                    class="bg-[#f1a452] text-white px-4 py-2 rounded w-full text-center hover:bg-[#f0d0ae] transition-colors duration-200 ease-in-out">
                                    Unduh
                                </button>
                                <button v-else disabled type="button" class="bg-[#f1a452] text-white px-4 py-2 rounded w-full hover:bg-[#f0d0ae] transition-colors duration-200 ease-in-out">
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>
                                    Mengunduh...
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
                <div v-if="activeTab === 'description'">
                    <p v-html="formattedDescription"></p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import Header from '../components/Header.vue';
import axiosInstance from '../plugins/axios';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import Download from '../utils/download';

// Utility function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const showTooltip = ref(null);
const activeTab = ref('video');
const route = useRoute();
const results = ref({ streams: [] });  // Initialize with empty streams array
const isLoading = ref(false);
const isDownloading = ref(null);

const fetchDetailVideo = async () => {
    isLoading.value = true;
    try {
        const videoId = route.params.videoId;
        const response = await axiosInstance.get(`/video/${videoId}`);
        results.value = response.data;
    } catch (error) {
        console.error('Failed to fetch video details:', error);
    } finally {
        isLoading.value = false;
    }
};

const sortedVideos = computed(() => {
    return (results.value.streams || [])
        .filter(video => video.type === 'video')
        .sort((a, b) => parseInt(b.resolution) - parseInt(a.resolution));
});

const sortedAudios = computed(() => {
    return (results.value.streams || [])
        .filter(video => video.type === 'audio')
        .sort((a, b) => parseInt(b.abr) - parseInt(a.abr));
});

const DownloadFile = async (videoId, itag) => {
    isDownloading.value = itag;
    await Download.FromYoutubeAPI(videoId, itag);
    isDownloading.value = null;
};

onMounted(async () => {
    await fetchDetailVideo();
});

const formattedDescription = computed(() => {
    return results.value.description ? results.value.description.replace(/\n/g, '<br>') : '';
});

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs}`;
};

const formatViews = (views) => {
    // Ensure views is a number before calling toLocaleString
    return views ? views.toLocaleString() : 'N/A'; // Provide a default value if views is undefined
};
</script>
