import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Ticket,
  TrendingUp,
  QrCode,
  Gift,
  MessageSquare,
  Share2,
  Wallet,
  BarChart3,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useOwner } from '@/context/OwnerContext';

interface NavSection {
  title?: string;
  items: {
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    accentColor: string;
  }[];
}

export const Sidebar = ({ isMobile = false, onCloseMobile }: { isMobile?: boolean; onCloseMobile?: () => void }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { transactions, trendFlyer, business } = useOwner();

  const pendingCount = transactions.filter((t) => t.status === 'PENDING').length;

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          path: ROUTES.OWNER_DASHBOARD,
          icon: LayoutDashboard,
          accentColor: 'text-indigo-400',
        },
      ],
    },
    {
      title: 'AI Marketing',
      items: [
        {
          name: 'Flyer Studio',
          path: ROUTES.OWNER_FLYERS,
          icon: Sparkles,
          badge: trendFlyer ? 'Auto 48h' : undefined,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accentColor: 'text-indigo-400',
        },
        {
          name: 'Coupons & Deals',
          path: ROUTES.OWNER_COUPONS,
          icon: Ticket,
          accentColor: 'text-emerald-400',
        },
        {
          name: 'Local Trends',
          path: ROUTES.OWNER_TRENDS,
          icon: TrendingUp,
          badge: 'Hot',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          accentColor: 'text-rose-400',
        },
      ],
    },
    {
      title: 'Store & Engagement',
      items: [
        {
          name: 'QR Standee Suite',
          path: ROUTES.OWNER_QR,
          icon: QrCode,
          accentColor: 'text-blue-400',
        },
        {
          name: 'Spin & Rewards',
          path: ROUTES.OWNER_REWARDS,
          icon: Gift,
          accentColor: 'text-amber-400',
        },
        {
          name: 'Customer Reviews',
          path: ROUTES.OWNER_REVIEWS,
          icon: MessageSquare,
          accentColor: 'text-rose-400',
        },
        {
          name: 'Social Media',
          path: ROUTES.OWNER_SOCIAL,
          icon: Share2,
          accentColor: 'text-sky-400',
        },
      ],
    },
    {
      title: 'Finance & Growth',
      items: [
        {
          name: 'Wallet & Ledger',
          path: ROUTES.OWNER_WALLET,
          icon: Wallet,
          badge: pendingCount > 0 ? `${pendingCount} Req` : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold',
          accentColor: 'text-emerald-400',
        },
        {
          name: 'Analytics',
          path: ROUTES.OWNER_ANALYTICS,
          icon: BarChart3,
          accentColor: 'text-sky-400',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Business Profile',
          path: ROUTES.OWNER_PROFILE,
          icon: Store,
          accentColor: 'text-slate-400',
        },
        {
          name: 'Settings & Billing',
          path: ROUTES.OWNER_SETTINGS,
          icon: Settings,
          accentColor: 'text-slate-400',
        },
      ],
    },
  ];

  const isSidebarCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={cn(
        'bg-slate-950 text-slate-200 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-30 select-none shrink-0 h-screen sticky top-0',
        isSidebarCollapsed ? 'w-20' : 'w-64',
        isMobile ? 'w-72 h-full' : ''
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur">
        <Link
          to={ROUTES.OWNER_DASHBOARD}
          className="flex items-center gap-3 overflow-hidden group"
          onClick={onCloseMobile}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
            E
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">Eddy</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Owner
                </span>
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[140px]">
                {business?.name || 'Local Business'}
              </span>
            </div>
          )}
        </Link>

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center justify-center transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && !isSidebarCollapsed && (
              <h3 className="px-3 text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
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
                      'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/90',
                      isSidebarCollapsed && 'justify-center px-2'
                    )}
                    title={isSidebarCollapsed ? item.name : undefined}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0 transition-transform group-hover:scale-110 duration-150',
                        isActive ? 'text-white' : item.accentColor
                      )}
                    />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="truncate flex-1">{item.name}</span>
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
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Subscription Card */}
      {!isSidebarCollapsed ? (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-white">Pro Plan</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={10} /> Active
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between items-center">
              <span>Auto-Publish & AI Tools</span>
              <span className="font-semibold text-slate-300 font-mono">₹299/mo</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 flex justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-amber-400" title="Pro Plan Active">
            <Zap size={16} />
          </div>
        </div>
      )}
    </aside>
  );
};
