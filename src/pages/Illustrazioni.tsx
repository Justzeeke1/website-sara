import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { fetchIllustrations } from "../api/firebase.js";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
const fallbackImage = "/placeholder.jpg";
import config from "../configs/config.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  useEffect(() => {
    const getAllIllustrations = async () => {
      const response = await fetchIllustrations();
      setIllustrations(response);
    };

    getAllIllustrations();
  }, []);

  const handleClick = (title: string) => {
    let message = `${t("illustrations.orderMessage")} ${title}.`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/+39${config.phoneNumber}?text=${encodedMessage}`;
    window.open(link, '_blank');
  };

  const lang = (i18n.language || "en").split("-")[0];

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
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
            {illustrations.map((illustration, index) => (
              <Card
                key={illustration.id}
                className={`portfolio-card animate-fade-in-up animate-stagger-${(index % 3) + 1}`}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="relative overflow-hidden group w-full">
                      <img
                        src={getImageSrc(illustration.image)}
                        alt={illustration.title?.[lang] || ""}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{illustration.title?.[lang] || ""}</DialogTitle>
                      <DialogDescription>{illustration.description?.[lang] || ""}</DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6">
                      <img
                        src={getImageSrc(illustration.image)}
                        alt={illustration.title?.[lang] || ""}
                        className="w-full h-auto object-contain rounded-lg"
                        loading="lazy"
                      />
                      <div>
                        {illustration.category?.[lang]?.length ? (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {illustration.category?.[lang]?.map((cat) => (
                              <Badge key={cat} variant="secondary" className="bg-gradient-accent text-white">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                        <p className="text-muted-foreground mb-6">
                          {illustration.description?.[lang] || ""}
                        </p>
                        <Button className="btn-hero w-full" onClick={() => handleClick(illustration.title?.[lang] || "")}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {t("illustrations.cta.button")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
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
