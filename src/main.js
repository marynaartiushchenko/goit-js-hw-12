
      import SimpleLightbox from "simplelightbox";
      import "simplelightbox/dist/simple-lightbox.min.css";

      const apiKey = "41734083-bc7e7acddd543bb8e35e20b9d";
      const searchForm = document.getElementById("search-form");
      const searchInput = document.getElementById("search-input");
      const galleryContainer = document.getElementById("gallery");
      const loader = document.getElementById("loader");

 const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

      searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
          iziToast.error({
            title: "Error",
            message: "Please enter a search query.",
            position: "topRight",
          });
          return;
        }

        loader.style.display = "block";

        try {
          const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`);
          const data = await response.json();

          if (data.hits && data.hits.length > 0) {
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
          loader.style.display = "none";
        }
      });

     function updateGallery(images) {
        // Clear existing gallery content
         galleryContainer.innerHTML = "";

  const galleryMarkup = images
    .map(
      (image) => `
        <a href="${image.largeUrl}" data-lightbox="gallery" data-title="Likes: ${image.likes}, Views: ${image.views}, Comments: ${image.comments}, Downloads: ${image.downloads}">
          <img src="${image.url}" alt="${image.alt}" />
        </a>
      `
    )
    .join('');

  galleryContainer.innerHTML = galleryMarkup;

        // Refresh the lightbox after updating the gallery
  lightbox.refresh();
}