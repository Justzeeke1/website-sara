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
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from "firebase/firestore";
import { addDocument, updateDocument, deleteDocument } from "@/api/firebase";
import { Checkbox } from "@/components/ui/checkbox";

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'array' | 'multi-select' | 'select' | 'boolean';
  options?: string[]; // for select or multi-select
  max?: number; // max selections for multi-select
  showInTable?: boolean; // whether to show this field as a column
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
      const items = querySnapshot.docs.map(d => ({
        docId: d.id,
        ...d.data()
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
        } else if (field.type === 'multi-select') {
          initialData[field.key] = Array.isArray(value) ? value : [];
        } else if (field.type === 'number') {
          initialData[field.key] = value ?? '';
        } else {
          initialData[field.key] = value || '';
        }
      });
      setFormData(initialData);
    } else {
      setEditingItem(null);
      const initialData: any = {};
      fields.forEach(field => {
        if (field.type === 'multi-select') {
          initialData[field.key] = [];
        } else {
          initialData[field.key] = '';
        }
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
          value = value !== '' && value !== null && value !== undefined ? Number(value) : 0;
        } // multi-select stays as an array

        setNestedValue(processedData, field.key, value);
      });

      // Special ordering logic for 'illustrazioni' when inserting a new item
      if (!editingItem && collectionName === 'illustrazioni' && typeof processedData.order === 'number' && processedData.order > 0) {
        const { dbFirestore } = await import('@/api/firebase');
        const q = query(collection(dbFirestore, 'illustrazioni'), where('order', '>=', processedData.order));
        const snap = await getDocs(q);
        const updates = snap.docs.map(async (d) => {
          const curr = d.data()?.order ?? 0;
          await updateDoc(d.ref, { order: curr + 1 });
        });
        await Promise.all(updates);
      }

      let result;
      if (editingItem) {
        result = await updateDocument(collectionName, editingItem.docId, processedData);
      } else {
        result = await addDocument(collectionName, processedData);
      }

      if (result.success) {
        toast({
          title: 'Successo',
          description: editingItem ? 'Elemento aggiornato' : 'Elemento creato',
        });
        setIsDialogOpen(false);
        fetchData();
      } else {
        toast({
          title: 'Errore',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante il salvataggio',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
      const result = await deleteDocument(collectionName, docId);
      
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
    const value = formData[field.key];
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={field.label}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={field.label}
          />
        );
      case 'array':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder="Inserisci un elemento per riga"
          />
        );
      case 'multi-select': {
        const selected: string[] = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-3">
            {field.options?.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const next = (() => {
                        if (isChecked) {
                          if (!checked) {
                            const candidate = [...selected, opt];
                            if (field.max && candidate.length > field.max) return selected; // prevent exceeding max
                            return candidate;
                          }
                          return selected;
                        } else {
                          return selected.filter((v) => v !== opt);
                        }
                      })();
                      setFormData({ ...formData, [field.key]: next });
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );
      }
      case 'select': {
        // Simple native select to keep dependencies minimal
        return (
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
          >
            <option value="">Seleziona...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }
      case 'boolean': {
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => setFormData({ ...formData, [field.key]: checked })}
          />
        );
      }
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
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
              {fields.filter((f) => f.showInTable).map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.docId}>
                {fields.filter((f) => f.showInTable).map((field) => (
                  <TableCell key={field.key}>
                    {(() => {
                      const value = getNestedValue(item, field.key);
                      if (field.type === 'boolean') {
                        return value ? 'Sì' : 'No';
                      }
                      if ((field.type === 'array' || field.type === 'multi-select') && Array.isArray(value)) {
                        return value.join(', ');
                      }
                      return String(value ?? '').substring(0, 80) + (String(value ?? '').length > 80 ? '...' : '');
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
                      onClick={() => handleDelete(item.docId)}
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