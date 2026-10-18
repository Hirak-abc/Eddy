import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { flyerService, type Flyer } from "@/services/flyer.service";

const filters = ["ALL", "GENERATING", "READY", "SCHEDULED", "PUBLISHED", "FAILED"] as const;
type FlyerFilter = (typeof filters)[number];

const localDateTime = (value: string) => {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

export const FlyersDashboardPage = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [filter, setFilter] = useState<FlyerFilter>("ALL");
  const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
  const [busyFlyerId, setBusyFlyerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const response = await flyerService.list();
    if (!response.success || !response.data) {
      toast.error(response.error?.message || "Could not load Flyer Studio.");
    } else {
      setFlyers(response.data.flyers);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const filteredFlyers = useMemo(
    () =>
      filter === "ALL"
        ? flyers
        : flyers.filter((flyer) => flyer.status === filter),
    [filter, flyers],
  );

  const handlePublishNow = async (flyer: Flyer) => {
    setBusyFlyerId(flyer.id);
    const response = await flyerService.publishNow(flyer.id);
    if (!response.success) {
      toast.error(response.error?.message || "Could not publish this flyer.");
    } else {
      toast.success("Flyer published to Facebook and Instagram.");
      await refresh();
    }
    setBusyFlyerId(null);
  };

  const handleSchedule = async (flyer: Flyer) => {
    const localValue = scheduleTimes[flyer.id];
    const scheduledAt = localValue ? new Date(localValue) : null;
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      toast.error("Choose a future date and time.");
      return;
    }
    setBusyFlyerId(flyer.id);
    const response = await flyerService.schedule(
      flyer.id,
      scheduledAt.toISOString(),
    );
    if (!response.success) {
      toast.error(response.error?.message || "Could not schedule this flyer.");
    } else {
      toast.success(
        `Flyer scheduled for ${scheduledAt.toLocaleString("en-IN")}.`,
      );
      await refresh();
    }
    setBusyFlyerId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Owner dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Flyer Studio
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track AI generation, review flyers, and manage publishing to both
            social accounts.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link to={ROUTES.OWNER_CREATE_FLYER}>
            <Plus size={16} className="mr-1.5" />
            Create custom flyer
          </Link>
        </Button>
      </header>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-indigo-950">
          <Sparkles size={16} /> Automatic flyer flow
        </p>
        <p className="mt-1 text-sm text-indigo-900/80">
          Saving all three business photos queues an AI flyer using one randomly
          selected photo. One flyer total can be generated every 72 hours. Each
          flyer is scheduled to Facebook and Instagram 72 hours after generation;
          you can change its time or post a custom flyer now.
        </p>
      </section>

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Flyer filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
              filter === item
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {item === "ALL" ? "All flyers" : item.toLowerCase()}
            {item !== "ALL" &&
              ` (${flyers.filter((flyer) => flyer.status === item).length})`}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white py-16 text-sm text-slate-500">
          <LoaderCircle size={17} className="animate-spin" /> Loading flyers...
        </div>
      ) : filteredFlyers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Sparkles size={25} className="mx-auto text-indigo-500" />
          <h2 className="mt-3 font-bold text-slate-900">No flyers in this view</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create a custom flyer or save all three photos in Business Profile
            to start an automatic campaign.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFlyers.map((flyer) => (
            <article
              key={flyer.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-100">
                {flyer.imageUrl ? (
                  <img
                    src={flyer.imageUrl}
                    alt={flyer.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                    {flyer.status === "FAILED" ? (
                      <CircleAlert size={24} className="text-rose-500" />
                    ) : (
                      <LoaderCircle size={24} className="animate-spin text-indigo-600" />
                    )}
                    {flyer.status === "FAILED"
                      ? "Generation failed"
                      : "xAI is generating your flyer"}
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                  {flyer.status}
                </span>
                {flyer.couponDiscountPercent && (
                  <span className="absolute bottom-3 right-3 rounded-lg bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950">
                    {flyer.couponDiscountPercent}% OFF · one claim
                  </span>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                    {flyer.kind === "AUTOMATIC" ? "Automatic trend flyer" : "Custom flyer"}
                  </p>
                  <h2 className="mt-1 font-bold text-slate-900">{flyer.title}</h2>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                    {flyer.caption || flyer.topic}
                  </p>
                </div>

                {flyer.status === "GENERATING" || flyer.status === "QUEUED" ? (
                  <p className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-xs font-medium text-indigo-800">
                    <LoaderCircle size={14} className="animate-spin" />
                    Flyer is being generated and will appear here when ready.
                  </p>
                ) : null}

                {flyer.scheduledAt && (
                  <p className="flex items-start gap-2 text-xs text-slate-600">
                    <CalendarClock size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    {flyer.status === "PUBLISHED" ? "Published" : "Scheduled"}{" "}
                    {new Date(flyer.scheduledAt).toLocaleString("en-IN")}
                  </p>
                )}

                {flyer.errorMessage && (
                  <p className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
                    {flyer.errorMessage}
                  </p>
                )}

                {(flyer.status === "READY" || flyer.status === "SCHEDULED") &&
                  flyer.imageUrl && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    {flyer.kind === "CUSTOM" && (
                      <Button
                        type="button"
                        disabled={busyFlyerId === flyer.id}
                        onClick={() => void handlePublishNow(flyer)}
                        className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <Send size={14} className="mr-1.5" />
                        Post now
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <label className="sr-only" htmlFor={`schedule-${flyer.id}`}>
                        Select posting date and time
                      </label>
                      <input
                        id={`schedule-${flyer.id}`}
                        type="datetime-local"
                        min={localDateTime(new Date().toISOString())}
                        value={scheduleTimes[flyer.id] || ""}
                        onChange={(event) =>
                          setScheduleTimes((current) => ({
                            ...current,
                            [flyer.id]: event.target.value,
                          }))
                        }
                        className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-2 text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busyFlyerId === flyer.id}
                        onClick={() => void handleSchedule(flyer)}
                        className="rounded-xl"
                      >
                        <Clock3 size={14} className="mr-1" />
                        {flyer.status === "SCHEDULED" ? "Change time" : "Schedule"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
