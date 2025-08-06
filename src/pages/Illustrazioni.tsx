import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import illustration1 from "@/assets/sample-illustration-1.jpg";
import illustration2 from "@/assets/sample-illustration-2.jpg";
import illustration3 from "@/assets/sample-illustration-3.jpg";

const illustrations = [
  {
    id: 1,
    title: "Volpe Magica",
    description: "Illustrazione in acquerello di una volpe in un bosco incantato",
    image: illustration1,
    category: "Acquerello",
    likes: 24,
    views: 156
  },
  {
    id: 2,
    title: "Giardino Botanico",
    description: "Delicate illustrazioni floreali in stile botanico",
    image: illustration2,
    category: "Botanico",
    likes: 31,
    views: 203
  },
  {
    id: 3,
    title: "Gattino Kawaii",
    description: "Ritratto tenero di un gattino in stile kawaii",
    image: illustration3,
    category: "Kawaii",
    likes: 42,
    views: 289
  },
  {
    id: 4,
    title: "Paesaggio Fantastico",
    description: "Mondo immaginario con colori pastello",
    image: illustration1,
    category: "Fantasy",
    likes: 18,
    views: 134
  },
  {
    id: 5,
    title: "Ritratto Animalier",
    description: "Studio dettagliato di animali selvatici",
    image: illustration2,
    category: "Animalier",
    likes: 27,
    views: 178
  },
  {
    id: 6,
    title: "Illustrazione Fiabesca",
    description: "Personaggi delle fiabe reinterpretati in chiave moderna",
    image: illustration3,
    category: "Fiabe",
    likes: 35,
    views: 241
  }
];

const Illustrazioni = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Le Mie Illustrazioni
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una collezione di opere che spaziano dall'acquerello al digitale, 
            dal realismo al fantastico. Ogni illustrazione racconta una storia unica.
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
                <div className="relative overflow-hidden">
                  <img
                    src={illustration.image}
                    alt={illustration.title}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{illustration.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{illustration.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {illustration.title}
                    </h3>
                    <Badge variant="secondary" className="bg-gradient-accent text-white">
                      {illustration.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {illustration.description}
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
            Ti piace il mio stile?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Posso creare un'illustrazione personalizzata per te. 
            Contattami per discutere il tuo progetto!
          </p>
          <a 
            href="/commissioni"
            className="btn-hero inline-flex items-center"
          >
            Richiedi una commissione
          </a>
        </div>
      </section>
    </div>
  );
};

export default Illustrazioni;