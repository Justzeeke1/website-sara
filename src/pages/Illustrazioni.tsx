import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { fetchIllustrations } from "../api/firebase.js";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
const fallbackImage = "/placeholder.jpg";
import config from "../configs/config.json";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import heroImage from "@/assets/WallpaperPatternHomepage.png";

const imageMap = import.meta.glob("/src/assets/*", {
  eager: true,
  import: "default",
});

const getImageSrc = (fileName: string): string => {
  const entry = Object.entries(imageMap).find(([path]) =>
    path.endsWith(`/${fileName}`)
  );
  return (entry?.[1] as string) || fallbackImage;
};

const Illustrazioni = () => {
  const { t, i18n } = useTranslation();
  const [illustrations, setIllustrations] = useState([]);
  const [formatById, setFormatById] = useState<Record<string, string>>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 640);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getAllIllustrations = async () => {
      const response = await fetchIllustrations();
      setIllustrations(response);
    };

    getAllIllustrations();
  }, []);

  const handleClick = (
    title: string,
    format?: string,
    idToClose?: string
  ) => {
    let message = `${t("illustrations.orderMessage")} ${title}`;
    if (format) {
      message += ` in ${t("illustrations.format.append", { format })}.`;
    } else {
      message += ".";
    }
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/+39${config.phoneNumber}?text=${encodedMessage}`;
    window.open(link, "_blank");
    // Chiudi il dialog
    if (idToClose) setOpenDialogId(null);
  };

  const lang = (i18n.language || "en").split("-")[0];

  const pricesByFormat: Record<string, number> = {
    A4: 10,
    A5: 5,
    A6: 3,
    Sticker: 2,
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playwrite font-normal text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {t("illustrations.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("illustrations.subtitle")}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {illustrations.map((illustration, index) => {
              // valore formato selezionato o default "A4"
              const selectedFormat = formatById[illustration.id] || "A4";
              // prezzo dinamico in base al formato
              const price = pricesByFormat[selectedFormat] ?? illustration.price ?? 0;

              return (
                <Card
                  key={illustration.id}
                  className={`portfolio-card animate-fade-in-up animate-stagger-${
                    (index % 3) + 1
                  }`}
                >
                  <Dialog
                    open={openDialogId === illustration.id}
                    onOpenChange={(isOpen) =>
                      setOpenDialogId(isOpen ? illustration.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setOpenDialogId(illustration.id)}
                        className="relative overflow-hidden group w-full"
                      >
                        <img
                          src={getImageSrc(illustration.image)}
                          alt={illustration.title?.[lang] || ""}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </button>
                    </DialogTrigger>
                    <DialogTitle>
                      <VisuallyHidden>{illustration.title?.[lang] || ""}</VisuallyHidden>
                    </DialogTitle>
                    <DialogContent className="w-full max-w-[100vw] sm:max-w-[500px] md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <Carousel className="w-full">
                            <CarouselContent>
                              {(illustration.images?.length
                                ? illustration.images
                                : [illustration.image]
                              ).map((img) => (
                                <CarouselItem key={img}>
                                  <img
                                    src={getImageSrc(img)}
                                    alt={illustration.title?.[lang] || ""}
                                    className="w-full object-contain rounded-lg"
                                    style={isMobile ? { maxHeight: '300px', height: 'auto' } : {}}
                                    loading="lazy"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {Array.isArray(illustration.images) &&
                              illustration.images.length > 1 && (
                                <>
                                  <CarouselPrevious className="left-2" />
                                  <CarouselNext className="right-2" />
                                </>
                              )}
                          </Carousel>
                        </div>
                        <div>
                          <p
                            className="font-playwrite font-normal mb-6"
                            style={{ fontSize: "2rem" }}
                          >
                            {illustration.title?.[lang]}
                          </p>
                          <p className="text-muted-foreground mb-6">
                            {illustration.description?.[lang]}
                          </p>

                          {/* Prezzo dinamico */}
                          {price ? (
                            <div className="mb-4">
                              <div className="text-sm text-muted-foreground">
                                {t("illustrations.priceLabel", { defaultValue: "Prezzo" })}
                              </div>
                              <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("it-IT", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(price)}
                              </div>
                            </div>
                          ) : null}

                          {illustration.category?.[lang]?.length ? (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {illustration.category?.[lang]?.map((cat) => (
                                <Badge
                                  key={cat}
                                  variant="secondary"
                                  className="bg-gradient-accent text-white"
                                >
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          ) : null}

                          <div className="space-y-4 mb-6">
                            <label className="text-sm font-medium text-foreground">
                              {t("illustrations.format.label", { defaultValue: "Formato" })}
                            </label>
                            <Select
                              value={selectedFormat}
                              onValueChange={(v) =>
                                setFormatById((prev) => ({ ...prev, [illustration.id]: v }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Formato" />
                              </SelectTrigger>
                              <SelectContent>
                                {illustration.format.map((f) => (
                                  <SelectItem key={f} value={f}>
                                    {t(`illustrations.format.options.${f}`, { defaultValue: f })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            className="btn-hero w-full"
                            onClick={() =>
                              handleClick(
                                illustration.title?.[lang] || "",
                                selectedFormat,
                                illustration.id
                              )
                            }
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {t("illustrations.cta.button")}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-playwrite font-normal text-xl text-foreground">
                        {illustration.title?.[lang] || ""}
                      </h3>
                      <div className="flex space-x-2">
                        {illustration.category?.[lang]?.map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="bg-gradient-accent text-white"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {illustration.description?.[lang] || ""}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playwrite font-normal text-3xl text-foreground mb-6">
            {t("illustrations.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("illustrations.cta.description")}
          </p>
          <a href="/commissioni" className="btn-hero inline-flex items-center">
            {t("illustrations.cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Illustrazioni;
