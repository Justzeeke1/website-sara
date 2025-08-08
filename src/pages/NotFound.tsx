import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import heroImage from "@/assets/WallpaperPatternHomepage.png";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center">
        <h1 className="font-playwrite font-normal text-4xl mb-4 text-foreground">{t('notFound.title')}</h1>
        <p className="font-playwrite font-normal text-muted-foreground mb-4" style={{fontSize:"2rem"}}>{t('notFound.message')}</p>
        <a href="/" className="text-primary hover:text-primary-glow underline">
          {t('notFound.backHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
