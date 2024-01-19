import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const apiKey = "41734083-bc7e7acddd543bb8e35e20b9d";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const galleryContainer = document.getElementById("gallery");
const loader = document.getElementById("loader");
const loadMoreBtn = document.getElementById("load-more-btn");
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1; // Initial page value
let currentQuery = ""; // Store the current user input
let totalHits = 0;
let cardHeight = 0; // Variable to store the height of one gallery card

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Очистіть вміст галереї при новому пошуковому запиті
  galleryContainer.innerHTML = "";

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.error({
      title: "Error",
      message: "Please enter a search query.",
      position: "topRight",
    });
    return;
  }

  // Reset current page number on a new search
  currentPage = 1;

  // Store the current user input
  currentQuery = query;

  // Show loader with a message
loader.style.display = "block";
loader.textContent = "Loading images, please wait...";

try {
    const response = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: apiKey,
      q: currentQuery,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: currentPage,
      per_page: 40,
    },
  });

  const data = response.data;

  if (data.hits && data.hits.length > 0) {
    totalHits = data.totalHits; // Update totalHits
    const images = data.hits.map((hit) => ({
      url: hit.webformatURL,
      alt: hit.tags,
      largeUrl: hit.largeImageURL,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    // Вимкніть кнопку "Load more" при новому пошуковому запиті
    loadMoreBtn.style.display = "none";

    // Get the height of one gallery card
    const firstCard = createGalleryCard(images[0]);
    galleryContainer.appendChild(firstCard);
    cardHeight = firstCard.getBoundingClientRect().height;

    updateGallery(images);
  } else {
    iziToast.info({
      title: "Info",
      message: "Sorry, there are no images matching your search query. Please try again!",
      position: "topRight",
    });
  }
} catch (error) {
  console.error("Error fetching data:", error);
  iziToast.error({
    title: "Error",
    message: "An error occurred while fetching data. Please try again later.",
    position: "topRight",
  });
} finally {
  // Hide the loader once the images are loaded or an error occurs
  loader.textContent = ""; // Clear loader text
  loader.style.display = "none";

  // Show/hide the "Load more" button based on totalHits and current gallery items
  toggleLoadMoreButton();
}
});

loadMoreBtn.addEventListener("click", async () => {
  // Show loader with a message for "Load more" button click
  loader.textContent = "Loading more images, please wait...";
  loader.style.display = "block";

  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: apiKey,
        q: currentQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    const data = response.data;

    if (data.hits && data.hits.length > 0) {
      totalHits = data.totalHits; // Update totalHits
      const images = data.hits.map((hit) => ({
        url: hit.webformatURL,
        alt: hit.tags,
        largeUrl: hit.largeImageURL,
        likes: hit.likes,
        views: hit.views,
        comments: hit.comments,
        downloads: hit.downloads,
      }));

      updateGallery(images);
    } else {
      iziToast.info({
        title: "Info",
        message: "No more images to load.",
        position: "topRight",
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    iziToast.error({
      title: "Error",
      message: "An error occurred while fetching data. Please try again later.",
      position: "topRight",
    });
  } finally {
    loader.textContent = ""; // Set loader text to an empty string
    loader.style.display = "none"; // Hide the loader once the images are loaded

    
    // Smoothly scroll to the next set of images
    window.scrollBy({
      top: cardHeight * 2, // Scroll by twice the height of one card
      behavior: 'smooth',
    });

    // Show/hide the "Load more" button based on totalHits and current gallery items
    toggleLoadMoreButton();
  }
});

   function scrollToNextSetOfImages() {
  // Smoothly scroll to the next set of images
  window.scrollBy({
    top: cardHeight * 2, // Scroll by twice the height of one card
    behavior: 'smooth',
  });
}


function updateGallery(images) {
  // Append new images to the gallery
  const galleryMarkup = images
    .map(
      (image) => `
        <a href="${image.largeUrl}" data-lightbox="gallery" data-title="Likes: ${image.likes}, Views: ${image.views}, Comments: ${image.comments}, Downloads: ${image.downloads}">
          <img src="${image.url}" alt="${image.alt}" />
        </a>
      `
    )
    .join('');

  // Use insertAdjacentHTML to append new content without destroying existing elements
  galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

  // Refresh the lightbox after updating the gallery
  lightbox.refresh();

  // Show/hide the "Load more" button based on totalHits and current gallery items
  toggleLoadMoreButton();
}

function toggleLoadMoreButton() {
  // Show/hide the "Load more" button based on totalHits and current gallery items
  if (totalHits > galleryContainer.children.length) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";

    // Display a message when the user reaches the end of search results
if (galleryContainer.children.length > 0 && currentPage > 1 && totalHits === galleryContainer.children.length) {
  iziToast.info({
    title: "Info",
    message: "We're sorry, but you've reached the end of search results.",
    position: "topRight",
  });
}
  }
}

// Function to create a gallery card element
function createGalleryCard(image) {
  const card = document.createElement("div");
  card.classList.add("gallery-card");

  const img = document.createElement("img");
  img.src = image.url;
  img.alt = image.alt;

  card.appendChild(img);
  return card;
}