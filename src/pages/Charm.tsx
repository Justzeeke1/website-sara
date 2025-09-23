import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles, Star } from "lucide-react";
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
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import heroImage from "@/assets/WallpaperPatternHomepage.png";
import config from "../configs/config.json";
import { useTranslation } from "react-i18next";

import { fetchCharms } from "../api/firebase.js";

const fallbackImage = "/placeholder.jpg";

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

// ✅ Normalizza il campo image per restituire sempre un array
const normalizeImages = (
  imageOrImages: string | string[] | undefined
): string[] => {
  if (!imageOrImages) return [];
  if (Array.isArray(imageOrImages)) return imageOrImages;
  return [imageOrImages];
};

const Charm = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0];

  const [charms, setCharms] = useState([]);
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
    const getAllCharms = async () => {
      const response = await fetchCharms();
      setCharms(response);
    };

    getAllCharms();
  }, []);

  const handleClick = (title: string, preorder: boolean, idToClose?: string) => {
    const message = preorder
      ? `${t("charms.order.preorderMessage", { defaultValue: "Vorrei preordinare" })} ${title}.`
      : `${t("charms.order.orderMessage", { defaultValue: "Vorrei ordinare" })} ${title}.`;

    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/+39${config.phoneNumber}?text=${encodedMessage}`;
    window.open(link, "_blank");
    // Chiudi il dialog
    if (idToClose) setOpenDialogId(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-artistic py-12 md:py-0 md:h-72 lg:h-80 flex items-center"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playwrite font-normal text-3xl sm:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            {t("charms.title", { defaultValue: "Charm" })}
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("charms.subtitle", { defaultValue: "Collezione di charm personalizzati" })}
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charms.map((charm, index) => {
              const title = charm.title?.[lang] || charm.title?.["en"];
              const description =
                charm.description?.[lang] || charm.description?.["en"];
              const detailDescription =
                charm.detailDescription?.[lang] || charm.detailDescription?.["en"];

              const mainImage = Array.isArray(charm.image)
                ? charm.image[0]
                : charm.image;

              const images = charm.images?.length
                ? charm.images
                : normalizeImages(charm.image);

              return (
                <Card
                  key={charm.id}
                  className={`portfolio-card animate-fade-in-up animate-stagger-${
                    (index % 3) + 1
                  }`}
                >
                  <Dialog
                    open={openDialogId === charm.id}
                    onOpenChange={(isOpen) =>
                      setOpenDialogId(isOpen ? charm.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="relative overflow-hidden group w-full"
                      >
                        <img
                          src={getImageSrc(mainImage)}
                          alt={title}
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={isMobile ? { maxHeight: '300px', height: 'auto' } : {}}
                        />
                        {!charm.available && !charm.preorder && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-white">
                              {t("charms.unavailable", { defaultValue: "Non disponibile" })}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-foreground shadow-soft hover:bg-white/90 cursor-default">
                            {new Intl.NumberFormat("it-IT", {
                              style: "currency",
                              currency: "EUR",
                            }).format(charm.price)}
                          </Badge>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogTitle>
                      <VisuallyHidden>{title}</VisuallyHidden>
                    </DialogTitle>
                    <DialogContent className="w-full max-w-[100vw] sm:max-w-[500px] md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <Carousel className="w-full">
                            <CarouselContent>
                              {images.map((img) => (
                                <CarouselItem key={img}>
                                  <img
                                    src={getImageSrc(img)}
                                    alt={title}
                                    className="w-full object-contain rounded-lg"
                                    style={isMobile ? { maxHeight: '300px', height: 'auto' } : {}}
                                    loading="lazy"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          {Array.isArray(images) && images.length > 1 && (
                            <>
                              <CarouselPrevious className="left-2" />
                              <CarouselNext className="right-2" />
                            </>
                          )}
                          </Carousel>
                        </div>
                        <div>
                          <p className="font-playwrite font-normal mb-6" style={{fontSize: "2rem"}}>
                            {title}
                          </p>
                          <p className="text-muted-foreground mb-6">
                            {description}
                          </p>
                          <div className="mb-4">
                            <p className="mb-6" style={{fontSize: "1.1rem"}}>
                              {detailDescription}
                            </p>
                            {Object.entries(t("charms.details", { returnObjects: true, defaultValue: {} })).map(
                              ([key, value]) => (
                                <div key={key} className="flex items-center mb-2">
                                  <Sparkles className="h-6 w-6 text-accent mr-3 flex-shrink-0" />
                                  <span>{value}</span>
                                </div>
                              )
                            )}
                            <div className="text-sm text-muted-foreground">
                              {t("charms.priceLabel", {
                                defaultValue: "Prezzo",
                              })}
                            </div>
                            <div className="text-2xl font-bold">
                              {new Intl.NumberFormat("it-IT", {
                                style: "currency",
                                currency: "EUR",
                              }).format(charm.price)}
                            </div>
                          </div>
                          <Button
                            className={`w-full ${
                              charm.available || charm.preorder
                                ? "btn-hero"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={
                              !charm.available && !charm.preorder
                            }
                            onClick={() =>
                              handleClick(title, charm.preorder, charm.id)
                            }
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {charm.available
                              ? t("charms.buy", { defaultValue: "Acquista" })
                              : charm.preorder
                              ? t("charms.preorder", { defaultValue: "Preordina" })
                              : t("charms.unavailable", { defaultValue: "Non disponibile" })}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-playwrite font-normal text-xl text-foreground mb-2">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <Button
                      className={`w-full ${
                        charm.available || charm.preorder
                          ? "btn-hero"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!charm.available && !charm.preorder}
                      onClick={() => handleClick(title, charm.preorder, charm.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {charm.available
                        ? t("charms.buy", { defaultValue: "Acquista" })
                        : charm.preorder
                        ? t("charms.preorder", { defaultValue: "Preordina" })
                        : t("charms.unavailable", { defaultValue: "Non disponibile" })}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playwrite font-normal text-3xl text-foreground mb-6">
              {t("charms.features.title", { defaultValue: "Caratteristiche" })}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("charms.features.unique.title", { defaultValue: "Unici" })}
              </h3>
              <p className="text-muted-foreground">
                {t("charms.features.unique.description", { defaultValue: "Ogni charm è unico e personalizzato" })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("charms.features.durable.title", { defaultValue: "Resistenti" })}
              </h3>
              <p className="text-muted-foreground">
                {t("charms.features.durable.description", { defaultValue: "Materiali di alta qualità e resistenti" })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("charms.features.shipping.title", { defaultValue: "Spedizione" })}
              </h3>
              <p className="text-muted-foreground">
                {t("charms.features.shipping.description", { defaultValue: "Spedizione veloce e sicura" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8">
            <h2 className="font-playwrite font-normal text-3xl text-foreground mb-4">
              {t("charms.cta.title", { defaultValue: "Hai bisogno di charm personalizzati?" })}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t("charms.cta.description", { defaultValue: "Contattaci per una commissione personalizzata" })}
            </p>
            <a href="/commissioni" className="btn-hero inline-flex items-center">
              {t("charms.cta.button", { defaultValue: "Richiedi Commissione" })}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Charm;