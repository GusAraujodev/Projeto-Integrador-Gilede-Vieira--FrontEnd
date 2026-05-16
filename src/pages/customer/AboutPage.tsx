import { BookOpen, Heart, Award, Truck } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Instagram, Facebook } from 'lucide-react';
import giledePhoto from 'figma:asset/ef12a660533c0f66321ed69c4390e48a70d3489c.png';
import livrariaPhoto from 'figma:asset/3b847812a3c0f172c45b193e845581c7974a6448.png';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-6">
              Sobre a Livraria Gilede Vieira
            </h1>
            <p className="text-xl text-white/90">
              Uma história de amor pelos livros e dedicação aos nossos clientes
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl text-slate-900 dark:text-white mb-6">
              Nossa História
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                A Livraria Gilede Vieira nasceu do sonho de compartilhar o amor pela leitura com 
                pessoas de todas as idades. O que começou com um sonho de menina, 
                hoje se transformou em uma livraria online completa, sempre mantendo o atendimento 
                personalizado que nos tornou conhecidos.
              </p>
              <p>
                Acreditamos que cada livro tem o poder de transformar vidas, inspirar sonhos e 
                ampliar horizontes. Por isso, selecionamos cuidadosamente cada título do nosso 
                catálogo, pensando nas necessidades e gostos dos nossos clientes.
              </p>
              <p>
                Nossa missão é tornar a leitura acessível, oferecendo uma experiência de compra 
                simples, segura e acolhedora. Aqui, cada cliente é especial e cada livro tem uma 
                história para contar.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src={livrariaPhoto}
              alt="Livraria Gilede Vieira"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-slate-900 dark:text-white text-center mb-12">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-full mb-4">
                <BookOpen className="size-8 text-white" />
              </div>
              <h3 className="text-xl text-slate-900 dark:text-white mb-2">
                Qualidade
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Seleção criteriosa de livros de qualidade
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-full mb-4">
                <Heart className="size-8 text-white" />
              </div>
              <h3 className="text-xl text-slate-900 dark:text-white mb-2">
                Dedicação
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Atendimento personalizado e acolhedor
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-full mb-4">
                <Award className="size-8 text-white" />
              </div>
              <h3 className="text-xl text-slate-900 dark:text-white mb-2">
                Confiança
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Transparência em todas as negociações
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-full mb-4">
                <Truck className="size-8 text-white" />
              </div>
              <h3 className="text-xl text-slate-900 dark:text-white mb-2">
                Agilidade
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Entrega rápida e segura
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-6">
            Nossa Equipe
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            Somos uma equipe apaixonada por livros e comprometida em oferecer a melhor 
            experiência de compra para nossos clientes.
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="mb-4">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
                <img 
                  src={giledePhoto} 
                  alt="Gilede Vieira - Fundadora" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl text-slate-900 dark:text-white">
                Gilede Vieira
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Fundadora
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              "Minha paixão por livros começou na infância e hoje tenho o privilégio de 
              compartilhar essa paixão com milhares de leitores. Cada livro vendido é uma 
              oportunidade de tocar corações e transformar vidas."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-4">
            Vamos Conversar?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Tem alguma dúvida ou sugestão? Entre em contato conosco!
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://instagram.com/livraria_gilede_vieira" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="size-6" />
            </a>
            <a 
              href="https://facebook.com/LivrariaGiledeVieira" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="size-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}