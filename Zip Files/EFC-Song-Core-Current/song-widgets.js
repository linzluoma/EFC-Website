/*
Electric Flower Co.
Song Widgets v2.1
*/
window.EFC=window.EFC||{};
(function(EFC){
function el(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;}
EFC.renderFeaturedSongs=function(containerId,options){
const s=Object.assign({limit:18,showArtists:true,emptyMessage:"No featured songs are currently listed."},options||{});
const container=document.getElementById(containerId);
if(!container)return false;
if(typeof EFC.getFeaturedSongs!=="function"){container.innerHTML="<p style='text-align:center;'>Song library not loaded.</p>";return false;}
const featured=EFC.getFeaturedSongs({limit:s.limit,sortBy:"title"});
const total=(window.EFC_SONGS||[]).length;
container.replaceChildren();
if(!featured.length){container.innerHTML="<p style='text-align:center;'>"+s.emptyMessage+"</p>";return true;}
const list=el("div","epk-song-list");
featured.forEach(function(song){
const card=el("div","epk-song");
card.appendChild(el("span","epk-title",song.title));
if(s.showArtists){card.appendChild(el("span","epk-artist",song.artist));}
list.appendChild(card);
});
container.appendChild(list);
container.appendChild(el("div","epk-summary","Featuring "+featured.length+" of our "+total+" songs"));
const wrap=el("div","epk-link");
const a=el("a",null,"View Complete Song List →");
a.href="/songs.html";
wrap.appendChild(a);
container.appendChild(wrap);
return true;
};
console.log("[EFC Song Widgets] song-widgets.js v2.1 loaded.");
})(window.EFC);
