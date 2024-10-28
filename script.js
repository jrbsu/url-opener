document.getElementById('urlInput').addEventListener('input', updateUrlCounter);

function updateUrlCounter() {
    const input = document.getElementById("urlInput").value;
    const urls = input.split("\n").map(url => url.trim()).filter(url => url);
    const urlCount = urls.length;

    const urlCounter = document.getElementById('urlCounter');
    urlCounter.textContent = `URLs: ${urlCount}`;

    if (urlCount >= 30) {
        urlCounter.classList.add('warning');
    } else {
        urlCounter.classList.remove('warning');
    }
}

function openUrls() {
    const input = document.getElementById("urlInput").value;
    const urls = input.split("\n").map(url => url.trim()).filter(url => url);
    
    urls.forEach(url => {
        if (!/^https?:\/\//i.test(url)) {
            url = "http://" + url; // Add http if no scheme provided
        }
        window.open(url, '_blank');
    });
}
