<template>
    <Header />

    <main class="absolute inset-x-0 top-48 mx-auto px-4">
        <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
            <input v-model="query" @keydown.enter="searchVideo" type="search" placeholder="Masukkan Judul atau Link Video Youtube"
                class="w-full p-2 border rounded mb-4">
            <button @click="searchVideo"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cari</button>
            <button v-if="resultQuery.length" @click="resetQuery"
                class="bg-red-500 text-white px-4 py-2 ms-3 rounded hover:bg-red-600">Reset</button>
            <p class="text-red-500 mt-2" v-if="error">{{ error }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 px-4" v-if="resultQuery.length > 0">
            <template v-for="video in resultQuery" :key="video.video_id">
                <div class="bg-white rounded-lg shadow-md p-4 flex flex-col">
                    <img :src="video.thumbnail" :alt="video.title" class="w-full rounded-lg mb-4">
                    <h3 class="text-lg font-bold mb-2">{{ video.title }}</h3>
                    <div class="mt-auto">
                        <p class="text-sm text-gray-500 mb-4">{{ video.author }}</p>
                    </div>
                    <div class="mt-auto">
                        <button type="button" @click="router.push({ name: 'Download', params: { videoId: video.video_id } })"
                            class="bg-blue-500 text-white px-4 py-2 rounded block text-center hover:bg-blue-600">Download</button>
                    </div>
                </div>
            </template>
        </div>
                
        <div v-if="isLoading" class="text-center mt-4">Loading...</div>

        <div class="mt-10 px-4">
            <h3 class="text-xl font-bold mb-2">How to download YouTube videos?</h3>
            <ol class="list-decimal list-inside space-y-4">
                <li>Go to YouTube.com and search for a video you would like to download. Then copy the video URL
                    from
                    the browser address bar (youtube.com/watch?v=id).</li>
                <li>Paste the video URL in our YouTube Converter, and choose your preferred download format. You can
                    choose between MP3 or MP4. If you do not choose any format the video will be converted by
                    default to
                    MP3. Click on the ‘Convert’ button.</li>
                <li>The conversion of the video will start, and it may take some time. Please note that it is only
                    possible to download YouTube videos with a maximum length of 90 minutes. As soon as the
                    conversion
                    is completed you will be able to download the converted video.</li>
            </ol>
        </div>

        <p class="text-sm text-gray-500 mt-10 px-4">With the usage of EzGrab you are accepting our <a href="#"
                class="text-blue-500 underline">Terms of Use</a>. Thank you for your support by using our YouTube
            Converter.</p>
    </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import axiosInstance from '../plugins/axios';
import Header from '../components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const query = ref('');
const error = ref('');
const resultQuery = ref([]);
const page = ref(1);
const pageSize = ref(8);
const isLoading = ref(false);
const hasMore = ref(true);  // Track if there are more results to fetch

const searchVideo = async () => {
    if (!query.value) {
        error.value = 'Judul video tidak boleh kosong.';
        return;
    }
    // Check if the query is url, if so, search for the video directly, and return to Download page
    
    if (query.value.includes('youtube.com/watch?v=')) {
        const videoId = query.value.split('v=')[1];
        router.push({ name: 'Download', params: { videoId } });
        return;
    }

    isLoading.value = true;
    try {
        const response = await axiosInstance.get(`search`, {
            params: {
                query: query.value,
                page: page.value,
                page_size: pageSize.value
            }
        });

        if (response.data.results.length > 0) {
            resultQuery.value = [...resultQuery.value, ...response.data.results];
            page.value += 1;  // Increment page for the next fetch
            hasMore.value = response.data.page < response.data.total_pages;
        } else {
            hasMore.value = false;  // No more results to load
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred';
    } finally {
        isLoading.value = false;
    }
};

const resetQuery = () => {
    query.value = '';
    resultQuery.value = [];
    page.value = 1;  // Reset page number
    hasMore.value = true;  // Reset the hasMore flag
};

const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (hasMore.value && !isLoading.value) {
            searchVideo();
        }
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// remove error message when query is changed
watch(query, () => {
    error.value = '';
});
</script>

<style scoped>
/* Tidak diperlukan tambahan gaya khusus */
</style>
