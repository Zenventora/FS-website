(() => {
  "use strict";

  const SITE = "https://fancycorner.in";
  const ORG_ID = SITE + "/#organization";
  const STORE_ID = SITE + "/#store";

  const absoluteImage = (value) => {
    const raw = String(value || "").replace(/^\\.\\//, SITE + "/");
    if (!raw) return "";
    if (/\\.(heic|heif)$/i.test(raw)) {
      return "https://wsrv.nl/?url=" + encodeURIComponent(raw) + "&output=webp&q=90&fit=cover&w=1600&h=1600";
    }
    return raw;
  };

  const productUrl = (id) => SITE + "/?product=" + encodeURIComponent(id);

  const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();

  const buildProduct = (p) => {
    const images = (p.images || []).map(absoluteImage).filter(Boolean);
    const node = {
      "@type": "Product",
      "@id": productUrl(p.id) + "#product",
      "name": clean(p.name),
      "description": clean(p.description),
      "category": [clean(p.category), clean(p.subcategory)].filter(Boolean).join(" > "),
      "sku": clean(p.id),
      "brand": {
        "@type": "Brand",
        "name": "Fancy Corner Online"
      },
      "manufacturer": {
        "@id": ORG_ID
      },
      "image": images,
      "url": productUrl(p.id),
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Product type",
          "value": clean(p.type)
        }
      ]
    };

    if (p.followerPrice != null && p.followerPrice !== "") {
      node.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Followers price",
        "value": "₹" + Number(p.followerPrice).toLocaleString("en-IN")
      });
    }

    if (p.shipping) {
      node.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Shipping",
        "value": clean(p.shipping)
      });
    }

    if (p.regularPrice != null && p.regularPrice !== "") {
      node.offers = {
        "@type": "Offer",
        "url": productUrl(p.id),
        "priceCurrency": "INR",
        "price": Number(p.regularPrice),
        "seller": {
          "@id": ORG_ID
        }
      };
    }

    return node;
  };

  const ensureMeta = (nameOrProperty, value, isProperty = false) => {
    if (!value) return;
    const selector = isProperty
      ? 'meta[property="' + nameOrProperty + '"]'
      : 'meta[name="' + nameOrProperty + '"]';
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (isProperty) el.setAttribute("property", nameOrProperty);
      else el.setAttribute("name", nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  };

  const setMetadata = (product) => {
    if (!product) {
      document.title = "Fancy Corner Online | Miniatures, RC Cars & Collectibles";
      ensureMeta("description", "Browse Fancy Corner Online's product catalogue in Coimbatore. Explore miniatures, RC cars, bikes and vintage collectibles using real product images, clear product details and direct WhatsApp enquiries.");
      ensureMeta("og:title", "Fancy Corner Online | Product Catalogue", true);
      ensureMeta("og:description", "Browse miniatures, RC cars, model bikes and vintage collectibles from Fancy Corner Online, Coimbatore.", true);
      ensureMeta("og:url", SITE + "/", true);
      const canonical = document.head.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", SITE + "/");
      return;
    }

    const title = clean(product.name) + " | Fancy Corner Online";
    const description = clean(product.description) + " Browse product photos, category details, pricing information and enquiry options from Fancy Corner Online, Coimbatore.";
    document.title = title;
    ensureMeta("description", description);
    ensureMeta("og:title", title, true);
    ensureMeta("og:description", description, true);
    ensureMeta("og:url", productUrl(product.id), true);

    const firstImage = absoluteImage((product.images || [])[0]);
    if (firstImage) {
      ensureMeta("og:image", firstImage, true);
      ensureMeta("twitter:image", firstImage);
    }

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", productUrl(product.id));
  };

  const writeSchema = (products) => {
    const active = products.filter((p) => p && p.active !== false);

    const graph = [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        "name": "Fancy Corner Online",
        "url": SITE + "/",
        "logo": SITE + "/images/logo.jpeg",
        "email": "fancycorneronline@gmail.com",
        "telephone": "+91 79046 39830",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No.12, Bilal Estate, South Ukkadam",
          "addressLocality": "Coimbatore",
          "postalCode": "641001",
          "addressRegion": "Tamil Nadu",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.instagram.com/fancycorneronline/",
          "https://www.youtube.com/@FancyCornerOnline",
          "https://www.facebook.com/profile.php?id=61596729560426",
          "https://www.threads.com/@fancycorneronline",
          "https://x.com/fancycorner_"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": STORE_ID,
        "name": "Fancy Corner Online",
        "url": SITE + "/",
        "image": SITE + "/images/logo.jpeg",
        "telephone": "+91 79046 39830",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No.12, Bilal Estate, South Ukkadam",
          "addressLocality": "Coimbatore",
          "postalCode": "641001",
          "addressRegion": "Tamil Nadu",
          "addressCountry": "IN"
        },
        "parentOrganization": {
          "@id": ORG_ID
        }
      },
      {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "name": "Fancy Corner Online",
        "url": SITE + "/",
        "publisher": {
          "@id": ORG_ID
        }
      },
      {
        "@type": "CollectionPage",
        "@id": SITE + "/#webpage",
        "url": SITE + "/",
        "name": "Fancy Corner Online Product Catalogue",
        "description": "Product catalogue for miniatures, RC cars, collectible bikes and vintage cars in Coimbatore.",
        "isPartOf": {
          "@id": SITE + "/#website"
        },
        "about": {
          "@id": STORE_ID
        },
        "mainEntity": {
          "@id": SITE + "/#product-list"
        }
      },
      {
        "@type": "ItemList",
        "@id": SITE + "/#product-list",
        "name": "Fancy Corner Online Product Catalogue",
        "numberOfItems": active.length,
        "itemListElement": active.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": productUrl(p.id),
          "item": {
            "@id": productUrl(p.id) + "#product"
          }
        }))
      },
      ...active.map(buildProduct)
    ];

    let script = document.getElementById("fc-dynamic-catalog-schema");
    if (!script) {
      script = document.createElement("script");
      script.id = "fc-dynamic-catalog-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph
    });
  };

  const run = async () => {
    try {
      const response = await fetch("./products.json", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products : [];
      writeSchema(products);

      const id = new URLSearchParams(location.search).get("product");
      const selected = products.find((p) => p && p.id === id && p.active !== false);
      setMetadata(selected || null);
    } catch (_) {
      // Never affect the catalogue UI if SEO metadata cannot be generated.
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();