import { Heart, Palette, Coffee } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png'

const AboutMe = () => {
  const { t } = useTranslation();
  
  return (
    <section className="section-artistic py-20">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playwrite font-normal text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Avatar and Info */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative">
                <Avatar className="shadow-artistic border-4 border-primary/20" style={{height: "20rem", width: "20rem"}}>
                  <AvatarImage 
                    src={logo} 
                    alt={t('about.avatarAlt')}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground">
                    Logo
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <h3 className="font-playwrite font-normal text-2xl font-bold text-foreground mb-4">
              {t('about.name')}
            </h3>
            
            <div className="flex justify-center lg:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Palette className="h-5 w-5" />
                <span className="text-sm font-medium">{t('about.role')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div className="portfolio-card p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Coffee className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-playwrite font-normal text-lg text-foreground mb-3">
                    {t('about.storyTitle')}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('about.description1')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('about.description2')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.description3')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">3+</div>
                <div className="text-sm text-muted-foreground">{t('about.experience')}</div>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <div className="text-2xl font-bold text-accent mb-1">40+</div>
                <div className="text-sm text-muted-foreground">{t('about.projects')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;