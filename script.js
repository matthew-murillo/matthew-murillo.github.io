const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// This adds the network effect to the background
// document.getElementById("node-background").appendChild(canvas);

let nodes = [];
const maxNodes = 125;
const maxDistance = 100; // Increased for fewer connections

class Node {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.velX = (Math.random() - 0.5) * 1; // Further reduced for slower movement
    this.velY = (Math.random() - 0.5) * 1; // Further reduced for slower movement
    this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 0.6)`;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
    if (this.x < 0 || this.x > canvas.width) this.velX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.velY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

function initNodes() {
  nodes = [];

  // Calculate canvas area
  const canvasArea = canvas.width * canvas.height;

  // Define a base area (e.g., for 1000x1000 px) and set the desired node count for that area
  const baseArea = 1000000; // Example: 1000px * 1000px
  const baseNodeCount = maxNodes; // Max nodes for the base area

  // Calculate the node count proportional to the canvas size
  const proportionalNodeCount = Math.round(
    (canvasArea / baseArea) * baseNodeCount
  );

  // Ensure a minimum number of nodes, if needed
  const minNodes = 20; // Set a minimum count to ensure there are always some nodes
  const finalNodeCount = Math.max(proportionalNodeCount, minNodes);

  for (let i = 0; i < finalNodeCount; i++) {
    nodes.push(new Node());
  }
}

function drawLines() {
  nodes.forEach((node, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = node.x - nodes[j].x;
      const dy = node.y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = "rgba(128, 128, 128, 0.7)";
        ctx.stroke();
      }
    }
  });
}

let frameCount = 0;
const throttleFrames = 3; // Update every 5 frames for slower animation

function update() {
  frameCount++;
  if (frameCount % throttleFrames === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((node) => {
      node.update();
      node.draw();
    });
    drawLines();
  }
  requestAnimationFrame(update);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initNodes();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Call this function to set initial size
update();

let isInitialLoad = true; // Flag to indicate initial load
let lastActiveClass = ""; // Track the last active class
let divClasses = ["Home", "Research", "Notes", "Projects"]; // Add more div class names as needed
let divZIndexes = divClasses.reduce((acc, cls) => ({ ...acc, [cls]: 1 }), {}); // Initialize z-indexes for each div

function adjustDivVisibility() {
  var currentHash = window.location.hash || "#Home"; // Default to #Home if no hash is present
  var targetClass = currentHash.substring(1);

  // If there was a last active class, set its z-index to 2
  if (lastActiveClass) {
    divZIndexes[lastActiveClass] = 2;
  }

  // Update z-index for the target class
  divZIndexes[targetClass] = 3; // Highest z-index for the active div

  // Set z-index 1 for all other divs
  divClasses.forEach((divClass) => {
    if (divClass !== targetClass && divClass !== lastActiveClass) {
      divZIndexes[divClass] = 1;
    }
  });

  // Apply styles and classes based on the z-index
  divClasses.forEach(function (divClass) {
    var div = document.querySelector("." + divClass);
    if (div) {
      div.style.zIndex = divZIndexes[divClass];
      div.classList.remove("slide-in");

      if (divClass === targetClass) {
        div.style.display = "flex"; // or "block", depending on your layout
        div.classList.add("slide-in");
        div.classList.remove("fade-out");
      } else if (divClass === lastActiveClass) {
        // Opacity to 0 the last active div after the animation completes
        setTimeout(function () {
          div.classList.add("fade-out");
        }, 500);
        setTimeout(function () {
          div.style.display = "none";
        }, 500);
      } else if (isInitialLoad) {
        div.style.display = "none"; // Hide non-active divs on initial load
      }
    }
  });

  // Update the last active class and the initial load flag
  lastActiveClass = targetClass;
  isInitialLoad = false;
}

// Call the function on page load and on hash change
window.addEventListener("load", adjustDivVisibility);
window.addEventListener("hashchange", adjustDivVisibility);

document.addEventListener("DOMContentLoaded", function () {
  // Select the hamburger menu
  var hamburger = document.querySelector(".hamburger-menu");
  var dropdown = document.querySelector(".dropdown-menu");

  hamburger.addEventListener("click", function () {
    if (dropdown.classList.contains("show")) {
      dropdown.style.height = "0";
    } else {
      var scrollHeight = dropdown.scrollHeight;
      dropdown.style.height = scrollHeight + "px";
    }
    dropdown.classList.toggle("show");
  });
});

function scrollToTopOfDiv() {
  var tinyModeBreakpoint = 768;
  if (window.innerWidth <= tinyModeBreakpoint) {
    var myDiv = document.querySelector(".right");
    if (myDiv) {
      myDiv.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top of the div
    }
  }
}

window.addEventListener("hashchange", scrollToTopOfDiv);

function adjustHeight() {
  // Define the breakpoint for "tiny mode"
  var tinyModeBreakpoint = 768;

  // Check if the screen width is less than or equal to the breakpoint
  if (window.innerWidth <= tinyModeBreakpoint) {
    var currentHash = window.location.hash;
    var referenceDivSelector;

    // Determine the correct selector based on the current hash
    switch (currentHash) {
      case "#Home":
        referenceDivSelector = ".home-background";
        break;
      case "#Research":
        referenceDivSelector = ".research-background";
        break;
      case "#Notes":
        referenceDivSelector = ".notes-background";
        break;
      case "#Projects":
        referenceDivSelector = ".projects-background";
        break;
      // Add more cases as needed
      default:
        return; // If no hash or an unrecognized hash, don't change the height
    }

    var referenceDiv = document.querySelector(referenceDivSelector);
    var nodeBackground = document.getElementById("node-background");

    if (referenceDiv && nodeBackground) {
      var height = referenceDiv.offsetHeight; // Get the height of the reference div
      nodeBackground.style.height = height + "px"; // Set the height of node-background
    }
  }
}

// Call the function on page load, resize, and hash change
window.addEventListener("DOMContentLoaded", adjustHeight);
window.addEventListener("resize", adjustHeight);
window.addEventListener("hashchange", adjustHeight);

document.addEventListener("DOMContentLoaded", function () {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // Prevent scrolling on the body for mobile devices
    document.body.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );

    // Allow scrolling on .right element
    var rightDiv = document.querySelector(".right");
    if (rightDiv) {
      rightDiv.addEventListener(
        "touchmove",
        function (e) {
          e.stopPropagation(); // Prevents preventing default behavior
        },
        { passive: false }
      );
    }
  }
});
