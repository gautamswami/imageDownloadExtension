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
  console.log("fontPick");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
        console.log("fontPick2");
        (function() {
          const allElements = document.querySelectorAll('*');
          const usedFonts = new Set();

          allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.getPropertyValue('font-family');
            if (fontFamily) {
              fontFamily.split(',').forEach(font => usedFonts.add(font.trim()));
            }
          });

          return Array.from(usedFonts);
        })();
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

function handleButtonSelection(buttonId) {
  const buttons = document.getElementsByClassName("headerButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("imageButton");
  }
  document.getElementById(buttonId).classList.add("imageButton");
}