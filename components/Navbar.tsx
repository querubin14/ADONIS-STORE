import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const { toggleCart, navbarLinks, products } = useShop();
  const [animateCart, setAnimateCart] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <>
      <AnnouncementBar />
      <nav className="sticky top-0 z-50 w-full border-b border-[#333] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-4">

          {/* LEFT: Mobile Menu + PC Logo */}
          <div className="flex-1 flex items-center justify-start opacity-100 z-10 transition-opacity">
            {/* Mobile Menu Toggle (Left on Mobile) */}
            <button
              className="flex lg:hidden p-2 text-white -ml-2"
              onClick={() => {
                const mobileMenu = document.getElementById('lateral-menu');
                if (mobileMenu) {
                  mobileMenu.classList.remove('translate-x-full');
                  mobileMenu.classList.add('translate-x-0');
                  document.getElementById('lateral-menu-overlay')?.classList.remove('hidden');
                }
              }}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* PC Logo (Left on Desktop) */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-2 group shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="h-12 w-auto flex items-center justify-center">
                <img src="/logo-final.png" alt="Adonis Logo" className="h-full w-auto object-contain filter brightness-110" />
              </div>
            </Link>
          </div>

          {/* CENTER MOBILE: Absolutely Center Logo */}
          <div className="flex lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="h-10 w-auto flex items-center justify-center pr-2">
                <img src="/logo-final.png" alt="Adonis Logo" className="h-[45px] w-auto object-contain filter brightness-110" />
              </div>
            </Link>
          </div>

          {/* CENTER PC: Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-[2] items-center justify-center relative z-10" ref={searchRef}>
            <div className="w-full max-w-xl relative flex items-center bg-transparent border border-gray-700 hover:border-white transition-colors rounded-full overflow-hidden">
              <input
                id="navbar-search"
                type="text"
                placeholder="¿Qué estás buscando? Escribí aquí..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-transparent text-white px-5 py-2.5 outline-none text-sm placeholder-gray-500 font-sans"
              />
              <button
                className="px-4 text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery('');
                  }
                  document.getElementById('navbar-search')?.focus();
                }}
              >
                {searchQuery ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>

            {/* Desktop Search Results Dropdown */}
            {isSearchOpen && searchQuery.length > 1 && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-in-from-top-2 z-50">
                {searchResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                    <div className="p-3 bg-white/5 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                      Resultados ({searchResults.length})
                    </div>
                    {searchResults.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0 text-left group"
                      >
                        <div className="w-10 h-12 overflow-hidden rounded bg-gray-900 flex-shrink-0">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white uppercase tracking-wide group-hover:text-gray-300 transition-colors line-clamp-1">{product.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Gs. {product.price.toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <span className="text-gray-600 text-xs uppercase tracking-widest block mb-1">Sin resultados</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Search Toggle (Mobile) + Cart */}
          <div className="flex-1 flex items-center gap-2 lg:gap-4 justify-end">
            {/* Mobile Search Button */}
            <button
              className="flex lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative flex items-center justify-center w-10 h-10 rounded hover:bg-white/10 transition-colors ${animateCart ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 text-[26px] ${animateCart ? 'scale-125' : 'scale-100'}`}>
                shopping_bag
              </span>

              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center transition-transform duration-300 border border-[#0a0a0a] ${animateCart ? 'scale-125' : 'scale-100'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Menu Toggle */}
            <button
              className="hidden lg:flex p-2 text-white hover:bg-white/10 rounded transition-colors"
              onClick={() => {
                const lateralMenu = document.getElementById('lateral-menu');
                if (lateralMenu) {
                  lateralMenu.classList.remove('translate-x-full');
                  lateralMenu.classList.add('translate-x-0');
                  document.getElementById('lateral-menu-overlay')?.classList.remove('hidden');
                }
              }}
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-[9999] bg-black flex flex-col h-[100dvh] w-full">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-800 bg-black shrink-0">
              <button
                onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }}
                className="p-2 text-white hover:bg-white/10 rounded-full"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1 flex items-center bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-gray-400"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 p-1">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-black">
              {searchQuery.length > 1 ? (
                searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                      Resultados ({searchResults.length})
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {searchResults.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl border border-gray-800 active:bg-gray-800 transition-all text-left"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white line-clamp-2 leading-snug">{product.name}</div>
                            <div className="text-sm text-primary font-black mt-1">Gs. {product.price.toLocaleString()}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-20 text-gray-500">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="text-sm font-medium">No encontramos nada para "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center pt-20 text-gray-600">
                  <p className="text-sm font-medium">Escribe para buscar...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lateral Side Menu (Both Mobile & Desktop) */}
        <div
          id="lateral-menu-overlay"
          className="fixed inset-0 bg-black/50 z-[990] hidden transition-opacity backdrop-blur-sm"
          onClick={() => {
            document.getElementById('lateral-menu')?.classList.add('translate-x-full');
            document.getElementById('lateral-menu')?.classList.remove('translate-x-0');
            document.getElementById('lateral-menu-overlay')?.classList.add('hidden');
          }}
        />
        <div
          id="lateral-menu"
          className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[400px] bg-[#0a0a0a] border-l border-gray-800 p-6 flex flex-col shadow-2xl z-[999] transition-transform duration-300 ease-in-out translate-x-full"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <div className="h-8 w-auto flex items-center justify-center">
              <img src="/logo-final.png" alt="Adonis Logo" className="h-[35px] w-auto object-contain filter brightness-110" />
            </div>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => {
                document.getElementById('lateral-menu')?.classList.add('translate-x-full');
                document.getElementById('lateral-menu')?.classList.remove('translate-x-0');
                document.getElementById('lateral-menu-overlay')?.classList.add('hidden');
              }}
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto">
            {navbarLinks.map(link => (
              <div key={link.id} className="flex flex-col gap-3 pb-4 border-b border-gray-800/50">
                <Link
                  className="text-lg font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors"
                  to={link.path}
                  onClick={() => {
                    document.getElementById('lateral-menu')?.classList.add('translate-x-full');
                    document.getElementById('lateral-menu-overlay')?.classList.add('hidden');
                  }}
                >
                  {link.label}
                </Link>
                {link.subcategories && link.subcategories.length > 0 && (
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-800 mt-2">
                    {link.subcategories.map(sub => (
                      <Link
                        key={sub}
                        to={`${link.path.replace(/\/$/, '')}/${sub.trim()}`}
                        className="text-gray-400 font-bold uppercase tracking-wider text-sm hover:text-white transition-colors"
                        onClick={() => {
                          document.getElementById('lateral-menu')?.classList.add('translate-x-full');
                          document.getElementById('lateral-menu-overlay')?.classList.add('hidden');
                        }}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 flex items-center gap-4 text-gray-500">
            <p className="text-xs font-bold uppercase tracking-widest">© ADONIS STORE 2026</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
