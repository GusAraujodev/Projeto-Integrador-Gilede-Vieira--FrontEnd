import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { Instagram, Facebook } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Como faço para comprar um livro?',
      answer: 'É muito simples! Navegue pelo nosso catálogo, escolha o livro desejado, clique em "Adicionar ao Carrinho" e siga para o checkout. Você pode pagar com PIX, cartão de crédito ou débito.'
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo de entrega é de 5 a 7 dias úteis após a confirmação do pagamento. Você receberá um código de rastreamento por email assim que o pedido for enviado.'
    },
    {
      question: 'Como posso acompanhar meu pedido?',
      answer: 'Após a confirmação do pagamento, você receberá um email com o número de rastreamento. Você também pode entrar em contato conosco pelo WhatsApp para verificar o status do seu pedido.'
    },
    {
      question: 'Vocês aceitam trocas e devoluções?',
      answer: 'Sim, porém, online fazemos somente devolução! Você tem até 7 dias após o recebimento para solicitar devolução. Já as trocas são feitas apenas pessoalmente. Entre em contato conosco pelo WhatsApp para iniciar o processo.'
    },
    {
      question: 'O frete é grátis?',
      answer: 'Oferecemos frete grátis para compras acima de R$80,00, abaixo desse valor fica por conta do cliente.'
    },
    {
      question: 'Como funcionam os cupons de desconto?',
      answer: 'Você pode aplicar cupons de desconto durante o checkout. Digite o código do cupom no campo apropriado e clique em "Aplicar". O desconto será automaticamente calculado no total.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos PIX (aprovação instantânea), cartão de crédito (em até 12x sem juros) e cartão de débito (à vista).'
    },
    {
      question: 'O site é seguro?',
      answer: 'Sim! Utilizamos tecnologia de criptografia SSL para proteger suas informações pessoais e de pagamento. Todos os dados são tratados com máxima segurança.'
    },
    {
      question: 'Como funciona a sincronização com o Mercado Livre?',
      answer: 'Mantemos nossa loja sincronizada com nossos produtos no Mercado Livre. Isso significa que os livros disponíveis em ambas as plataformas têm as mesmas informações e disponibilidade.'
    },
    {
      question: 'Posso fazer pedidos pelo WhatsApp?',
      answer: 'Sim! Se preferir, você pode fazer seu pedido diretamente pelo WhatsApp. Basta clicar no botão verde flutuante no canto da tela e falar com nossa equipe.'
    },
    {
      question: 'Vocês vendem livros usados?',
      answer: 'Sim! Vendemos livros usados, novos e semi-novos.'
    },
    {
      question: 'Como posso entrar em contato?',
      answer: 'Você pode nos contatar pelo WhatsApp (11) 98542-8782, email livrariagiledevieira@gmail.com, ou através das nossas redes sociais. Estamos sempre prontos para ajudar!'
    },
    {
      question: 'Posso solicitar um livro específico que não está no catálogo?',
      answer: 'Sim! Entre em contato conosco pelo WhatsApp e informe qual livro você procura. Faremos o possível para conseguir o título desejado.'
    },
    {
      question: 'Vocês emitem nota fiscal?',
      answer: 'Sim, emitimos nota fiscal para todos os pedidos. Ela é enviada por email junto com a confirmação do pedido.'
    },
    {
      question: 'Há algum programa de fidelidade?',
      answer: 'Estamos sempre criando promoções especiais e cupons de desconto para nossos clientes. Siga-nos nas redes sociais para ficar por dentro!'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="size-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl mb-6">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossa livraria
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-slate-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-4">
            Não encontrou sua resposta?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco e teremos prazer em ajudá-lo!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
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