// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'Array.from(document.images).map(img => img.src);'},
//         displayImages
//     );
// });

// function displayImages(imageUrls) {
//     const container = document.getElementById('imageContainer');
//     imageUrls[0].forEach(url => {
//         const img = document.createElement('img');
//         img.src = url;
//         const button = document.createElement('button');
//         button.textContent = 'Download';
//         button.addEventListener('click', () => chrome.downloads.download({url}));
//         container.appendChild(img);
//         container.appendChild(button);
//     });
// }
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    {code: 'Array.from(document.images).map(img => ({src: img.src, size: img.naturalWidth + "x" + img.naturalHeight}));'},
    displayImages
  );
});

function displayImages(imageUrls) {
  const container = document.getElementById('imageContainer');
  if (!imageUrls) {
    const message = document.createElement('p');
    message.className = 'boldText';
    message.textContent = 'Oops! no images found.';
    container.appendChild(message);
    return;
  }
  const allUrls = imageUrls[0];

  allUrls.forEach(url => {
    const div = document.createElement('div');
    div.className = 'contentDiv';

    const img = document.createElement('img');
    img.src = url.src;

    const button = document.createElement('button');
    button.textContent = 'Download ';
    const downloadIcon = document.createElement('i');
    downloadIcon.className = 'fa-solid fa-download';
    button.appendChild(downloadIcon);
    button.addEventListener('click', () => chrome.downloads.download({url: url.src}));

    const size = document.createElement('p');
    size.className = 'sizeText';
    size.textContent =  url.size;

    div.appendChild(img);
    div.appendChild(button);
    div.appendChild(size);
    container.appendChild(div);
  });
}


// function downloadAll(urls) {
//     const zip = new JSZip();
//     let count = 0;
//     urls.forEach(url => {
//         const filename = url.split('/').pop();
//         const proxyUrl = 'https://your-server.com/download-script?image=' + encodeURIComponent(url);
//         JSZipUtils.getBinaryContent(proxyUrl, function (err, data) {
//             if(err) {
//                 throw err;
//             }
//             zip.file(filename, data, {binary:true});
//             count++;
//             if (count === urls.length) {
//                 zip.generateAsync({type:'blob'}).then(function(content) {
//                     saveAs(content, 'images.zip');
//                 });
//             }
//         });
//     });
// }
// function downloadAll(urls) {
//   const zip = new JSZip();
//   let count = 0;
//   urls.forEach(url => {
//     const filename = url.split('/').pop();
//     JSZipUtils.getBinaryContent(url, function (err, data) {
//       if(err) {
//         throw err;
//       }
//       zip.file(filename, data, {binary:true});
//       count++;
//       if (count === urls.length) {
//         zip.generateAsync({type:'blob'}).then(function(content) {
//           saveAs(content, 'images.zip');
//         });
//       }
//     });
//   });
// }