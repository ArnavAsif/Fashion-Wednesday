const fs = require('fs');
const path = require('path');

const PRODUCTS_META = [
  { id: 1, title: 'Error 404 Streetwear Zip Hoodie', price: 185, size: ['S', 'M', 'L', 'XL'], color: ['Washed Black'], bestseller: false },
  { id: 2, title: 'Distressed Mohair Shrug & Silver Chain Top', price: 145, size: ['S', 'M', 'L'], color: ['Charcoal Grey'], bestseller: false },
  { id: 3, title: 'BONEZ Signature Leather Lace-Up Corset', price: 265, size: ['S', 'M', 'L'], color: ['Onyx Black'], bestseller: true },
  { id: 4, title: 'Saturn Orb Pendant Silver Chain Necklace', price: 95, size: ['ONE SIZE'], color: ['Silver'], bestseller: false },
  { id: 5, title: 'Washed Distressed Denim Jacket & Gothic Cross', price: 295, size: ['S', 'M', 'L'], color: ['Acid Blue'], bestseller: false },
  { id: 6, title: 'White High-Neck Corset Bodysuit', price: 165, size: ['S', 'M', 'L'], color: ['Optic White'], bestseller: true },
  { id: 7, title: 'Faux Leather Structured Lace-Up Bustier', price: 245, size: ['S', 'M', 'L'], color: ['Matte Black'], bestseller: false },
  { id: 8, title: 'Angel Graphic Bodysuit & Fur Shrug Set', price: 195, size: ['S', 'M', 'L'], color: ['Black', 'White'], bestseller: true },
  { id: 9, title: 'Baby Pink Lace-Up Collared Zip Halter Top', price: 135, size: ['S', 'M', 'L'], color: ['Pastel Pink'], bestseller: false },
  { id: 10, title: 'Y2K Celestial Star Hair Clip & Rings Set', price: 65, size: ['ONE SIZE'], color: ['Silver'], bestseller: false },
  { id: 11, title: 'Rhinestone Cami Lace-Trim Silk Crop Top', price: 125, size: ['S', 'M', 'L'], color: ['Jet Black'], bestseller: false },
  { id: 12, title: 'Fringed Distressed Knit Oversized Sweater', price: 215, size: ['S', 'M', 'L'], color: ['Heather Grey'], bestseller: false },
  { id: 13, title: 'Asymmetric Off-Shoulder Top & Eyelet Shorts', price: 175, size: ['S', 'M', 'L'], color: ['Dark Slate'], bestseller: false },
  { id: 14, title: 'Vintage Washed Graphic Grunge Boxy Tee', price: 95, size: ['S', 'M', 'L', 'XL'], color: ['Vintage Grey'], bestseller: false },
  { id: 15, title: 'Satin Varsity Bomber Jacket with 8-Ball Patches', price: 345, size: ['S', 'M', 'L'], color: ['Black', 'Cream'], bestseller: true },
  { id: 16, title: 'Strapless Raw-Hem Denim Corset Tube Top', price: 185, size: ['S', 'M', 'L'], color: ['Indigo Blue'], bestseller: false },
  { id: 17, title: 'Contrast Strap Structured Bustier & Fur Sleeves', price: 225, size: ['S', 'M', 'L'], color: ['Black', 'Ivory'], bestseller: false },
  { id: 18, title: 'Gothic Chain-Link Cutout Halter Maxi Dress', price: 280, size: ['S', 'M', 'L'], color: ['Raven Black'], bestseller: true },
  { id: 19, title: 'Minimalist Ribbed Knit Micro Tube Dress', price: 140, size: ['S', 'M', 'L'], color: ['Obsidian'], bestseller: false },
  { id: 20, title: 'Deconstructed Mesh Panel Layered Longsleeve Top', price: 155, size: ['S', 'M', 'L'], color: ['Smoke Grey'], bestseller: false },
  { id: 21, title: 'Boned Satin Underbust Corset with Buckles', price: 210, size: ['S', 'M', 'L'], color: ['Silver Satin'], bestseller: false },
  { id: 22, title: 'Pleated Low-Rise Buckle Cargo Mini Skirt', price: 165, size: ['S', 'M', 'L'], color: ['Washed Olive'], bestseller: false },
  { id: 23, title: 'Heavy Metal Studded Moto Biker Jacket', price: 420, size: ['S', 'M', 'L'], color: ['Distressed Black'], bestseller: true },
  { id: 24, title: 'Distressed Open-Knit Spiderweb Maxi Dress', price: 230, size: ['S', 'M', 'L'], color: ['Off-White'], bestseller: false },
  { id: 25, title: 'Cropped Ribbed Zip Cardigan with Metal Hardware', price: 175, size: ['S', 'M', 'L'], color: ['Anthracite'], bestseller: false },
  { id: 26, title: 'Ruched Sheer Mesh Bodycon Halter Dress', price: 195, size: ['S', 'M', 'L'], color: ['Electric Blue'], bestseller: false },
  { id: 27, title: 'Gothic Cross Charm Double Choker Necklace', price: 75, size: ['ONE SIZE'], color: ['Silver'], bestseller: false },
  { id: 28, title: 'Acid-Wash Raw Edge Flare Denim Jeans', price: 220, size: ['26', '28', '30', '32'], color: ['Bleached Indigo'], bestseller: false },
  { id: 29, title: 'Sheer Organza Puff Sleeve Corset Bodice Top', price: 205, size: ['S', 'M', 'L'], color: ['Midnight Black'], bestseller: false },
  { id: 30, title: 'Silver Spiked Chain Link Leather Belt', price: 110, size: ['S', 'M', 'L'], color: ['Black', 'Silver'], bestseller: false },
  { id: 31, title: 'Frayed Edge Asymmetric Hem Grunge Tank Top', price: 85, size: ['S', 'M', 'L'], color: ['Washed Olive'], bestseller: false },
  { id: 32, title: 'Velvet Boned Romantic Lace-Trim Bustier', price: 215, size: ['S', 'M', 'L'], color: ['Deep Plum'], bestseller: false },
  { id: 33, title: 'Layered Ruffle Tiered Grunge Mini Dress', price: 240, size: ['S', 'M', 'L'], color: ['Coal Black'], bestseller: false },
  { id: 34, title: 'Oversized Distressed Thermal Knit Top', price: 145, size: ['S', 'M', 'L'], color: ['Bone White'], bestseller: false },
  { id: 35, title: 'Studded Leather Buckle Utility Platform Harness', price: 190, size: ['ONE SIZE'], color: ['Black'], bestseller: false },
  { id: 36, title: 'Cyberpunk Techwear Mesh Panel Crop Top', price: 130, size: ['S', 'M', 'L'], color: ['Charcoal'], bestseller: false },
  { id: 37, title: 'Heavyweight Boxy Leather Racing Jacket', price: 395, size: ['S', 'M', 'L'], color: ['Black', 'White'], bestseller: true },
  { id: 38, title: 'Distressed Graphic Print Baby Tee Top', price: 75, size: ['S', 'M', 'L'], color: ['Faded Ash'], bestseller: false },
  { id: 39, title: 'High-Waisted Buckled Cargo Parachute Pants', price: 235, size: ['S', 'M', 'L'], color: ['Stealth Black'], bestseller: false },
  { id: 40, title: 'Sculpted Metal Hardware Zip-Up Corset Top', price: 250, size: ['S', 'M', 'L'], color: ['Gunmetal'], bestseller: false },
  { id: 41, title: 'Draped Asymmetric Cowl Neck Evening Dress', price: 275, size: ['S', 'M', 'L'], color: ['Burgundy Wine'], bestseller: false },
  { id: 43, title: 'Vintage Wash Oversized Denim Trucker Jacket', price: 290, size: ['S', 'M', 'L'], color: ['Vintage Indigo'], bestseller: false },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const baseDir = path.join(__dirname, '..', 'public', 'images', 'products');

const products = PRODUCTS_META.map(item => {
  const dirPath = path.join(baseDir, 'product-' + item.id);
  const files = fs.readdirSync(dirPath)
    .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a,b) => {
      const na = parseInt((a.match(/\d+/) || [0])[0]);
      const nb = parseInt((b.match(/\d+/) || [0])[0]);
      return na - nb;
    });

  const slug = slugify(item.title);
  const images = files.map(f => [`/images/products/product-${item.id}/${f}`]);

  return {
    id: item.id,
    title: item.title,
    price: item.price,
    basePrice: 0,
    href: `/products/${slug}/`,
    quantity: 1,
    bestseller: item.bestseller,
    createdAt: new Date('2026-03-01T12:00:00Z').toISOString(),
    size: item.size,
    color: item.color,
    images: images
  };
});

const fileContent = `export interface Product {
  id: number;
  title: string;
  price: number;
  basePrice?: number;
  href: string;
  quantity: number;
  bestseller: boolean;
  createdAt: string;
  size: string[];
  color: string[];
  images: any[];
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export function getProductSlug(product: Product): string {
  if (product.href) {
    const match = product.href.match(/\\/products\\/([^\\/]+)\\/?/);
    if (match && match[1]) return match[1];
  }
  return product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().replace(/^\\/+|\\/+$/g, '').replace(/^products\\//, '');

  const byHref = PRODUCTS.find((p) => {
    const s = getProductSlug(p);
    return s.toLowerCase() === clean;
  });
  if (byHref) return byHref;

  const byTitle = PRODUCTS.find((p) => {
    const s = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return s === clean;
  });
  if (byTitle) return byTitle;

  if (!isNaN(Number(clean))) {
    const byId = PRODUCTS.find((p) => p.id === Number(clean));
    if (byId) return byId;
  }

  const words = clean.split('-').filter(Boolean);
  if (words.length > 1) {
    const byWords = PRODUCTS.find((p) => {
      const t = p.title.toLowerCase();
      return words.every((w) => t.includes(w));
    });
    if (byWords) return byWords;
  }

  const byWordMatch = PRODUCTS.find((p) => p.title.toLowerCase().includes(clean.replace(/-/g, ' ')));
  if (byWordMatch) return byWordMatch;

  // Fallbacks for previous URLs so no external/scraped link breaks
  if (clean.includes('corset') || clean.includes('witch') || clean.includes('bustier')) {
    return PRODUCTS.find(p => p.id === 3) || PRODUCTS[0];
  }
  if (clean.includes('dress') || clean.includes('sunna') || clean.includes('mesh') || clean.includes('sparkling')) {
    return PRODUCTS.find(p => p.id === 18) || PRODUCTS[0];
  }
  if (clean.includes('jacket') || clean.includes('bomber')) {
    return PRODUCTS.find(p => p.id === 15) || PRODUCTS[0];
  }

  return PRODUCTS[0];
}

export function getAllProductSlugs(): string[] {
  const set = new Set<string>();
  PRODUCTS.forEach((p) => set.add(getProductSlug(p)));
  // Aliases for historical / existing pages
  set.add('velvet-witch-corset');
  set.add('witch-velvet-corset');
  set.add('classic-knit-maxi-dress');
  set.add('sunna-dress');
  set.add('mesh-dress');
  set.add('sparkling-mini-dress');
  set.add('velvet-bra-top');
  return Array.from(set);
}
`;

const targetPath = path.join(__dirname, '..', 'lib', 'products.ts');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully generated ' + products.length + ' products in ' + targetPath);
