import{S as b,i,a as f}from"./assets/vendor-89feecc5.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerpolicy&&(a.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?a.credentials="include":t.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();const h="41734083-bc7e7acddd543bb8e35e20b9d",L=document.getElementById("search-form"),v=document.getElementById("search-input"),c=document.getElementById("gallery"),l=document.getElementById("loader"),d=document.getElementById("load-more-btn"),E=new b(".gallery a",{captionsData:"alt",captionDelay:250});let g=1,p="",m=0,u=0;L.addEventListener("submit",async n=>{n.preventDefault();const o=v.value.trim();if(!o){i.error({title:"Error",message:"Please enter a search query.",position:"topRight"});return}g=1,p=o,l.textContent="Loading images, please wait...",l.style.display="block";try{const r=(await f.get("https://pixabay.com/api/",{params:{key:h,q:p,image_type:"photo",orientation:"horizontal",safesearch:!0,page:g,per_page:40}})).data;if(r.hits&&r.hits.length>0){m=r.totalHits;const t=r.hits.map(s=>({url:s.webformatURL,alt:s.tags,largeUrl:s.largeImageURL,likes:s.likes,views:s.views,comments:s.comments,downloads:s.downloads})),a=k(t[0]);c.appendChild(a),u=a.getBoundingClientRect().height,w(t)}else i.info({title:"Info",message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"})}catch(e){console.error("Error fetching data:",e),i.error({title:"Error",message:"An error occurred while fetching data. Please try again later.",position:"topRight"})}finally{l.textContent="",l.style.display="none",y()}});d.addEventListener("click",async()=>{l.textContent="Loading more images, please wait...",l.style.display="block";try{const o=(await f.get("https://pixabay.com/api/",{params:{key:h,q:p,image_type:"photo",orientation:"horizontal",safesearch:!0,page:g,per_page:40}})).data;if(o.hits&&o.hits.length>0){m=o.totalHits;const e=o.hits.map(r=>({url:r.webformatURL,alt:r.tags,largeUrl:r.largeImageURL,likes:r.likes,views:r.views,comments:r.comments,downloads:r.downloads}));w(e)}else i.info({title:"Info",message:"No more images to load.",position:"topRight"})}catch(n){console.error("Error fetching data:",n),i.error({title:"Error",message:"An error occurred while fetching data. Please try again later.",position:"topRight"})}finally{l.textContent="",l.style.display="none",window.scrollBy({top:u*2,behavior:"smooth"}),y()}});window.scrollBy({top:u*2,behavior:"smooth"});function w(n){const o=n.map(e=>`
        <a href="${e.largeUrl}" data-lightbox="gallery" data-title="Likes: ${e.likes}, Views: ${e.views}, Comments: ${e.comments}, Downloads: ${e.downloads}">
          <img src="${e.url}" alt="${e.alt}" />
        </a>
      `).join("");c.innerHTML+=o,E.refresh(),y()}function y(){m>c.children.length?d.style.display="block":(d.style.display="none",c.children.length>0&&i.info({title:"Info",message:"We're sorry, but you've reached the end of search results.",position:"topRight"}))}function k(n){const o=document.createElement("div");o.classList.add("gallery-card");const e=document.createElement("img");return e.src=n.url,e.alt=n.alt,o.appendChild(e),o}
//# sourceMappingURL=commonHelpers.js.map
