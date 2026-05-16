import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import logo from 'figma:asset/e424140872cdd5e1723e7bee340cc7b39a0d7bcb.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-pink-500 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-6">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Livraria Gilede Vieira" 
                  className="h-16 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" 
                />
                <div>
                  <p className="text-white text-lg leading-tight">Livraria</p>
                  <p className="text-white text-lg leading-tight">Gilede Vieira</p>
                </div>
              </Link>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Sua livraria de confiança, oferecendo os melhores livros com qualidade e dedicação.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="text-white/80 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/categoria/Romance" className="text-white/80 hover:text-white transition-colors">
                  Romance
                </Link>
              </li>
              <li>
                <Link to="/categoria/Evangélico" className="text-white/80 hover:text-white transition-colors">
                  Livros Evangélicos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg mb-4">Categorias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categoria/Autoajuda" className="text-white/80 hover:text-white transition-colors">
                  Autoajuda
                </Link>
              </li>
              <li>
                <Link to="/categoria/Suspense" className="text-white/80 hover:text-white transition-colors">
                  Suspense
                </Link>
              </li>
              <li>
                <Link to="/categoria/Didático" className="text-white/80 hover:text-white transition-colors">
                  Didáticos
                </Link>
              </li>
              <li>
                <Link to="/categoria/Ficção" className="text-white/80 hover:text-white transition-colors">
                  Ficção
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="size-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">(11) 98542-8782</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">livrariagiledevieira@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">Rua Abílio Cesar 26, São Paulo, SP, 05881-020</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm mb-3 text-white/90">Siga-nos nas redes sociais</h4>
              <div className="flex gap-3 flex-wrap">
                <a 
                  href="https://instagram.com/livraria_gilede_vieira" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-2"
                  aria-label="Instagram @livraria_gilede_vieira"
                  title="@livraria_gilede_vieira"
                >
                  <Instagram className="size-5" />
                </a>
                <a 
                  href="https://facebook.com/LivrariaGiledeVieira" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-2"
                  aria-label="Facebook Livraria Gilede Vieira"
                >
                  <Facebook className="size-5" />
                </a>
                <a 
                  href="https://youtube.com/@livrariagiledevieira?si=gCh8xvPrX8np55Z4" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-2"
                  aria-label="YouTube"
                >
                  <Youtube className="size-5" />
                </a>
                <div className="ml-2 border-l border-white/30 pl-3">
                  <a 
                    href="https://instagram.com/cafe_com_gilede" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 transition-colors rounded-full pl-2 pr-3 py-2 text-slate-900 font-semibold text-sm shadow-lg"
                    aria-label="Instagram @cafe_com_gilede"
                  >
                    <Instagram className="size-4" />
                    <span>@cafe_com_gilede</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          <p>&copy; {new Date().getFullYear()} Livraria Gilede Vieira. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}