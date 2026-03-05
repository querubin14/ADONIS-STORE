import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { socialConfig, footerColumns } = useShop();

  return (
    <footer className="bg-[#050505] border-t border-gray-900 mt-auto pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-16 lg:gap-32 mb-20 text-center">

          {/* Brand & Info */}
          <div className="flex flex-col items-center gap-6 max-w-sm">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="h-10 md:h-12 w-auto flex items-center justify-center transition-transform hover:scale-105">
              <img src="/logo-final.png" alt="Adonis Logo" className="h-full w-auto object-contain filter brightness-110" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mt-2">
              {socialConfig.address || 'Joyería urbana y accesorios premium de máximo nivel. Piezas diseñadas para quienes imponen estilo y no siguen tendencias.'}
            </p>
            <div className="flex items-center justify-center gap-8 mt-4">
              <a className="text-gray-400 hover:text-white transition-colors text-[11px] font-black uppercase tracking-[0.2em]" href={socialConfig.instagram || '#'} target="_blank" rel="noreferrer">INSTAGRAM</a>
              <a className="text-gray-400 hover:text-white transition-colors text-[11px] font-black uppercase tracking-[0.2em]" href={socialConfig.tiktok || '#'} target="_blank" rel="noreferrer">TIKTOK</a>
            </div>
          </div>

          {/* Dynamic Links Columns */}
          {footerColumns && footerColumns.length > 0 && (
            <div className="flex flex-wrap justify-center gap-16 md:gap-32 w-full max-w-2xl">
              {footerColumns.map(col => (
                <div key={col.id} className="min-w-[140px] flex-1 flex flex-col items-center">
                  <h3 className="text-white font-black uppercase tracking-[0.15em] mb-6 text-base md:text-lg flex items-center justify-center w-full text-center">{col.title}</h3>
                  <ul className="flex flex-col items-center gap-5 text-base md:text-[17px] text-gray-400 w-full">
                    {col.links.map(link => (
                      <li key={link.id} className="w-full flex justify-center">
                        <a className="hover:text-white transition-colors text-center inline-block" href={link.url}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
          <div className="flex flex-col md:flex-row items-center md:gap-4 gap-2">
            <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-[0.1em]">© 2026 ADONIS STORE. Todos los derechos reservados.</p>
            <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-[0.1em] md:border-l md:border-gray-800 md:pl-4">
              Desarrollado por <span className="text-white font-black tracking-widest">HoriZon</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
            <Link className="hover:text-white transition-colors" to="/privacy-policy">Privacidad</Link>
            <Link className="hover:text-white transition-colors" to="/terms-of-use">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
