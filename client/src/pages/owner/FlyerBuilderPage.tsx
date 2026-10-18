import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImagePlus, LoaderCircle, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useOwner } from "@/context/OwnerContext";
import { ROUTES } from "@/lib/constants";
import { flyerService, type FlyerLanguage } from "@/services/flyer.service";

const languages: Array<{ value: FlyerLanguage; label: string }> = [
  { value: "HINDI", label: "Hindi" },
  { value: "ENGLISH", label: "English" },
  { value: "HINGLISH", label: "Hinglish" },
];

export const FlyerBuilderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { business } = useOwner();
  const availablePhotos = [
    { label: "Shop front", url: business.images?.shop?.url },
    { label: "Hero product", url: business.images?.product?.url },
    { label: "Signature item", url: business.images?.item?.url },
  ].filter((photo): photo is { label: string; url: string } => Boolean(photo.url));
  const [topic, setTopic] = useState(searchParams.get("trend") || "");
  const [language, setLanguage] = useState<FlyerLanguage>("HINGLISH");
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    availablePhotos[0]?.url || "",
  );
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewUrl = newImage ? URL.createObjectURL(newImage) : selectedImageUrl;

  useEffect(
    () => () => {
      if (newImage) URL.revokeObjectURL(previewUrl);
    },
    [newImage, previewUrl],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (topic.trim().length < 2) {
      toast.error("Enter a campaign topic.");
      return;
    }
    if (!newImage && !selectedImageUrl) {
      toast.error("Choose one of your saved photos or upload a new picture.");
      return;
    }

    setIsGenerating(true);
    try {
      let imageUrl = selectedImageUrl;
      if (newImage) {
        const upload = await flyerService.uploadImage(newImage);
        if (!upload.success || !upload.data) {
          throw new Error(upload.error?.message || "Could not upload the image.");
        }
        imageUrl = upload.data.image.url;
      }

      const response = await flyerService.queueCustom({
        businessName: business.name,
        businessCategory: business.category,
        businessLocation: business.location,
        topic: topic.trim(),
        language,
        imageUrl,
      });
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Could not queue flyer generation.");
      }
      toast.success("Flyer generation started. Follow its progress in Flyer Studio.");
      navigate(ROUTES.OWNER_FLYERS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate flyer.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Flyer Studio
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Create a custom flyer
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          xAI researches your topic, combines it with your photo, and writes a
          caption. Only one flyer total can be generated every 72 hours. It will
          publish to Facebook and Instagram 72 hours after generation unless you
          change its schedule in Flyer Studio.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="space-y-2">
          <label
            htmlFor="flyer-topic"
            className="text-sm font-bold text-slate-800"
          >
            Topic or occasion
          </label>
          <input
            id="flyer-topic"
            list="flyer-topic-suggestions"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Type a topic, e.g. Diwali Festival"
            maxLength={160}
            required
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <datalist id="flyer-topic-suggestions">
            <option value="Diwali Festival" />
            <option value="Holi Festival" />
            <option value="Independence Day" />
            <option value="Weekend Special" />
            <option value="New Product Launch" />
            <option value="Monsoon Offer" />
          </datalist>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-800">Choose a photo</p>
          {availablePhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {availablePhotos.map((photo) => (
                <button
                  key={photo.label}
                  type="button"
                  disabled={Boolean(newImage)}
                  onClick={() => setSelectedImageUrl(photo.url)}
                  className={`overflow-hidden rounded-2xl border-2 text-left transition ${
                    selectedImageUrl === photo.url && !newImage
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-slate-200"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block px-2 py-1.5 text-xs font-semibold text-slate-700">
                    {photo.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No saved business photos found. Upload a picture below or add your
              three business photos in Business Profile.
            </p>
          )}
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Upload size={16} />
            {newImage ? "Replace uploaded picture" : "Upload a new picture"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) {
                  toast.error("Choose an image up to 10 MB.");
                  event.target.value = "";
                  return;
                }
                setNewImage(file);
              }}
            />
          </label>
          {newImage && (
            <button
              type="button"
              onClick={() => setNewImage(null)}
              className="ml-3 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Use a saved photo instead
            </button>
          )}
          {previewUrl && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <ImagePlus size={17} className="shrink-0 text-indigo-600" />
              <p className="truncate text-xs font-medium text-slate-600">
                Selected: {newImage?.name || "saved business photo"}
              </p>
            </div>
          )}
        </div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Selected flyer source"
            className="max-h-72 w-full rounded-2xl bg-slate-100 object-contain"
          />
        )}

        <div className="space-y-2">
          <label
            htmlFor="flyer-language"
            className="text-sm font-bold text-slate-800"
          >
            Flyer and caption language
          </label>
          <select
            id="flyer-language"
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as FlyerLanguage)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.OWNER_FLYERS)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isGenerating}
            className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isGenerating ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Uploading and queuing...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-2" />
                Generate custom flyer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
