import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useOwner } from '@/context/OwnerContext';

interface NavSection {
  title?: string;
  items: {
    name: string;
    path: string;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar = ({
  isMobile = false,
  onCloseMobile,
  businessName,
}: {
  isMobile?: boolean;
  onCloseMobile?: () => void;
  businessName?: string;
}) => {
  const location = useLocation();
  const { transactions, trendFlyer } = useOwner();

  const pendingCount = transactions.filter((t) => t.status === 'PENDING').length;

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          path: ROUTES.OWNER_DASHBOARD,
        },
      ],
    },
    {
      title: 'Marketing',
      items: [
        {
          name: 'Flyer Studio',
          path: ROUTES.OWNER_FLYERS,
          badge: trendFlyer ? 'Auto 72h' : undefined,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        },
        {
          name: 'Coupons & Deals',
          path: ROUTES.OWNER_COUPONS,
        },
        {
          name: 'Local Trends',
          path: ROUTES.OWNER_TRENDS,
          badge: 'Soon',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        },
      ],
    },
    {
      title: 'Store & Engagement',
      items: [
        {
          name: 'QR Standee Suite',
          path: ROUTES.OWNER_QR,
        },
        {
          name: 'Spin & Rewards',
          path: ROUTES.OWNER_REWARDS,
        },
        {
          name: 'Customer Reviews',
          path: ROUTES.OWNER_REVIEWS,
          badge: 'Soon',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        },
        {
          name: 'Social Media',
          path: ROUTES.OWNER_SOCIAL,
        },
      ],
    },
    {
      title: 'Finance & Growth',
      items: [
        {
          name: 'Wallet & Ledger',
          path: ROUTES.OWNER_WALLET,
          badge: pendingCount > 0 ? `${pendingCount} Req` : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold',
        },
        {
          name: 'Analytics',
          path: ROUTES.OWNER_ANALYTICS,
          badge: 'Soon',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Business Profile',
          path: ROUTES.OWNER_PROFILE,
        },
        {
          name: 'Settings & Billing',
          path: ROUTES.OWNER_SETTINGS,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'bg-black text-slate-200 border-r border-white/10 flex flex-col transition-all duration-300 z-30 select-none shrink-0',
        isMobile ? 'w-72 h-full' : 'w-64 h-screen sticky top-0'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-black shrink-0">
        <Link
          to={ROUTES.OWNER_DASHBOARD}
          className="flex flex-col min-w-0"
          onClick={onCloseMobile}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-white">Eddy</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Owner
            </span>
          </div>
          {businessName && (
            <span className="text-xs text-slate-400 truncate max-w-[180px]">
              {businessName}
            </span>
          )}
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="shrink-0 ml-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <h3 className="px-3 text-[10.5px] font-semibold tracking-wider text-yellow-400 uppercase">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.path === ROUTES.OWNER_FLYERS
                    ? location.pathname.startsWith('/owner/flyers') && location.pathname !== ROUTES.OWNER_TRENDS
                    : location.pathname === item.path ||
                      (item.path !== ROUTES.OWNER_DASHBOARD && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={cn(
                      'group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full border border-transparent tracking-wide',
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Subscription Card */}
      <div className="p-3 border-t border-white/10 bg-black">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400">Pro Plan</span>
            <span className="text-[10px] font-bold text-yellow-400">Active</span>
          </div>
          <div className="text-[11px] text-yellow-400 flex justify-between items-center">
            <span>Auto-Publish & AI Tools</span>
            <span className="font-semibold text-yellow-400 font-mono">₹299/mo</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
