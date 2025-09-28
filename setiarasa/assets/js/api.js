/* =========================================================
📡 api.js — Modul API untuk Campuss Caffe
========================================================= */

// URL sumber data
export const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Fungsi ambil data menu
export async function getMenu(searchQuery = "") {
  try {
    const res = await fetch(API_URL + searchQuery);
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error("❌ Gagal mengambil data:", err);
    return [];
  }
}
