import axiosInstance from '../plugins/axios'

// Function for downloading youtube videos
class Download {
    static async FromYoutubeAPI(videoId, itag) {
        try {
            const response = await axiosInstance.get(`download/${videoId}/${itag}`, { responseType: 'blob' });
            
            // Extract filename from Content-Disposition header
            const disposition = response.headers['content-disposition'];
            let fileName = 'downloaded-file'; // Default filename
            if (disposition) {
                const matches = /filename\*=utf-8''(.+)/.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
            }
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    }
}

export default Download;