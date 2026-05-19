import { useState } from 'react';
import { Save, Store, Globe, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    name: 'Livraria Gilede Vieira',
    email: 'livrariagiledevieira@gmail.com',
    phone: '(11) 98542-8782',
    whatsapp: '5511985428782',
    address: 'Rua Abílio Cesar 26, São Paulo, SP, 05881-020',
    instagram: '@giledevieira',
    facebook: 'LivrariaGiledeVieira'
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In production, this would save to a backend
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-slate-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gerencie as informações da sua livraria
        </p>
      </div>

      {/* Store Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Store className="size-5 text-[#1e3a5f] dark:text-blue-400" />
          <h2 className="text-xl text-slate-900 dark:text-white">
            Informações da Loja
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Livraria</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="size-5 text-[#1e3a5f] dark:text-blue-400" />
          <h2 className="text-xl text-slate-900 dark:text-white">
            Informações de Contato
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="whatsapp">WhatsApp (com código do país)</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="5511985428782"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="size-5 text-[#1e3a5f] dark:text-blue-400" />
          <h2 className="text-xl text-slate-900 dark:text-white">
            Redes Sociais
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={settings.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="@usuario"
            />
          </div>

          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={settings.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#1e3a5f] hover:bg-[#2d5082] dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Save className="size-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
