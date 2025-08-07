import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import config from '../configs/config.json';
import { fetchKeychains } from '../api/firebase.js';
import { useTranslation } from "react-i18next";
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

const Portachiavi = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0];

  const [keychains, setKeychains] = useState([]);

  useEffect(() => {
    const getAllKeychains = async () => {
      const response = await fetchKeychains();
      setKeychains(response);
    };

    getAllKeychains();
  }, []);

  const handleClick = (title: string, preorder: boolean) => {
    let message: string;
    if(preorder){
      message = `${t("keychains.order.preorderMessage")} ${title}.`
    } else {
      message = `${t("keychains.order.orderMessage")} ${title}.`
    }
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/+39${config.phoneNumber}?text=${encodedMessage}`;
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {t("keychains.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("keychains.subtitle")}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keychains.map((keychain, index) => (
              <Card 
                key={keychain.id} 
                className={`portfolio-card animate-fade-in-up animate-stagger-${(index % 3) + 1}`}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="relative overflow-hidden group w-full">
                      <img
                        src={getImageSrc(keychain.image)}
                        alt={keychain.title[lang] || keychain.title["en"]}
                        className="w-full h-70 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {!keychain.available && !keychain.preorder && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-white">
                            {t("keychains.unavailable")}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-foreground shadow-soft hover:bg-white/90 cursor-default">
                          {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(keychain.price)}
                        </Badge>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{keychain.title[lang] || keychain.title["en"]}</DialogTitle>
                      <DialogDescription>{keychain.description[lang] || keychain.description["en"]}</DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6">
                      <img
                        src={getImageSrc(keychain.image)}
                        alt={keychain.title[lang] || keychain.title["en"]}
                        className="w-full h-auto object-contain rounded-lg"
                        loading="lazy"
                      />
                      <div>
                        <div className="mb-4">
                          <Badge className="bg-white/90 text-foreground shadow-soft hover:bg-white/90 cursor-default">
                            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(keychain.price)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-6">
                          {keychain.description[lang] || keychain.description["en"]}
                        </p>
                        <Button
                          className={`w-full ${keychain.available || keychain.preorder ? "btn-hero" : "bg-gray-400 cursor-not-allowed"}`}
                          disabled={!keychain.available && !keychain.preorder}
                          onClick={() => handleClick(keychain.title[lang] || keychain.title["en"], keychain.preorder)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {keychain.available ? t("keychains.buy") : keychain.preorder ? t("keychains.preorder") : t("keychains.unavailable")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {keychain.title[lang] || keychain.title["en"]}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {keychain.description[lang] || keychain.description["en"]}
                  </p>
                  <Button 
                    className={`w-full ${
                      keychain.available || keychain.preorder
                        ? "btn-hero" 
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!keychain.available && !keychain.preorder}
                    onClick={() => handleClick(keychain.title[lang] || keychain.title["en"], keychain.preorder)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {keychain.available ? t("keychains.buy") : keychain.preorder ? t("keychains.preorder") : t("keychains.unavailable")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {t("keychains.features.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("keychains.features.unique.title")}</h3>
              <p className="text-muted-foreground">
                {t("keychains.features.unique.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("keychains.features.durable.title")}</h3>
              <p className="text-muted-foreground">
                {t("keychains.features.durable.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("keychains.features.shipping.title")}</h3>
              <p className="text-muted-foreground">
                {t("keychains.features.shipping.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("keychains.cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t("keychains.cta.description")}
            </p>
            <a 
              href="/commissioni"
              className="btn-hero inline-flex items-center"
            >
              {t("keychains.cta.button")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portachiavi;
