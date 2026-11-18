const WA="917904639830";
let catalog=[],activeCategory="All",activeSubcategory="All",q="";
let selection=JSON.parse(localStorage.getItem("fc-selection")||"[]");
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const imageSrc=path=>{
  const p=String(path||"");
  if(!/\.heic$/i.test(p)) return p;
  const absolute="https://fancycorner.in/"+p.replace(/^\.\//,"");
  return "https://wsrv.nl/?url="+encodeURIComponent(absolute)+"&output=webp&q=90&fit=contain&w=1400&h=1400";
};
const toast=t=>{const e=$("#toast");if(!e)return;e.textContent=t;e.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>e.classList.remove("show"),1800)};
const get=id=>catalog.find(p=>p.id===id);
const url=p=>"https://fancycorner.in/?product="+encodeURIComponent(p.id)+"#product-"+encodeURIComponent(p.id);
const wa=t=>"https://wa.me/"+WA+"?text="+encodeURIComponent(t);
const priceMarkup=p=>{if(p.regularPrice==null)return '<div class="price-unconfirmed"><strong>Price to be confirmed</strong><small>Contact us for current price</small></div>';return '<div class="price-main"><b>₹'+p.regularPrice+'</b><small>'+esc(p.shipping||"")+'</small></div>'+(p.followerPrice!=null?'<div class="follower-price"><span>Followers Price</span><strong>₹'+p.followerPrice+'</strong><em>Offer</em></div>':'')};
const shareIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8.5a3 3 0 1 0-2.8-4.1L8.7 8a3 3 0 0 0 0 8l6.5 3.6A3 3 0 1 0 16 17.1l-6.3-3.5a3.1 3.1 0 0 0 0-1.2L16 8.9A3 3 0 0 0 18 8.5z"/></svg>';
function filters(){
const groups=["All","Miniatures","RC Cars"];
const icons={All:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.1 6.1L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-1.9L12 2z"/></svg>',Miniatures:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16.5 7 9h10l2 7.5M7 9l1.5-3h7L17 9M4 17h16M8 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm11 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',"RC Cars":'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10h14l1.5 4v4H3v-4L4.5 10 7 6h10l2.5 4M7 14h10M7 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm13 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>'};
const subs=activeCategory==="Miniatures"?["All","Vintage Cars","Super Bikes","Bikes","Cycles","RC Cars"]:activeCategory==="RC Cars"?["All","Racing Drift Car"]:[];
$("#filters").innerHTML='<div class="filter-row">'+groups.map(x=>'<button class="filter '+(x===activeCategory?"active":"")+'" data-c="'+esc(x)+'"><span class="filter-icon">'+(icons[x]||"•")+'</span>'+esc(x)+'</button>').join("")+'</div>'+(subs.length?'<div class="filter-row sub">'+subs.map(x=>'<button class="filter '+(x===activeSubcategory?"active":"")+'" data-s="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>':'');
document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.c;activeSubcategory="All";filters();render()});
document.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{activeSubcategory=b.dataset.s;filters();render()})
}
function render(){const list=catalog.filter(p=>p.active!==false&&(activeCategory==="All"||p.category===activeCategory)&&(activeSubcategory==="All"||p.subcategory===activeSubcategory)&&((p.name+" "+p.category+" "+p.subcategory).toLowerCase().includes(q)));$("#products").innerHTML=list.length?list.map(p=>'<article class="product-card" id="product-'+esc(p.id)+'"><button class="product-image" type="button" data-view="'+p.id+'" aria-label="View '+esc(p.name)+' photos"><img src="'+esc(imageSrc(p.images[0]))+'" alt="'+esc(p.name)+'" loading="lazy"><span class="tag">'+esc(p.badge)+'</span><span class="image-count">'+p.images.length+' photos</span></button><div class="product-info"><div class="product-cat">'+esc(p.category)+' · '+esc(p.subcategory)+'</div><button class="product-name" type="button" data-view="'+p.id+'">'+esc(p.name)+'</button>'+priceMarkup(p)+'<div class="product-actions"><button class="buy-now" data-buy="'+p.id+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h-2v2h1l2.2 9.1a2 2 0 0 0 1.9 1.5h7.8v-2H10.5l-.4-1.6h7.2a2 2 0 0 0 1.9-1.5L21 7H8.1L7.6 4H7zm4 16a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>Buy Now</button><button class="add" data-add="'+p.id+'" aria-label="Add to cart">＋</button><button class="share" data-share="'+p.id+'" aria-label="Share product">'+shareIcon()+'</button></div></div></article>').join("")+'<div class="catalog-note">Each product uses its own verified folder gallery. Combo products show six unique images; individual products retain all unique product-angle images.</div>':'<div class="empty">No products match this search or category.</div>';document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{if(!selection.includes(b.dataset.add))selection.push(b.dataset.add);save();toast("Added to cart")});document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buy(b.dataset.buy));document.querySelectorAll("[data-share]").forEach(b=>b.onclick=()=>share(b.dataset.share));document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openGallery(b.dataset.view))}
function save(){localStorage.setItem("fc-selection",JSON.stringify(selection));cart()}
function buy(id){const p=get(id);if(!p)return;const text="Hi Fancy Corner Online! 👋\n\nI'm interested in:\n• "+p.name+"\n"+url(p)+"\n\nPlease confirm availability, price and shipping.";window.open(wa(text),"_blank","noopener")}
async function share(id){const p=get(id);if(!p)return;const u=url(p);try{if(navigator.share){await navigator.share({title:p.name,text:"Check this product from Fancy Corner Online.",url:u});return}window.open(wa(p.name+" — Fancy Corner Online\n"+u),"_blank","noopener")}catch(e){}}
function cart(){const rows=selection.map(get).filter(Boolean);$("#cartCount").textContent=rows.length;const navCount=$("#cartCountNav");if(navCount)navCount.textContent=rows.length;$("#bagCount").textContent="("+rows.length+")";$("#cartBody").innerHTML=rows.length?rows.map(p=>'<div class="cart-item"><img src="'+esc(imageSrc(p.images[0]))+'" alt="'+esc(p.name)+'"><div><strong>'+esc(p.name)+'</strong><small>'+esc(p.category)+' · '+esc(p.subcategory)+'</small><button class="remove" data-r="'+p.id+'">Remove</button></div></div>').join(""):'<div style="padding:60px 10px;text-align:center;color:#777;font-size:12px">No products selected yet.<br>Use Add to Cart on any product.</div>';document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{selection=selection.filter(x=>x!==b.dataset.r);save()})}
function checkout(){const rows=selection.map(get).filter(Boolean);if(!rows.length)return toast("No products selected");const lines=rows.map(p=>"• "+p.name+"\n  "+url(p)).join("\n");window.open(wa("Hi Fancy Corner Online! 👋\n\nI'm interested in these products:\n"+lines+"\n\nPlease confirm availability, price and shipping."),"_blank","noopener")}
let galleryProduct=null,galleryIndex=0;
function openGallery(id,start=0){
 const p=get(id);if(!p)return;
 galleryProduct=p;galleryIndex=Math.max(0,Math.min(start,p.images.length-1));
 const m=$("#productModal");if(!m)return;
 m.classList.add("open");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 renderGallery();
 history.replaceState(null,"",url(p));
 requestAnimationFrame(()=>$("#galleryImage")?.focus?.());
}
function closeGallery(){
 const m=$("#productModal");if(!m)return;
 m.classList.remove("open");m.setAttribute("aria-hidden","true");document.body.style.overflow="";
 galleryProduct=null;galleryIndex=0;
 history.replaceState(null,"",location.pathname);
}
function renderGallery(){
 const p=galleryProduct;if(!p)return;
 const img=$("#galleryImage");img.src=imageSrc(p.images[galleryIndex]);img.alt=p.name;
 $("#galleryName").textContent=p.name;$("#galleryCategory").textContent=p.category+" · "+p.subcategory;
 $("#galleryPrice").innerHTML=priceMarkup(p);$("#galleryCounter").textContent=(galleryIndex+1)+" / "+p.images.length;
 $("#galleryDots").innerHTML=p.images.map((src,i)=>'<button class="gallery-dot '+(i===galleryIndex?"active":"")+'" data-gallery-index="'+i+'" style="background-image:url(\''+esc(imageSrc(src))+'\')" aria-label="Photo '+(i+1)+'"></button>').join("");
 document.querySelectorAll("[data-gallery-index]").forEach(b=>b.onclick=()=>{galleryIndex=Number(b.dataset.galleryIndex);renderGallery()});
 $("#galleryBuy").onclick=()=>buy(p.id);
 $("#galleryAdd").onclick=()=>{if(!selection.includes(p.id))selection.push(p.id);save();toast("Added to cart")};
}
function galleryStep(delta){if(!galleryProduct)return;galleryIndex=(galleryIndex+delta+galleryProduct.images.length)%galleryProduct.images.length;renderGallery()}
function bindGallery(){
 const m=$("#productModal");if(!m)return;
 const panel=m.querySelector(".product-modal-panel");
 const media=m.querySelector(".product-modal-media");
 let swipeStartX=0,swipeStartY=0,swiping=false;

 const close=()=>{
   if(!m.classList.contains("open"))return;
   closeGallery();
 };

 // Single delegated close handler: close button + backdrop are both reliable.
 m.addEventListener("click",e=>{
   const closeTarget=e.target.closest("[data-modal-close]");
   if(closeTarget){
     e.preventDefault();
     e.stopPropagation();
     close();
     return;
   }
   if(e.target===m||e.target===m.querySelector(".product-modal-backdrop")){
     e.preventDefault();
     close();
   }
 });

 // Prevent clicks inside the dialog from being treated as outside clicks.
 if(panel)panel.addEventListener("click",e=>e.stopPropagation());

 const prev=$("#galleryPrev"),next=$("#galleryNext");
 if(prev)prev.addEventListener("click",e=>{
   e.preventDefault();e.stopPropagation();galleryStep(-1);
 });
 if(next)next.addEventListener("click",e=>{
   e.preventDefault();e.stopPropagation();galleryStep(1);
 });

 const startSwipe=e=>{
   if(!galleryProduct)return;
   const p=e.touches?.[0]||e;
   swipeStartX=p.clientX;
   swipeStartY=p.clientY;
   swiping=true;
 };
 const endSwipe=e=>{
   if(!swiping||!galleryProduct)return;
   swiping=false;
   const p=e.changedTouches?.[0]||e;
   const dx=p.clientX-swipeStartX;
   const dy=p.clientY-swipeStartY;
   if(Math.abs(dx)>=45&&Math.abs(dx)>Math.abs(dy)){
     galleryStep(dx<0?1:-1);
   }
 };

 if(media){
   media.addEventListener("touchstart",startSwipe,{passive:true});
   media.addEventListener("touchend",endSwipe,{passive:true});
 }

 // Keyboard handling while the gallery is open.
 document.addEventListener("keydown",e=>{
   if(!m.classList.contains("open"))return;
   if(e.key==="Escape"){
     e.preventDefault();
     close();
   }else if(e.key==="ArrowLeft"){
     e.preventDefault();
     galleryStep(-1);
   }else if(e.key==="ArrowRight"){
     e.preventDefault();
     galleryStep(1);
   }
 });

 // Browser back should close the open gallery cleanly.
 window.addEventListener("popstate",()=>{
   if(m.classList.contains("open"))closeGallery();
 });
}

function init(){fetch("./products.json",{cache:"no-store"}).then(r=>r.json()).then(d=>{catalog=(d.products||[]).map(p=>({...p,images:[...new Set(p.images||[])]}));filters();render();cart();$("#year").textContent=new Date().getFullYear();$("#search").oninput=e=>{q=e.target.value.toLowerCase().trim();render()};const openCart=()=>$("#drawer").classList.add("open");$("#cartBtn").onclick=openCart;const cartNav=$("#cartNav");if(cartNav)cartNav.onclick=e=>{e.preventDefault();openCart()};$("#close").onclick=()=>$("#drawer").classList.remove("open");$("#overlay").onclick=()=>$("#drawer").classList.remove("open");$("#checkout").onclick=checkout;const params=new URLSearchParams(location.search),id=params.get("product"),cat=params.get("category");if(cat){activeCategory=catalog.some(p=>p.category===cat)?cat:"All";activeSubcategory="All";filters();render()}bindGallery();if(id){const p=get(id);if(p){activeCategory=p.category;activeSubcategory=p.subcategory;filters();render();setTimeout(()=>openGallery(id),80)}}})}
init();
