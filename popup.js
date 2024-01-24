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

document.getElementById("mediaPick").addEventListener("click", function () {
  handleButtonSelection("mediaPick");
  const container = document.getElementById("imageContainer");
  container.innerHTML = ""; // Remove existing content

  const message = document.createElement("p");
  message.className = "boldText";
  message.textContent = `COMING SOON ! JOIN WAITING LIST`; // Added line break
  message.style.textDecoration = "underline";
  message.style.textAlign = "center";
  container.appendChild(message);
  const formContainer = document.createElement("div");
  formContainer.classList.add("formContainer");
  const emailInput = document.createElement("input");
  emailInput.classList.add("emailInput");
  emailInput.type = "email";
  emailInput.placeholder = "Enter your email";
  

  const signupButton = document.createElement("button");
  signupButton.textContent = "Sign Up";
  signupButton.classList.add("signupButton");
  signupButton.addEventListener("click", function () {
    const email = emailInput.value;
    // Perform signup logic here
    emailInput.remove();
    signupButton.remove();

    // Show notification text
    const notifyText = document.createElement("p");
    notifyText.classList.add("notifyText");
    notifyText.textContent = "We will notify you very soon!";
    container.appendChild(notifyText);
    console.log("Signed up with email:", email);
  });
  formContainer.appendChild(emailInput);
  formContainer.appendChild(signupButton);
  container.appendChild(formContainer);
  
});

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

document.getElementById("colorPick").addEventListener("click", function () {
  findColorsAndDisplay();
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
    div.className = "contentDiv paleteBG";
    const colorBox = document.createElement("div");
    colorBox.style.backgroundColor = color;
    colorBox.className = "colorBox";
    colorBox.style.width = "80px";
    colorBox.style.height = "40px";
    colorBox.style.marginBottom = "20px";
    colorBox.style.position = "relative";
    colorBox.style.border = "1px dashed #6c594c";

    const colorText = document.createElement("p");
    const hexColor = rgbToHex(color);
    colorText.className = "colorText";
    colorText.textContent = hexColor;

    colorBox.appendChild(colorText); // Add colorText to colorBox first
    div.appendChild(colorBox); // Add colorBox to div
    container.appendChild(div);
    div.addEventListener("click", function () {
      copyTextFunction(hexColor);
    });
  });
}

function handleButtonSelection(buttonId) {
  const buttons = document.getElementsByClassName("headerButton");
  
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("imageButton");
  }
  document.getElementById(buttonId).classList.add("imageButton");

  if (buttonId === "colorPick") {
    document.getElementById("infoText").style.display = "block";
  } else {
    document.getElementById("infoText").style.display = "none";
  }
  if (buttonId === "fontPick") {
    document.getElementById("fontText").style.display = "block";
  } else {
    document.getElementById("fontText").style.display = "none";
  }
}
function copyTextFunction(copyText) {
  console.log(copyText);
  navigator.clipboard.writeText(copyText);
  const copiedText = document.querySelector("#copiedText");
  copiedText.style.opacity = 1;
  setTimeout(function () {
    copiedText.style.opacity = 0;
  }, 1000);
}
function rgbToHex(rgb) {
  // Check if the color is already in Hex format
  if (/^#[0-9A-F]{6}$/i.test(rgb)) {
    return rgb;
  }

  // Extract individual color components
  const [r, g, b] = rgb.match(/\d+/g);

  // Convert each component to Hex and concatenate
  const hexColor = `#${Number(r).toString(16).padStart(2, "0")}${Number(g)
    .toString(16)
    .padStart(2, "0")}${Number(b).toString(16).padStart(2, "0")}`;

  return hexColor;
}
