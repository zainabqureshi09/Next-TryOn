"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "@/hooks/use-translation"; // fixed import

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-300 text-white py-12 sm:py-16 font-playfair border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 px-4 sm:px-6">
        
        {/* Brand */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-300 mb-3 tracking-wide drop-shadow-lg">
            LensVision
          </h3>
          <p className="text-sm text-purple-200/80 leading-relaxed max-w-sm mb-4">
            {t('footer.brandDesc')}
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { Icon: FaFacebookF, link: "https://facebook.com", label: "Facebook" },
              { Icon: FaInstagram, link: "https://instagram.com", label: "Instagram" },
              { Icon: FaTwitter, link: "https://twitter.com", label: "Twitter" },
              { Icon: FaLinkedinIn, link: "https://linkedin.com", label: "LinkedIn" },
            ].map(({ Icon, link, label }, idx) => (
              <Link 
                key={idx} 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Follow us on ${label}`}
                className="p-2 bg-purple-800/40 rounded-full hover:bg-purple-600 transition-colors duration-300 shadow-md flex items-center justify-center min-h-[40px] min-w-[40px] focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <Icon className="text-base text-purple-200 hover:text-white" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base sm:text-lg mb-4 sm:mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {[
              { name: t('nav.home'), link: "/" },
              { name: t('nav.shop'), link: "/shop" },
              { name: t('nav.tryon'), link: "/tryon" },
              { name: t('nav.about'), link: "/about" },
            ].map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.link} 
                  className="text-sm sm:text-base text-purple-200 hover:text-white transition-colors duration-300 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:text-white rounded-sm px-1 py-1 -mx-1 block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-base sm:text-lg mb-4 sm:mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            {t('footer.support')}
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {[
              { name: "Privacy Policy", link: "/privacy" },
              { name: "Terms & Conditions", link: "/terms" },
              { name: "Returns & Refunds", link: "/refunds" },
              { name: "Shipping Info", link: "/shipping" },
            ].map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.link} 
                  className="text-sm sm:text-base text-purple-200 hover:text-white transition-colors duration-300 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:text-white rounded-sm px-1 py-1 -mx-1 block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-base sm:text-lg mb-4 sm:mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            {t('nav.contact')}
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-purple-200/80 flex items-center gap-2">
              <span aria-hidden="true">📧</span>
              <a 
                href="mailto:support@lensvision.com" 
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:text-white rounded-sm px-1 py-1 -mx-1"
              >
                support@lensvision.com
              </a>
            </p>
            <p className="text-sm text-purple-200/80 flex items-center gap-2">
              <span aria-hidden="true">📞</span>
              <a 
                href="tel:+1-800-LENS-VISION" 
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:text-white rounded-sm px-1 py-1 -mx-1"
              >
                +1-800-LENS-VISION
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-8 sm:mt-10 pt-4 sm:pt-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-4">
          <p className="text-xs text-purple-200/70 tracking-wide text-center sm:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Image 
              src="/assets/visa.png" 
              alt="Visa accepted" 
              height={24} 
              width={48} 
              className="transition hover:opacity-80 bg-white/10 rounded p-1" 
            />
            <Image 
              src="/assets/master.png" 
              alt="MasterCard accepted" 
              height={24} 
              width={48} 
              className="transition hover:opacity-80 bg-white/10 rounded p-1" 
            />
            <Image 
              src="/assets/paypal.png" 
              alt="PayPal accepted" 
              height={24} 
              width={48} 
              className="transition hover:opacity-80 bg-white/10 rounded p-1" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
