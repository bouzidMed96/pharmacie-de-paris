/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const PHARMACY = {
  name: "Pharmacie de Paris",
  address: "6 bis rue du Départ",
  city: "95880 Enghien-les-Bains",
  phone: "01 34 12 80 73",
  clickAndCollect: "Pharmacie de Paris — 6 bis rue du Départ, 95880 Enghien-les-Bains",
};

// Kept for legacy compat with CheckoutModal (single entry = single store)
export const STORES_LIST = [PHARMACY.clickAndCollect];

export const PRODUCTS_LIST: Product[] = [
  // --- SKINCARE / SOINS VISAGE & CORPS ---
  {
    id: "p1",
    name: "Effaclar Duo(+) Soin Anti-Imperfections",
    brand: "La Roche-Posay",
    category: "skincare",
    description: "Soin complet à l'efficacité anti-imperfections renforcée, pour aider à libérer rapidement les boutons existants, prévenir leur réapparition et limiter le risque de marques.",
    price: 12.90,
    oldPrice: 15.40,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=450&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 342,
    stock: 50,
    prescriptionRequired: false,
    size: "40ml",
    concern: ["Dermatologique", "Imperfections", "Acné", "Peaux Grasses"]
  },
  {
    id: "p2",
    name: "Cicalfate+ Crème Restauratrice Protectrice",
    brand: "Avène",
    category: "skincare",
    description: "Apaise, restaure et purifie les peaux irritées de toute la famille au quotidien. Texture protectrice effet pansement.",
    price: 7.80,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=450&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 520,
    stock: 120,
    prescriptionRequired: false,
    size: "100ml",
    concern: ["Cicatrisation", "Irritations", "Peaux Sensibles", "Famille"]
  },
  {
    id: "p3",
    name: "Vinoperfect Sérum Éclat Anti-Taches",
    brand: "Caudalie",
    category: "skincare",
    description: "Ce sérum lacté sublime l'éclat du teint, corrige les taches et prévient leur apparition. Convient à toutes les peaux.",
    price: 39.90,
    oldPrice: 44.90,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 289,
    stock: 45,
    prescriptionRequired: false,
    size: "30ml",
    concern: ["Anti-taches", "Éclat", "Bio / Naturel", "Anti-âge"]
  },
  {
    id: "p4",
    name: "Sensibio H2O Eau Micellaire Démaquillante",
    brand: "Bioderma",
    category: "skincare",
    description: "L'eau micellaire dermatologique originale, qui nettoie, démaquille et apaise les peaux sensibles en respectant l'équilibre cutané.",
    price: 9.90,
    oldPrice: 12.10,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 611,
    stock: 90,
    prescriptionRequired: false,
    size: "500ml",
    concern: ["Nettoyage", "Peaux Sensibles", "Démaquillant"]
  },
  {
    id: "p5",
    name: "Huile Sèche Prodigieuse Multi-Fonction",
    brand: "Nuxe",
    category: "skincare",
    description: "Huile sèche mythique aux 7 huiles végétales précieuses qui nourrit, répare et sublime le visage, le corps et les cheveux.",
    price: 19.50,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=450&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 245,
    stock: 65,
    prescriptionRequired: false,
    size: "100ml",
    concern: ["Hydratation", "Bio / Naturel", "Multi-usage", "Corps & Cheveux"]
  },

  // --- HAIRCARE / SOINS CAPILLAIRES ---
  {
    id: "p6",
    name: "Shampooing Anti-Chute à la Quinine & Edelweiss BIO",
    brand: "Klorane",
    category: "haircare",
    description: "Stimule la croissance capillaire et freine la chute des cheveux fatigués. Des cheveux plus forts et plus vigoureux.",
    price: 8.40,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=450&auto=format&fit=crop&q=80",
    rating: 4.4,
    reviewsCount: 135,
    stock: 40,
    prescriptionRequired: false,
    size: "400ml",
    concern: ["Anti-chute", "Cheveux courts/fins", "Bio / Naturel"]
  },
  {
    id: "p7",
    name: "Anaphase+ Shampooing Complément Anti-Chute",
    brand: "Ducray",
    category: "haircare",
    description: "Prépare le cuir chevelu aux traitements anti-chute tout en redonnant volume et force aux cheveux dévitalisés.",
    price: 9.20,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=450&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewsCount: 198,
    stock: 55,
    prescriptionRequired: false,
    size: "200ml",
    concern: ["Anti-chute", "Volume", "Dermatologique"]
  },

  // --- BABY & MOTHER / BÉBÉ & MATERNITÉ ---
  {
    id: "p8",
    name: "Gel Lavant Doux sans rinçage ou à l'eau Bébé",
    brand: "Mustela",
    category: "baby",
    description: "Nettoie le visage et le corps des nourrissons et enfants avec douceur, tout en protégeant leur capital cellulaire cutané.",
    price: 6.90,
    oldPrice: 8.50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=450&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 388,
    stock: 80,
    prescriptionRequired: false,
    size: "500ml",
    concern: ["Bébé", "Peau fragile", "Nettoyage doux"]
  },
  {
    id: "p9",
    name: "Crème pour le Change au Calendula",
    brand: "Weleda",
    category: "baby",
    description: "Protège et apaise efficacement l'épiderme fessier irrité ou rouge de bébé. Formule 100% naturelle de haute tolérance biologique.",
    price: 6.20,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 220,
    stock: 75,
    prescriptionRequired: false,
    size: "75ml",
    concern: ["Bébé", "Bio / Naturel", "Rougeurs"]
  },

  // --- NUTRITION & COMPLÉMENTS ALIMENTAIRES ---
  {
    id: "p10",
    name: "Zinc Picolinate 22mg Vitamines & Minéraux",
    brand: "Solgar",
    category: "nutrition",
    description: "Favorise une peau saine, des cheveux résistants et soutient de manière optimale le bon fonctionnement du système immunitaire.",
    price: 13.90,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=450&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 165,
    stock: 35,
    prescriptionRequired: false,
    size: "100 gélules",
    concern: ["Immunité", "Peau & Ongles", "Vitamines / Minéraux"]
  },
  {
    id: "p11",
    name: "Forcapil Cheveux et Ongles (Zinc, Biotine)",
    brand: "Arkopharma",
    category: "nutrition",
    description: "Formule complète pour fortifier la fibre capillaire, stimuler la pousse des cheveux et renforcer les ongles dédoublés ou cassants.",
    price: 18.90,
    oldPrice: 22.50,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=450&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 412,
    stock: 60,
    prescriptionRequired: false,
    size: "180 gélules",
    concern: ["Force & Pousse", "Cheveux", "Ongles"]
  },
  {
    id: "p12",
    name: "Magnésium B6 Énergie & Anti-Fatigue",
    brand: "Forté Pharma",
    category: "nutrition",
    description: "Soutient l'organisme en cas de fatigue passagère, de surmenage, de nervosité ou de stress intense.",
    price: 8.90,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=450&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewsCount: 97,
    stock: 110,
    prescriptionRequired: false,
    size: "60 comprimés",
    concern: ["Stress", "Fatigue", "Énergie"]
  },

  // --- HYGIÈNE & PREMIERS SECOURS ---
  {
    id: "p13",
    name: "Dentifrice elmex Anti-Caries Duo Pack",
    brand: "Elmex",
    category: "hygiene",
    description: "Formule au fluor d'amines Olafluor qui forme un bouclier de calcium résistant pour reminéraliser et protéger l'émail des dents dentaires.",
    price: 6.50,
    oldPrice: 7.90,
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 304,
    stock: 150,
    prescriptionRequired: false,
    size: "2x75ml",
    concern: ["Bucco-dentaire", "Protection Email", "Caries"]
  },
  {
    id: "p14",
    name: "Spray Désinfectant Cooper Alcool à 70°",
    brand: "Cooper",
    category: "hygiene",
    description: "Alcool modifié pour la désinfection locale de la peau saine et de l'instrumentation médicale.",
    price: 3.40,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=450&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 82,
    stock: 200,
    prescriptionRequired: false,
    size: "125ml",
    concern: ["Premiers Secours", "Désinfectant", "Antiseptique"]
  },

  // --- MEDICATIONS / MÉDICAMENTS (OTC & PRESCRIPTION FLAGGED) ---
  {
    id: "p15",
    name: "Doliprane 1000mg Paracétamol (Sans Ordonnance)",
    brand: "Sanofi",
    category: "medication",
    description: "Indiqué en cas de douleur d'intensité légère à modérée et/ou d'état fébrile (maux de tête, états grippaux, douleurs dentaires, courbatures). SANS ORDONNANCE.",
    price: 2.18,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=450&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 852,
    stock: 400,
    prescriptionRequired: false, // OTC
    size: "8 comprimés",
    concern: ["Douleur", "Fièvre", "Maux de tête", "Médicament"]
  },
  {
    id: "p16",
    name: "Amoxicilline Sandoz 500mg Antibio",
    brand: "Sandoz",
    category: "medication",
    description: "Antibiotique de la famille des bêtalactamines, indiqué pour le traitement d'infections bactériennes de l'oreille, des poumons, de la gorge. ORDONNANCE OBLIGATOIRE.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=450&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewsCount: 44,
    stock: 30,
    prescriptionRequired: true, // Prescription required
    size: "12 gélules",
    concern: ["Antibiotique", "Infection", "Sur prescription", "Médicament"]
  },
  {
    id: "p17",
    name: "Ibuprofène Mylan 400mg Douleurs",
    brand: "Mylan",
    category: "medication",
    description: "Anti-inflammatoire non stéroïdien (AINS). Traitement de courte durée de la fièvre et/ou de douleurs comme maux de tête, courbatures. SANS ORDONNANCE.",
    price: 2.95,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=450&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 198,
    stock: 250,
    prescriptionRequired: false,
    size: "12 comprimés",
    concern: ["Anti-inflammatoire", "Douleur", "Fièvre", "Médicament"]
  },
  {
    id: "p18",
    name: "Strepsils Miel Citron Gorge Irritée",
    brand: "Strepsils",
    category: "medication",
    description: "Pastilles antiseptiques contenant de l'alcool dichlorobenzylique et de l'amylmétacrésol, indiquées en cas de mal de gorge peu intense et sans fièvre.",
    price: 5.60,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 233,
    stock: 180,
    prescriptionRequired: false,
    size: "24 pastilles",
    concern: ["Mal de gorge", "Gorge", "Antiseptique", "Médicament"]
  },
  {
    id: "p19",
    name: "Spasfon Comprimés Douleurs Spasmodiques",
    brand: "Teva",
    category: "medication",
    description: "Médicament antispasmodique pour soulager les douleurs aiguës liées aux spasmes des voies biliaires, des voies urinaires ou de l'utérus.",
    price: 3.20,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=450&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    stock: 210,
    prescriptionRequired: false,
    size: "30 comprimés",
    concern: ["Spasmes", "Ventre", "Règles", "Médicament"]
  },
  {
    id: "p20",
    name: "Kardegic 75mg Antithrombotique",
    brand: "AstraZeneca",
    category: "medication",
    description: "Contient de l'aspirine à faible dose pour prévenir la formation de caillots sanguins dans les artères après un infarctus. SUR ORDONNANCE.",
    price: 3.80,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=450&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 19,
    stock: 40,
    prescriptionRequired: true, // Prescription required
    size: "30 sachets",
    concern: ["Cardiologie", "Prévention", "Sur prescription", "Médicament"]
  }
];
