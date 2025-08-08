import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import config from '../configs/config.json';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdAlternateEmail } from "react-icons/md";
import { fetchServices } from "../api/firebase.js";
import emailjs from "@emailjs/browser";
import heroImage from "@/assets/WallpaperPatternHomepage.png";

const Commissioni = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0];

  const [services, setServices] = useState([]);

  useEffect(() => {
    const getAllServices = async () => {
      const response = await fetchServices();
      setServices(response);
    };

    getAllServices();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔹 Email da inviare a te (Admin)
  const templateParamsAdmin = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    service: formData.service,
    description: formData.description,
    budget: formData.budget,
    deadline: formData.deadline,
    to_email: config.email // la tua email personale
  };

  // 🔹 Email di conferma da inviare all'utente
  
  const messageUser = t("commissions.form.emailBody", {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    service: formData.service,
    description: formData.description,
    budget: formData.budget,
    deadline: formData.deadline
  });
  
  const templateParamsUser = {
    from_name: "Sara De Masi Art",
    to_email: formData.email,
    service: formData.service,
    message: messageUser,
    subject: t("commissions.form.emailSubject")
  };

  // 🔧 Sostituisci con i tuoi veri ID EmailJS
  const serviceId = config.serviceId;
  const templateIdAdmin = config.templateIdAdmin;
  const templateIdUser = config.templateIdUser;
  const publicKey = config.publicKey;

  try {
    await Promise.all([
      emailjs.send(serviceId, templateIdAdmin, templateParamsAdmin, publicKey),
      emailjs.send(serviceId, templateIdUser, templateParamsUser, publicKey)
    ]);

    toast({
      title: t("commissions.form.toast.successTitle"),
      description: t("commissions.form.toast.successDescription"),
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

  } catch (error) {
    toast({
      title: t("commissions.form.toast.failureTitle"),
      description: t("commissions.form.toast.failureDescription"),
      variant: "destructive"
    });
    console.error("Errore invio email:", error);
  }
};


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="section-artistic py-12 md:py-0 md:h-72 lg:h-80 flex items-center"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playwrite font-normal text-3xl sm:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            {t("commissions.title")}
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("commissions.subtitle")}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playwrite font-normal text-3xl font-bold text-foreground mb-4">{t("commissions.sectionTitle")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("commissions.sectionSubtitle")}
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
                    <CardTitle className="font-playwrite font-normal text-xl text-foreground">
                      {service.title?.[lang] || service.title?.en}
                    </CardTitle>
                    <Badge className="bg-gradient-accent text-white">
                      {service.price?.[lang] || service.price?.en}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {service.description?.[lang] || service.description?.en}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration?.[lang] || service.duration?.en}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(service.features?.[lang] || service.features?.en || []).map((feature, i) => (
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
            <h2 className="font-playwrite font-normal text-3xl font-bold text-foreground mb-4">{t("commissions.features.title")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("commissions.features.description")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {step}
                </div>
                <h3 className="font-playwrite font-normal text-lg mb-2">{t(`commissions.features.step${step}.title`)}</h3>
                <p className="text-muted-foreground text-sm">{t(`commissions.features.step${step}.description`)}</p>
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
              <CardTitle className="font-playwrite font-normal text-3xl text-foreground mb-4">
                {t("commissions.form.title")}
              </CardTitle>
              <p className="text-muted-foreground">
                {t("commissions.form.subtitle")}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("commissions.form.name.label")}</Label>
                    <Input
                      id="name"
                      placeholder={t("commissions.form.name.placeholder")}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("commissions.form.email.label")}</Label>
                    <Input
                      id="email"
                      placeholder={t("commissions.form.email.placeholder")}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("commissions.form.phone.label")}</Label>
                    <Input
                      id="phone"
                      placeholder={t("commissions.form.phone.placeholder")}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">{t("commissions.form.type.label")}</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled={formData.service !== ""} hidden={formData.service !== ""}>
                        {t("commissions.form.type.placeholder")}
                      </option>
                      {services.map(service => (
                        <option key={service.id} value={service.title?.[lang] || service.title?.en}>
                          {service.title?.[lang] || service.title?.en}
                        </option>
                      ))}
                      <option value="altro">{t("commissions.form.type.optionsOther")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t("commissions.form.description.label")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t("commissions.form.description.placeholder")}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">{t("commissions.form.budget.label")}</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder={t("commissions.form.budget.placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">{t("commissions.form.deadline.label")}</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-hero">
                  <Mail className="h-5 w-5 mr-2" />
                  {t("commissions.form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-artistic py-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playwrite font-normal text-3xl font-bold text-foreground mb-8">
            {t("commissions.contacts.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <MdAlternateEmail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-playwrite font-normal text-lg mb-2">{t("commissions.contacts.email")}</h3>
              <p className="text-muted-foreground">{config.email}</p>
            </div>
            {/* WhatsApp */}
            <div className="flex flex-col items-center">
              <a
                href={`https://wa.me/${config.phoneNumber.replace(/\s+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-4"
              >
                <FaWhatsapp className="h-8 w-8 text-white" />
              </a>
              <h3 className="font-playwrite font-normal text-lg mb-2">
                {t("commissions.contacts.whatsapp")}
              </h3>
              <p className="text-muted-foreground">+39 {config.phoneNumber}</p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center">
              <a
                href={`https://instagram.com/${config.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4"
              >
                <FaInstagram className="h-8 w-8 text-white" />
              </a>
              <h3 className="font-playwrite font-normal text-lg mb-2">
                {t("commissions.contacts.instagram")}
              </h3>
              <p className="text-muted-foreground">@{config.instagram}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Commissioni;