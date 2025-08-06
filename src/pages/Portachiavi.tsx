import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import keychain1 from "@/assets/keychain-sample-1.jpg";
import keychain2 from "@/assets/keychain-sample-2.jpg";

const keychains = [
  {
    id: 1,
    title: "Collezione Kawaii",
    description: "Portachiavi con personaggi adorabili: sole, nuvola e stella",
    image: keychain1,
    price: "€8",
    rating: 4.9,
    reviews: 23,
    available: true
  },
  {
    id: 2,
    title: "Animali del Bosco",
    description: "Volpe, coniglio e gufo in stile acquerello delicato",
    image: keychain2,
    price: "€10",
    rating: 5.0,
    reviews: 18,
    available: true
  },
  {
    id: 3,
    title: "Fiori Primaverili",
    description: "Illustrazioni botaniche su portachiavi in acrilico",
    image: keychain1,
    price: "€9",
    rating: 4.8,
    reviews: 31,
    available: false
  },
  {
    id: 4,
    title: "Gatti Espressivi",
    description: "Una collezione di gattini con diverse espressioni",
    image: keychain2,
    price: "€8",
    rating: 4.9,
    reviews: 27,
    available: true
  },
  {
    id: 5,
    title: "Elementi Magici",
    description: "Luna, stelle e cristalli in un design mistico",
    image: keychain1,
    price: "€11",
    rating: 5.0,
    reviews: 14,
    available: true
  },
  {
    id: 6,
    title: "Cibo Kawaii",
    description: "Cibi carini con faccine sorridenti",
    image: keychain2,
    price: "€7",
    rating: 4.7,
    reviews: 42,
    available: true
  }
];

const Portachiavi = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Portachiavi Artistici
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Porta sempre con te un pezzo della mia arte! Portachiavi in acrilico 
            con le mie illustrazioni originali, perfetti come regalo o per personalizzare le tue chiavi.
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
                <div className="relative overflow-hidden">
                  <img
                    src={keychain.image}
                    alt={keychain.title}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {!keychain.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-white">
                        Esaurito
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-foreground shadow-soft">
                      {keychain.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {keychain.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(keychain.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({keychain.reviews} recensioni)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {keychain.description}
                  </p>
                  <Button 
                    className={`w-full ${
                      keychain.available 
                        ? "btn-hero" 
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!keychain.available}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {keychain.available ? "Aggiungi al carrello" : "Non disponibile"}
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
              Perché scegliere i miei portachiavi?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Illustrazioni Originali</h3>
              <p className="text-muted-foreground">
                Ogni design è creato a mano da me, garantendo unicità e qualità artistica
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Materiali di Qualità</h3>
              <p className="text-muted-foreground">
                Acrilico resistente e stampa ad alta definizione per una durata nel tempo
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Spedizione Rapida</h3>
              <p className="text-muted-foreground">
                Preparazione veloce e spedizione sicura in tutta Italia
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
              Vuoi un design personalizzato?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Posso creare portachiavi unici con le tue idee o con il tuo animale domestico!
            </p>
            <a 
              href="/commissioni"
              className="btn-hero inline-flex items-center"
            >
              Richiedi un portachiavi personalizzato
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portachiavi;