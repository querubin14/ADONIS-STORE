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
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          {/* Logo */}
          {/* Mobile Logo */}
          <Link
            to="/"
            className="flex md:hidden items-center gap-2 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-10 w-auto flex items-center justify-center">
              <img src="/logo-final.png" alt="Adonis Logo" className="h-full w-auto object-contain filter brightness-110" />
            </div>
          </Link>

          {/* Desktop Navigation (Centered Split) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:gap-14 w-full justify-center pointer-events-none">

            {/* Left Links */}
            <div className="flex items-center gap-6 lg:gap-8 pointer-events-auto">
              {navbarLinks.slice(0, Math.ceil(navbarLinks.length / 2)).map(link => (
                <div key={link.id} className="relative group h-full flex items-center justify-center">
                  <Link
                    className="text-gray-400 hover:text-white hover:font-bold transition-all text-sm font-medium uppercase tracking-widest relative py-2"
                    to={link.path}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                  </Link>

                  {/* Subcategories Dropdown */}
                  {link.subcategories && link.subcategories.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block w-64 z-50">
                      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 shadow-2xl flex flex-col gap-3 backdrop-blur-md bg-[#0a0a0a]/95">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0a0a] border-t border-l border-gray-800 transform rotate-45"></div>
                        {link.subcategories.map(sub => (
                          <Link
                            key={sub}
                            to={`${link.path.replace(/\/$/, '')}/${sub.trim()}`}
                            className="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-all"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Logo (Center) */}
            <Link
              to="/"
              className="flex items-center justify-center transform hover:scale-105 transition-transform pointer-events-auto px-4"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="h-14 lg:h-16 w-auto flex items-center justify-center">
                <img src="/logo-final.png" alt="Adonis Logo" className="h-full w-auto object-contain filter brightness-110" />
              </div>
            </Link>

            {/* Right Links */}
            <div className="flex items-center gap-6 lg:gap-8 pointer-events-auto">
              {navbarLinks.slice(Math.ceil(navbarLinks.length / 2)).map(link => (
                <div key={link.id} className="relative group h-full flex items-center justify-center">
                  <Link
                    className="text-gray-400 hover:text-white hover:font-bold transition-all text-sm font-medium uppercase tracking-widest relative py-2"
                    to={link.path}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                  </Link>

                  {/* Subcategories Dropdown */}
                  {link.subcategories && link.subcategories.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block w-64 z-50">
                      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 shadow-2xl flex flex-col gap-3 backdrop-blur-md bg-[#0a0a0a]/95">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0a0a] border-t border-l border-gray-800 transform rotate-45"></div>
                        {link.subcategories.map(sub => (
                          <Link
                            key={sub}
                            to={`${link.path.replace(/\/$/, '')}/${sub.trim()}`}
                            className="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-all"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Right Actions: Search + Cart */}
          <div className="flex items-center gap-1 md:gap-4 relative ml-auto">

            {/* Search */}
            <div ref={searchRef} className="hidden md:flex items-center relative transition-all">
              <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-60 bg-white/5 border-gray-700' : 'w-8 border-transparent'} border rounded-full overflow-hidden`}>
                <button
                  onClick={() => {
                    if (isSearchOpen && !searchQuery) { setIsSearchOpen(false); return; }
                    setIsSearchOpen(true);
                    setTimeout(() => document.getElementById('navbar-search')?.focus(), 50);
                  }}
                  className={`p-2 hover:text-white transition-colors flex items-center justify-center ${isSearchOpen ? 'text-gray-300' : 'text-gray-400'}`}
                >
                  <Search size={18} />
                </button>
                <input
                  id="navbar-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="BUSCAR..."
                  className={`bg-transparent border-none outline-none text-xs font-bold tracking-wider text-white placeholder-gray-600 transition-all duration-300 ${isSearchOpen ? 'w-full px-2 opacity-100' : 'w-0 px-0 opacity-0'}`}
                />
                {isSearchOpen && searchQuery && (
                  <button onClick={() => { setSearchQuery(''); document.getElementById('navbar-search')?.focus(); }} className="p-2 text-gray-500 hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Results Dropdown */}
              {isSearchOpen && searchQuery.length > 1 && (
                <div className="absolute top-12 right-0 w-80 bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-in-from-top-2 z-50">
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
                            <div className="font-bold text-xs text-white uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-1">{product.name}</div>
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

            {/* Mobile Search Button */}
            <button
              className="flex md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded hover:bg-white/10 transition-colors ${animateCart ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 text-[24px] ${animateCart ? 'scale-125' : 'scale-100'}`}>
                shopping_bag
              </span>

              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 md:top-0 md:right-0 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] flex items-center justify-center transition-transform duration-300 border border-[#0a0a0a] ${animateCart ? 'scale-125' : 'scale-100'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="flex md:hidden p-2 text-white ml-2"
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.toggle('hidden');
              }}
            >
              <span className="material-symbols-outlined">menu</span>
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

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden absolute top-20 left-0 w-full bg-[#0a0a0a] border-b border-gray-800 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4">
          {navbarLinks.map(link => (
            <Link
              key={link.id}
              className="text-lg font-bold uppercase tracking-widest text-white hover:text-primary transition-colors border-b border-gray-800 pb-2"
              to={link.path}
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              {link.label}
            </Link>
          ))}
          {/* Helper Link for Admin if needed or just general links */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
