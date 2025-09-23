import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Shield } from "lucide-react";
import { loginAdmin, logoutAdmin, onAuthChange } from "@/api/firebase";
import AdminTable from "@/components/AdminTable";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const result = await loginAdmin(email, password);
    
    if (result.success) {
      toast({
        title: "Login effettuato",
        description: "Benvenuto nell'area admin",
      });
    } else {
      toast({
        title: "Errore di login",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    const result = await logoutAdmin();
    
    if (result.success) {
      toast({
        title: "Logout effettuato",
        description: "Arrivederci!",
      });
    } else {
      toast({
        title: "Errore di logout",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se non è autenticato, mostra il form di login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se è autenticato, mostra il pannello admin
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pannello Admin</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="illustrazioni" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="illustrazioni">Illustrazioni</TabsTrigger>
          <TabsTrigger value="portachiavi">Portachiavi</TabsTrigger>
          <TabsTrigger value="servizi">Servizi</TabsTrigger>
          <TabsTrigger value="sticker">Sticker</TabsTrigger>
          <TabsTrigger value="spille">Spille</TabsTrigger>
          <TabsTrigger value="charm">Charm</TabsTrigger>
        </TabsList>

        <TabsContent value="illustrazioni">
          <AdminTable 
            collectionName="illustrazioni" 
            title="Gestione Illustrazioni"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'order', label: 'Ordine', type: 'number', showInTable: true },
              { key: 'format', label: 'Formato', type: 'multi-select', options: ['A4', 'A5', 'A6', 'Sticker'] },
              { key: 'category.it', label: 'Categoria (IT)', type: 'multi-select', options: ['Illustrazione', 'Sticker'], max: 2 },
              { key: 'category.en', label: 'Category (EN)', type: 'multi-select', options: ['Illustration', 'Sticker'], max: 2 },
              // Opzionali, non mostrati in tabella
              { key: 'title.en', label: 'Titolo (EN)', type: 'text' },
              { key: 'description.en', label: 'Descrizione (EN)', type: 'textarea' },
              { key: 'image', label: 'URL Immagine', type: 'text' },
            ]}
          />
        </TabsContent>

        <TabsContent value="portachiavi">
          <AdminTable 
            collectionName="portachiavi" 
            title="Gestione Portachiavi"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'available', label: 'Disponibile', type: 'boolean', showInTable: true },
              { key: 'preorder', label: 'Preordine', type: 'boolean', showInTable: true },
              { key: 'price', label: 'Prezzo', type: 'number' },
              { key: 'image', label: 'Immagine', type: 'text' },
            ]}
          />
        </TabsContent>

        <TabsContent value="servizi">
          <AdminTable 
            collectionName="servizi" 
            title="Gestione Servizi"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'duration.it', label: 'Durata (IT)', type: 'text', showInTable: true },
              { key: 'price.it', label: 'Prezzo (IT)', type: 'text', showInTable: true },
              { key: 'title.en', label: 'Titolo (EN)', type: 'text' },
              { key: 'description.en', label: 'Descrizione (EN)', type: 'textarea' },
              { key: 'duration.en', label: 'Durata (EN)', type: 'text' },
              { key: 'price.en', label: 'Prezzo (EN)', type: 'text' },
            ]}
          />
        </TabsContent>

        <TabsContent value="sticker">
          <AdminTable 
            collectionName="stickers" 
            title="Gestione Sticker"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'available', label: 'Disponibile', type: 'boolean', showInTable: true },
              { key: 'preorder', label: 'Preordine', type: 'boolean', showInTable: true },
              { key: 'price', label: 'Prezzo', type: 'number' },
              { key: 'image', label: 'Immagine', type: 'text' },
            ]}
          />
        </TabsContent>

        <TabsContent value="spille">
          <AdminTable 
            collectionName="spille" 
            title="Gestione Spille"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'available', label: 'Disponibile', type: 'boolean', showInTable: true },
              { key: 'preorder', label: 'Preordine', type: 'boolean', showInTable: true },
              { key: 'price', label: 'Prezzo', type: 'number' },
              { key: 'image', label: 'Immagine', type: 'text' },
            ]}
          />
        </TabsContent>

        <TabsContent value="charm">
          <AdminTable 
            collectionName="charm" 
            title="Gestione Charm"
            fields={[
              { key: 'id', label: 'ID', type: 'number', showInTable: true },
              { key: 'title.it', label: 'Titolo (IT)', type: 'text', showInTable: true },
              { key: 'description.it', label: 'Descrizione (IT)', type: 'textarea', showInTable: true },
              { key: 'available', label: 'Disponibile', type: 'boolean', showInTable: true },
              { key: 'preorder', label: 'Preordine', type: 'boolean', showInTable: true },
              { key: 'price', label: 'Prezzo', type: 'number' },
              { key: 'image', label: 'Immagine', type: 'text' },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;