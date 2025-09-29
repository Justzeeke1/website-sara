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
import { fetchPins } from "../api/firebase.js";

const fallbackImage = "/placeholder.jpg";

const imageMap = import.meta.glob("/src/assets/spille/*", {
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

const Spille = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0];

  const [pins, setPins] = useState([]);
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
    const getAllPins = async () => {
      const response = await fetchPins();
      setPins(response);
    };

    getAllPins();
  }, []);

  const handleClick = (title: string, preorder: boolean, idToClose?: string) => {
    const message = preorder
      ? `${t("pins.order.preorderMessage", { defaultValue: "Vorrei preordinare" })} ${title}.`
      : `${t("pins.order.orderMessage", { defaultValue: "Vorrei ordinare" })} ${title}.`;

    if (config.stopVendite || preorder) {
      // Apri WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/+39${config.phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappLink, "_blank");
    } else {
      // Apri link di Vinted
      window.open(config.vintedShop, "_blank");
    }

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
            {t("pins.title", { defaultValue: "Spille" })}
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("pins.subtitle", { defaultValue: "Collezione di spille personalizzate" })}
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pins.map((pin, index) => {
              const title = pin.title?.[lang] || pin.title?.["en"];
              const description =
                pin.description?.[lang] || pin.description?.["en"];
              const detailDescription =
                pin.detailDescription?.[lang] || pin.detailDescription?.["en"];

              const mainImage = Array.isArray(pin.image)
                ? pin.image[0]
                : pin.image;

              const images = pin.images?.length
                ? pin.images
                : normalizeImages(pin.image);

              return (
                <Card
                  key={pin.id}
                  className={`portfolio-card animate-fade-in-up animate-stagger-${
                    (index % 3) + 1
                  }`}
                >
                  <Dialog
                    open={openDialogId === pin.id}
                    onOpenChange={(isOpen) =>
                      setOpenDialogId(isOpen ? pin.id : null)
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
                          style={isMobile ? { maxHeight: '200px', height: 'auto' } : {maxHeight: '300px', imageRendering: "crisp-edges"}}
                        />
                        {!pin.available && !pin.preorder && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-white">
                              {t("pins.unavailable", { defaultValue: "Non disponibile" })}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-foreground shadow-soft hover:bg-white/90 cursor-default">
                            {new Intl.NumberFormat("it-IT", {
                              style: "currency",
                              currency: "EUR",
                            }).format(pin.price)}
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
                          {/* <p className="text-muted-foreground mb-6">
                            {description}
                          </p> */}
                          <div className="mb-4">
                            {Object.entries(t("pins.details", { returnObjects: true, defaultValue: {} })).map(
                              ([key, value]) => (
                                <div key={key} className="flex items-center mb-2">
                                  <Sparkles className="h-6 w-6 text-accent mr-3 flex-shrink-0" />
                                  <span>{value}</span>
                                </div>
                              )
                            )}
                            <div className="text-sm text-muted-foreground mt-4 mb-2">
                              {t("pins.shipping")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("pins.priceLabel", {
                                defaultValue: "Prezzo",
                              })}
                            </div>
                            <div className="text-2xl font-bold">
                              {new Intl.NumberFormat("it-IT", {
                                style: "currency",
                                currency: "EUR",
                              }).format(pin.price)}
                            </div>
                          </div>
                          <Button
                            className={`w-full ${
                              pin.available || pin.preorder
                                ? "btn-hero"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={
                              !pin.available && !pin.preorder
                            }
                            onClick={() =>
                              handleClick(title, pin.preorder, pin.id)
                            }
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {pin.available
                              ? t("pins.buy", { defaultValue: "Acquista" })
                              : pin.preorder
                              ? t("pins.preorder", { defaultValue: "Preordina" })
                              : t("pins.unavailable", { defaultValue: "Non disponibile" })}
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
                    <Button
                      className={`w-full ${
                        pin.available || pin.preorder
                          ? "btn-hero"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!pin.available && !pin.preorder}
                      onClick={() => handleClick(title, pin.preorder, pin.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {pin.available
                        ? t("pins.buy", { defaultValue: "Acquista" })
                        : pin.preorder
                        ? t("pins.preorder", { defaultValue: "Preordina" })
                        : t("pins.unavailable", { defaultValue: "Non disponibile" })}
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
              {t("pins.features.title", { defaultValue: "Caratteristiche" })}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("pins.features.unique.title", { defaultValue: "Uniche" })}
              </h3>
              <p className="text-muted-foreground">
                {t("pins.features.unique.description", { defaultValue: "Ogni spilla è unica e personalizzata" })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("pins.features.durable.title", { defaultValue: "Resistenti" })}
              </h3>
              <p className="text-muted-foreground">
                {t("pins.features.durable.description", { defaultValue: "Materiali di alta qualità e resistenti" })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-xl mb-3">
                {t("pins.features.shipping.title", { defaultValue: "Spedizione" })}
              </h3>
              <p className="text-muted-foreground">
                {t("pins.features.shipping.description", { defaultValue: "Spedizione veloce e sicura" })}
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
              {t("pins.cta.title", { defaultValue: "Hai bisogno di spille personalizzate?" })}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t("pins.cta.description", { defaultValue: "Contattaci per una commissione personalizzata" })}
            </p>
            <a href="/commissioni" className="btn-hero inline-flex items-center">
              {t("pins.cta.button", { defaultValue: "Richiedi Commissione" })}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spille;