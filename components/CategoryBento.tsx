
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const CategoryBento: React.FC = () => {
  const { bannerBento } = useShop();

  // Fallback defaults or use array indices
  const large = bannerBento[0];
  const topRight = bannerBento[1];
  const bottomRight = bannerBento[2];

  return (
    <section className="py-6 px-4 md:px-12 max-w-[1400px] mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">Categorías</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[600px]">
        {/* JOYAS - Large Block */}
        {large && (
          <Link to={large.link} className="relative group col-span-1 row-span-2 md:col-span-2 md:row-span-2 rounded overflow-hidden cursor-pointer block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${large.image}')` }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">{large.title}</h3>
              {large.subtitle && <p className="text-gray-200 text-xs md:text-sm max-w-xs mb-4 hidden md:block">{large.subtitle}</p>}
              <span className="inline-flex items-center text-xs md:text-sm font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                {large.buttonText}
              </span>
            </div>
          </Link>
        )}

        {/* ROPA - Medium Block */}
        {topRight && (
          <Link to={topRight.link} className="relative group col-span-1 row-span-1 rounded overflow-hidden cursor-pointer block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${topRight.image}')` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 left-0 p-3 md:p-6">
              <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter mb-1">{topRight.title}</h3>
              <span className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                {topRight.buttonText}
              </span>
            </div>
          </Link>
        )}

        {/* NUEVOS INGRESOS - Medium Block */}
        {bottomRight && (
          <Link to={bottomRight.link} className="relative group col-span-1 row-span-1 rounded overflow-hidden cursor-pointer block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${bottomRight.image}')` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 left-0 p-3 md:p-6">
              <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter mb-1">{bottomRight.title}</h3>
              <span className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                {bottomRight.buttonText || bottomRight.subtitle}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Extra Banners (if any) */}
      {bannerBento.length > 3 && (
        <div className={`grid grid-cols-1 ${bannerBento.length === 4 ? '' : bannerBento.length === 5 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 mt-4`}>
          {bannerBento.slice(3).map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className={`group relative overflow-hidden block rounded-xl ${bannerBento.length === 4 ? 'h-[300px] md:h-[450px]' : 'h-64'}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center p-4">
                <h3 className={`font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-lg ${bannerBento.length === 4 ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                  {banner.title}
                </h3>
                {banner.buttonText && (
                  <span className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full">
                    {banner.buttonText}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryBento;
