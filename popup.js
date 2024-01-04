chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'Array.from(document.images).map(img => img.src);'},
        displayImages
    );
});

function displayImages(imageUrls) {
    const container = document.getElementById('imageContainer');
    imageUrls[0].forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        const button = document.createElement('button');
        button.textContent = 'Download';
        button.addEventListener('click', () => chrome.downloads.download({url}));
        container.appendChild(img);
        container.appendChild(button);
    });
}