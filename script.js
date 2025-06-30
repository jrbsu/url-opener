let currentIndex = 0;

document.getElementById('urlInput').addEventListener('input', updateUrlCounter);
document.getElementById('batchSize').addEventListener('input', updateUrlCounter);
document.getElementById('openBatchButton').addEventListener('click', openNextBatch);
document.getElementById('resetButton').addEventListener('click', resetCounter);

function updateUrlCounter() {
    const input = document.getElementById("urlInput").value;
    const urls = input
        .split("\n")
        .map(url => url.trim())
        .filter(url => url);

    const urlCount = urls.length;
    const urlCounter = document.getElementById('urlCounter');
    urlCounter.textContent = `Total URLs: ${urlCount}`;

    let batchSize = parseInt(document.getElementById('batchSize').value, 10);
    if (urlCount >= 30 && batchSize > 20) {
        urlCounter.classList.add('warning');
    } else {
        urlCounter.classList.remove('warning');
    }

    if (currentIndex >= urlCount) {
        currentIndex = 0;
        hideResetButton();
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

    if (currentIndex > 0) {
        showResetButton();
    }

    const remaining = totalUrls - currentIndex;
    if (remaining > 0) {
        document.getElementById('urlCounter').textContent =
            `Total URLs: ${totalUrls} (${remaining} remaining)`;
    } else {
        document.getElementById('urlCounter').textContent =
            `Total URLs: ${totalUrls} (all opened)`;
    }
}

// Fraction buttons
document
  .getElementById('allButton')
  .addEventListener('click', () => setFractionBatch(1));

document
  .getElementById('halfButton')
  .addEventListener('click', () => setFractionBatch(2));

document
  .getElementById('thirdButton')
  .addEventListener('click', () => setFractionBatch(3));

document
  .getElementById('quarterButton')
  .addEventListener('click', () => setFractionBatch(4));

function setFractionBatch(divisor) {
    resetCounter();
    const raw = document.getElementById('urlInput').value;
    const urls = raw
      .split('\n')
      .map(u => u.trim())
      .filter(u => u);

    const total = urls.length;
    const remaining = Math.max(0, total - currentIndex);

    let val;
    if (divisor === 1) {
      val = remaining;
    } else {
      val = Math.ceil(remaining / divisor);
    }

    document.getElementById('batchSize').value = val > 0 ? val : 0;
}

function resetCounter() {
    currentIndex = 0;

    hideResetButton();

    const input = document.getElementById("urlInput").value;
    const urls = input
        .split("\n")
        .map(url => url.trim())
        .filter(url => url);
    const totalUrls = urls.length;

    document.getElementById('urlCounter').textContent = `Total URLs: ${totalUrls}`;
}

function showResetButton() {
    const btn = document.getElementById('resetButton');
    btn.style.display = "inline-block";
}

function hideResetButton() {
    const btn = document.getElementById('resetButton');
    btn.style.display = "none";
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
