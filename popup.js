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
    div.className = "contentDiv textHeight";

    const fontText = document.createElement("p");
    fontText.textContent = font;

    div.appendChild(fontText);
    container.appendChild(div);
    div.addEventListener("click", function () {
      copyTextFunction(font);
    });

  });
}


document.getElementById("colorPick").addEventListener("click", function () {
  findColorsAndDisplay();
});

function findColorsAndDisplay() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `
          function getColors() {
            const allElements = document.querySelectorAll('*');
            const usedColors = new Set();

            allElements.forEach(element => {
              const computedStyle = window.getComputedStyle(element);
              const bgColor = computedStyle.getPropertyValue('background-color');
              const textColor = computedStyle.getPropertyValue('color');

              if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                usedColors.add(bgColor);
              }

              if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
                usedColors.add(textColor);
              }
            });

            return Array.from(usedColors);
          }

          getColors();
        `,
      },
      function (colors) {
        displayColors(colors);
      }
    );
  });
}

function displayColors(colors) {
  handleButtonSelection("colorPick");
  const container = document.getElementById("imageContainer");
  container.innerHTML = ""; // Remove existing content

  if (!colors) {
    const message = document.createElement("p");
    message.className = "boldText";
    message.textContent = "Oops! no colors found.";
    container.appendChild(message);
    return;
  }

  const uniqueColors = Array.from(new Set(colors)); // Remove duplicates

  console.log(uniqueColors, "--unique colors here---");

  
  uniqueColors[0].forEach((color) => {
    const div = document.createElement("div");
    div.className = "contentDiv";
    const colorBox = document.createElement("div");
    colorBox.style.backgroundColor = color;
    colorBox.className = "colorBox";
    colorBox.style.width = "115px";
    colorBox.style.height = "40px";
    colorBox.style.marginBottom = "20px";
    colorBox.style.position = "relative";

    const colorText = document.createElement("p");
    colorText.className = "colorText";
    colorText.textContent = color;

    colorBox.appendChild(colorText); // Add colorText to colorBox first
    div.appendChild(colorBox); // Add colorBox to div
    container.appendChild(div);
    div.addEventListener("click", function () {
      copyTextFunction(color);
    });
  });

}

function handleButtonSelection(buttonId) {
  const buttons = document.getElementsByClassName("headerButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("imageButton");
  }
  document.getElementById(buttonId).classList.add("imageButton");
}

function copyTextFunction(copyText) {
  console.log(copyText);
  navigator.clipboard.writeText(copyText);

  // Alert the copied text
}
   


function handleButtonSelection(buttonId) {
  const buttons = document.getElementsByClassName("headerButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("imageButton");
  }
  document.getElementById(buttonId).classList.add("imageButton");
}
function copyTextFunction(copyText) {
  console.log(copyText)
  navigator.clipboard.writeText(copyText);

  // Alert the copied text
}
