const WA="917904639830";
let catalog=[],activeCategory="All",activeSubcategory="All",q="";
let selection=JSON.parse(localStorage.getItem("fc-selection")||"[]");
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const imageSrc=path=>{
  const p=String(path||"");
  if(!/\.heic$/i.test(p)) return p;
  const absolute="https://fancycorner.in/"+p.replace(/^\.\//,"");
  return "https://wsrv.nl/?url="+encodeURIComponent(absolute)+"&output=webp&q=90&fit=cover&w=1400&h=1400";
};
const toast=t=>{const e=$("#toast");if(!e)return;e.textContent=t;e.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>e.classList.remove("show"),1800)};
const get=id=>catalog.find(p=>p.id===id);
const url=p=>"https://fancycorner.in/?product="+encodeURIComponent(p.id)+"#product-"+encodeURIComponent(p.id);
const wa=t=>"https://wa.me/"+WA+"?text="+encodeURIComponent(t);
const priceMarkup=p=>{if(p.regularPrice==null)return '<div class="price-unconfirmed"><strong>Price to be confirmed</strong><small>Contact us for current price</small></div>';const shippingText="+ shipping charges";return '<div class="price-main"><b>₹'+p.regularPrice+'</b><small>'+shippingText+'</small></div>'+(p.followerPrice!=null?'<div class="follower-price"><span>Followers Price</span><strong>₹'+p.followerPrice+'</strong><em>Offer</em></div>':'')};
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

function destroyGallerySliders(){
  const jq=window.jQuery;
  if(!jq)return;
  const main=jq("#gallerySlider");
  const thumbs=jq("#galleryDots");
  if(main.length && main.hasClass("slick-initialized")) main.slick("unslick");
  if(thumbs.length && thumbs.hasClass("slick-initialized")) thumbs.slick("unslick");
}

function openGallery(id,start=0){
  const p=get(id);
  const modal=$("#productModal");
  if(!p||!modal)return;

  galleryProduct=p;
  galleryIndex=Math.max(0,Math.min(start,p.images.length-1));
  modal.dataset.productId=p.id;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";

  renderGallery();
  history.replaceState(null,"",url(p));

  requestAnimationFrame(()=>{
    const main=window.jQuery ? window.jQuery("#gallerySlider") : null;
    const thumbs=window.jQuery ? window.jQuery("#galleryDots") : null;
    if(main && main.hasClass("slick-initialized")) main.slick("setPosition");
    if(thumbs && thumbs.hasClass("slick-initialized")) thumbs.slick("setPosition");
    const close=modal.querySelector(".product-modal-close");
    if(close)close.focus({preventScroll:true});
  });
}

function closeGallery(){
  const modal=$("#productModal");
  if(!modal)return;

  destroyGallerySliders();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  modal.removeAttribute("data-product-id");
  document.body.style.overflow="";
  galleryProduct=null;
  galleryIndex=0;

  // Reset the modal stage and return to the normal catalogue URL/view.
  history.replaceState(null,"",location.pathname);
}

function renderGallery(){
  const p=galleryProduct;
  if(!p)return;

  const main=$("#gallerySlider");
  const thumbs=$("#galleryDots");
  if(!main||!thumbs)return;

  destroyGallerySliders();

  main.innerHTML=p.images.map((src,i)=>{
    const image=imageSrc(src);
    return '<div class="gallery-slide" data-gallery-slide="'+i+'">'+
      '<img src="'+esc(image)+'" alt="'+esc(p.name)+' — photo '+(i+1)+'" draggable="false" loading="'+(i===galleryIndex?"eager":"lazy")+'">'+
    '</div>';
  }).join("");

  thumbs.innerHTML=p.images.map((src,i)=>{
    const image=imageSrc(src);
    return '<button type="button" class="gallery-dot '+(i===galleryIndex?"active":"")+'" data-gallery-index="'+i+'" aria-label="Photo '+(i+1)+'" style="background-image:url(\''+esc(image)+'\')"></button>';
  }).join("");

  $("#galleryName").textContent=p.name;
  $("#galleryCategory").textContent=p.category+" · "+p.subcategory;
  $("#galleryDescription").textContent=p.description||"";
  $("#galleryPrice").innerHTML=priceMarkup(p);
  $("#galleryCounter").textContent=(galleryIndex+1)+" / "+p.images.length;

  const jq=window.jQuery;
  if(!(jq&&jq.fn&&jq.fn.slick)){
    main.innerHTML='<div class="gallery-slide"><img src="'+esc(imageSrc(p.images[galleryIndex]))+'" alt="'+esc(p.name)+'"></div>';
    return;
  }

  const $main=jq(main);
  const $thumbs=jq(thumbs);

  $main.slick({
    slidesToShow:1,
    slidesToScroll:1,
    arrows:false,
    dots:false,
    infinite:p.images.length>1,
    autoplay:p.images.length>1,
    autoplaySpeed:3500,
    pauseOnHover:true,
    pauseOnFocus:false,
    speed:350,
    fade:false,
    swipe:true,
    draggable:true,
    touchMove:true,
    adaptiveHeight:false,
    accessibility:true
  });

  $thumbs.slick({
    slidesToShow:Math.min(6,p.images.length),
    slidesToScroll:1,
    arrows:false,
    dots:false,
    infinite:false,
    focusOnSelect:false,
    swipe:true,
    draggable:true,
    touchMove:true,
    variableWidth:true,
    responsive:[
      {breakpoint:760,settings:{slidesToShow:Math.min(5,p.images.length),variableWidth:true}},
      {breakpoint:520,settings:{slidesToShow:Math.min(4,p.images.length),variableWidth:true}}
    ]
  });

  const sync=(index)=>{
    galleryIndex=index;
    $("#galleryCounter").textContent=(index+1)+" / "+p.images.length;
    $thumbs.find(".gallery-dot").removeClass("active").eq(index).addClass("active");
    if($thumbs.hasClass("slick-initialized")){
      const visible=Math.max(1,Math.min(6,p.images.length));
      const target=Math.max(0,Math.min(index,Math.max(0,p.images.length-visible)));
      $thumbs.slick("slickGoTo",target,true);
    }
  };

  $main.on("afterChange.fcGallery",(e,slick,current)=>sync(current));

  $thumbs.on("click.fcGallery",".gallery-dot",function(e){
    e.preventDefault();
    e.stopPropagation();
    const index=Number(this.dataset.galleryIndex);
    if(Number.isInteger(index) && index>=0 && index<p.images.length){
      $main.slick("slickGoTo",index);
    }
  });

  $main.slick("slickGoTo",galleryIndex,true);
  sync(galleryIndex);

  requestAnimationFrame(()=>{
    if($main.hasClass("slick-initialized")) $main.slick("setPosition");
    if($thumbs.hasClass("slick-initialized")) $thumbs.slick("setPosition");
  });
}
function galleryStep(delta){
  if(!galleryProduct)return;
  const jq=window.jQuery;
  const main=$("#gallerySlider");

  if(jq&&jq.fn&&jq.fn.slick&&jq(main).hasClass("slick-initialized")){
    jq(main).slick(delta<0?"slickPrev":"slickNext");
    return;
  }

  galleryIndex=(galleryIndex+delta+galleryProduct.images.length)%galleryProduct.images.length;
  renderGallery();
}

function bindGallery(){
  const modal=$("#productModal");
  if(!modal)return;

  const panel=modal.querySelector(".product-modal-panel");
  const closeButton=modal.querySelector(".product-modal-close");
  const backdrop=modal.querySelector(".product-modal-backdrop");
  const prev=modal.querySelector("#galleryPrev");
  const next=modal.querySelector("#galleryNext");

  if(closeButton)closeButton.onclick=e=>{e.preventDefault();e.stopPropagation();closeGallery()};
  if(backdrop)backdrop.onclick=e=>{e.preventDefault();e.stopPropagation();closeGallery()};
  if(prev)prev.onclick=e=>{e.preventDefault();e.stopPropagation();galleryStep(-1)};
  if(next)next.onclick=e=>{e.preventDefault();e.stopPropagation();galleryStep(1)};

  if(panel)panel.onclick=e=>e.stopPropagation();

  modal.onclick=e=>{
    if(e.target===modal||e.target===backdrop)closeGallery();
  };

  document.addEventListener("keydown",e=>{
    if(!modal.classList.contains("open"))return;
    if(e.key==="Escape"){e.preventDefault();closeGallery()}
    else if(e.key==="ArrowLeft"){e.preventDefault();galleryStep(-1)}
    else if(e.key==="ArrowRight"){e.preventDefault();galleryStep(1)}
  });
}

function init(){fetch("./products.json",{cache:"no-store"}).then(r=>r.json()).then(d=>{catalog=(d.products||[]).map(p=>({...p,images:[...new Set(p.images||[])]}));filters();render();cart();$("#year").textContent=new Date().getFullYear();$("#search").oninput=e=>{q=e.target.value.toLowerCase().trim();render()};const drawer=$("#drawer");
const openCart=e=>{
  if(e){e.preventDefault();e.stopPropagation()}
  if(drawer){
    cart();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  }
};
const closeCart=()=>{
  if(drawer){
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }
};
const cartBtn=$("#cartBtn");
if(cartBtn)cartBtn.onclick=openCart;
const cartNav=$("#cartNav");
if(cartNav)cartNav.onclick=openCart;
const closeBtn=$("#close");
if(closeBtn)closeBtn.onclick=closeCart;
const overlay=$("#overlay");
if(overlay){
  overlay.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    closeCart();
  };
  overlay.onpointerdown=e=>{
    e.preventDefault();
    e.stopPropagation();
    closeCart();
  };
}
if(drawer){
  drawer.onclick=e=>{
    if(e.target===drawer || e.target===overlay){
      e.preventDefault();
      e.stopPropagation();
      closeCart();
    }
  };
}
$("#checkout").onclick=checkout;

const params=new URLSearchParams(location.search),id=params.get("product"),cat=params.get("category");
if(cat){activeCategory=catalog.some(p=>p.category===cat)?cat:"All";activeSubcategory="All";filters();render()}
bindGallery();
$("#galleryBuy").onclick=()=>{if(galleryProduct)buy(galleryProduct.id)};
$("#galleryAdd").onclick=()=>{
  if(!galleryProduct)return;
  if(!selection.includes(galleryProduct.id)){
    selection.push(galleryProduct.id);
    save();
  }else{
    cart();
  }
  toast("Added to cart");
};
if(id){const p=get(id);if(p){activeCategory=p.category;activeSubcategory=p.subcategory;filters();render();setTimeout(()=>openGallery(id),80)}}})}
init();