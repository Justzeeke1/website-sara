import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { addDocument, updateDocument, deleteDocument } from "@/api/firebase";

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'array';
}

interface AdminTableProps {
  collectionName: string;
  title: string;
  fields: Field[];
}

const AdminTable = ({ collectionName, title, fields }: AdminTableProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Importa dbFirestore dinamicamente 
      const { dbFirestore } = await import("@/api/firebase");
      const q = collectionName === "illustrazioni" 
        ? query(collection(dbFirestore, collectionName), orderBy("order", "asc"))
        : query(collection(dbFirestore, collectionName));
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(items);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dei dati",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      const initialData: any = {};
      fields.forEach(field => {
        const value = getNestedValue(item, field.key);
        if (field.type === 'array' && Array.isArray(value)) {
          initialData[field.key] = value.join('\n');
        } else {
          initialData[field.key] = value || '';
        }
      });
      setFormData(initialData);
    } else {
      setEditingItem(null);
      const initialData: any = {};
      fields.forEach(field => {
        initialData[field.key] = '';
      });
      setFormData(initialData);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const processedData: any = {};
      
      fields.forEach(field => {
        let value = formData[field.key];
        
        if (field.type === 'array') {
          value = value ? value.split('\n').filter((item: string) => item.trim()) : [];
        } else if (field.type === 'number') {
          value = value ? Number(value) : 0;
        }
        
        setNestedValue(processedData, field.key, value);
      });

      let result;
      if (editingItem) {
        result = await updateDocument(collectionName, editingItem.id, processedData);
      } else {
        result = await addDocument(collectionName, processedData);
      }

      if (result.success) {
        toast({
          title: "Successo",
          description: editingItem ? "Elemento aggiornato" : "Elemento creato",
        });
        setIsDialogOpen(false);
        fetchData();
      } else {
        toast({
          title: "Errore",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
      const result = await deleteDocument(collectionName, id);
      
      if (result.success) {
        toast({
          title: "Successo",
          description: "Elemento eliminato",
        });
        fetchData();
      } else {
        toast({
          title: "Errore",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const renderField = (field: Field) => {
    const value = formData[field.key] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
            placeholder={field.label}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
            placeholder={field.label}
          />
        );
      case 'array':
        return (
          <Textarea
            value={value}
            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
            placeholder="Inserisci un elemento per riga"
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
            placeholder={field.label}
          />
        );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Modifica Elemento" : "Nuovo Elemento"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleSave}>
                  Salva
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {fields.slice(0, 3).map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                {fields.slice(0, 3).map((field) => (
                  <TableCell key={field.key}>
                    {(() => {
                      const value = getNestedValue(item, field.key);
                      if (field.type === 'array' && Array.isArray(value)) {
                        return value.join(', ');
                      }
                      return String(value || '').substring(0, 50) + (String(value || '').length > 50 ? '...' : '');
                    })()}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminTable;