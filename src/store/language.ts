import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "EN" | "UR" | "FR" | "AR";

export interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string) => string;
}

// Translation data
const translations = {
  EN: {
    // Navigation
    "nav.home": "Home",
    "nav.tryon": "Try-On",
    "nav.about": "About Us",
    "nav.categories": "Categories",
    "nav.contact": "Contact Us",
    "nav.shop": "Shop",
    "nav.men": "Men",
    "nav.women": "Women",
    "nav.kids": "Kids",
    "nav.blueLight": "Blue Light",
    "nav.sunglasses": "Sunglasses",

    "hero.title": "Luxury Eyewear",
    "hero.subtitle": "Virtual Try-On",
    "hero.description":
      "Discover timeless elegance with our AI-powered virtual try-on experience.",
    "hero.shopNow": "Shop Now",
    "hero.contactUs": "Contact Us",

    // Top bar
    "topbar.delivery": "Delivery in 2–5 days",
    "topbar.freeShipping": "Free shipping over $200",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signOut": "Sign Out",
    "auth.admin": "Admin",

    // Cart
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.goToShop": "Go to Shop",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Proceed to Checkout",
    "cart.clear": "Clear cart",
    "cart.remove": "Remove",
    "cart.increase": "Increase quantity",
    "cart.decrease": "Decrease quantity",

    // Product
    "product.addToCart": "Add to Cart",
    "product.tryOn": "Try-On",
    "product.outOfStock": "Out of stock",
    "product.lowStock": "Low stock",

    // Account
    "account.title": "My Account",
    "account.welcome": "Welcome back",
    "account.profile": "Profile",
    "account.orders": "Orders",
    "account.gallery": "Gallery",
    "account.profileDesc": "Manage your personal information",
    "account.ordersDesc": "View your order history",
    "account.galleryDesc": "Your virtual try-on photos",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.welcome": "Welcome to the LensVision admin panel",
    "admin.totalProducts": "Total Products",
    "admin.totalOrders": "Total Orders",
    "admin.totalRevenue": "Total Revenue",
    "admin.totalUsers": "Total Users",
    "admin.addProduct": "Add New Product",
    "admin.manageProducts": "Manage Products",
    "admin.viewOrders": "View Orders",
    "admin.addProductDesc": "Create a new product listing",
    "admin.manageProductsDesc": "View and edit existing products",
    "admin.viewOrdersDesc": "Manage customer orders",

    // Home Page
    "home.exploreCollection": "Explore Our Latest Collection",
    "home.signatureCollections": "Our Signature Collections",
    "home.whyChooseUs": "Why Choose Lens Vision?",
    "home.premiumQuality": "Premium Quality",
    "home.premiumQualityDesc":
      "Crafted with top materials for durability and elegance.",
    "home.smartTechnology": "Smart Technology",
    "home.smartTechnologyDesc": "Blue-light filters and AI-powered try-ons.",
    "home.luxuryDesign": "Luxury Design",
    "home.luxuryDesignDesc": "Frames that tell a story of modern fashion.",
    "home.redefiningEyewear": "Redefining Eyewear",
    "home.redefiningDesc":
      "At LensVision, we don't just make glasses. We craft experiences that blend technology, fashion, and luxury into one. Every frame tells a story of elegance.",
    "home.experienceTryOn": "Experience Virtual Try-On Now",
    "home.experienceDesc":
      "Step into the future of eyewear with our cinematic, AI-powered try-on experience.",
    "home.startTryOn": "Start Virtual Try-On",

    // Footer
    "footer.brandDesc":
      "Experience the future of eyewear shopping with our AI-powered virtual try-on technology.",
    "footer.quickLinks": "Quick Links",
    "footer.categories": "Categories",
    "footer.support": "Support",
    "footer.copyright": "© 2025 LensVision. All rights reserved.",

    // About Page
    "about.title": "About Us",
    "about.subtitle":
      "Redefining eyewear with premium craftsmanship, timeless design, and cutting-edge virtual try-on technology.",
    "about.mission": "Our Mission",
    "about.missionDesc":
      "Empowering individuality with eyewear that blends luxury design, comfort, and innovation.",
    "about.vision": "Our Vision",
    "about.visionDesc":
      "Building a sustainable and tech-forward future for fashion eyewear experiences.",
    "about.craftsmanship": "Premium Craftsmanship",
    "about.craftsmanshipDesc":
      "Every frame is carefully designed and handcrafted with the finest materials.",
    "about.technology": "Next-Gen Technology",
    "about.technologyDesc":
      "AI virtual try-on delivers instant, realistic previews for every style.",
    "about.sustainability": "Sustainable Future",
    "about.sustainabilityDesc":
      "Eco-friendly materials and recyclable packaging for a greener tomorrow.",
    "about.team": "Meet the Team",
    "about.contact": "Get in Touch",
    "about.contactDesc":
      "Have questions, feedback, or collaboration ideas? We'd love to hear from you.",
    "about.contactBtn": "Contact Us",

    // Contact Page
    "contact.title": "Get in Touch",
    "contact.subtitle":
      "We'd love to hear from you! Whether you have a question about products, need support, or just want to say hi — our team is ready to assist.",
    "contact.callUs": "Call Us",
    "contact.emailUs": "Email Us",
    "contact.visitUs": "Visit Us",
    "contact.sendMessage": "Send Us a Message",
    "contact.yourName": "Your Name",
    "contact.yourEmail": "Your Email",
    "contact.subject": "Subject",
    "contact.yourMessage": "Your Message",
    "contact.sendBtn": "Send Message",

    // Try-On Page
    "tryon.title": "Virtual Try-On",
    "tryon.subtitle":
      "Use your webcam or upload a photo. Adjust fit if needed.",
    "tryon.useWebcam": "Use Webcam",
    "tryon.uploadPhoto": "Upload Photo",
    "tryon.scale": "Scale",
    "tryon.verticalOffset": "Vertical Offset",

    // Checkout Pages
    "checkout.success": "Payment Successful!",
    "checkout.successDesc":
      "Thank you for your order. Your payment has been processed successfully.",
    "checkout.emailSent":
      "A confirmation email has been sent to your email address.",
    "checkout.orderProcessed":
      "Your order will be processed and shipped within 2-3 business days.",
    "checkout.orderId": "Order ID",
    "checkout.viewOrders": "View My Orders",
    "checkout.continueShopping": "Continue Shopping",
    "checkout.cancelled": "Payment Cancelled",
    "checkout.cancelledDesc":
      "Your payment was cancelled. No charges have been made to your account.",
    "checkout.contactSupport":
      "If you encountered any issues during checkout, please try again or contact our support team.",
    "checkout.returnToCart": "Return to Cart",

    // Auth Pages
    "auth.signInTitle": "Sign in to your account",
    "auth.continueAsGuest": "continue as guest",
    "auth.emailAddress": "Email address",
    "auth.password": "Password",
    "auth.enterEmail": "Enter your email",
    "auth.enterPassword": "Enter your password",
    "auth.signingIn": "Signing in...",
    "auth.signInWithGoogle": "Sign in with Google",
    "auth.demoCredentials": "Demo credentials",
    "auth.invalidCredentials": "Invalid credentials",
    "auth.errorOccurred": "An error occurred. Please try again.",
    "auth.googleSignInFailed": "Google sign-in failed",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
  },

  UR: {
    // Navigation
    "nav.home": "ہوم",
    "nav.tryon": "ٹرائی آن",
    "nav.about": "ہمارے بارے میں",
    "nav.categories": "کیٹگریز",
    "nav.contact": "رابطہ",
    "nav.shop": "شاپ",
    "nav.men": "مرد",
    "nav.women": "خواتین",
    "nav.kids": "بچے",
    "nav.blueLight": "بلیو لائٹ",
    "nav.sunglasses": "دھوپ کے چشمے",

    // Top bar
    "topbar.delivery": "2-5 دن میں ڈیلیوری",
    "topbar.freeShipping": "$200 سے زیادہ پر مفت شپنگ",

    // Auth
    "auth.signIn": "سائن ان",
    "auth.signOut": "سائن آؤٹ",
    "auth.admin": "ایڈمن",

    // Cart
    "cart.title": "آپ کی ٹوکری",
    "cart.empty": "آپ کی ٹوکری خالی ہے",
    "cart.goToShop": "شاپ پر جائیں",
    "cart.subtotal": "ذیلی کل",
    "cart.checkout": "چیک آؤٹ کریں",
    "cart.clear": "ٹوکری صاف کریں",
    "cart.remove": "ہٹائیں",
    "cart.increase": "مقدار بڑھائیں",
    "cart.decrease": "مقدار کم کریں",

    // Product
    "product.addToCart": "ٹوکری میں شامل کریں",
    "product.tryOn": "ٹرائی آن",
    "product.outOfStock": "اسٹاک ختم",
    "product.lowStock": "کم اسٹاک",

    // Account
    "account.title": "میرا اکاؤنٹ",
    "account.welcome": "واپس آئیں",
    "account.profile": "پروفائل",
    "account.orders": "آرڈرز",
    "account.gallery": "گیلری",
    "account.profileDesc": "اپنی ذاتی معلومات کا انتظام کریں",
    "account.ordersDesc": "اپنے آرڈر کی تاریخ دیکھیں",
    "account.galleryDesc": "آپ کی ورچوئل ٹرائی آن تصاویر",

    "hero.title": "عمدہ عینکیں",
    "hero.subtitle": "ورچوئل ٹرائی آن",
    "hero.description": "ہماری AI ٹیکنالوجی کے ساتھ اپنی شخصیت کو نکھاریں۔",
    "hero.shopNow": "ابھی خریدیں",
    "hero.contactUs": "رابطہ کریں",

    // Admin
    "admin.dashboard": "ایڈمن ڈیش بورڈ",
    "admin.welcome": "LensVision ایڈمن پینل میں خوش آمدید",
    "admin.totalProducts": "کل مصنوعات",
    "admin.totalOrders": "کل آرڈرز",
    "admin.totalRevenue": "کل آمدنی",
    "admin.totalUsers": "کل صارفین",
    "admin.addProduct": "نئی مصنوعات شامل کریں",
    "admin.manageProducts": "مصنوعات کا انتظام",
    "admin.viewOrders": "آرڈرز دیکھیں",
    "admin.addProductDesc": "نئی مصنوعات کی لسٹنگ بنائیں",
    "admin.manageProductsDesc": "موجودہ مصنوعات دیکھیں اور ترمیم کریں",
    "admin.viewOrdersDesc": "کسٹمر آرڈرز کا انتظام کریں",

    // Home Page
    "home.exploreCollection": "ہماری تازہ ترین کالیکشن دیکھیں",
    "home.signatureCollections": "ہماری خصوصی کالیکشنز",
    "home.whyChooseUs": "Lens Vision کیوں منتخب کریں؟",
    "home.premiumQuality": "پریمیم کوالٹی",
    "home.premiumQualityDesc":
      "پائیداری اور خوبصورتی کے لیے اعلیٰ معیار کے مواد سے تیار۔",
    "home.smartTechnology": "اسمارٹ ٹیکنالوجی",
    "home.smartTechnologyDesc": "بلیو لائٹ فلٹرز اور AI سے چلنے والے ٹرائی آن۔",
    "home.luxuryDesign": "لگژری ڈیزائن",
    "home.luxuryDesignDesc": "فریمز جو جدید فیشن کی کہانی سناتی ہیں۔",
    "home.redefiningEyewear": "آنکھوں کے شیشے کو نئی شکل",
    "home.redefiningDesc":
      "LensVision میں، ہم صرف شیشے نہیں بناتے۔ ہم ایسے تجربات تخلیق کرتے ہیں جو ٹیکنالوجی، فیشن اور لگژری کو یکجا کرتے ہیں۔ ہر فریم خوبصورتی کی کہانی سناتا ہے۔",
    "home.experienceTryOn": "اب ورچوئل ٹرائی آن کا تجربہ کریں",
    "home.experienceDesc":
      "ہمارے سنیماٹک، AI سے چلنے والے ٹرائی آن تجربے کے ساتھ آنکھوں کے شیشوں کے مستقبل میں قدم رکھیں۔",
    "home.startTryOn": "ورچوئل ٹرائی آن شروع کریں",

    // Footer
    "footer.brandDesc":
      "ہماری AI سے چلنے والی ورچوئل ٹرائی آن ٹیکنالوجی کے ساتھ آنکھوں کے شیشوں کی خریداری کا مستقبل دیکھیں۔",
    "footer.quickLinks": "فوری لنکس",
    "footer.categories": "کیٹگریز",
    "footer.support": "سپورٹ",
    "footer.copyright": "© 2025 LensVision. تمام حقوق محفوظ ہیں۔",

    // Common
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.error": "خرابی",
    "common.success": "کامیابی",
    "common.cancel": "منسوخ",
    "common.save": "محفوظ",
    "common.edit": "ترمیم",
    "common.delete": "حذف",
    "common.close": "بند",
    "common.back": "واپس",
    "common.next": "اگلا",
    "common.previous": "پچھلا",

    // About Page
    "about.title": "ہمارے بارے میں",
    "about.subtitle":
      "پریمیم کاریگری، لازوال ڈیزائن، اور جدید ورچوئل ٹرائی آن ٹیکنالوجی کے ساتھ آنکھوں کے شیشے کو نئی شکل۔",
    "about.mission": "ہمارا مشن",
    "about.missionDesc":
      "لگژری ڈیزائن، آرام اور جدت کو یکجا کرنے والے آنکھوں کے شیشوں کے ساتھ انفرادیت کو بااختیار بنانا۔",
    "about.vision": "ہماری وژن",
    "about.visionDesc":
      "فیشن آنکھوں کے شیشوں کے تجربات کے لیے پائیدار اور ٹیکنالوجی سے آگے مستقبل کی تعمیر۔",
    "about.craftsmanship": "پریمیم کاریگری",
    "about.craftsmanshipDesc":
      "ہر فریم بہترین مواد کے ساتھ احتیاط سے ڈیزائن اور ہاتھ سے تیار کیا جاتا ہے۔",
    "about.technology": "اگلی نسل کی ٹیکنالوجی",
    "about.technologyDesc":
      "AI ورچوئل ٹرائی آن ہر اسٹائل کے لیے فوری، حقیقی پیش نظارے فراہم کرتا ہے۔",
    "about.sustainability": "پائیدار مستقبل",
    "about.sustainabilityDesc":
      "سبز کل کے لیے ماحول دوست مواد اور قابل ری سائیکل پیکیجنگ۔",
    "about.team": "ٹیم سے ملیں",
    "about.contact": "رابطہ کریں",
    "about.contactDesc":
      "آپ کے سوالات، فیڈ بیک، یا تعاون کے خیالات ہیں؟ ہم آپ سے سننا پسند کریں گے۔",
    "about.contactBtn": "رابطہ کریں",

    // Contact Page
    "contact.title": "رابطہ کریں",
    "contact.subtitle":
      "ہم آپ سے سننا پسند کریں گے! چاہے آپ کے مصنوعات کے بارے میں سوالات ہوں، سپورٹ کی ضرورت ہو، یا صرف ہیلو کہنا چاہتے ہوں — ہماری ٹیم مدد کے لیے تیار ہے۔",
    "contact.callUs": "ہمیں کال کریں",
    "contact.emailUs": "ہمیں ای میل کریں",
    "contact.visitUs": "ہمیں ملنے آئیں",
    "contact.sendMessage": "ہمیں پیغام بھیجیں",
    "contact.yourName": "آپ کا نام",
    "contact.yourEmail": "آپ کا ای میل",
    "contact.subject": "موضوع",
    "contact.yourMessage": "آپ کا پیغام",
    "contact.sendBtn": "پیغام بھیجیں",

    // Try-On Page
    "tryon.title": "ورچوئل ٹرائی آن",
    "tryon.subtitle":
      "اپنے ویب کیم یا تصویر اپ لوڈ کریں۔ ضرورت ہو تو فٹ ایڈجسٹ کریں۔",
    "tryon.useWebcam": "ویب کیم استعمال کریں",
    "tryon.uploadPhoto": "تصویر اپ لوڈ کریں",
    "tryon.scale": "سکیل",
    "tryon.verticalOffset": "عمودی آفسیٹ",

    // Checkout Pages
    "checkout.success": "پیمنٹ کامیاب!",
    "checkout.successDesc":
      "آپ کے آرڈر کا شکریہ۔ آپ کی پیمنٹ کامیابی سے پروسیس ہو گئی ہے۔",
    "checkout.emailSent":
      "آپ کے ای میل ایڈریس پر تصدیقی ای میل بھیج دیا گیا ہے۔",
    "checkout.orderProcessed":
      "آپ کا آرڈر 2-3 کاروباری دنوں میں پروسیس اور شپ ہو جائے گا۔",
    "checkout.orderId": "آرڈر ID",
    "checkout.viewOrders": "میرے آرڈرز دیکھیں",
    "checkout.continueShopping": "خریداری جاری رکھیں",
    "checkout.cancelled": "پیمنٹ منسوخ",
    "checkout.cancelledDesc":
      "آپ کی پیمنٹ منسوخ کر دی گئی۔ آپ کے اکاؤنٹ سے کوئی چارج نہیں کیا گیا۔",
    "checkout.contactSupport":
      "اگر آپ کو چیک آؤٹ کے دوران کوئی مسئلہ آیا، تو براہ کرم دوبارہ کوشش کریں یا ہماری سپورٹ ٹیم سے رابطہ کریں۔",
    "checkout.returnToCart": "ٹوکری میں واپس جائیں",

    // Auth Pages
    "auth.signInTitle": "اپنے اکاؤنٹ میں سائن ان کریں",
    "auth.continueAsGuest": "مہمان کے طور پر جاری رکھیں",
    "auth.emailAddress": "ای میل ایڈریس",
    "auth.password": "پاس ورڈ",
    "auth.enterEmail": "اپنا ای میل درج کریں",
    "auth.enterPassword": "اپنا پاس ورڈ درج کریں",
    "auth.signingIn": "سائن ان ہو رہا ہے...",
    "auth.signInWithGoogle": "Google کے ساتھ سائن ان",
    "auth.demoCredentials": "ڈیمو کریڈنشلز",
    "auth.invalidCredentials": "غلط کریڈنشلز",
    "auth.errorOccurred": "ایک خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔",
    "auth.googleSignInFailed": "Google سائن ان ناکام",
  },

  FR: {
    // Navigation
    "nav.home": "Accueil",
    "nav.tryon": "Essayer",
    "nav.about": "À propos",
    "nav.categories": "Catégories",
    "nav.contact": "Contact",
    "nav.shop": "Boutique",
    "nav.men": "Hommes",
    "nav.women": "Femmes",
    "nav.kids": "Enfants",
    "nav.blueLight": "Lumière bleue",
    "nav.sunglasses": "Lunettes de soleil",

    "hero.title": "Lunettes de Luxe",
    "hero.subtitle": "Essayage Virtuel",
    "hero.description":
      "Découvrez l’élégance intemporelle avec notre expérience d’essai virtuel alimentée par l’IA.",
    "hero.shopNow": "Acheter Maintenant",
    "hero.contactUs": "Nous Contacter",

    // Top bar
    "topbar.delivery": "Livraison en 2-5 jours",
    "topbar.freeShipping": "Livraison gratuite à partir de 200$",

    // Auth
    "auth.signIn": "Se connecter",
    "auth.signOut": "Se déconnecter",
    "auth.admin": "Admin",

    // Cart
    "cart.title": "Votre panier",
    "cart.empty": "Votre panier est vide",
    "cart.goToShop": "Aller à la boutique",
    "cart.subtotal": "Sous-total",
    "cart.checkout": "Passer à la caisse",
    "cart.clear": "Vider le panier",
    "cart.remove": "Supprimer",
    "cart.increase": "Augmenter la quantité",
    "cart.decrease": "Diminuer la quantité",

    // Product
    "product.addToCart": "Ajouter au panier",
    "product.tryOn": "Essayer",
    "product.outOfStock": "Rupture de stock",
    "product.lowStock": "Stock faible",

    // Account
    "account.title": "Mon compte",
    "account.welcome": "Bon retour",
    "account.profile": "Profil",
    "account.orders": "Commandes",
    "account.gallery": "Galerie",
    "account.profileDesc": "Gérez vos informations personnelles",
    "account.ordersDesc": "Consultez votre historique de commandes",
    "account.galleryDesc": "Vos photos d'essai virtuel",

    // Admin
    "admin.dashboard": "Tableau de bord admin",
    "admin.welcome": "Bienvenue dans le panneau admin LensVision",
    "admin.totalProducts": "Total des produits",
    "admin.totalOrders": "Total des commandes",
    "admin.totalRevenue": "Revenus totaux",
    "admin.totalUsers": "Total des utilisateurs",
    "admin.addProduct": "Ajouter un nouveau produit",
    "admin.manageProducts": "Gérer les produits",
    "admin.viewOrders": "Voir les commandes",
    "admin.addProductDesc": "Créer une nouvelle fiche produit",
    "admin.manageProductsDesc": "Voir et modifier les produits existants",
    "admin.viewOrdersDesc": "Gérer les commandes clients",

    // Home Page
    "home.exploreCollection": "Explorez Notre Dernière Collection",
    "home.signatureCollections": "Nos Collections Signature",
    "home.whyChooseUs": "Pourquoi Choisir Lens Vision ?",
    "home.premiumQuality": "Qualité Premium",
    "home.premiumQualityDesc":
      "Fabriqués avec des matériaux de qualité supérieure pour la durabilité et l'élégance.",
    "home.smartTechnology": "Technologie Intelligente",
    "home.smartTechnologyDesc":
      "Filtres de lumière bleue et essais virtuels alimentés par IA.",
    "home.luxuryDesign": "Design de Luxe",
    "home.luxuryDesignDesc":
      "Des montures qui racontent une histoire de mode moderne.",
    "home.redefiningEyewear": "Redéfinir les Lunettes",
    "home.redefiningDesc":
      "Chez LensVision, nous ne fabriquons pas seulement des lunettes. Nous créons des expériences qui mélangent technologie, mode et luxe en un seul. Chaque monture raconte une histoire d'élégance.",
    "home.experienceTryOn": "Découvrez l'Essai Virtuel Maintenant",
    "home.experienceDesc":
      "Entrez dans l'avenir des lunettes avec notre expérience d'essai virtuel cinématique alimentée par IA.",
    "home.startTryOn": "Commencer l'Essai Virtuel",

    // Footer
    "footer.brandDesc":
      "Découvrez l'avenir du shopping de lunettes avec notre technologie d'essai virtuel alimentée par IA.",
    "footer.quickLinks": "Liens Rapides",
    "footer.categories": "Catégories",
    "footer.support": "Support",
    "footer.copyright": "© 2025 LensVision. Tous droits réservés.",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",

    // About Page
    "about.title": "À propos de nous",
    "about.subtitle":
      "Redéfinir les lunettes avec un artisanat premium, un design intemporel et une technologie d'essai virtuel de pointe.",
    "about.mission": "Notre Mission",
    "about.missionDesc":
      "Autonomiser l'individualité avec des lunettes qui mélangent design de luxe, confort et innovation.",
    "about.vision": "Notre Vision",
    "about.visionDesc":
      "Construire un avenir durable et technologique pour les expériences de lunettes de mode.",
    "about.craftsmanship": "Artisanat Premium",
    "about.craftsmanshipDesc":
      "Chaque monture est soigneusement conçue et fabriquée à la main avec les meilleurs matériaux.",
    "about.technology": "Technologie de Nouvelle Génération",
    "about.technologyDesc":
      "L'essai virtuel IA offre des aperçus instantanés et réalistes pour chaque style.",
    "about.sustainability": "Avenir Durable",
    "about.sustainabilityDesc":
      "Matériaux écologiques et emballages recyclables pour un lendemain plus vert.",
    "about.team": "Rencontrez l'Équipe",
    "about.contact": "Entrer en Contact",
    "about.contactDesc":
      "Vous avez des questions, des commentaires ou des idées de collaboration ? Nous aimerions vous entendre.",
    "about.contactBtn": "Nous Contacter",

    // Contact Page
    "contact.title": "Entrer en Contact",
    "contact.subtitle":
      "Nous aimerions vous entendre ! Que vous ayez une question sur les produits, besoin de support, ou que vous vouliez simplement dire bonjour — notre équipe est prête à vous aider.",
    "contact.callUs": "Appelez-nous",
    "contact.emailUs": "Écrivez-nous",
    "contact.visitUs": "Visitez-nous",
    "contact.sendMessage": "Envoyez-nous un Message",
    "contact.yourName": "Votre Nom",
    "contact.yourEmail": "Votre Email",
    "contact.subject": "Sujet",
    "contact.yourMessage": "Votre Message",
    "contact.sendBtn": "Envoyer le Message",

    // Try-On Page
    "tryon.title": "Essai Virtuel",
    "tryon.subtitle":
      "Utilisez votre webcam ou téléchargez une photo. Ajustez l'ajustement si nécessaire.",
    "tryon.useWebcam": "Utiliser la Webcam",
    "tryon.uploadPhoto": "Télécharger une Photo",
    "tryon.scale": "Échelle",
    "tryon.verticalOffset": "Décalage Vertical",

    // Checkout Pages
    "checkout.success": "Paiement Réussi !",
    "checkout.successDesc":
      "Merci pour votre commande. Votre paiement a été traité avec succès.",
    "checkout.emailSent":
      "Un email de confirmation a été envoyé à votre adresse email.",
    "checkout.orderProcessed":
      "Votre commande sera traitée et expédiée dans les 2-3 jours ouvrables.",
    "checkout.orderId": "ID de Commande",
    "checkout.viewOrders": "Voir Mes Commandes",
    "checkout.continueShopping": "Continuer les Achats",
    "checkout.cancelled": "Paiement Annulé",
    "checkout.cancelledDesc":
      "Votre paiement a été annulé. Aucun frais n'a été facturé à votre compte.",
    "checkout.contactSupport":
      "Si vous avez rencontré des problèmes lors du checkout, veuillez réessayer ou contacter notre équipe de support.",
    "checkout.returnToCart": "Retourner au Panier",

    // Auth Pages
    "auth.signInTitle": "Connectez-vous à votre compte",
    "auth.continueAsGuest": "continuer en tant qu'invité",
    "auth.emailAddress": "Adresse email",
    "auth.password": "Mot de passe",
    "auth.enterEmail": "Entrez votre email",
    "auth.enterPassword": "Entrez votre mot de passe",
    "auth.signingIn": "Connexion en cours...",
    "auth.signInWithGoogle": "Se connecter avec Google",
    "auth.demoCredentials": "Identifiants de démonstration",
    "auth.invalidCredentials": "Identifiants invalides",
    "auth.errorOccurred": "Une erreur s'est produite. Veuillez réessayer.",
    "auth.googleSignInFailed": "Connexion Google échouée",
  },

  AR: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.tryon": "جرب",
    "nav.about": "من نحن",
    "nav.categories": "الفئات",
    "nav.contact": "اتصل بنا",
    "nav.shop": "المتجر",
    "nav.men": "رجال",
    "nav.women": "نساء",
    "nav.kids": "أطفال",
    "nav.blueLight": "الضوء الأزرق",
    "nav.sunglasses": "النظارات الشمسية",

    "hero.title": "نظارات فاخرة",
    "hero.subtitle": "تجربة افتراضية",
    "hero.description":
      "اكتشف الأناقة الخالدة مع تجربتنا الافتراضية المدعومة بالذكاء الاصطناعي.",
    "hero.shopNow": "تسوق الآن",
    "hero.contactUs": "اتصل بنا",

    // Top bar
    "topbar.delivery": "التوصيل خلال 2-5 أيام",
    "topbar.freeShipping": "شحن مجاني لأكثر من 200$",

    // Auth
    "auth.signIn": "تسجيل الدخول",
    "auth.signOut": "تسجيل الخروج",
    "auth.admin": "المدير",

    // Cart
    "cart.title": "سلة التسوق",
    "cart.empty": "سلة التسوق فارغة",
    "cart.goToShop": "اذهب للمتجر",
    "cart.subtotal": "المجموع الفرعي",
    "cart.checkout": "الدفع",
    "cart.clear": "مسح السلة",
    "cart.remove": "إزالة",
    "cart.increase": "زيادة الكمية",
    "cart.decrease": "تقليل الكمية",

    // Product
    "product.addToCart": "أضف للسلة",
    "product.tryOn": "جرب",
    "product.outOfStock": "نفد المخزون",
    "product.lowStock": "مخزون منخفض",

    // Account
    "account.title": "حسابي",
    "account.welcome": "مرحباً بعودتك",
    "account.profile": "الملف الشخصي",
    "account.orders": "الطلبات",
    "account.gallery": "المعرض",
    "account.profileDesc": "إدارة معلوماتك الشخصية",
    "account.ordersDesc": "عرض تاريخ طلباتك",
    "account.galleryDesc": "صور التجربة الافتراضية",

    // Admin
    "admin.dashboard": "لوحة تحكم المدير",
    "admin.welcome": "مرحباً بك في لوحة تحكم LensVision",
    "admin.totalProducts": "إجمالي المنتجات",
    "admin.totalOrders": "إجمالي الطلبات",
    "admin.totalRevenue": "إجمالي الإيرادات",
    "admin.totalUsers": "إجمالي المستخدمين",
    "admin.addProduct": "إضافة منتج جديد",
    "admin.manageProducts": "إدارة المنتجات",
    "admin.viewOrders": "عرض الطلبات",
    "admin.addProductDesc": "إنشاء قائمة منتج جديدة",
    "admin.manageProductsDesc": "عرض وتعديل المنتجات الموجودة",
    "admin.viewOrdersDesc": "إدارة طلبات العملاء",

    // Home Page
    "home.exploreCollection": "استكشف مجموعتنا الأحدث",
    "home.signatureCollections": "مجموعاتنا المميزة",
    "home.whyChooseUs": "لماذا تختار Lens Vision؟",
    "home.premiumQuality": "جودة ممتازة",
    "home.premiumQualityDesc": "مصنوعة من مواد عالية الجودة للديمومة والأناقة.",
    "home.smartTechnology": "تقنية ذكية",
    "home.smartTechnologyDesc":
      "مرشحات الضوء الأزرق وتجربة افتراضية مدعومة بالذكاء الاصطناعي.",
    "home.luxuryDesign": "تصميم فاخر",
    "home.luxuryDesignDesc": "إطارات تحكي قصة الموضة العصرية.",
    "home.redefiningEyewear": "إعادة تعريف النظارات",
    "home.redefiningDesc":
      "في LensVision، لا نصنع النظارات فقط. نحن نصنع تجارب تدمج التكنولوجيا والأزياء والفخامة في واحد. كل إطار يحكي قصة أناقة.",
    "home.experienceTryOn": "جرب التجربة الافتراضية الآن",
    "home.experienceDesc":
      "ادخل إلى مستقبل النظارات مع تجربة التجربة الافتراضية السينمائية المدعومة بالذكاء الاصطناعي.",
    "home.startTryOn": "ابدأ التجربة الافتراضية",

    // Footer
    "footer.brandDesc":
      "اكتشف مستقبل تسوق النظارات مع تقنية التجربة الافتراضية المدعومة بالذكاء الاصطناعي.",
    "footer.quickLinks": "روابط سريعة",
    "footer.categories": "الفئات",
    "footer.support": "الدعم",
    "footer.copyright": "© 2025 LensVision. جميع الحقوق محفوظة.",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.close": "إغلاق",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.previous": "السابق",

    // About Page
    "about.title": "من نحن",
    "about.subtitle":
      "إعادة تعريف النظارات مع الحرفية المتميزة والتصميم الخالد وتقنية التجربة الافتراضية المتطورة.",
    "about.mission": "مهمتنا",
    "about.missionDesc":
      "تمكين الفردية بالنظارات التي تدمج التصميم الفاخر والراحة والابتكار.",
    "about.vision": "رؤيتنا",
    "about.visionDesc":
      "بناء مستقبل مستدام ومتقدم تقنياً لتجارب النظارات الأنيقة.",
    "about.craftsmanship": "الحرفية المتميزة",
    "about.craftsmanshipDesc":
      "كل إطار مصمم بعناية ومصنوع يدوياً بأفضل المواد.",
    "about.technology": "تقنية الجيل القادم",
    "about.technologyDesc":
      "التجربة الافتراضية بالذكاء الاصطناعي توفر معاينات فورية وواقعية لكل نمط.",
    "about.sustainability": "مستقبل مستدام",
    "about.sustainabilityDesc":
      "مواد صديقة للبيئة وتغليف قابل لإعادة التدوير لغد أكثر اخضراراً.",
    "about.team": "تعرف على الفريق",
    "about.contact": "تواصل معنا",
    "about.contactDesc":
      "لديك أسئلة أو ملاحظات أو أفكار للتعاون؟ نحب أن نسمع منك.",
    "about.contactBtn": "تواصل معنا",

    // Contact Page
    "contact.title": "تواصل معنا",
    "contact.subtitle":
      "نحب أن نسمع منك! سواء كان لديك سؤال حول المنتجات أو تحتاج دعم أو تريد فقط أن تقول مرحباً — فريقنا جاهز للمساعدة.",
    "contact.callUs": "اتصل بنا",
    "contact.emailUs": "راسلنا",
    "contact.visitUs": "زرنا",
    "contact.sendMessage": "أرسل لنا رسالة",
    "contact.yourName": "اسمك",
    "contact.yourEmail": "بريدك الإلكتروني",
    "contact.subject": "الموضوع",
    "contact.yourMessage": "رسالتك",
    "contact.sendBtn": "إرسال الرسالة",

    // Try-On Page
    "tryon.title": "التجربة الافتراضية",
    "tryon.subtitle":
      "استخدم كاميرا الويب أو ارفع صورة. اضبط الملاءمة إذا لزم الأمر.",
    "tryon.useWebcam": "استخدام كاميرا الويب",
    "tryon.uploadPhoto": "رفع صورة",
    "tryon.scale": "المقياس",
    "tryon.verticalOffset": "الإزاحة العمودية",

    // Checkout Pages
    "checkout.success": "تم الدفع بنجاح!",
    "checkout.successDesc": "شكراً لطلبك. تم معالجة دفعتك بنجاح.",
    "checkout.emailSent":
      "تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.",
    "checkout.orderProcessed": "سيتم معالجة طلبك وشحنه خلال 2-3 أيام عمل.",
    "checkout.orderId": "رقم الطلب",
    "checkout.viewOrders": "عرض طلباتي",
    "checkout.continueShopping": "متابعة التسوق",
    "checkout.cancelled": "تم إلغاء الدفع",
    "checkout.cancelledDesc": "تم إلغاء دفعتك. لم يتم خصم أي مبلغ من حسابك.",
    "checkout.contactSupport":
      "إذا واجهت أي مشاكل أثناء الدفع، يرجى المحاولة مرة أخرى أو الاتصال بفريق الدعم.",
    "checkout.returnToCart": "العودة إلى السلة",

    // Auth Pages
    "auth.signInTitle": "تسجيل الدخول إلى حسابك",
    "auth.continueAsGuest": "المتابعة كضيف",
    "auth.emailAddress": "عنوان البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.enterEmail": "أدخل بريدك الإلكتروني",
    "auth.enterPassword": "أدخل كلمة المرور",
    "auth.signingIn": "جاري تسجيل الدخول...",
    "auth.signInWithGoogle": "تسجيل الدخول بـ Google",
    "auth.demoCredentials": "بيانات الاعتماد التجريبية",
    "auth.invalidCredentials": "بيانات اعتماد غير صحيحة",
    "auth.errorOccurred": "حدث خطأ. يرجى المحاولة مرة أخرى.",
    "auth.googleSignInFailed": "فشل تسجيل الدخول بـ Google",
  },
};

const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "EN",
      setLanguage: (language: Language) => set({ currentLanguage: language }),
      getTranslation: (key: string) => {
        const currentLang = get().currentLanguage;
        return (
          translations[currentLang][
            key as keyof (typeof translations)[typeof currentLang]
          ] || key
        );
      },
    }),
    { name: "language-store" }
  )
);

export default useLanguageStore;
