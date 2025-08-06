import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Palette, Mail, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const services = [
  {
    id: 1,
    title: "Ritratto Personalizzato",
    description: "Ritratti di persone o animali domestici in acquerello",
    price: "A partire da €50",
    duration: "3-5 giorni",
    features: ["Formato A4 o A3", "Acquerello su carta", "Foto di riferimento inclusa", "Bozza per approvazione"]
  },
  {
    id: 2,
    title: "Illustrazione per Bambini",
    description: "Illustrazioni colorate per libri o camerette",
    price: "A partire da €35",
    duration: "2-4 giorni",
    features: ["Stile cartoonesco", "Colori vivaci", "Formato personalizzabile", "Ideale per stampa"]
  },
  {
    id: 3,
    title: "Logo & Branding",
    description: "Logo unico e identità visiva per la tua attività",
    price: "A partire da €80",
    duration: "5-7 giorni",
    features: ["3 proposte iniziali", "2 revisioni incluse", "File vettoriali", "Varianti colore"]
  },
  {
    id: 4,
    title: "Portachiavi Personalizzato",
    description: "Portachiavi con il tuo design o personaggio preferito",
    price: "A partire da €15",
    duration: "2-3 giorni",
    features: ["Design personalizzato", "Stampa su acrilico", "Anello incluso", "Confezione regalo"]
  }
];

const Commissioni = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    description: "",
    budget: "",
    deadline: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Richiesta inviata!",
      description: "Ti risponderò entro 24 ore con un preventivo dettagliato.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      description: "",
      budget: "",
      deadline: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="section-artistic py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Commissioni Personalizzate
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dai vita alle tue idee! Collaboriamo insieme per creare l'opera d'arte perfetta 
            per te, che si tratti di un ritratto, un logo o un'illustrazione unica.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">I Miei Servizi</h2>
            <p className="text-lg text-muted-foreground">
              Scegli il servizio più adatto alle tue esigenze
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`portfolio-card animate-fade-in-up animate-stagger-${(index % 2) + 1}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                    <Badge className="bg-gradient-accent text-white">{service.price}</Badge>
                  </div>
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Come Funziona</h2>
            <p className="text-lg text-muted-foreground">
              Un processo semplice e trasparente per la tua commissione
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Contatto", desc: "Compila il modulo con i dettagli del tuo progetto" },
              { step: "2", title: "Preventivo", desc: "Ricevi un preventivo personalizzato entro 24 ore" },
              { step: "3", title: "Creazione", desc: "Inizio a lavorare sulla tua opera dopo l'acconto" },
              { step: "4", title: "Consegna", desc: "Ricevi la tua commissione completata" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-artistic">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-foreground mb-4">
                Richiedi la Tua Commissione
              </CardTitle>
              <p className="text-muted-foreground">
                Compila il modulo sottostante con tutti i dettagli del tuo progetto
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Tipo di Servizio *</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 focus:shadow-glow"
                    >
                      <option value="">Seleziona un servizio</option>
                      {services.map(service => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                      ))}
                      <option value="altro">Altro (specifica nella descrizione)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione del Progetto *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descrivi dettagliatamente cosa vorresti che realizzassi..."
                    rows={5}
                    required
                    className="transition-all duration-300 focus:shadow-glow"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Indicativo</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="es. €50-100"
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Scadenza Desiderata</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-hero">
                  <Mail className="h-5 w-5 mr-2" />
                  Invia Richiesta
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Altri Modi per Contattarmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">illustratrice@email.com</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Telefono</h3>
              <p className="text-muted-foreground">+39 123 456 7890</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground">+39 123 456 7890</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Commissioni;