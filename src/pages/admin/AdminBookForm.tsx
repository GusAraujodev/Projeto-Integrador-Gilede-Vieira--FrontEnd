import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const categories = [
  'Autoajuda',
  'Romance',
  'Suspense',
  'Evangélico',
  'Didático',
  'Ficção',
  'Biografia',
  'Infantil',
  'Técnico'
];

export default function AdminBookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBook, updateBook, getBookById } = useBooks();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    year: '',
    isbn: '',
    images: [''],
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      const book = getBookById(id);
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
          price: book.price.toString(),
          stock: book.stock.toString(),
          year: book.year?.toString() || '',
          isbn: book.isbn || '',
          images: book.images.length > 0 ? book.images : [''],
          active: book.active
        });
      }
    }
  }, [id, isEditing, getBookById]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.author.trim()) newErrors.author = 'Autor é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser maior ou igual a zero';
    }
    if (formData.images.every(img => !img.trim())) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const bookData = {
      title: formData.title,
      author: formData.author,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      year: formData.year ? parseInt(formData.year) : undefined,
      isbn: formData.isbn || undefined,
      images: formData.images.filter(img => img.trim()),
      active: formData.active,
      rating: undefined,
      reviews: []
    };

    if (isEditing && id) {
      updateBook(id, bookData);
    } else {
      addBook(bookData);
    }

    navigate('/admin/livros');
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/livros')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl text-slate-900 dark:text-white">
          {isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl text-slate-900 dark:text-white mb-6">
            Informações Básicas
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.author}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="year">Ano de Publicação</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                placeholder="978-3-16-148410-0"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl text-slate-900 dark:text-white mb-6">
            Preço e Estoque
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Quantidade em Estoque *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl text-slate-900 dark:text-white mb-6">
            Imagens
          </h2>

          <div className="space-y-3">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="URL da imagem"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeImageField(index)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImageField}>
              Adicionar Mais Imagens
            </Button>
            {errors.images && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.images}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Livro ativo (visível na loja)
            </span>
          </label>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/livros')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#1e3a5f] hover:bg-[#2d5082] dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Save className="size-4 mr-2" />
              {isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
