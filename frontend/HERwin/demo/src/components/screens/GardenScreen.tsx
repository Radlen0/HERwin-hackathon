import React, { useState } from 'react';
import {
  Sprout,
  ShoppingBag,
  History,
  Check,
  Sparkles,
  TreePine,
  Flower2,
  Home as HomeIcon,
  Compass,
  ArrowRight,
  Info,
  X,
  Droplet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShopItem, ShopCategory } from '../../types';
import { MascotBrain } from '../mascots/MascotBrain';

export const SHOP_ITEMS: ShopItem[] = [
  // Flowers (10 💎)
  {
    id: 'flower_jasmine',
    name: 'Jasmine de Tunisie (فل)',
    category: 'flower',
    price: 10,
    description: 'Fragrant white jasmine buds, symbolizing calm and clarity in Tunisia.',
    iconType: 'flower_white'
  },
  {
    id: 'flower_rose',
    name: 'Pastel Coral Rose',
    category: 'flower',
    price: 10,
    description: 'Gentle bloom that adds warm, comforting coral tones to your garden.',
    iconType: 'flower_coral'
  },
  {
    id: 'flower_lavender',
    name: 'Lavender Blossom',
    category: 'flower',
    price: 10,
    description: 'Calming purple sprigs that promote deep, restorative rest.',
    iconType: 'flower_lavender'
  },
  // Small Plants (20 💎)
  {
    id: 'plant_mint',
    name: 'Tunisian Mint (نعناع)',
    category: 'plant',
    price: 20,
    description: 'Fresh aromatic mint leaves, perfect for a soothing hot tea break.',
    iconType: 'plant_mint'
  },
  {
    id: 'plant_succulent',
    name: 'Desert Succulent',
    category: 'plant',
    price: 20,
    description: 'Resilient and patient; thrives even when life feels dry.',
    iconType: 'plant_succulent'
  },
  // Trees (40 💎)
  {
    id: 'tree_olive',
    name: 'Heritage Olive Tree (زيتونة)',
    category: 'tree',
    price: 40,
    description: 'Deep-rooted Mediterranean olive tree, standing for enduring peace and resilience.',
    iconType: 'tree_olive'
  },
  {
    id: 'tree_orange',
    name: 'Orange Blossom (شجرة زهر)',
    category: 'tree',
    price: 40,
    description: 'Sweet citrus blossom tree with golden fruit and soothing aromas.',
    iconType: 'tree_orange'
  },
  // Decorations (50 💎)
  {
    id: 'deco_bench',
    name: 'Stone Reading Bench',
    category: 'decoration',
    price: 50,
    description: 'A quiet carved stone seat for catching your breath between study sessions.',
    iconType: 'deco_bench'
  },
  {
    id: 'deco_fountain',
    name: 'Ceramic Fountain',
    category: 'decoration',
    price: 50,
    description: 'Gentle running water sounds that quiet racing thoughts.',
    iconType: 'deco_fountain'
  },
  // Cozy House (150 💎)
  {
    id: 'house_sidi',
    name: 'Sidi Bou Said Sanctuary',
    category: 'house',
    price: 150,
    description: 'Traditional whitewashed cottage with sky-blue arches and bougainvillea.',
    iconType: 'house_sidi'
  }
];

export const GardenScreen: React.FC = () => {
  const {
    diamonds,
    spendDiamond,
    placedGardenItems,
    placeGardenItem,
    removeGardenItem,
    diamondTransactions,
    setActiveScreen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sanctuary' | 'shop' | 'history'>('sanctuary');
  const [shopCategory, setShopCategory] = useState<ShopCategory | 'all'>('all');
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [inspectingItem, setInspectingItem] = useState<{ instanceId: string; item: ShopItem } | null>(null);

  // Growth Stage evaluation
  const totalItemsCount = placedGardenItems.length;
  let growthStageName = 'Seedling Sanctuary 🌱';
  let growthDescription = 'Your sanctuary has sprouted its first gentle roots.';

  if (totalItemsCount >= 8) {
    growthStageName = 'Lush Haven & Oasis 🏡';
    growthDescription = 'A flourishing space honoring your daily courage and steady steps.';
  } else if (totalItemsCount >= 4) {
    growthStageName = 'Blooming Garden 🌿';
    growthDescription = 'Your consistent effort is bringing beauty and color to this sanctuary.';
  } else if (totalItemsCount >= 2) {
    growthStageName = 'Budding Sprout 🌸';
    growthDescription = 'New blooms are opening as you take time to care for yourself.';
  }

  const handlePurchase = (item: ShopItem) => {
    if (diamonds < item.price) {
      alert(`You need ${item.price} diamonds for this item. Complete tasks, breathing, or reflections to earn more!`);
      return;
    }

    const success = spendDiamond(item.price, `Adopted ${item.name}`);
    if (success) {
      // Find an open grid slot (5x4 grid)
      let targetX = 1;
      let targetY = 1;
      const occupied = new Set(placedGardenItems.map(p => `${p.gridX},${p.gridY}`));

      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
          // Keep center (2,1) clear for the mascot
          if (x === 2 && y === 1) continue;
          if (!occupied.has(`${x},${y}`)) {
            targetX = x;
            targetY = y;
            break;
          }
        }
      }

      placeGardenItem(item.id, targetX, targetY);
      setSelectedShopItem(null);
      setPurchaseSuccessMessage(`You planted ${item.name}! Check your sanctuary.`);
      setTimeout(() => setPurchaseSuccessMessage(null), 3000);
      setActiveTab('sanctuary');
    }
  };

  const filteredShopItems = shopCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(item => item.category === shopCategory);

  // Render SVG or graphic for each garden item type
  const renderItemGraphic = (iconType: string, isSmall = false) => {
    const size = isSmall ? 'w-7 h-7' : 'w-10 h-10';

    switch (iconType) {
      case 'flower_white':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🌼
          </span>
        );
      case 'flower_coral':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🌺
          </span>
        );
      case 'flower_lavender':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🪻
          </span>
        );
      case 'plant_mint':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🌿
          </span>
        );
      case 'plant_succulent':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🪴
          </span>
        );
      case 'tree_olive':
        return (
          <span className={`flex items-center justify-center text-2xl select-none ${size}`}>
            🫒
          </span>
        );
      case 'tree_orange':
        return (
          <span className={`flex items-center justify-center text-2xl select-none ${size}`}>
            🍊
          </span>
        );
      case 'deco_bench':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🪑
          </span>
        );
      case 'deco_fountain':
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            ⛲
          </span>
        );
      case 'house_sidi':
        return (
          <span className={`flex items-center justify-center text-2xl select-none ${size}`}>
            🏛️
          </span>
        );
      default:
        return (
          <span className={`flex items-center justify-center text-xl select-none ${size}`}>
            🌱
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-3">
        <div>
          <span className="text-xs font-bold text-[#6F8D45] uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4" />
            Virtual Sanctuary
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#202019] mt-0.5">
            Nefes Bloom
          </h1>
        </div>

        {/* Diamond Balance Display */}
        <div className="flex items-center gap-2 bg-[#FFF0D4] border border-[#F5D547] px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="text-base animate-bounce">💎</span>
          <div>
            <span className="text-xs font-black text-[#825C08] tracking-tight">
              {diamonds}
            </span>
            <span className="text-[10px] text-[#A37213] block -mt-1 font-semibold">
              Diamonds
            </span>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      {purchaseSuccessMessage && (
        <div className="bg-[#E8E9AE] border border-[#A8BC78] text-[#202019] text-xs font-bold px-4 py-2.5 rounded-2xl mb-3 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#6F8D45]" />
          <span>{purchaseSuccessMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between gap-1 bg-[#F5F0D2] p-1 rounded-2xl mb-4">
        <button
          onClick={() => setActiveTab('sanctuary')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'sanctuary' ? 'bg-white text-[#202019] shadow-xs' : 'text-[#737264] hover:text-[#202019]'
          }`}
        >
          My Garden
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'shop' ? 'bg-white text-[#202019] shadow-xs' : 'text-[#737264] hover:text-[#202019]'
          }`}
        >
          Bloom Shop
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'history' ? 'bg-white text-[#202019] shadow-xs' : 'text-[#737264] hover:text-[#202019]'
          }`}
        >
          Rewards ({diamondTransactions.length})
        </button>
      </div>

      {/* TAB 1: Virtual Garden Canvas Sanctuary */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-4">
          {/* Garden Stage Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#6F8D45] tracking-wider block">
                Growth Stage
              </span>
              <h3 className="text-sm font-bold text-[#202019]">
                {growthStageName}
              </h3>
              <p className="text-xs text-[#737264] mt-0.5">
                {growthDescription}
              </p>
            </div>
            <span className="text-xs font-bold bg-[#F8F5E4] text-[#555447] px-3 py-1.5 rounded-full border border-[#ECE7D4]">
              {placedGardenItems.length} Blooms
            </span>
          </div>

          {/* Interactive Sanctuary Ground (5x4 Grid) */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#A8BC78]/40 shadow-md bg-gradient-to-b from-[#E8F2D2] via-[#F4F9E4] to-[#E2EBBF] p-4">
            {/* Gentle Background Decor: floating sun & clouds */}
            <div className="absolute top-2 right-3 text-lg opacity-80 pointer-events-none">
              ☀️
            </div>
            <div className="absolute top-3 left-4 text-xs opacity-60 pointer-events-none">
              ☁️
            </div>

            {/* Meditating Mascot seated in the center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="transform scale-90 translate-y-1">
                <MascotBrain size="sm" animated={true} />
              </div>
            </div>

            {/* Grid of 5 columns x 4 rows */}
            <div className="grid grid-cols-5 gap-2 relative z-20 my-2">
              {Array.from({ length: 20 }).map((_, idx) => {
                const x = idx % 5;
                const y = Math.floor(idx / 5);
                const isCenter = x === 2 && y === 1;

                const placed = placedGardenItems.find(p => p.gridX === x && p.gridY === y);
                const shopDef = placed ? SHOP_ITEMS.find(s => s.id === placed.itemId) : null;

                if (isCenter) {
                  return (
                    <div
                      key={idx}
                      className="h-14 rounded-2xl border border-transparent flex items-end justify-center pb-0.5 opacity-0 pointer-events-none"
                    />
                  );
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (placed && shopDef) {
                        setInspectingItem({ instanceId: placed.instanceId, item: shopDef });
                      } else {
                        setActiveTab('shop');
                      }
                    }}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      placed
                        ? 'bg-white/80 hover:bg-white border border-[#A8BC78]/60 shadow-xs cursor-pointer hover:scale-105'
                        : 'border border-dashed border-[#A8BC78]/30 hover:border-[#6F8D45] hover:bg-white/40 cursor-pointer'
                    }`}
                  >
                    {placed && shopDef ? (
                      renderItemGraphic(shopDef.iconType)
                    ) : (
                      <span className="text-[10px] text-[#A8BC78]/60 font-medium">
                        +
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-center text-[#555447] font-semibold mt-2">
              Tap any bloom to inspect • Plants never wither here
            </p>
          </div>

          {/* Quick Ways to Earn More Diamonds */}
          <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs">
            <h4 className="text-xs font-bold text-[#737264] uppercase tracking-wider mb-2.5">
              How to Earn Diamonds:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => setActiveScreen('roadmap')}
                className="bg-[#F8F5E4] hover:bg-[#F5F0D2] p-2.5 rounded-2xl border border-[#ECE7D4] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202019]">Complete Study Task</span>
                  <span className="text-[#825C08] font-black">+10 💎</span>
                </div>
                <p className="text-[10px] text-[#737264] mt-0.5">Checked off in My Roadmap</p>
              </div>

              <div
                onClick={() => setActiveScreen('breathing')}
                className="bg-[#F8F5E4] hover:bg-[#F5F0D2] p-2.5 rounded-2xl border border-[#ECE7D4] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202019]">Breathing Session</span>
                  <span className="text-[#825C08] font-black">+5 💎</span>
                </div>
                <p className="text-[10px] text-[#737264] mt-0.5">Deep Calm exercise</p>
              </div>

              <div
                onClick={() => setActiveScreen('paint')}
                className="bg-[#F8F5E4] hover:bg-[#F5F0D2] p-2.5 rounded-2xl border border-[#ECE7D4] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202019]">Paint Reflection</span>
                  <span className="text-[#825C08] font-black">+5 💎</span>
                </div>
                <p className="text-[10px] text-[#737264] mt-0.5">Express how you feel</p>
              </div>

              <div
                onClick={() => setActiveScreen('schedule')}
                className="bg-[#F8F5E4] hover:bg-[#F5F0D2] p-2.5 rounded-2xl border border-[#ECE7D4] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202019]">Mood Check-In</span>
                  <span className="text-[#825C08] font-black">+5 💎</span>
                </div>
                <p className="text-[10px] text-[#737264] mt-0.5">Daily emotional check</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bloom Shop */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          {/* Shop category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['all', 'flower', 'plant', 'tree', 'decoration', 'house'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setShopCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-all ${
                  shopCategory === cat
                    ? 'bg-[#3D5834] text-white shadow-xs'
                    : 'bg-white border border-[#ECE7D4] text-[#555447] hover:bg-[#F8F5E4]'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat === 'house' ? 'Sanctuary House' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="space-y-2.5">
            {filteredShopItems.map((item) => {
              const canAfford = diamonds >= item.price;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#ECE7D4] shadow-xs flex items-center justify-between gap-3 hover:border-[#6F8D45] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F8F5E4] border border-[#ECE7D4] flex items-center justify-center flex-shrink-0">
                      {renderItemGraphic(item.iconType)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#202019]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#737264] leading-snug line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#1C1C17] text-white hover:bg-black active:scale-95 shadow-xs'
                        : 'bg-neutral-100 text-[#9C9A8E] cursor-not-allowed'
                    }`}
                  >
                    <span>{item.price}</span>
                    <span>💎</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Reward History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-[#737264] uppercase tracking-wider mb-2">
            Diamond Ledger & Rewards
          </h3>

          {diamondTransactions.length === 0 ? (
            <p className="text-xs text-[#737264] text-center py-6">
              No transactions yet. Complete your first study task or breathing session!
            </p>
          ) : (
            diamondTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-[#F2EFE2] pb-2 last:border-0"
              >
                <div>
                  <p className="text-xs font-semibold text-[#202019]">
                    {tx.reason}
                  </p>
                  <span className="text-[10px] text-[#8C8A7B]">
                    {new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`text-xs font-black ${
                  tx.type === 'earn' ? 'text-emerald-700' : 'text-neutral-700'
                }`}>
                  {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`} 💎
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Item Inspection Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#ECE7D4]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#6F8D45]">
                {inspectingItem.item.category}
              </span>
              <button
                onClick={() => setInspectingItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
              >
                <X className="w-4 h-4 text-[#737264]" />
              </button>
            </div>

            <div className="text-center my-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F8F5E4] flex items-center justify-center mb-2">
                {renderItemGraphic(inspectingItem.item.iconType)}
              </div>
              <h3 className="text-base font-bold text-[#202019]">
                {inspectingItem.item.name}
              </h3>
              <p className="text-xs text-[#737264] mt-1 leading-relaxed">
                {inspectingItem.item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => {
                  removeGardenItem(inspectingItem.instanceId);
                  setInspectingItem(null);
                }}
                className="flex-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 py-2.5 rounded-full"
              >
                Store in Inventory
              </button>
              <button
                onClick={() => setInspectingItem(null)}
                className="flex-1 bg-[#1C1C17] text-white text-xs font-bold py-2.5 rounded-full hover:bg-black"
              >
                Keep in Garden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
