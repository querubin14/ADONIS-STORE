import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { socialConfig, footerColumns } = useShop();

  return (
    <footer className="bg-[#050505] border-t border-gray-900 mt-auto pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row flex-wrap justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6 md:w-1/3">
            <div className="flex items-center gap-2 text-white">
              <div className="h-8 w-auto flex items-center justify-center text-primary">
                <img src="/logo-final.png" alt="Adonis Logo" className="h-full w-auto object-contain filter brightness-110" />
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              {socialConfig.address || 'Joyería urbana y accesorios premium de máximo nivel. Piezas diseñadas para quienes imponen estilo y no siguen tendencias.'}
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-widest" href={socialConfig.instagram || '#'} target="_blank" rel="noreferrer">INSTAGRAM</a>
              <a className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-widest" href={socialConfig.tiktok || '#'} target="_blank" rel="noreferrer">TIKTOK</a>
            </div>
          </div>

          {/* Dynamic Links Columns */}
          <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
            {footerColumns && footerColumns.map(col => (
              <div key={col.id}>
                <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">{col.title}</h3>
                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                  {col.links.map(link => (
                    <li key={link.id}>
                      <a className="hover:text-white transition-colors" href={link.url}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">© 2026 ADONIS STORE. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link className="hover:text-gray-400" to="/privacy-policy">Política de Privacidad</Link>
            <Link className="hover:text-gray-400" to="/terms-of-use">Términos de Uso</Link>
            <Link className="hover:text-gray-400" to="/care-guide">Cuidados de las Joyas</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
