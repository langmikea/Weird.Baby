// src/data/wb_merch.js
// Weird.Baby's own merch — the museum's store.
// This is the W.B. section of the gift shop (middle slot, between Featured
// and Friends). Items here are actually fulfilled by us (via Big Cartel +
// Printful, planned — not set up yet).
//
// Until the pipeline is live, this file renders as a "coming soon" state in
// the gift shop. The room still works; the middle slot just says so.

export const wbMerch = {
  storeName: "Weird.Baby",
  storeUrl: "https://shop.weird.baby/", // PLANNED — not live yet
  storePlatform: "Big Cartel + Printful",
  live: false, // flip to true when the storefront actually exists
  featured: [
    // Shape when populated:
    // {
    //   title: "Weird.Baby Logo Tee",
    //   price: "$25",
    //   img: "/images/wb-merch/logo-tee.jpg",
    //   url: "https://shop.weird.baby/product/logo-tee",
    // },
  ],
};
