import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import heroImage from "@/assets/WallpaperPatternHomepage.png";

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-accent mr-3 animate-float" />
            <span className="text-accent font-medium text-lg">{t('hero.welcome')}</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-stagger-1">
            {t('hero.title').split(' ')[0]}
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('hero.title').split(' ')[1] + " " + t('hero.title').split(' ')[2]}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-stagger-2">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-stagger-3">
            <Link to="/illustrazioni">
              <Button className="btn-hero group">
                {t('hero.discover')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/commissioni">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {t('hero.commission')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-accent to-primary-glow rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;