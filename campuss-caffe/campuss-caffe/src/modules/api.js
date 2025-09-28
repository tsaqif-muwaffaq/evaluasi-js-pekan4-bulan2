// api.js — fetch coffee menu from public API (sampleapis.com)
const BASE = 'https://api.sampleapis.com/coffee';

// Deskripsi kopi dalam Bahasa Indonesia
const indonesianDescriptions = {
  'Black': 'Kopi hitam klasik yang diseduh dari biji kopi pilihan, disajikan hangat untuk memulai hari Anda.',
  'Latte': 'Minuman kopi paling populer, perpaduan shot espresso dan susu steam dengan sedikit busa lembut di atasnya.',
  'Cappuccino': 'Kombinasi seimbang antara espresso, susu steam, dan busa susu tebal. Sempurna untuk dinikmati kapan saja.',
  'Americano': 'Satu shot espresso yang diencerkan dengan air panas, menghasilkan kopi hitam dengan rasa yang lebih ringan.',
  'Espresso': 'Ekstrak kopi murni dengan rasa intens dan pekat. Fondasi dari semua minuman kopi spesial kami.',
  'Doppio': 'Dua shot espresso untuk Anda yang membutuhkan dorongan energi ekstra dan cita rasa kopi yang lebih kuat.',
  'Cortado': 'Perpaduan espresso dengan susu steam dalam rasio yang sama, menciptakan harmoni rasa yang lembut dan kuat.',
  'Red Eye': 'Kopi hitam yang diperkuat dengan tambahan satu shot espresso. Pilihan tepat untuk tetap fokus dan produktif.',
  'Galão': 'Kopi khas Portugis dengan rasio espresso dan busa susu yang lebih banyak, mirip latte namun lebih ringan.',
  'Lungo': 'Espresso yang diekstraksi lebih lama, menghasilkan rasa yang lebih kaya namun tidak terlalu pahit.',
  'Macchiato': 'Satu shot espresso dengan sedikit noda busa susu di atasnya, menonjolkan rasa asli dari kopi.',
  'Mocha': 'Perpaduan manis antara espresso, susu steam, dan saus cokelat, diakhiri dengan whipped cream lembut.',
  'Ristretto': 'Espresso dengan ekstraksi singkat, menghasilkan rasa yang lebih manis, pekat, dan tidak terlalu pahit.',
  'Flat White': 'Espresso yang dipadukan dengan susu steam bertekstur microfoam, menciptakan rasa kopi yang kuat dan lembut.',
  'Affogato': 'Satu scoop es krim vanila yang "ditenggelamkan" dalam satu shot espresso panas. Dessert kopi yang sempurna.',
  'Café au Lait': 'Kopi hitam yang dicampur dengan susu panas, minuman klasik dari Prancis yang nyaman dan nikmat.',
  'Irish': 'Kopi hitam yang dipadukan dengan sirup Irish cream dan whipped cream, memberikan sensasi hangat dan mewah.',
  'Iced Proffee': 'Kombinasi kopi dingin dan protein shake, minuman sehat untuk menemani aktivitas Anda.',
  'Iced Coffee': 'Kopi hitam klasik yang disajikan dingin dengan es, menyegarkan untuk hari yang panas.',
  'Iced Espresso': 'Shot espresso yang disajikan dingin dengan es, memberikan sensasi kopi kuat yang menyegarkan.',
  'Iced Latte': 'Perpaduan shot espresso dan susu dingin yang disajikan dengan es batu, pilihan favorit yang lembut dan menyegarkan.',
  'Iced Cappuccino': 'Kombinasi espresso dan susu dingin dengan lapisan busa susu tebal di atasnya, disajikan dingin untuk sensasi berbeda.',
  'Iced Macchiato': 'Espresso yang disajikan dingin dengan sedikit noda susu, menonjolkan rasa kopi yang kuat dengan sentuhan lembut.'
};

export async function fetchCoffees(type = 'hot') {
  // type: hot | iced
  const url = `${BASE}/${type}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data: ' + res.status);
    const data = await res.json();
    // normalize: ensure each item has an id
    // and add a mock price since the API doesn't provide one
    return data.map((item, idx) => ({
      id: item.id ?? idx + Math.floor(Math.random()*100000),
      price: 15000 + Math.floor(Math.random() * 4) * 2000, // e.g., 15000, 17000, 19000, 21000
      ...item,
      description: indonesianDescriptions[item.title] || item.description
    }));
  } catch (err) {
    // rethrow so UI can handle
    throw err;
  }
}

export async function getCoffeeById(type='hot', id) {
  const list = await fetchCoffees(type);
  return list.find(x => String(x.id) === String(id));
}
