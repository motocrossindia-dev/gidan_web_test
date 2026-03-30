import { SectionHeader } from './Common';
import ProductCard from '../ProductCard';

const BentoSection = ({ data }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  
  if (!data || !data.is_active) return null;

  const products = data.product_cards?.filter(p => p.is_active) || [];
  
  // Rotating logic for the bottom-right slot if we have many products
  const secondaryProducts = products.slice(2);
  const hasRotation = secondaryProducts.length > 1;

  useEffect(() => {
    if (!hasRotation) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % secondaryProducts.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [hasRotation, secondaryProducts.length]);

  const styleConfig = {
    hero: { bg: "bg-[#2d451b]", titleColor: "text-white", highlightColor: "text-[#a8e070]", accentBg: "bg-[#a8e070]", accentText: "text-[#1a3d0a]" },
    climate: { bg: "bg-[#1a1f14]", titleColor: "text-white", highlightColor: "text-[#a8e070]", accentBg: "bg-[#a8e070]", accentText: "text-[#1a3d0a]" },
    gift: { bg: "bg-[#2d451b]", titleColor: "text-white", highlightColor: "text-[#facc15]", accentBg: "bg-[#facc15]", accentText: "text-[#1a3d0a]" },
    gardener: { bg: "bg-[#f8f7f0]", titleColor: "text-[#1a3d0a]", highlightColor: "text-[#2d451b]", accentBg: "bg-[#2d451b]", accentText: "text-white" },
    subscription: { bg: "bg-[#111111]", titleColor: "text-white", highlightColor: "text-[#a8e070]", accentBg: "bg-[#a8e070]", accentText: "text-[#1a3d0a]" }
  };

  const config = styleConfig[data.section_type] || styleConfig.hero;
  const isDark = config.bg.includes('bg-[#') && !config.bg.includes('#f8f7f0');

  return (
    <section className={`py-10 lg:py-16 ${config.bg} relative overflow-hidden transition-colors duration-700`}>
      {/* Decorative patterns or gradients could go here */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Content Column */}
        <div className="w-full lg:col-span-5 space-y-8 lg:space-y-10 text-center lg:text-left z-10">
          <div className="space-y-4">
            {data.label && (
              <span className={`inline-block px-5 py-2 rounded-full ${isDark ? 'bg-white/10 text-white/50 border-white/10' : 'bg-black/5 text-black/40 border-black/5'} text-[11px] font-bold tracking-[0.25em] uppercase border backdrop-blur-sm animate-fade-in`}>
              {data.label}
            </span>
          )}
          
          <h2 className={`text-4xl lg:text-[60px] font-serif font-bold ${config.titleColor} leading-[1.05] tracking-tight`}>
            {data.heading} <br className="hidden sm:block" />
            <span className={`italic font-normal ${config.highlightColor}`}>
              {data.italic_text}
            </span> {data.heading_suffix}
          </h2>
        </div>

        <p className={`text-[15px] lg:text-[17px] ${isDark ? 'text-white/60' : 'text-black/60'} leading-relaxed max-w-[500px] mx-auto lg:mx-0 italic font-medium`}>
          {data.description}
        </p>

        {/* Checklist UI - Only on left if products exist */}
        {products.length > 0 && data.items?.some(item => item.item_type === 'checklist' && item.is_active) && (
          <div className="space-y-4 pt-4 max-w-[500px] mx-auto lg:mx-0">
            {data.items
              .filter(item => item.item_type === 'checklist' && item.is_active)
              .map(item => (
                <div key={item.id} className="flex items-center gap-4 group/item">
                  <div className={`flex-shrink-0 w-8 lg:w-9 h-8 lg:h-9 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center transition-all group-hover/item:scale-110`}>
                    <Check size={18} className={config.highlightColor} strokeWidth={3} />
                  </div>
                  <span className={`text-[14px] lg:text-[16px] font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* List Item UI (Horizontal Cards) - Only on left if products exist */}
        {products.length > 0 && data.section_type !== 'gardener' && data.items?.some(item => item.item_type === 'list_item' && item.is_active) && (
          <div className="space-y-3 pt-6 max-w-[550px] mx-auto lg:mx-0">
            {data.items
              .filter(item => item.item_type === 'list_item' && item.is_active)
              .map(item => (
                <div key={item.id} className={`flex items-center justify-between p-5 rounded-[24px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'} border backdrop-blur-sm group/list-item transition-all hover:bg-white/10 hover:-translate-y-0.5`}>
                  <div className="flex flex-col gap-0.5" >
                    <h4 className={`text-[15px] lg:text-[17px] font-bold ${isDark ? 'text-white' : 'text-[#1a1f14]'}`}>
                      {item.name}
                    </h4>
                    {item.subtitle && (
                      <p className={`text-[12px] lg:text-[13px] ${isDark ? 'text-white/40' : 'text-[#4a4a4a]/60'} font-medium`}>
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  {item.tag && (
                    <div className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-white/10 text-white/60 border-white/10' : 'bg-black/5 text-[#1a3d0a]/50 border-black/5'} text-[11px] font-bold border whitespace-nowrap`}>
                      {item.tag}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Tag UI (Feature Cards Grid) - Only on left if products exist */}
        {products.length > 0 && (data.items?.some(item => item.item_type === 'tag' && item.is_active) || 
          (data.section_type === 'gardener' && data.items?.some(item => item.item_type === 'list_item' && item.is_active))) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-[650px] mx-auto lg:mx-0">
            {data.items
              .filter(item => (item.item_type === 'tag' || (data.section_type === 'gardener' && item.item_type === 'list_item')) && item.is_active)
              .map((item, idx) => {
                return (
                  <div key={item.id} className={`p-6 lg:p-8 rounded-[32px] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-[#eef5e9] border-[#e2efe0] hover:bg-[#e6f0e0]'} border backdrop-blur-md transition-all duration-500 hover:-translate-y-1 group/tag`}>
                    {item.icon && (
                      <div className="text-3xl mb-5 transform group-hover/tag:scale-110 group-hover/tag:-rotate-6 transition-transform">
                        {item.icon}
                      </div>
                    )}
                    <h4 className={`text-[16px] lg:text-[18px] font-bold ${isDark ? 'text-white' : 'text-[#1a1f14]'} mb-2`}>
                      {item.name}
                    </h4>
                    {item.subtitle && (
                      <p className={`text-[12px] lg:text-[13px] ${isDark ? 'text-white/50' : 'text-[#4a4a4a]/70'} leading-relaxed`}>
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
            {data.btn1_text && (
              <a href={data.btn1_link} className={`${config.accentBg} ${config.accentText} px-10 py-5 rounded-[24px] text-[15px] font-bold transition-all hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center gap-2`}>
                {data.btn1_text}
              </a>
            )}
            {data.btn2_text && (
              <a href={data.btn2_link} className={`${isDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'} px-10 py-5 rounded-[24px] text-[15px] font-bold border transition-all active:scale-95`}>
                {data.btn2_text}
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Bento Grid or Shifted Items if products are empty */}
        <div className="w-full lg:col-span-7">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-5 h-[450px] lg:h-[550px]">
              {/* Slot 1: Tall Main (First Product) */}
              <div className="col-span-1 row-span-2 relative group animate-fade-in-up">
                {products[0] && (
                  <ProductCard 
                    product={products[0]} 
                    variant="bento-large" 
                    extra={{ 
                      stat_rating: data.extra?.stat_rating, 
                      stat_count: data.extra?.stat_count 
                    }} 
                  />
                )}
              </div>

              {/* Slot 2: Top Right (Second Product) */}
              <div className="col-span-1 row-span-1 relative group animate-fade-in-up [animation-delay:200ms]">
                {products[1] && <ProductCard product={products[1]} variant="bento" />}
              </div>

              {/* Slot 3: Bottom Right (Rotating others) */}
              <div className="col-span-1 row-span-1 relative group animate-fade-in-up [animation-delay:400ms]">
                {secondaryProducts.length > 0 ? (
                  <div className="relative w-full h-full">
                    {secondaryProducts.map((product, idx) => (
                      <div 
                        key={product.id || idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                          idx === activeIdx 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                        }`}
                      >
                        <ProductCard 
                          product={product} 
                          variant="bento" 
                          extra={{ 
                            is_brown_variant: idx % 2 === 1
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Simple empty placeholder instead of mock content
                  <div className={`w-full h-full rounded-[50px] ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
                )}
              </div>
            </div>
          ) : (
            /* Shifted Items Logic: When products are empty, move items here */
            <div className="space-y-6 animate-fade-in-up">
              {/* Checklist UI (Shifted) */}
              {data.items?.some(item => item.item_type === 'checklist' && item.is_active) && (
                <div className="space-y-4">
                  {data.items
                    .filter(item => item.item_type === 'checklist' && item.is_active)
                    .map(item => (
                      <div key={item.id} className="flex items-center gap-4 group/item">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center transition-all group-hover/item:scale-110`}>
                          <Check size={18} className={config.highlightColor} strokeWidth={3} />
                        </div>
                        <span className={`text-[16px] font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* List Item UI (Shifted) */}
              {data.items?.some(item => item.item_type === 'list_item' && item.is_active) && (
                <div className="space-y-4">
                  {data.items
                    .filter(item => item.item_type === 'list_item' && item.is_active)
                    .map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-6 rounded-[32px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'} border backdrop-blur-sm group/list-item transition-all hover:translate-x-2`}>
                        <div className="flex flex-col gap-0.5">
                          <h4 className={`text-[17px] font-bold ${isDark ? 'text-white' : 'text-[#1a1f14]'}`}>
                            {item.name}
                          </h4>
                          {item.subtitle && (
                            <p className={`text-[13px] ${isDark ? 'text-white/40' : 'text-[#4a4a4a]/60'} font-medium`}>
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        {item.tag && (
                          <div className={`px-5 py-2 rounded-full ${isDark ? 'bg-white/10 text-white/60 border-white/10' : 'bg-black/5 text-[#1a3d0a]/50 border-black/5'} text-[12px] font-bold border`}>
                            {item.tag}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Tag UI Grid (Shifted) */}
              {data.items?.some(item => item.item_type === 'tag' && item.is_active) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {data.items
                    .filter(item => item.item_type === 'tag' && item.is_active)
                    .map((item, idx) => (
                      <div key={item.id} className={`p-8 rounded-[40px] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-[#eef5e9] border-[#e2efe0] hover:bg-[#e6f0e0]'} border backdrop-blur-md transition-all duration-500 hover:-translate-y-2 group/tag`}>
                        {item.icon && (
                          <div className="text-4xl mb-6 transform group-hover/tag:scale-110 transition-transform">
                            {item.icon}
                          </div>
                        )}
                        <h4 className={`text-[18px] font-bold ${isDark ? 'text-white' : 'text-[#1a1f14]'} mb-2`}>
                          {item.name}
                        </h4>
                        {item.subtitle && (
                          <p className={`text-[14px] ${isDark ? 'text-white/50' : 'text-[#4a4a4a]/70'} leading-relaxed`}>
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BentoSection;
