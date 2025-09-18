import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "EN" | "IT" | "FR" | "DE";

// Define the translation keys type
export type TranslationKey = 
  | "nav.home" | "nav.tryon" | "nav.about" | "nav.categories" | "nav.contact" | "nav.shop" | "nav.men" | "nav.women" | "nav.kids" | "nav.blueLight" | "nav.sunglasses"
  | "hero.title" | "hero.subtitle" | "hero.description" | "hero.shopNow" | "hero.contactUs"
  | "topbar.delivery" | "topbar.freeShipping"
  | "auth.signIn" | "auth.signOut" | "auth.admin" | "auth.signInTitle" | "auth.continueAsGuest" | "auth.emailAddress" | "auth.password" | "auth.enterEmail" | "auth.enterPassword" | "auth.signingIn" | "auth.signInWithGoogle" | "auth.demoCredentials" | "auth.invalidCredentials" | "auth.errorOccurred" | "auth.googleSignInFailed"
  | "cart.title" | "cart.empty" | "cart.goToShop" | "cart.subtotal" | "cart.checkout" | "cart.clear" | "cart.remove" | "cart.increase" | "cart.decrease"
  | "product.addToCart" | "product.tryOn" | "product.outOfStock" | "product.lowStock"
  | "account.title" | "account.welcome" | "account.profile" | "account.orders" | "account.gallery" | "account.profileDesc" | "account.ordersDesc" | "account.galleryDesc"
  | "admin.dashboard" | "admin.welcome" | "admin.totalProducts" | "admin.totalOrders" | "admin.totalRevenue" | "admin.totalUsers" | "admin.addProduct" | "admin.manageProducts" | "admin.viewOrders" | "admin.addProductDesc" | "admin.manageProductsDesc" | "admin.viewOrdersDesc"
  | "home.exploreCollection" | "home.signatureCollections" | "home.whyChooseUs" | "home.premiumQuality" | "home.premiumQualityDesc" | "home.smartTechnology" | "home.smartTechnologyDesc" | "home.luxuryDesign" | "home.luxuryDesignDesc" | "home.redefiningEyewear" | "home.redefiningDesc" | "home.experienceTryOn" | "home.experienceDesc" | "home.startTryOn"
  | "footer.brandDesc" | "footer.quickLinks" | "footer.categories" | "footer.support" | "footer.copyright"
  | "about.title" | "about.subtitle" | "about.mission" | "about.missionDesc" | "about.vision" | "about.visionDesc" | "about.craftsmanship" | "about.craftsmanshipDesc" | "about.technology" | "about.technologyDesc" | "about.sustainability" | "about.sustainabilityDesc" | "about.team" | "about.contact" | "about.contactDesc" | "about.contactBtn"
  | "contact.title" | "contact.subtitle" | "contact.callUs" | "contact.emailUs" | "contact.visitUs" | "contact.sendMessage" | "contact.yourName" | "contact.yourEmail" | "contact.subject" | "contact.yourMessage" | "contact.sendBtn"
  | "tryon.title" | "tryon.subtitle" | "tryon.useWebcam" | "tryon.uploadPhoto" | "tryon.scale" | "tryon.verticalOffset"
  | "checkout.success" | "checkout.successDesc" | "checkout.emailSent" | "checkout.orderProcessed" | "checkout.orderId" | "checkout.viewOrders" | "checkout.continueShopping" | "checkout.cancelled" | "checkout.cancelledDesc" | "checkout.contactSupport" | "checkout.returnToCart"
  | "common.loading" | "common.error" | "common.success" | "common.cancel" | "common.save" | "common.edit" | "common.delete" | "common.close" | "common.back" | "common.next" | "common.previous";

export interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getTranslation: (key: TranslationKey) => string;
}

// Define the translations type
interface Translations {
  [language: string]: {
    [key in TranslationKey]?: string;
  };
}

// Translation data
const translations: Translations = {
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

  IT: {
    // Navigation
    "nav.home": "Home",
    "nav.tryon": "Prova Virtuale",
    "nav.about": "Chi Siamo",
    "nav.categories": "Categorie",
    "nav.contact": "Contattaci",
    "nav.shop": "Negozio",
    "nav.men": "Uomini",
    "nav.women": "Donne",
    "nav.kids": "Bambini",
    "nav.blueLight": "Luce Blu",
    "nav.sunglasses": "Occhiali da Sole",

    "hero.title": "Occhiali di Lusso",
    "hero.subtitle": "Prova Virtuale",
    "hero.description":
      "Scopri l'eleganza senza tempo con la nostra esperienza di prova virtuale alimentata dall'IA.",
    "hero.shopNow": "Acquista Ora",
    "hero.contactUs": "Contattaci",

    // Top bar
    "topbar.delivery": "Consegna in 2-5 giorni",
    "topbar.freeShipping": "Spedizione gratuita oltre 200€",

    // Auth
    "auth.signIn": "Accedi",
    "auth.signOut": "Esci",
    "auth.admin": "Amministratore",

    // Cart
    "cart.title": "Il Tuo Carrello",
    "cart.empty": "Il tuo carrello è vuoto",
    "cart.goToShop": "Vai al Negozio",
    "cart.subtotal": "Subtotale",
    "cart.checkout": "Procedi al Checkout",
    "cart.clear": "Svuota carrello",
    "cart.remove": "Rimuovi",
    "cart.increase": "Aumenta quantità",
    "cart.decrease": "Diminuisci quantità",

    // Product
    "product.addToCart": "Aggiungi al Carrello",
    "product.tryOn": "Prova",
    "product.outOfStock": "Esaurito",
    "product.lowStock": "Scorte limitate",

    // Account
    "account.title": "Il Mio Account",
    "account.welcome": "Bentornato",
    "account.profile": "Profilo",
    "account.orders": "Ordini",
    "account.gallery": "Galleria",
    "account.profileDesc": "Gestisci le tue informazioni personali",
    "account.ordersDesc": "Visualizza la cronologia ordini",
    "account.galleryDesc": "Le tue foto di prova virtuale",

    // Admin
    "admin.dashboard": "Pannello di Amministrazione",
    "admin.welcome": "Benvenuto nel pannello di amministrazione LensVision",
    "admin.totalProducts": "Prodotti Totali",
    "admin.totalOrders": "Ordini Totali",
    "admin.totalRevenue": "Fatturato Totale",
    "admin.totalUsers": "Utenti Totali",
    "admin.addProduct": "Aggiungi Nuovo Prodotto",
    "admin.manageProducts": "Gestisci Prodotti",
    "admin.viewOrders": "Visualizza Ordini",
    "admin.addProductDesc": "Crea una nuova scheda prodotto",
    "admin.manageProductsDesc": "Visualizza e modifica prodotti esistenti",
    "admin.viewOrdersDesc": "Gestisci ordini clienti",

    // Home Page
    "home.exploreCollection": "Esplora la Nostra Ultima Collezione",
    "home.signatureCollections": "Le Nostre Collezioni Signature",
    "home.whyChooseUs": "Perché Scegliere Lens Vision?",
    "home.premiumQuality": "Qualità Premium",
    "home.premiumQualityDesc":
      "Realizzati con materiales di prima qualità per durabilità ed eleganza.",
    "home.smartTechnology": "Tecnologia Intelligente",
    "home.smartTechnologyDesc": "Filtri luce blu e prova virtuale con IA.",
    "home.luxuryDesign": "Design di Lusso",
    "home.luxuryDesignDesc": "Montature che raccontano una storia di moda moderna.",
    "home.redefiningEyewear": "Ridefinire gli Occhiali",
    "home.redefiningDesc":
      "In LensVision, non produciamo solo occhiali. Creiamo esperienze che uniscono tecnologia, moda e lusso in un unico prodotto. Ogni montatura racconta una storia di eleganza.",
    "home.experienceTryOn": "Prova la Prova Virtuale Ora",
    "home.experienceDesc":
      "Entra nel futuro degli occhiali con la nostra esperienza cinematografica di prova virtuale alimentata dall'IA.",
    "home.startTryOn": "Inizia la Prova Virtuale",

    // Footer
    "footer.brandDesc":
      "Sperimenta il futuro dello shopping di occhiali con la nostra tecnologia di prova virtuale alimentata dall'IA.",
    "footer.quickLinks": "Link Rapidi",
    "footer.categories": "Categorie",
    "footer.support": "Supporto",
    "footer.copyright": "© 2025 LensVision. Tutti i diritti riservati.",

    // About Page
    "about.title": "Chi Siamo",
    "about.subtitle":
      "Ridefiniamo gli occhiali con artigianato di qualità, design senza tempo e tecnologia all'avanguardia per la prova virtuale.",
    "about.mission": "La Nostra Missione",
    "about.missionDesc":
      "Potenziare l'individualità con occhiali che uniscono design di lusso, comfort e innovazione.",
    "about.vision": "La Nostra Visione",
    "about.visionDesc":
      "Costruire un futuro sostenibile e tecnologicamente avanzato per le esperienze di occhiali di moda.",
    "about.craftsmanship": "Artigianato di Qualità",
    "about.craftsmanshipDesc":
      "Ogni montatura è progettata con cura e realizzata a mano con i materiali migliori.",
    "about.technology": "Tecnologia di Nuova Generazione",
    "about.technologyDesc":
      "La prova virtuale con IA offre anteprime istantanee e realistiche per ogni stile.",
    "about.sustainability": "Futuro Sostenibile",
    "about.sustainabilityDesc":
      "Materiali ecologici e imballaggi riciclabili per un domani più verde.",
    "about.team": "Incontra il Team",
    "about.contact": "Mettiti in Contatto",
    "about.contactDesc":
      "Hai domande, feedback o idee di collaborazione? Ci piacerebbe sentirti.",
    "about.contactBtn": "Contattaci",

    // Contact Page
    "contact.title": "Mettiti in Contatto",
    "contact.subtitle":
      "Ci piacerebbe sentirti! Che tu abbia domande sui prodotti, bisogno di supporto o voglia semplicemente di salutare, il nostro team è pronto ad aiutarti.",
    "contact.callUs": "Chiamaci",
    "contact.emailUs": "Scrivici",
    "contact.visitUs": "Visita il nostro negozio",
    "contact.sendMessage": "Inviaci un Messaggio",
    "contact.yourName": "Il Tuo Nome",
    "contact.yourEmail": "La Tua Email",
    "contact.subject": "Oggetto",
    "contact.yourMessage": "Il Tuo Messaggio",
    "contact.sendBtn": "Invia Messaggio",

    // Try-On Page
    "tryon.title": "Prova Virtuale",
    "tryon.subtitle":
      "Usa la webcam o carica una foto. Regola la vestibilità se necessario.",
    "tryon.useWebcam": "Usa Webcam",
    "tryon.uploadPhoto": "Carica Foto",
    "tryon.scale": "Scala",
    "tryon.verticalOffset": "Offset Verticale",

    // Checkout Pages
    "checkout.success": "Pagamento Riuscito!",
    "checkout.successDesc":
      "Grazie per il tuo ordine. Il tuo pagamento è stato elaborato con successo.",
    "checkout.emailSent":
      "Un'email di conferma è stata inviata al tuo indirizzo email.",
    "checkout.orderProcessed":
      "Il tuo ordine verrà elaborato e spedito entro 2-3 giorni lavorativi.",
    "checkout.orderId": "ID Ordine",
    "checkout.viewOrders": "Visualizza i Miei Ordini",
    "checkout.continueShopping": "Continua gli Acquisti",
    "checkout.cancelled": "Pagamento Annullato",
    "checkout.cancelledDesc":
      "Il tuo pagamento è stato annullato. Non sono stati addebitati importi sul tuo account.",
    "checkout.contactSupport":
      "Se hai riscontrato problemi durante il checkout, riprova or contatta il nostro team di supporto.",
    "checkout.returnToCart": "Torna al Carrello",

    // Auth Pages
    "auth.signInTitle": "Accedi al tuo account",
    "auth.continueAsGuest": "continua come ospite",
    "auth.emailAddress": "Indirizzo email",
    "auth.password": "Password",
    "auth.enterEmail": "Inserisci la tua email",
    "auth.enterPassword": "Inserisci la tua password",
    "auth.signingIn": "Accesso in corso...",
    "auth.signInWithGoogle": "Accedi con Google",
    "auth.demoCredentials": "Credenziali demo",
    "auth.invalidCredentials": "Credenziali non valide",
    "auth.errorOccurred": "Si è verificato un errore. Riprova.",
    "auth.googleSignInFailed": "Accesso con Google fallito",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    "common.cancel": "Annulla",
    "common.save": "Salva",
    "common.edit": "Modifica",
    "common.delete": "Elimina",
    "common.close": "Chiudi",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.previous": "Precedente",
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
      "Découvrez l'élégance intemporelle avec notre expérience d'essai virtuel alimentée par l'IA.",
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
    "common.previous": "Precedente",

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

  DE: {
    // Navigation
    "nav.home": "Startseite",
    "nav.tryon": "Anprobieren",
    "nav.about": "Über uns",
    "nav.categories": "Kategorien",
    "nav.contact": "Kontakt",
    "nav.shop": "Shop",
    "nav.men": "Herren",
    "nav.women": "Damen",
    "nav.kids": "Kinder",
    "nav.blueLight": "Blaulichtfilter",
    "nav.sunglasses": "Sonnenbrillen",

    "hero.title": "Luxusbrillen",
    "hero.subtitle": "Virtuelle Anprobe",
    "hero.description":
      "Entdecken Sie zeitlose Eleganz mit unserer KI-gestützten virtuellen Anprobe.",
    "hero.shopNow": "Jetzt einkaufen",
    "hero.contactUs": "Kontaktieren Sie uns",

    // Top bar
    "topbar.delivery": "Lieferung in 2–5 Tagen",
    "topbar.freeShipping": "Kostenloser Versand ab 200$",

    // Auth
    "auth.signIn": "Anmelden",
    "auth.signOut": "Abmelden",
    "auth.admin": "Administrator",

    // Cart
    "cart.title": "Warenkorb",
    "cart.empty": "Ihr Warenkorb ist leer",
    "cart.goToShop": "Zum Shop",
    "cart.subtotal": "Zwischensumme",
    "cart.checkout": "Zur Kasse",
    "cart.clear": "Warenkorb leeren",
    "cart.remove": "Entfernen",
    "cart.increase": "Menge erhöhen",
    "cart.decrease": "Menge verringern",

    // Product
    "product.addToCart": "In den Warenkorb",
    "product.tryOn": "Anprobieren",
    "product.outOfStock": "Nicht auf Lager",
    "product.lowStock": "Geringer Bestand",

    // Account
    "account.title": "Mein Konto",
    "account.welcome": "Willkommen zurück",
    "account.profile": "Profil",
    "account.orders": "Bestellungen",
    "account.gallery": "Galerie",
    "account.profileDesc": "Verwalten Sie Ihre persönlichen Daten",
    "account.ordersDesc": "Bestellverlauf anzeigen",
    "account.galleryDesc": "Virtuelle Anprobe-Bilder",

    // Admin
    "admin.dashboard": "Admin-Dashboard",
    "admin.welcome": "Willkommen im LensVision-Dashboard",
    "admin.totalProducts": "Gesamtprodukte",
    "admin.totalOrders": "Gesamtbestellungen",
    "admin.totalRevenue": "Gesamtumsatz",
    "admin.totalUsers": "Gesamtnutzer",
    "admin.addProduct": "Neues Produkt hinzufügen",
    "admin.manageProducts": "Produkte verwalten",
    "admin.viewOrders": "Bestellungen ansehen",
    "admin.addProductDesc": "Neue Produktliste erstellen",
    "admin.manageProductsDesc": "Vorhandene Produkte anzeigen und bearbeiten",
    "admin.viewOrdersDesc": "Kundenbestellungen verwalten",

    // Home Page
    "home.exploreCollection": "Entdecken Sie unsere neueste Kollektion",
    "home.signatureCollections": "Unsere Signature-Kollektionen",
    "home.whyChooseUs": "Warum Lens Vision?",
    "home.premiumQuality": "Premiumqualität",
    "home.premiumQualityDesc": "Hergestellt aus hochwertigen Materialien für Langlebigkeit und Stil.",
    "home.smartTechnology": "Intelligente Technologie",
    "home.smartTechnologyDesc":
      "Blaulichtfilter und KI-gestützte virtuelle Anprobe.",
    "home.luxuryDesign": "Luxuriöses Design",
    "home.luxuryDesignDesc": "Fassungen, die Modegeschichten erzählen.",
    "home.redefiningEyewear": "Brillen neu definiert",
    "home.redefiningDesc":
      "Bei LensVision stellen wir nicht nur Brillen her – wir schaffen Erlebnisse, die Technologie, Mode und Luxus vereinen. Jede Fassung erzählt eine storia di eleganza.",
    "home.experienceTryOn": "Erleben Sie die virtuelle Anprobe jetzt",
    "home.experienceDesc":
      "Tauchen Sie ein in die Zukunft der Brillen mit der KI-gestützten virtuellen Anprobe im Kino-Stil.",
    "home.startTryOn": "Virtuelle Anprobe starten",

    // Footer
    "footer.brandDesc":
      "Entdecken Sie die Zukunft des Brilleneinkaufs mit KI-gestützter virtueller Anprobe.",
    "footer.quickLinks": "Schnellzugriff",
    "footer.categories": "Kategorien",
    "footer.support": "Support",
    "footer.copyright": "© 2025 LensVision. Alle Rechte vorbehalten.",

    // Common
    "common.loading": "Lädt...",
    "common.error": "Fehler",
    "common.success": "Erfolgreich",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.close": "Schließen",
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.previous": "Zurück",

    // About Page
    "about.title": "Über uns",
    "about.subtitle":
      "Brillen neu definiert – mit außergewöhnlicher Handwerkskunst, zeitlosem Design und modernster virtueller Anprobetechnologie.",
    "about.mission": "Unsere Mission",
    "about.missionDesc":
      "Individualität stärken mit Brillen, die Luxusdesign, Komfort und Innovation vereinen.",
    "about.vision": "Unsere Vision",
    "about.visionDesc":
      "Eine nachhaltige, technologisch fortschrittliche Zukunft für stilvolle Brillenerlebnisse schaffen.",
    "about.craftsmanship": "Außergewöhnliche Handwerkskunst",
    "about.craftsmanshipDesc":
      "Jede Fassung wird sorgfältig entworfen und aus den besten Materialien handgefertigt.",
    "about.technology": "Next-Gen-Technologie",
    "about.technologyDesc":
      "Die KI-gestützte virtuelle Anprobe bietet sofortige und realistische Vorschauen für jeden Stil.",
    "about.sustainability": "Nachhaltige Zukunft",
    "about.sustainabilityDesc":
      "Umweltfreundliche Materialien und recycelbare Verpackungen für eine grünere Zukunft.",
    "about.team": "Lernen Sie unser Team kennen",
    "about.contact": "Kontaktieren Sie uns",
    "about.contactDesc":
      "Haben Sie Fragen, Feedback oder Kooperationsideen? Wir freuen uns auf Ihre Nachricht.",
    "about.contactBtn": "Kontakt aufnehmen",

    // Contact Page
    "contact.title": "Kontaktieren Sie uns",
    "contact.subtitle":
      "Wir freuen uns, von Ihnen zu hören! Ob Fragen zu unseren Produkten, Supportanfragen oder einfach nur ein Hallo – unser Team ist für Sie da.",
    "contact.callUs": "Rufen Sie uns an",
    "contact.emailUs": "Schreiben Sie uns",
    "contact.visitUs": "Besuchen Sie uns",
    "contact.sendMessage": "Senden Sie uns eine Nachricht",
    "contact.yourName": "Ihr Name",
    "contact.yourEmail": "Ihre E-Mail",
    "contact.subject": "Betreff",
    "contact.yourMessage": "Ihre Nachricht",
    "contact.sendBtn": "Nachricht senden",

    // Try-On Page
    "tryon.title": "Virtuelle Anprobe",
    "tryon.subtitle":
      "Verwenden Sie Ihre Webcam oder laden Sie ein Foto hoch. Passen Sie die Größe bei Bedarf an.",
    "tryon.useWebcam": "Webcam verwenden",
    "tryon.uploadPhoto": "Foto hochladen",
    "tryon.scale": "Skalierung",
    "tryon.verticalOffset": "Vertikaler Versatz",

    // Checkout Pages
    "checkout.success": "Bezahlung erfolgreich!",
    "checkout.successDesc": "Vielen Dank für Ihre Bestellung. Ihre Zahlung wurde erfolgreich verarbeitet.",
    "checkout.emailSent":
      "Eine Bestätigungs-E-Mail wurde an Ihre Adresse gesendet.",
    "checkout.orderProcessed": "Ihre Bestellung wird innerhalb von 2–3 Werktagen bearbeitet und versandt.",
    "checkout.orderId": "Bestellnummer",
    "checkout.viewOrders": "Meine Bestellungen ansehen",
    "checkout.continueShopping": "Weiter einkaufen",
    "checkout.cancelled": "Zahlung abgebrochen",
    "checkout.cancelledDesc": "Ihre Zahlung wurde abgebrochen. Es wurde kein Betrag abgebucht.",
    "checkout.contactSupport":
      "Falls Sie Probleme beim Bezahlen hatten, versuchen Sie es bitte erneut oder wenden Sie sich an den Support.",
    "checkout.returnToCart": "Zurück zum Warenkorb",

    // Auth Pages
    "auth.signInTitle": "Melden Sie sich bei Ihrem Konto an",
    "auth.continueAsGuest": "Als Gast fortfahren",
    "auth.emailAddress": "E-Mail-Adresse",
    "auth.password": "Passwort",
    "auth.enterEmail": "E-Mail eingeben",
    "auth.enterPassword": "Passwort eingeben",
    "auth.signingIn": "Anmeldung läuft...",
    "auth.signInWithGoogle": "Mit Google anmelden",
    "auth.demoCredentials": "Demo-Zugangsdaten",
    "auth.invalidCredentials": "Ungültige Zugangsdaten",
    "auth.errorOccurred": "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    "auth.googleSignInFailed": "Google-Anmeldung fehlgeschlagen"
  },
};
const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "EN",
      setLanguage: (language: Language) => set({ currentLanguage: language }),
      getTranslation: (key: TranslationKey) => {
        const currentLang = get().currentLanguage;
        const langTranslations = translations[currentLang];
        
        // Check if the language exists and has the translation
        if (langTranslations && langTranslations[key]) {
          return langTranslations[key] as string;
        }
        
        // Fallback to English if translation is missing
        const englishTranslations = translations.EN;
        if (englishTranslations && englishTranslations[key]) {
          return englishTranslations[key] as string;
        }
        
        // Final fallback - return the key itself
        return key;
      },
    }),
    { name: "language-store" }
  )
);

export default useLanguageStore;
