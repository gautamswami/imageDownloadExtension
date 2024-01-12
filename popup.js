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
document.getElementById("imagePick").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: 'Array.from(document.images).map(img => ({src: img.src, size: img.naturalWidth + "x" + img.naturalHeight}));',
      },
      function (imageUrls) {
        displayImages(imageUrls);
      }
    );
  });
});
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    {
      code: 'Array.from(document.images).map(img => ({src: img.src, size: img.naturalWidth + "x" + img.naturalHeight}));',
    },
    displayImages
  );
});


function displayImages(imageUrls) {
  handleButtonSelection("imagePick");
  const container = document.getElementById("imageContainer");
  container.innerHTML = ""; // Remove existing images

  if (!imageUrls) {
    const message = document.createElement("p");
    message.className = "boldText";
    message.textContent = "Oops! no images found.";
    container.appendChild(message);
    return;
  }
  const allUrls = imageUrls[0];

  allUrls.forEach((url) => {
    const div = document.createElement("div");
    div.className = "contentDiv";

    const img = document.createElement("img");
    img.src = url.src;

    const button = document.createElement("button");
    button.textContent = "Download ";
    const downloadIcon = document.createElement("i");
    downloadIcon.className = "fa-solid fa-download";
    button.appendChild(downloadIcon);
    button.addEventListener("click", () =>
      chrome.downloads.download({ url: url.src })
    );

    const size = document.createElement("p");
    size.className = "sizeText";
    size.textContent = url.size;

    div.appendChild(img);
    div.appendChild(button);
    div.appendChild(size);
    container.appendChild(div);
  });
}

document.getElementById("fontPick").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
          const allElements = document.querySelectorAll('*');
          const usedFonts = new Set();

          allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.getPropertyValue('font-family');
            if (fontFamily) {
              fontFamily.split(',').forEach(font => usedFonts.add(font.trim()));
            }
          });

          Array.from(usedFonts)
        `,
      },
      function (fonts) {
        displayFonts(fonts);
      }
    );
  });
});

function displayFonts(fonts) {
  handleButtonSelection("fontPick");
  console.log(fonts);
  const container = document.getElementById("imageContainer");
  container.innerHTML = ""; // Clear existing content

  if (!fonts) {
    const message = document.createElement("p");
    message.className = "boldText";
    message.textContent = "Oops! no fonts found.";
    container.appendChild(message);
    return;
  }

  fonts[0]?.forEach((font) => {
    const div = document.createElement("div");
    div.className = "contentDiv";

    const fontText = document.createElement("p");
    fontText.textContent = font;

    div.appendChild(fontText);
    container.appendChild(div);
  });
}

// Add event listeners to the buttons

// Function to handle button selection
function handleButtonSelection(buttonId) {
  const buttons = document.getElementsByClassName("headerButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("imageButton");
  }
  document.getElementById(buttonId).classList.add("imageButton");
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



// document.getElementById("fontPick").addEventListener("click", listFontFamilies);
// function listFontFamilies() {
//   handleButtonSelection("fontPick");
//   const container = document.getElementById("imageContainer");
//   container.innerHTML = ""; // Remove existing images

//   const fontFamilies = Array.from(document.querySelectorAll("*"))
//     .map((element) => getComputedStyle(element).fontFamily)
//     .filter((fontFamily) => fontFamily !== "")
//     .filter((fontFamily, index, self) => self.indexOf(fontFamily) === index); // Remove duplicates

//   if (fontFamilies.length === 0) {
//     const message = document.createElement("p");
//     message.className = "boldText";
//     message.textContent = "No font families found.";
//     container.appendChild(message);
//     return;
//   }

//   const fontList = document.createElement("ul");
//   fontList.className = "fontList";
//   fontFamilies.forEach((fontFamily) => {
//     const listItem = document.createElement("li");
//     listItem.className = "fontListItem";
//     listItem.textContent = fontFamily;
//     fontList.appendChild(listItem);
//   });

//   container.appendChild(fontList);
// }