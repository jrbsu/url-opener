let currentIndex = 0;

document.getElementById('urlInput').addEventListener('input', updateUrlCounter);
document.getElementById('openBatchButton').addEventListener('click', openNextBatch);
document.getElementById('maxButton').addEventListener('click', setMaxBatch);

function updateUrlCounter() {
    const input = document.getElementById("urlInput").value;
    const urls = input
        .split("\n")
        .map(url => url.trim())
        .filter(url => url);

    const urlCount = urls.length;
    const urlCounter = document.getElementById('urlCounter');
    urlCounter.textContent = `URLs: ${urlCount}`;

    if (urlCount >= 30) {
        urlCounter.classList.add('warning');
    } else {
        urlCounter.classList.remove('warning');
    }

    if (currentIndex >= urlCount) {
        currentIndex = 0;
    }
}

function openNextBatch() {
    const input = document.getElementById("urlInput").value;
    const urls = input
        .split("\n")
        .map(url => url.trim())
        .filter(url => url);

    const totalUrls = urls.length;
    if (totalUrls === 0) {
        showToast("No URLs to open.");
        return;
    }

    let batchSize = parseInt(document.getElementById('batchSize').value, 10);
    if (isNaN(batchSize) || batchSize < 1) {
        batchSize = 1; // fallback
    }

    if (currentIndex >= totalUrls) {
        showToast("All URLs have already been opened.");
        return;
    }

    const endIndex = Math.min(currentIndex + batchSize, totalUrls);
    const urlsToOpen = urls.slice(currentIndex, endIndex);

    urlsToOpen.forEach(rawUrl => {
        let url = rawUrl;
        if (!/^https?:\/\//i.test(url)) {
            url = "http://" + url;
        }
        window.open(url, '_blank');
    });

    currentIndex = endIndex;

    const remaining = totalUrls - currentIndex;
    if (remaining > 0) {
        document.getElementById('urlCounter').textContent =
            `URLs: ${totalUrls} (${remaining} remaining)`;
    } else {
        document.getElementById('urlCounter').textContent =
            `URLs: ${totalUrls} (all opened)`;
    }
}

function setMaxBatch() {
    const input = document.getElementById("urlInput").value;
    const urls = input
        .split("\n")
        .map(url => url.trim())
        .filter(url => url);

    const totalUrls = urls.length;
    const remaining = totalUrls - currentIndex;

    document.getElementById('batchSize').value = remaining > 0 ? remaining : 0;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
