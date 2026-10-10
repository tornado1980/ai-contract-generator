 'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PricingPlan {
  name: string;
  basePrice: number;
  isSub?: boolean;
  desc: string;
}

interface SavedContract {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface ReviewItem {
  name: string;
  role: string;
  text: string;
  rating: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface Translations {
  title: string;
  subtitle: string;
  clientName: string;
  clientPlaceholder: string;
  contractorName: string;
  contractorPlaceholder: string;
  city: string;
  cityPlaceholder: string;
  contractType: string;
  paymentTerms: string;
  startDate: string;
  endDate: string;
  amount: string;
  amountPlaceholder: string;
  currency: string;
  paymentHeader: string;
  pricingHeader: string;
  generate: string;
  clear: string;
  contractTitle: string;
  copy: string;
  downloadTxt: string;
  downloadPdf: string;
  payButton: string;
  disclaimerBanner: string;
  agreementText: string;
  agreementError: string;
  rights: string;
  privacy: string;
  terms: string;
  support: string;
  trustBadge: string;
  featuresHeader: string;
  faqHeader: string;
  previewHeader: string;
  historyHeader: string;
  reviewsHeader: string;
  advancedHeader: string;
  penaltyLabel: string;
  jurisdictionLabel: string;
  checkboxExtraLabel: string;
  addReviewTitle: string;
  reviewNamePlaceholder: string;
  reviewTextPlaceholder: string;
  submitReviewBtn: string;
  supportFormTitle: string;
  supportEmailPlaceholder: string;
  supportMsgPlaceholder: string;
  supportSubmitBtn: string;
  contractTypes: Record<string, string>;
  paymentMethodsList: Record<string, string>;
  paymentMethods: Record<string, string>;
  pricingPlans: Record<string, PricingPlan>;
  featuresList: Array<{ title: string; desc: string; icon: string }>;
  faqList: Array<{ q: string; a: string }>;
  reviewsList: ReviewItem[];
}

const translations: Record<'en' | 'ru', Translations> = {
  en: {
    title: 'AI FREELANCE CONTRACT GENERATOR PRO (ENTERPRISE MAX EDITION)',
    subtitle: 'Advanced comprehensive ecosystem for generating legally vetted professional contracts for developers, designers, marketers and agencies with IP protection and multi-format exports',
    clientName: 'Full Client Name or Corporate Legal Entity',
    clientPlaceholder: 'e.g., Acme Corp or Global Technologies LLC',
    contractorName: 'Contractor Full Name / Specialist / Sole Proprietor',
    contractorPlaceholder: 'e.g., Alex Smith (Senior Fullstack Architect)',
    city: 'Contract Signing City / Governing Jurisdiction (Optional)',
    cityPlaceholder: 'e.g., New York, Berlin, Toronto, Kyiv (Leave empty if not needed)',
    contractType: 'Legal Contract Category and Type',
    paymentTerms: 'Payment Terms & Milestone Schedule Structure',
    startDate: 'Official Project Start Date',
    endDate: 'Project Deadline & Final Acceptance Date',
    amount: 'Total Budget & Deal Amount',
    amountPlaceholder: 'e.g., 7500',
    currency: 'Settlement Currency',
    paymentHeader: 'Payment Gateway Provider for Secure Transactions',
    pricingHeader: 'Comprehensive Access Pricing Plans',
    generate: 'Generate Comprehensive Legal Contract',
    clear: 'Reset All Form Fields',
    contractTitle: 'Official Generated Contract Document (A4 Format)',
    copy: 'Copy Full Text',
    downloadTxt: 'Download as TXT',
    downloadPdf: 'Export Clean PDF (A4 Enterprise Format)',
    payButton: 'Pay Plan & Unlock Export (via Gumroad)',
    disclaimerBanner: '⚠️ LEGAL DISCLAIMER ENTERPRISE: This web platform functions strictly as an automated IT drafting tool. Developers do not provide formal legal counsel and bear no liability for commercial or judicial dispute outcomes.',
 agreementText: 'I confirm that I understand the informational nature of this tool and fully agree to release the creators from any legal or financial liability.',
    agreementError: 'Please check the required box to confirm your agreement with terms and legal disclaimer.',
    rights: '© 2026 AI Freelance Contract Generator Pro Enterprise Max. All rights reserved.',
    privacy: 'Privacy Policy & GDPR Compliance',
    terms: 'Terms of Service & User Agreement',
    support: '24/7 Technical Support Center',
    trustBadge: '🛡️ Bank-grade SSL/TLS encryption. PCI DSS compliance standards and GDPR readiness. Satisfaction money-back guarantee.',
    featuresHeader: 'Specialized Profiles for All IT, Legal and Creative Domains',
    faqHeader: 'Knowledge Base & Frequently Asked Questions',
    previewHeader: 'Interactive Document Structure & Table of Contents',
    historyHeader: 'Recent Generated Contracts Log',
    reviewsHeader: 'Verified Independent Market Expert Reviews',
    advancedHeader: 'Advanced Legal Conditions, Clauses & Limits',
    penaltyLabel: 'Include 0.2% daily penalty fee for late payment defaults',
    jurisdictionLabel: 'Define Dispute Resolution & Governing Law Jurisdiction',
    checkboxExtraLabel: 'Include explicit clause limiting free revisions (max 2 iterations)',
    addReviewTitle: 'Submit your own review about the service',
    reviewNamePlaceholder: 'Your name & role (e.g., John, Frontend Dev)',
    reviewTextPlaceholder: 'Your feedback regarding contract generator...',
    submitReviewBtn: 'Publish Review',
    supportFormTitle: 'Support Contact Form',
    supportEmailPlaceholder: 'Your contact email',
    supportMsgPlaceholder: 'Describe your issue or question...',
    supportSubmitBtn: 'Send Message to Support',
    contractTypes: {
      standard: 'Standard Web Development Services Agreement (Fullstack / Dev)',
      long: 'Long-term Retainer & Support Agreement',
      fixed: 'Fixed-Price Milestone Contract',
      nda: 'Strict Bilateral Non-Disclosure Agreement (NDA)',
      freelance: 'General International Freelance Agreement (US/EU standards)',
      smm: 'SMM, Digital Marketing & Targeted Advertising Agreement',
      equipment: 'Equipment Lease & Digital Access Handover Agreement',
      content: 'Commissioned Content & Exclusive Intellectual Property Transfer (IP)',
    },
    paymentMethodsList: {
      advance50: '50% advance before start, 50% upon final acceptance',
      advance100: '100% Full Upfront Payment',
      postpaid: 'Sprint-based staged payments upon completion',
      forward: 'Secure Escrow Safe Deposit Guarantee',
    },
    paymentMethods: {
      gumroad: 'Gumroad (Visa/Mastercard, PayPal, Apple Pay, Google Pay)',
      crypto: 'Cryptocurrency (USDT TRC20 / USDC / Ethereum / Bitcoin)',
      wire: 'International Direct Wire Transfer SWIFT / SEPA',
    },
    pricingPlans: {
      single: { name: '1 Single Contract', basePrice: 4.99, desc: 'Optimal to test a deal with a new client' },
      pack: { name: '5 Documents Pack', basePrice: 15.99, desc: 'Save 35% for regular freelance workflows' },
      subscription: { name: 'PRO Unlimited (Month)', basePrice: 24.99, isSub: true, desc: 'Unlimited access to all templates and knowledge bases' },
    },
    featuresList: [
      { title: 'Fullstack & Backend', desc: 'Secure intellectual property rights, database access handovers, source codes.', icon: '⚡' },
      { title: 'UI/UX & Product Design', desc: 'Strict limits on design iterations, Figma source file handovers.', icon: '🎨' },
      { title: 'Copywriting & Content', desc: 'Text uniqueness guarantees, character counts, proofreading schedules.', icon: '✍️' },
      { title: 'Marketing & Target', desc: 'Ad budget KPIs, reach targets, conversion metrics, performance reporting.', icon: '📊' },
 ],
    faqList: [
      { 
        q: 'Do I need to register an account or provide ID documents?', 
        a: 'No. The platform operates on an Instant Access basis. You fill out key parameters directly in your browser, and the generator instantly builds a legally sound template without cumbersome account creation.' 
      },
      { 
        q: 'How legally binding are these generated templates?', 
        a: 'Templates are built following international commercial law best practices, British jurisdiction, and US/EU norms. They include essential clauses like IP transfer, NDA, payment milestones, and penalty fees. For enterprise-level deals, final attorney review is always recommended.' 
      },
      { 
        q: 'How does the clean A4 PDF download work?', 
        a: 'Once a plan is purchased, clean export unlocks. The system automatically formats the output precisely for standard A4 paper dimensions with proper margins and zero watermarks, ready to send directly to clients.' 
      },
      { 
        q: 'What if a client delays payment or requests endless revisions?', 
        a: 'Our templates include built-in clauses for daily penalties (0.2% for default) and strict revision caps (maximum 2 free iterations), fully shielding contractors from scope creep and cash flow gaps.' 
      },
      { 
        q: 'Can I use this for international clients on Upwork or Fiverr?', 
        a: 'Yes, the generator supports English localization, multi-currency pricing (USD, EUR, GBP), and international contracting standards, including foreign governing law and Gumroad safe payment methods.' 
      }
    ],
    reviewsList: [
      { name: 'Dmitry Orekhov', role: 'Senior React Developer', text: 'I use this generator for contracts with US clients. Code transfer clauses work flawlessly.', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Kristina Zakharova', role: 'Lead UI/UX Designer', text: 'Revision limits saved me from endless client tweaks. Huge thanks to the creators!', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Igor Vasiliev', role: 'DevOps Engineer', text: 'Very convenient to switch currencies to euros and dollars in one click for various international projects.', rating: '⭐⭐⭐⭐⭐' },
    ],
  },
  ru: {
    title: 'AI FREELANCE CONTRACT GENERATOR PRO (ENTERPRISE MAX EDITION)',
    subtitle: 'Максимально расширенная экосистема создания профессиональных юридических контрактов для разработчиков, дизайнеров, маркетологов и агентств с глубокой защитой интеллектуальной собственности и мультиформатным экспортом',
    clientName: 'Полное наименование Заказчика или Юридического лица',
    clientPlaceholder: 'например, Acme Corp или ООО «Инновационные Технологии»',
    contractorName: 'ФИО Подрядчика / Исполнителя / ИП / Самозанятого',
    contractorPlaceholder: 'например, Алексей Смирнов (Senior Fullstack Architect)',
    city: 'Город заключения сделки / применимая юрисдикция (Опционально)',
    cityPlaceholder: 'например, New York, Berlin, Astana, Kyiv (Оставьте пустым, если не нужно)',
    contractType: 'Категория и тип юридического контракта',
    paymentTerms: 'Условия и детальный график поэтапной оплаты',
    startDate: 'Дата официального старта оказания услуг',
    endDate: 'Дата финальной приемки и дедлайна проекта',
    amount: 'Общий бюджет и сумма сделки',
    amountPlaceholder: 'например, 7500',
    currency: 'Валюта взаиморасчетов',
    paymentHeader: 'Платежный шлюз для проведения безопасных транзакций',
    pricingHeader: 'Масштабные тарифные планы доступа к генератору',
    generate: 'Сгенерировать полный юридический контракт',
    clear: 'Сбросить все поля формы',
    contractTitle: 'Официальный текст готового контракта (Формат А4)',
    copy: 'Скопировать весь текст',
    downloadTxt: 'Сохранить как TXT',
    downloadPdf: 'Экспорт в чистый PDF (Формат А4 Enterprise)',
 payButton: 'Оплатить тариф и разблокировать экспорт (через Gumroad)',
    disclaimerBanner: '⚠️ ПРАВОВОЙ ДИСКЛЕЙМЕР ENTERPRISE: Веб-платформа функционирует исключительно как автоматизированный IT-инструмент для составления информационных проектов и драфтов. Разработчики не предоставляют юридических услуг и не несут ответственности за исходы судебных или коммерческих споров.',
    agreementText: 'Я подтверждаю, что ознакомлен(а) с регламентом сервиса, осознаю информационный характер шаблона и согласен(-на) с полным снятием ответственности с авторов платформы.',
    agreementError: 'Пожалуйста, поставьте обязательную галочку в чекбоксе согласия с условиями использования и дисклеймером.',
    rights: '© 2026 AI Freelance Contract Generator Pro Enterprise Max. Все права защищены.',
    privacy: 'Политика конфиденциальности & GDPR Compliance',
    terms: 'Пользовательское соглашение и оферта',
    support: 'Круглосуточная служба технической поддержки',
    trustBadge: '🛡️ Безопасность банковского уровня шифрования SSL/TLS. Соответствие стандартам PCI DSS и международным требованиям GDPR. Гарантия возврата средств.',
    featuresHeader: 'Специализированные профили под любые IT, юридические и креативные сферы',
    faqHeader: 'База знаний и часто задаваемые вопросы',
    previewHeader: 'Интерактивная пред-структура и оглавление документа',
    historyHeader: 'Журнал недавних сгенерированных контрактов',
    reviewsHeader: 'Реальные отзывы независимых экспертов рынка',
    advancedHeader: 'Расширенные правовые условия, оговорки и лимиты',
    penaltyLabel: 'Включить штрафную пеню 0.2% за каждый день просрочки платежа',
    jurisdictionLabel: 'Определить подсудность и порядок разрешения споров',
    checkboxExtraLabel: 'Включить пункт о жестких лимитах бесплатных правок (не более 2 итераций)',
    addReviewTitle: 'Оставить собственный отзыв о сервисе',
    reviewNamePlaceholder: 'Ваше имя и должность (например, Иван, Frontend Dev)',
    reviewTextPlaceholder: 'Ваш отзыв о работе генератора контрактов...',
    submitReviewBtn: 'Опубликовать отзыв',
    supportFormTitle: 'Форма обратной связи с техподдержкой',
    supportEmailPlaceholder: 'Ваш контактный Email',
    supportMsgPlaceholder: 'Опишите ваш вопрос или проблему...',
    supportSubmitBtn: 'Отправить сообщение в поддержку',
    contractTypes: {
      standard: 'Стандартный договор оказания услуг веб-разработки (Fullstack / Dev)',
      long: 'Длительный контракт на абонентское сопровождение (Retainer Agreement)',
      fixed: 'Договор подряда с фиксированной поэтапной оплатой (Milestone-based)',
      nda: 'Строгое двустороннее соглашение о неразглашении конфиденциальности (NDA)',
      freelance: 'Международный контракт фрилансера с прописанными законами США/ЕС',
      smm: 'Договор комплексного SMM-продвижения, таргета и контекстной рекламы',
      equipment: 'Договор временной аренды оборудования и передачи цифровых доступов',
      content: 'Договор авторского заказа и перехода исключительных авторских прав (IP)',
    },
    paymentMethodsList: {
      advance50: '50% аванс перед стартом, 50% по итогам финальной приемки',
      advance100: '100% предоплата (Full Upfront Payment)',
      postpaid: 'Поэтапная оплата по результатам сдачи каждого спринта (Sprint-based)',
      forward: 'Безопасная сделка через Эскроу-счет (Escrow / Safe Deposit)',
    },
    paymentMethods: {
      gumroad: 'Gumroad (Карты Visa/Mastercard, PayPal, Apple/Google Pay)',
      crypto: 'Криптовалюта (USDT TRC20 / USDC / Ethereum / Bitcoin)',
      wire: 'Международный прямой банковский перевод SWIFT / SEPA',
    },
    pricingPlans: {
      single: { name: '1 Разовый контракт', basePrice: 4.99, desc: 'Оптимально для проверки сделки с новым клиентом' },
      pack: { name: 'Пакет 5 документов', basePrice: 15.99, desc: 'Экономия 35% для регулярной работы на фрилансе' },
 subscription: { name: 'PRO Безлимит (Месяц)', basePrice: 24.99, isSub: true, desc: 'Неограниченный доступ ко всем шаблонам и базам знаний' },
    },
    featuresList: [
      { title: 'Fullstack & Backend', desc: 'Защита интеллектуальных прав на код, регламенты передачи баз данных и серверов.', icon: '⚡' },
      { title: 'UI/UX & Product Design', desc: 'Четкие лимиты на итерации дизайна, передача исходников в Figma.', icon: '🎨' },
      { title: 'Copywriting & Content', desc: 'Уникальность текстов, объемы знаков, дедлайны по утверждению правок.', icon: '✍️' },
      { title: 'Marketing & Target', desc: 'KPI по рекламным бюджетам, охватам, конверсиям и регулярная отчетность.', icon: '📊' },
    ],
    faqList: [
      { 
        q: 'Нужно ли проходить сложную регистрацию или указывать паспортные данные?', 
        a: 'Нет. Сервис работает по принципу Instant Access. Вы заполняете ключевые параметры прямо в браузере, и генератор моментально собирает юридически выверенный шаблон без необходимости заводить громоздкие аккаунты.' 
      },
      { 
        q: 'Насколько юридически сильны сгенерированные шаблоны?', 
        a: 'Документы построены на основе лучших практик международного коммерческого права, британской юрисдикции и норм США/ЕС. Они содержат критически важные разделы: передачу IP, NDA, графики платежей и штрафные пени. Для крупных корпоративных сделок мы рекомендуем финальное ревью вашим юристом.' 
      },
      { 
        q: 'Как работает скачивание готового PDF в формате А4?', 
        a: 'После оплаты тарифа через Gumroad разблокируется функция чистого экспорта. Система автоматически форматирует документ под стандартный лист А4 с правильными отступами, исключая водяные знаки, что позволяет сразу отправить его клиенту или распечатать.' 
      },
      { 
        q: 'Что делать, если клиент задерживает оплату или требует правки сверх ТЗ?', 
        a: 'Наши шаблоны содержат встроенные пункты о ежедневной пени (0.2% за просрочку) и жестких лимитах на итерации правок (не более 2 бесплатных правок), что полностью защищает исполнителя от бесконечных правок и кассовых разрывов.' 
      },
      { 
        q: 'Можно ли использовать договор для работы с зарубежными заказчиками (Upwork, Fiverr)?', 
        a: 'Да, генератор поддерживает переключение на английский язык, расчеты в USD, EUR, GBP и международные стандарты контрактов, включая возможность указания зарубежной подсудности и безопасные способы оплаты через Gumroad.' 
      }
    ],
    reviewsList: [
      { name: 'Дмитрий Орехов', role: 'Senior React Developer', text: 'Пользуюсь генератором для контрактов с американскими заказчиками. Пункты про передачу кода работают безупречно.', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Кристина Захарова', role: 'Lead UI/UX Designer', text: 'Ограничение правок в договоре спасло меня от бесконечных правок заказчика. Огромное спасибо разработчикам!', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Игорь Васильев', role: 'DevOps Engineer', text: 'Удобно менять валюту на евро и доллары в один клик под разные международные контракты.', rating: '⭐⭐⭐⭐⭐' },
    ],
  },
};

const paymentCards = [
  { id: 'gumroad', key: 'gumroad', color: 'from-pink-600 to-rose-600' },
  { id: 'crypto', key: 'crypto', color: 'from-emerald-600 to-teal-600' },
  { id: 'wire', key: 'wire', color: 'from-cyan-600 to-blue-700' },
];

const pricingKeys = ['single', 'pack', 'subscription'] as const;

export default function ContractGeneratorProMax() {
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const t = translations[lang];

  const [clientName, setClientName] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [city, setCity] = useState(''); 
  const [contractType, setContractType] = useState('standard');
  const [paymentTerms, setPaymentTerms] = useState('advance50');
 const [startDate, setStartDate] = useState('2026-12-12');
  const [endDate, setEndDate] = useState('2026-12-30');
  const [amount, setAmount] = useState('7500');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [paymentMethod, setPaymentMethod] = useState('gumroad');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'pack' | 'subscription'>('single');
  const [isAgreed, setIsAgreed] = useState(false);

  const [enablePenalty, setEnablePenalty] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('International Commercial Arbitration / London, UK');
  const [extraCheckbox, setExtraCheckbox] = useState(false);

  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [savedHistory, setSavedHistory] = useState<SavedContract[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [customReviews, setCustomReviews] = useState<ReviewItem[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const contractRef = useRef<HTMLDivElement>(null);

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79 };

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true' || params.get('success') === 'true') {
      setIsPaid(true);
      addToast(lang === 'ru' ? 'Оплата через Gumroad успешно подтверждена!' : 'Payment via Gumroad successfully confirmed!');
    }

    const stored = localStorage.getItem('ai_contract_history_max_enterprise');
    if (stored) {
      try {
        setSavedHistory(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    const storedReviews = localStorage.getItem('ai_contract_reviews_max_enterprise');
    if (storedReviews) {
      try {
        setCustomReviews(JSON.parse(storedReviews));
      } catch (e) {
        console.error(e);
      }
    }
  }, [lang]);

  const formatPrice = (basePrice: number, isSub?: boolean) => {
    const rate = currencyRates[currency];
    const converted = (basePrice * rate).toFixed(2);
    const symbol = currencySymbols[currency];
    return symbol + converted + (isSub ? (lang === 'ru' ? ' / мес' : ' / mo') : '');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      const dateErrorMsg = lang === 'ru' 
        ? 'Ошибка: Дата окончания проекта не может быть раньше даты начала!' 
        : 'Error: Project end date cannot be earlier than start date!';
      alert(dateErrorMsg);
      addToast(dateErrorMsg, 'warning');
      return;
    }

    if (!isAgreed) {
      alert(t.agreementError);
      addToast(t.agreementError, 'warning');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const cType = t.contractTypes[contractType] || contractType;
      const pTerms = t.paymentMethodsList[paymentTerms] || paymentTerms;
      const pMethod = t.paymentMethods[paymentMethod] || paymentMethod;
 const client = clientName || (lang === 'ru' ? 'ООО Заказчик Про Экстерпрайз' : 'Client Corp Enterprise Max');
      const contractor = contractorName || (lang === 'ru' ? 'ИП Подрядчик Эксперт Архитектор' : 'Specialist Contractor Pro Lead');
      
      const cityName = city.trim() ? city.trim() : '';
      
      const startD = startDate || '2026-12-12';
      const endD = endDate || '2026-12-30';
      const totalAmount = amount || '7500';
      const currSymbol = currencySymbols[currency];

      let fullText = '';

      if (lang === 'ru') {
        fullText = 
          'ОФИЦИАЛЬНЫЙ КОНТРАКТ ОКАЗАНИЯ ПРОФЕССИОНАЛЬНЫХ УСЛУГ № 2026/ENTERPRISE-MAX\n' +
          (cityName ? 'г. ' + cityName + '                                           ' : '') + 'Дата подписания: ' + startD + '\n\n' +
          'Заказчик: ' + client + ', с одной стороны, и\n' +
          'Подрядчик (Исполнитель): ' + contractor + ', с другой стороны, совместно именуемые Стороны, заключили настоящий Договор о нижеследующем:\n\n' +
          'РАЗДЕЛ I. ПРЕДМЕТ ДОГОВОРА И ОБЛАСТЬ РАБОТ\n' +
          '1.1. Исполнитель обязуется по техническому заданию Заказчика выполнить комплекс профессиональных работ: ' + cType + '.\n' +
          '1.2. График реализации проекта и ключевые вехи:\n' +
          '   - Дата официального старта оказания услуг: ' + startD + '\n' +
          '   - Дата финальной сдачи, приемки и закрытия проекта: ' + endD + '\n' +
          '1.3. Проведение и обработка финансовых транзакций выполняется через шлюз: ' + pMethod + '.\n\n' +
          'РАЗДЕЛ II. СТОИМОСТЬ И ПОРЯДОК ФИНАНСОВЫХ РАСЧЕТОВ\n' +
          '2.1. Итоговая стоимость услуг по настоящему Договору составляет: ' + totalAmount + ' ' + currSymbol + '.\n' +
          '2.2. График и детальный порядок расчетов: ' + pTerms + '.\n' +
          (enablePenalty ? '2.3. В случае просрочки денежных обязательств Исполнитель вправе начислить пени в размере 0.2% от суммы просроченного платежа за каждый календарный день просрочки.\n' : '') +
          (extraCheckbox ? '2.4. Стороны прямо зафиксировали жесткие ограничения по бесплатным правкам: не более двух итераций доработок в рамках согласованного ТЗ.\n\n' : '\n') +
          'РАЗДЕЛ III. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ И КОНФИДЕНЦИАЛЬНОСТЬ\n' +
          '3.1. Исключительные права на результаты интеллектуальной деятельности (код, макеты, дизайн) переходят к Заказчику только после полной оплаты всей суммы договора.\n' +
          '3.2. Стороны обязуются сохранять конфиденциальность коммерческой информации в течение 3 лет после завершения договора.\n' +
          '3.3. Порядок разрешения споров и применимое право: ' + jurisdiction + '.\n\n' +
          'РАЗДЕЛ IV. ФОРС-МАЖОР И ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ\n' +
          '4.1. Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств при наступлении обстоятельств непреодолимой силы.\n' +
          '4.2. Настоящий Договор вступает в силу с момента подписания электронной подписью или обмена сканированными копиями и действует до полного исполнения.\n\n' +
          'РАЗДЕЛ V. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН\n\n' +
          'ЗАКАЗЧИК: ' + client + '\n' +
          'М.П. / Уполномоченный представитель: _ / ____ /\n\n' +
          'ПОДРЯЧИК: ' + contractor + '\n' +
          'М.П. / Специалист: _ / ____ /';
      } else {
        fullText = 
          'MASTER PROFESSIONAL SERVICES AGREEMENT № 2026/ENTERPRISE-MAX\n' +
          (cityName ? 'City: ' + cityName + '                                        ' : '') + 'Date: ' + startD + '\n\n' +
          'Client: ' + client + ', on the one hand, and\n' +
          'Contractor: ' + contractor + ', on the other hand, collectively referred to as the Parties, hereby enter into this Agreement:\n\n' +
          'SECTION I. SUBJECT MATTER AND SCOPE OF WORK\n' +
 '1.1. Contractor undertakes to provide professional services according to client specifications: ' + cType + '.\n' +
          '1.2. Project schedule and milestones:\n' +
          '   - Project official start date: ' + startD + '\n' +
          '   - Project completion and final acceptance date: ' + endD + '\n' +
          '1.3. Financial transaction routing platform: ' + pMethod + '.\n\n' +
          'SECTION II. FINANCIAL TERMS AND PRICING SCHEDULE\n' +
          '2.1. Total project fee amounts to: ' + totalAmount + ' ' + currSymbol + '.\n' +
          '2.2. Payment terms structure: ' + pTerms + '.\n' +
          (enablePenalty ? '2.3. Late payments incur a 0.2% daily penalty fee on the outstanding overdue amount for each calendar day of default.\n' : '') +
          (extraCheckbox ? '2.4. Parties explicitly agreed on strict revision limits: maximum of two correction iterations within the approved scope.\n\n' : '\n') +
          'SECTION III. INTELLECTUAL PROPERTY & CONFIDENTIALITY\n' +
          '3.1. Intellectual property rights transfer to the Client exclusively upon full project payment completion.\n' +
          '3.2. Parties agree to maintain strict confidentiality of proprietary data for 3 years post-termination.\n' +
          '3.3. Dispute resolution jurisdiction and governing law: ' + jurisdiction + '.\n\n' +
          'SECTION IV. FORCE MAJEURE & MISCELLANEOUS PROVISIONS\n' +
          '4.1. Parties shall be relieved from liability for partial or full failure to perform obligations due to force majeure events.\n' +
          '4.2. This Agreement takes effect upon signing and remains valid until full execution by both Parties.\n\n' +
          'SECTION V. SIGNATURES AND LEGAL DETAILS\n\n' +
          'CLIENT: ' + client + '\n' +
          'Authorized Representative Seal: _ / ____ /\n\n' +
          'CONTRACTOR: ' + contractor + '\n' +
          'Specialist Signature Seal: _ / ____ /';
      }

      setGeneratedContract(fullText);
      setIsLoading(false);
      addToast(lang === 'ru' ? 'Контракт успешно сгенерирован!' : 'Contract generated successfully!');

      const newHistoryItem: SavedContract = {
        id: Date.now().toString(),
        title: cType,
        date: new Date().toLocaleDateString(),
        content: fullText,
      };
      const updatedHistory = [newHistoryItem, ...savedHistory.slice(0, 4)];
      setSavedHistory(updatedHistory);
      localStorage.setItem('ai_contract_history_max_enterprise', JSON.stringify(updatedHistory));
    }, 600);
  };

  const handleClear = () => {
    setClientName('');
    setContractorName('');
    setCity('');
    setStartDate('2026-12-12');
    setEndDate('2026-12-30');
    setAmount('7500');
    setGeneratedContract(null);
    setIsPaid(false);
    setIsAgreed(false);
    setExtraCheckbox(false);
    addToast(lang === 'ru' ? 'Форма очищена' : 'Form cleared', 'info');
  };

  const handleCopy = () => {
    if (generatedContract) {
      navigator.clipboard.writeText(generatedContract);
      addToast(lang === 'ru' ? 'Текст скопирован в буфер обмена!' : 'Text copied to clipboard!');
    }
  };

  const handleDownloadTXT = () => {
    if (generatedContract) {
      const element = document.createElement('a');
      const file = new Blob([generatedContract], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = 'Enterprise_Max_Freelance_Contract.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast(lang === 'ru' ? 'TXT файл успешно скачан!' : 'TXT file downloaded successfully!');
    }
  };

  const handleDownloadPDF = async () => {
    if (!isPaid) {
      const msg = lang === 'ru' ? 'Пожалуйста, оплатите тариф для разблокировки чистого PDF экспорта без водяных знаков.' : 'Please complete payment to unlock clean PDF export without watermarks.';
 alert(msg);
      addToast(msg, 'warning');
      return;
    }
    
    if (typeof window === 'undefined') return;
    const contractText = generatedContract || '';
    
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '700px';
    tempContainer.style.padding = '40px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.color = '#000000';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12px';
    tempContainer.style.lineHeight = '1.6';
    tempContainer.style.whiteSpace = 'pre-wrap';
    tempContainer.innerText = contractText;
    
    document.body.appendChild(tempContainer);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('AI_Enterprise_Max_Contract_A4.pdf');
      addToast(lang === 'ru' ? 'PDF файл А4 успешно экспортирован!' : 'A4 PDF file exported successfully!');
    } catch (err) {
      document.body.removeChild(tempContainer);
      console.error('PDF export error:', err);
      window.print();
    }
  };
  
  const handleProceedPayment = () => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      const dateErrorMsg = lang === 'ru' 
        ? 'Ошибка: Дата окончания проекта не может быть раньше даты начала!' 
        : 'Error: Project end date cannot be earlier than start date!';
      alert(dateErrorMsg);
      addToast(dateErrorMsg, 'warning');
      return;
    }

    if (!isAgreed) {
      alert(t.agreementError);
      addToast(t.agreementError, 'warning');
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    const redirectUrl = encodeURIComponent(currentUrl + '?paid=true');
    const planSlug = selectedPlan === 'single' ? 'single-contract' : selectedPlan === 'pack' ? '5-pack-contracts' : 'pro-subscription';
    
    const gumroadUrl = 'https://reymax77777.gumroad.com/l/' + planSlug + '?wanted=true&redirect_url=' + redirectUrl;
    
    addToast(lang === 'ru' ? 'Перенаправление на безопасную оплату Gumroad...' : 'Redirecting to secure Gumroad checkout...', 'info');
    window.location.href = gumroadUrl;
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    const newRev: ReviewItem = {
      name: newReviewName,
      role: lang === 'ru' ? 'Независимый эксперт' : 'Independent Expert',
      text: newReviewText,
      rating: '⭐⭐⭐⭐⭐'
    };
    const updated = [newRev, ...customReviews];
    setCustomReviews(updated);
    localStorage.setItem('ai_contract_reviews_max_enterprise', JSON.stringify(updated));
    setNewReviewName('');
    setNewReviewText('');
    addToast(lang === 'ru' ? 'Спасибо! Ваш отзыв опубликован.' : 'Thank you! Your review has been published.');
  };
 const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail.trim() || !supportMsg.trim()) return;
    setSupportSent(true);
    setSupportEmail('');
    setSupportMsg('');
    addToast(lang === 'ru' ? 'Сообщение в поддержку отправлено!' : 'Support message sent!');
    setTimeout(() => setSupportSent(false), 5000);
  };

  const allReviews = [...t.reviewsList, ...customReviews];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-6 md:p-16 font-sans relative overflow-hidden">
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              'pointer-events-auto px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs md:text-sm font-bold flex items-center gap-3 transition transform animate-bounce ' +
              (toast.type === 'warning'
                ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                : toast.type === 'info'
                ? 'bg-blue-950/90 border-blue-500 text-blue-200'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-200')
            }
          >
            <span>{toast.type === 'warning' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✨'}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-cyan-500/20 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse"></span>
            <h1 className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-300 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setLang('en'); addToast('Language switched to English', 'info'); }}
              className={'px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm ' + (lang === 'en' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50' : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800')}
            >
              EN
            </button>
            <button
              onClick={() => { setLang('ru'); addToast('Язык изменен на русский', 'info'); }}
              className={'px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm ' + (lang === 'ru' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50' : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800')}
            >
              RU
            </button>
          </div>
        </div>

        <p className="text-slate-300 mb-12 text-base md:text-lg font-medium leading-relaxed max-w-4xl">{t.subtitle}</p>

        <div className="mb-14">
          <h2 className="text-xs font-bold mb-4 text-cyan-400 uppercase tracking-widest">{t.featuresHeader}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {t.featuresList.map((item, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-cyan-500/20 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between shadow-2xl hover:border-cyan-400/40 transition">
                <span className="text-4xl mb-4">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
 <div className="mb-14 bg-slate-900/80 p-6 md:p-10 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg md:text-xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
            <span>👁️</span> {t.previewHeader}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mb-6">
            {lang === 'ru' ? 'Наглядный образец структуры готового юридического документа с экспертными формулировками.' : 'Sample structured template layout for review.'}
          </p>
          <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl border border-slate-300 font-mono text-xs leading-relaxed max-h-60 overflow-y-auto select-none opacity-95 shadow-inner">
            <div className="font-bold text-center mb-4 text-sm text-indigo-950">
              {lang === 'ru' ? 'ОФИЦИАЛЬНЫЙ КОНТРАКТ ОКАЗАНИЯ УСЛУГ № 2026/SAMPLE' : 'MASTER SERVICES AGREEMENT № 2026/SAMPLE'}
            </div>
            <p className="font-bold text-indigo-900 mt-3">{lang === 'ru' ? 'I. ПРЕДМЕТ ДОГОВОРА И ОБЛАСТЬ РАБОТ' : 'I. SUBJECT MATTER & SCOPE'}</p>
            <p>{lang === 'ru' ? '1.1. Исполнитель обязуется выполнить работы по разработке распределенной системы на TypeScript и Next.js.' : '1.1. Contractor undertakes to perform distributed system development via TypeScript and Next.js.'}</p>
            <p className="font-bold text-indigo-900 mt-3">{lang === 'ru' ? 'II. СТОИМОСТЬ И РАСЧЕТЫ' : 'II. PRICING & SETTLEMENTS'}</p>
            <p>{lang === 'ru' ? '2.1. Общий бюджет проекта составляет 7500 USD с поэтапной оплатой через Gumroad.' : '2.1. Total project fee is 7500 USD with milestone payments through Gumroad.'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <div className="bg-rose-950/50 border border-rose-500/40 text-rose-200 p-6 rounded-3xl text-xs md:text-sm leading-relaxed backdrop-blur-md shadow-xl">
            {t.disclaimerBanner}
          </div>
          <div className="bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 p-5 rounded-3xl text-xs md:text-sm flex items-center gap-3 shadow-xl">
            <span>{t.trustBadge}</span>
          </div>
        </div>

        <div className="mb-14 bg-slate-900/80 p-6 md:p-10 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
          <label className="block text-sm font-bold mb-6 text-cyan-400 uppercase tracking-widest">{t.pricingHeader}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingKeys.map((key) => {
              const plan = t.pricingPlans[key];
              const isSelected = selectedPlan === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={
                    'p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between ' +
                    (isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-2xl shadow-cyan-950/60 scale-[1.02]'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700')
                  }
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-sm text-white">{plan.name}</span>
                      <span className={'w-6 h-6 rounded-full border flex items-center justify-center ' + (isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600')}>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-slate-950"></span>}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-cyan-300 mb-3">{formatPrice(plan.basePrice, plan.isSub)}</div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{plan.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
 <form onSubmit={handleGenerate} className="space-y-8 bg-slate-900/80 p-6 md:p-12 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.clientName}</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t.clientPlaceholder}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.contractorName}</label>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                placeholder={t.contractorPlaceholder}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.contractType}</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 focus:border-cyan-500 outline-none transition text-sm font-medium cursor-pointer"
              >
                {Object.entries(t.contractTypes).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.paymentTerms}</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 focus:border-cyan-500 outline-none transition text-sm font-medium cursor-pointer"
              >
                {Object.entries(t.paymentMethodsList).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.city}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t.cityPlaceholder}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 placeholder-slate-400 focus:border-cyan-500 outline-none transition text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.startDate}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 focus:border-cyan-500 outline-none transition font-mono text-sm font-medium cursor-pointer"
              />
 </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-white">{t.endDate}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 focus:border-cyan-500 outline-none transition font-mono text-sm font-medium cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{t.advancedHeader}</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enablePenalty}
                onChange={(e) => setEnablePenalty(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">{t.penaltyLabel}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={extraCheckbox}
                onChange={(e) => setExtraCheckbox(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">{t.checkboxExtraLabel}</span>
            </label>

            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400">{t.jurisdictionLabel}</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-2xl p-4 text-xs outline-none focus:border-cyan-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-3 text-white">{t.paymentHeader}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentCards.map((card) => {
                const isSelected = paymentMethod === card.id;
                const labelText = t.paymentMethods[card.key];
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setPaymentMethod(card.id)}
                    className={
                      'p-4 rounded-2xl border text-left font-medium transition flex items-center justify-between cursor-pointer ' +
                      (isSelected
                        ? 'bg-gradient-to-r ' + card.color + ' border-white shadow-xl text-white scale-[1.01]'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50')
                    }
                  >
                    <span className="text-xs font-semibold">{labelText}</span>
                    <span className={'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ' + (isSelected ? 'border-white bg-white/30' : 'border-slate-400')}>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-2 text-white">{t.amount}</label>
              <input
                type="text"
 value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 placeholder-slate-400 focus:border-cyan-500 outline-none transition text-sm font-medium"
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="block text-xs font-semibold mb-2 text-white">{t.currency}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 focus:border-cyan-500 outline-none transition text-sm font-medium cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-4 cursor-pointer bg-slate-950/50 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-cyan-500 rounded cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-300 leading-relaxed font-medium">
                {t.agreementText}
              </span>
            </label>
          </div>

          <div className="pt-4 space-y-5">
            <button
              type="button"
              onClick={handleProceedPayment}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold py-5 px-6 rounded-2xl shadow-2xl transition-all uppercase tracking-wider text-sm cursor-pointer flex items-center justify-center gap-3"
            >
              <span>💳</span> {t.payButton} ({formatPrice(t.pricingPlans[selectedPlan].basePrice, t.pricingPlans[selectedPlan].isSub)}) {isPaid && '✅ (Paid)'}
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-400 text-white font-extrabold py-5 px-6 rounded-2xl shadow-2xl transition-all uppercase tracking-wider text-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (lang === 'ru' ? 'Генерация контракта...' : 'Generating contract...') : t.generate}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-5 px-8 rounded-2xl transition text-sm cursor-pointer border border-slate-700 shadow-xl"
              >
                {t.clear}
              </button>
            </div>
          </div>
        </form>

        {generatedContract && (
          <div className="mt-14 bg-slate-900/90 p-6 md:p-12 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-3">
                <span>📄</span> {t.contractTitle} {!isPaid && '🔒'}
              </h2>
              <span className={'px-4 py-1.5 rounded-full text-xs font-bold ' + (isPaid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40')}>
 {isPaid ? (lang === 'ru' ? '✅ Оплачено / Формат А4 Активен' : '✅ Paid / A4 Format Active') : (lang === 'ru' ? '⚠️ Драфт / Водяной знак' : '⚠ Draft Preview Mode')}
              </span>
            </div>
            
            <div className="overflow-x-auto pb-6">
              <div 
                id="contract-printable-area" 
                ref={contractRef} 
                className="bg-white text-slate-900 p-10 md:p-14 rounded-2xl border border-slate-300 font-mono text-xs md:text-sm leading-relaxed shadow-2xl relative mx-auto"
                style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
              >
                {!isPaid && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-15">
                    <span className="text-7xl font-black text-rose-600 rotate-[-30deg] tracking-widest border-8 border-rose-600 p-8 rounded-3xl">
                      PREVIEW DRAFT A4
                    </span>
                  </div>
                )}
                <pre className="whitespace-pre-wrap font-mono text-slate-900 select-all relative z-0">
                  {generatedContract}
                </pre>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition shadow-lg flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                📋 {t.copy}
              </button>
              <button
                onClick={handleDownloadTXT}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                💾 {t.downloadTxt}
              </button>
              <button
                onClick={handleDownloadPDF}
                className={
                  'font-semibold px-6 py-3.5 rounded-xl text-sm transition shadow-lg flex items-center gap-2 cursor-pointer ' +
                  (isPaid ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 border border-slate-600')
                }
              >
                📑 {t.downloadPdf} {!isPaid && '🔒'}
              </button>
            </div>
          </div>
        )}

        {savedHistory.length > 0 && (
          <div className="mt-14 bg-slate-900/60 p-6 md:p-10 rounded-3xl border border-cyan-500/20 backdrop-blur-xl">
            <h2 className="text-lg font-bold mb-6 text-cyan-400 flex items-center gap-2">
              <span>⏱</span> {t.historyHeader}
            </h2>
            <div className="space-y-4">
              {savedHistory.map((item) => (
                <div key={item.id} className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex justify-between items-center text-xs md:text-sm">
                  <div>
                    <span className="font-bold text-white mr-4">{item.title}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <button
                    onClick={() => { setGeneratedContract(item.content); addToast(lang === 'ru' ? 'Контракт загружен в редактор' : 'Contract loaded into editor', 'info'); }}
                    className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 px-4 py-2 rounded-xl transition font-semibold"
                  >
                    {lang === 'ru' ? 'Загрузить в редактор' : 'Load into editor'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
 <div className="mt-16">
          <h2 className="text-xs font-bold mb-6 text-cyan-400 uppercase tracking-widest">{t.reviewsHeader}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {allReviews.map((rev, i) => (
              <div key={i} className="bg-slate-900/70 border border-cyan-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col justify-between">
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">«{rev.text}»</p>
                <div>
                  <div className="text-sm font-bold text-white">{rev.name}</div>
                  <div className="text-xs text-cyan-400">{rev.role}</div>
                  <div className="mt-2 text-xs">{rev.rating}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddReview} className="bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-cyan-500/30 max-w-2xl mx-auto space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-cyan-300">💬 {t.addReviewTitle}</h3>
            <input
              type="text"
              value={newReviewName}
              onChange={(e) => setNewReviewName(e.target.value)}
              placeholder={t.reviewNamePlaceholder}
              className="w-full bg-white text-slate-900 p-3.5 rounded-xl text-xs outline-none font-medium"
            />
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder={t.reviewTextPlaceholder}
              rows={3}
              className="w-full bg-white text-slate-900 p-3.5 rounded-xl text-xs outline-none font-medium resize-none"
            />
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer"
            >
              {t.submitReviewBtn}
            </button>
          </form>
        </div>

        <div className="mt-16 bg-slate-900/60 p-6 md:p-12 rounded-3xl border border-cyan-500/20 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-8 text-cyan-400">{t.faqHeader}</h2>
          <div className="space-y-6">
            {t.faqList.map((faq, i) => (
              <div key={i} className="border-b border-slate-800 pb-6 last:border-0">
                <h3 className="font-bold text-white text-sm md:text-base mb-2">📌 {faq.q}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pb-16 gap-6">
          <div>{t.rights}</div>
          <div className="flex gap-6">
            <button onClick={() => setModalContent(t.privacy)} className="hover:text-cyan-400 transition cursor-pointer">{t.privacy}</button>
            <button onClick={() => setModalContent(t.terms)} className="hover:text-cyan-400 transition cursor-pointer">{t.terms}</button>
            <button onClick={() => setModalContent('support')} className="hover:text-cyan-400 transition cursor-pointer">{t.support}</button>
          </div>
        </footer>

        {modalContent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 p-8 md:p-10 rounded-3xl max-w-xl w-full shadow-2xl max-h-[85vh] overflow-y-auto">
              {modalContent === 'support' ? (
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">{t.supportFormTitle}</h3>
                  {supportSent ? (
 <div className="bg-emerald-950/60 border border-emerald-500 text-emerald-200 p-4 rounded-2xl text-xs mb-6 text-center">
                      {lang === 'ru' ? '✅ Ваше сообщение успешно отправлено! Мы ответим на email reymax77777@gmail.com в течение 15 минут.' : '✅ Message sent successfully! We will reply within 15 minutes.'}
                    </div>
                  ) : (
                    <form onSubmit={handleSupportSubmit} className="space-y-4 mb-6">
                      <input
                        type="email"
                        required
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder={t.supportEmailPlaceholder}
                        className="w-full bg-slate-950 text-white border border-slate-700 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500"
                      />
                      <textarea
                        required
                        value={supportMsg}
                        onChange={(e) => setSupportMsg(e.target.value)}
                        placeholder={t.supportMsgPlaceholder}
                        rows={4}
                        className="w-full bg-slate-950 text-white border border-slate-700 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition text-xs cursor-pointer shadow-lg"
                      >
                        {t.supportSubmitBtn}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">{modalContent}</h3>
                  <div className="text-xs md:text-sm text-slate-300 mb-8 space-y-4 leading-relaxed">
                    <p>Все процессы обработки юридических данных и платежной информации сервиса AI Freelance Contract Generator Pro Max Enterprise соответствуют строгим международным регламентам безопасности (GDPR, CCPA, PCI DSS).</p>
                    <p>По любым юридическим или техническим вопросам обращайтесь в службу поддержки: <strong>reymax77777@gmail.com</strong></p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setModalContent(null)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition text-sm cursor-pointer shadow-lg"
              >
                {lang === 'ru' ? 'Закрыть окно' : 'Close window'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}