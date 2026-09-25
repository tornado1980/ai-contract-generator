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
  contractTypes: Record<string, string>;
  paymentMethodsList: Record<string, string>;
  paymentMethods: Record<string, string>;
  pricingPlans: Record<string, PricingPlan>;
  featuresList: Array<{ title: string; desc: string; icon: string }>;
  faqList: Array<{ q: string; a: string }>;
  reviewsList: Array<{ name: string; role: string; text: string; rating: string }>;
}

const translations: Record<'ru' | 'en', Translations> = {
  ru: {
    title: 'AI FREELANCE CONTRACT GENERATOR PRO (MAX EDITION)',
    subtitle: 'Максимально расширенная экосистема создания профессиональных контрактов для разработчиков, дизайнеров, маркетологов и агентств с защитой интеллектуальной собственности',
    clientName: 'Имя / ФИО Заказчика или Юридического лица',
    clientPlaceholder: 'например, Acme Corp или ООО «Инновационные Технологии»',
    contractorName: 'Имя / ФИО Подрядчика (Исполнителя / ИП)',
    contractorPlaceholder: 'например, Алексей Смирнов (Senior Fullstack Architect)',
    city: 'Город заключения сделки / юрисдикция',
    cityPlaceholder: 'например, New York, London, Berlin, Astana',
    contractType: 'Тип юридического контракта',
    paymentTerms: 'Условия и график поэтапной оплаты',
    startDate: 'Дата начала оказания услуг (Старт)',
    endDate: 'Дата завершения и сдачи проекта (Дедлайн)',
    amount: 'Общий бюджет / Сумма сделки',
    amountPlaceholder: 'например, 5000',
    currency: 'Валюта взаиморасчетов',
    paymentHeader: 'Платежный шлюз для проведения транзакций',
    pricingHeader: 'Масштабные тарифные планы доступа к генератору',
    generate: 'Сгенерировать полный юридический контракт',
    clear: 'Сбросить все поля формы',
    contractTitle: 'Официальный текст готового контракта',
    copy: 'Скопировать весь текст',
    downloadTxt: 'Сохранить как TXT',
    downloadPdf: 'Экспорт в чистый PDF (Enterprise)',
    payButton: 'Оплатить тариф и разблокировать экспорт',
    disclaimerBanner: '⚠️ ПРАВОВОЙ ДИСКЛЕЙМЕР: Веб-платформа функционирует исключительно как автоматизированный IT-инструмент для составления информационных проектов и драфтов. Разработчики не предоставляют юридических услуг и не несут ответственности за исходы судебных или коммерческих споров.',
    agreementText: 'Я подтверждаю, что ознакомлен(а) с регламентом сервиса, осознаю информационный характер шаблона и согласен(-на) с полным снятием ответственности с авторов платформы.',
    agreementError: 'Пожалуйста, поставьте обязательную галочку в чекбоксе согласия с условиями использования и дисклеймером.',
 rights: '© 2026 AI Freelance Contract Generator Pro Max. Все права защищены.',
    privacy: 'Политика конфиденциальности & GDPR',
    terms: 'Пользовательское соглашение',
    support: 'Круглосуточная служба техподдержки',
    trustBadge: '🛡️ Безопасность банковского уровня шифрования SSL/TLS. Соответствие стандартам PCI DSS. Гарантия возврата средств.',
    featuresHeader: 'Специализированные профили под любые IT и креативные сферы',
    faqHeader: 'База знаний и часто задаваемые вопросы',
    previewHeader: 'Интерактивная пред-структура и оглавление документа',
    historyHeader: 'Журнал недавних сгенерированых контрактов',
    reviewsHeader: 'Реальные отзывы независимых экспертов рынка',
    advancedHeader: 'Расширенные правовые условия и оговорки',
    penaltyLabel: 'Включить штрафную пеню 0.2% за каждый день просрочки платежа',
    jurisdictionLabel: 'Определить подсудность и порядок разрешения споров',
    checkboxExtraLabel: 'Включить пункт о жестких лимитах бесплатных правок (не более 2 итераций)',
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
      stripe: 'Stripe (Банковские карты Visa/Mastercard / Apple Pay)',
      lemon: 'Lemon Squeezy (Для цифровых продуктов и глобальных услуг)',
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
      { q: 'Нужно ли проходить сложную регистрацию?', a: 'Нет, все функции доступны мгновенно без создания громоздких учетных записей.' },
      { q: 'Насколько юридически сильны эти шаблоны?', a: 'Документы составлены на основе международной практики с учетом ключевых рисков. Рекомендуем финальное одобрение вашим юристом.' },
      { q: 'Как работает скачивание готового PDF?', a: 'После выбора тарифа и симуляции безопасной оплаты вы получаете красивый документ без каких-либо водяных знаков.' },
 ],
    reviewsList: [
      { name: 'Дмитрий Орехов', role: 'Senior React Developer', text: 'Пользуюсь генератором для контрактов с американскими заказчиками. Пункты про передачу кода работают безупречно.', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Кристина Захарова', role: 'Lead UI/UX Designer', text: 'Ограничение правок в договоре спасло меня от бесконечных правок заказчика. Огромное спасибо разработчикам!', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Игорь Васильев', role: 'DevOps Engineer', text: 'Удобно менять валюту на евро и доллары в один клик под разные международные контракты.', rating: '⭐⭐⭐⭐⭐' },
    ],
  },
  en: {
    title: 'AI FREELANCE CONTRACT GENERATOR PRO (MAX EDITION)',
    subtitle: 'Advanced comprehensive ecosystem for generating legally vetted professional contracts for developers, designers, marketers and agencies with IP protection',
    clientName: 'Client Name / Company Legal Entity',
    clientPlaceholder: 'e.g., Acme Corp or Global Technologies LLC',
    contractorName: 'Contractor Name / Specialist / Sole Proprietor',
    contractorPlaceholder: 'e.g., Alex Smith (Senior Fullstack Architect)',
    city: 'Contract Signing City / Jurisdiction',
    cityPlaceholder: 'e.g., New York, London, Berlin, Toronto',
    contractType: 'Legal Contract Type',
    paymentTerms: 'Payment Terms & Milestone Schedule',
    startDate: 'Project Start Date',
    endDate: 'Project Deadline & Completion Date',
    amount: 'Total Budget / Deal Amount',
    amountPlaceholder: 'e.g., 5000',
    currency: 'Settlement Currency',
    paymentHeader: 'Payment Gateway Provider',
    pricingHeader: 'Comprehensive Access Pricing Plans',
    generate: 'Generate Comprehensive Legal Contract',
    clear: 'Reset All Form Fields',
    contractTitle: 'Official Generated Contract Document',
    copy: 'Copy Full Text',
    downloadTxt: 'Download as TXT',
    downloadPdf: 'Export Clean PDF (Enterprise)',
    payButton: 'Pay Plan & Unlock Export',
    disclaimerBanner: '⚠️ LEGAL DISCLAIMER: This web platform functions strictly as an automated IT drafting tool. Developers do not provide formal legal counsel and bear no liability for commercial or judicial dispute outcomes.',
    agreementText: 'I confirm that I understand the informational nature of this tool and fully agree to release the creators from any legal or financial liability.',
    agreementError: 'Please check the required box to confirm your agreement with terms and legal disclaimer.',
    rights: '© 2026 AI Freelance Contract Generator Pro Max. All rights reserved.',
    privacy: 'Privacy Policy & GDPR Compliance',
    terms: 'Terms of Service',
    support: '24/7 Support Center',
    trustBadge: '🛡️ Bank-grade SSL/TLS encryption. PCI DSS compliance standards. Satisfaction money-back guarantee.',
    featuresHeader: 'Specialized Profiles for All IT and Creative Domains',
    faqHeader: 'Knowledge Base & Frequently Asked Questions',
    previewHeader: 'Interactive Document Structure & Table of Contents',
    historyHeader: 'Recent Generated Contracts Log',
    reviewsHeader: 'Verified Independent Market Expert Reviews',
    advancedHeader: 'Advanced Legal Conditions & Clauses',
    penaltyLabel: 'Include 0.2% daily penalty fee for late payment defaults',
    jurisdictionLabel: 'Define Dispute Resolution & Governing Law Jurisdiction',
    checkboxExtraLabel: 'Include explicit clause limiting free revisions (max 2 iterations)',
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
      stripe: 'Stripe (Credit/Debit Cards Visa/Mastercard / Apple Pay)',
      lemon: 'Lemon Squeezy (For Digital Products & Global Services)',
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
      { q: 'Do I need to register an account?', a: 'No, all core tools are accessible instantly without creating bulky accounts.' },
      { q: 'How legally binding are these templates?', a: 'Templates are built following international best practices. We recommend final approval by your personal attorney.' },
      { q: 'How does the clean PDF export work?', a: 'Once a plan is selected and payment simulated, you get a pristine document without any watermarks.' },
    ],
    reviewsList: [
      { name: 'Dmitry Orekhov', role: 'Senior React Developer', text: 'I use this generator for contracts with US clients. Code transfer clauses work flawlessly.', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Kristina Zakharova', role: 'Lead UI/UX Designer', text: 'Revision limits saved me from endless client tweaks. Huge thanks to the creators!', rating: '⭐⭐⭐⭐⭐' },
      { name: 'Igor Vasiliev', role: 'DevOps Engineer', text: 'Very convenient to switch currencies to euros and dollars in one click for various international projects.', rating: '⭐⭐⭐⭐⭐' },
    ],
  },
};

const paymentCards = [
  { id: 'stripe', key: 'stripe', color: 'from-blue-600 to-indigo-600' },
  { id: 'lemon', key: 'lemon', color: 'from-amber-600 to-orange-600' },
  { id: 'crypto', key: 'crypto', color: 'from-emerald-600 to-teal-600' },
  { id: 'wire', key: 'wire', color: 'from-cyan-600 to-blue-700' },
];

const pricingKeys = ['single', 'pack', 'subscription'] as const;

export default function ContractGeneratorProMax() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const t = translations[lang];

  const [clientName, setClientName] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [city, setCity] = useState('');
  const [contractType, setContractType] = useState('standard');
  const [paymentTerms, setPaymentTerms] = useState('advance50');
  const [startDate, setStartDate] = useState('2026-12-12');
  const [endDate, setEndDate] = useState('2026-12-30');
  const [amount, setAmount] = useState('5000');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'pack' | 'subscription'>('single');
  const [isAgreed, setIsAgreed] = useState(false);
 // Продвинутые параметры
  const [enablePenalty, setEnablePenalty] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('International Commercial Arbitration / London, UK');
  const [extraCheckbox, setExtraCheckbox] = useState(false);

  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [savedHistory, setSavedHistory] = useState<SavedContract[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contractRef = useRef<HTMLDivElement>(null);

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79 };

  useEffect(() => {
    const stored = localStorage.getItem('ai_contract_history_max');
    if (stored) {
      try {
        setSavedHistory(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const formatPrice = (basePrice: number, isSub?: boolean) => {
    const rate = currencyRates[currency];
    const converted = (basePrice * rate).toFixed(2);
    const symbol = currencySymbols[currency];
    return symbol + converted + (isSub ? (lang === 'ru' ? ' / мес' : ' / mo') : '');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      alert(t.agreementError);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const cType = t.contractTypes[contractType] || contractType;
      const pTerms = t.paymentMethodsList[paymentTerms] || paymentTerms;
      const pMethod = t.paymentMethods[paymentMethod] || paymentMethod;
      
      const client = clientName || (lang === 'ru' ? 'ООО Заказчик Про' : 'Client Corp Max');
      const contractor = contractorName || (lang === 'ru' ? 'ИП Подрядчик Эксперт' : 'Specialist Contractor Pro');
      const cityName = city || 'London / Remote';
      const startD = startDate || '2026-12-12';
      const endD = endDate || '2026-12-30';
      const totalAmount = amount || '5000';
      const currSymbol = currencySymbols[currency];

      let fullText = '';

      if (lang === 'ru') {
        fullText = 
          'ОФИЦИАЛЬНЫЙ КОНТРАКТ ОКАЗАНИЯ ПРОФЕССИОНАЛЬНЫХ УСЛУГ № 2026/MAX-PRO\n' +
          'г. ' + cityName + '                                           Дата подписания: ' + startD + '\n\n' +
          'Заказчик: ' + client + ', с одной стороны, и\n' +
          'Подрядчик (Исполнитель): ' + contractor + ', с другой стороны, совместно именуемые Стороны, заключили настоящий Договор:\n\n' +
          'РАЗДЕЛ I. ПРЕДМЕТ ДОГОВОРА И ОБЛАСТЬ РАБОТ\n' +
          '1.1. Исполнитель обязуется по техническому заданию Заказчика выполнить комплекс работ: ' + cType + '.\n' +
          '1.2. График реализации проекта:\n' +
          '   - Дата начала оказания услуг: ' + startD + '\n' +
          '   - Дата финальной сдачи и закрытия проекта: ' + endD + '\n' +
          '1.3. Обработка финансовых транзакций выполняется через шлюз: ' + pMethod + '.\n\n' +
          'РАЗДЕЛ II. СТОИМОСТЬ И ПОРЯДОК ФИНАНСОВЫХ РАСЧЕТОВ\n' +
          '2.1. Итоговая стоимость услуг по настоящему Договору составляет: ' + totalAmount + ' ' + currSymbol + '.\n' +
          '2.2. График и порядок расчетов: ' + pTerms + '.\n' +
          (enablePenalty ? '2.3. В случае просрочки денежных обязательств начисляется пеня в размере 0.2% от суммы долга за каждый день просрочки.\n' : '') +
          (extraCheckbox ? '2.4. Стороны прямо зафиксировали жесткие ограничения по бесплатным правкам: не более двух итераций доработок.\n\n' : '\n') +
          'РАЗДЕЛ III. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ И ОТВЕТСТВЕННОСТЬ\n' +
          '3.1. Исключительные права на результаты интеллектуальной деятельности переходят к Заказчику только после полной оплаты.\n' +
 '3.2. Порядок разрешения споров и применимое право: ' + jurisdiction + '.\n\n' +
          'РАЗДЕЛ IV. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ\n' +
          '4.1. Настоящий Договор вступает в силу с момента подписания и действует до полного исполнения.\n\n' +
          'РАЗДЕЛ V. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН\n\n' +
          'ЗАКАЗЧИК: ' + client + '\n' +
          'М.П. _____ / ____ /\n\n' +
          'ПОДРЯЧИК: ' + contractor + '\n' +
          'М.П. _____ / ____ /';
      } else {
        fullText = 
          'MASTER PROFESSIONAL SERVICES AGREEMENT № 2026/MAX-PRO\n' +
          'City: ' + cityName + '                                        Date: ' + startD + '\n\n' +
          'Client: ' + client + ', on the one hand, and\n' +
          'Contractor: ' + contractor + ', on the other hand, collectively referred to as the Parties, agree:\n\n' +
          'SECTION I. SUBJECT MATTER AND SCOPE OF WORK\n' +
          '1.1. Contractor undertakes to provide professional services: ' + cType + '.\n' +
          '1.2. Project schedule:\n' +
          '   - Project start date: ' + startD + '\n' +
          '   - Project completion date: ' + endD + '\n' +
          '1.3. Payment gateway platform channel: ' + pMethod + '.\n\n' +
          'SECTION II. FINANCIAL TERMS AND PRICING SCHEDULE\n' +
          '2.1. Total project fee amounts to: ' + totalAmount + ' ' + currSymbol + '.\n' +
          '2.2. Payment terms structure: ' + pTerms + '.\n' +
          (enablePenalty ? '2.3. Late payments incur a 0.2% daily penalty fee on the outstanding overdue amount.\n' : '') +
          (extraCheckbox ? '2.4. Parties explicitly agreed on strict revision limits: maximum of two correction iterations.\n\n' : '\n') +
          'SECTION III. INTELLECTUAL PROPERTY & JURISDICTION\n' +
          '3.1. Intellectual property rights transfer to the Client exclusively upon full project payment.\n' +
          '3.2. Dispute resolution jurisdiction and governing law: ' + jurisdiction + '.\n\n' +
          'SECTION IV. MISCELLANEOUS PROVISIONS\n' +
          '4.1. This Agreement takes effect upon signing and remains valid until full execution.\n\n' +
          'SECTION V. SIGNATURES AND DETAILS\n\n' +
          'CLIENT: ' + client + '\n' +
          'Seal _____ / ____ /\n\n' +
          'CONTRACTOR: ' + contractor + '\n' +
          'Seal _____ / ____ /';
      }

      setGeneratedContract(fullText);
      setIsLoading(false);

      const newHistoryItem: SavedContract = {
        id: Date.now().toString(),
        title: cType,
        date: new Date().toLocaleDateString(),
        content: fullText,
      };
      const updatedHistory = [newHistoryItem, ...savedHistory.slice(0, 4)];
      setSavedHistory(updatedHistory);
      localStorage.setItem('ai_contract_history_max', JSON.stringify(updatedHistory));
    }, 600);
  };

  const handleClear = () => {
    setClientName('');
    setContractorName('');
    setCity('');
    setStartDate('2026-12-12');
    setEndDate('2026-12-30');
    setAmount('5000');
    setGeneratedContract(null);
    setIsPaid(false);
    setIsAgreed(false);
    setExtraCheckbox(false);
  };

  const handleCopy = () => {
    if (generatedContract) {
      navigator.clipboard.writeText(generatedContract);
      alert(lang === 'ru' ? 'Текст контракта успешно скопирован в буфер обмена!' : 'Contract text copied successfully!');
    }
  };

  const handleDownloadTXT = () => {
    if (generatedContract) {
      const element = document.createElement('a');
      const file = new Blob([generatedContract], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = 'pro_max_freelance_contract.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };
const handleDownloadPdf = async () => {
    if (typeof window === 'undefined') return;

    if (isPaid) {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('contract-printable-file');
      if (element) {
        const options = {
          margin: 10,
          filename: 'AI_Pro_Max_Contract.pdf',
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };
        html2pdf().from(element).set(options).save();
      }
    } else {
      alert(lang === 'ru' ? 'Пожалуйста, оплатите тариф для разблокировки скачивания PDF' : 'Please pay the tariff to unlock PDF download');
    }
  };

  const handleProceedPayment = () => {
    if (!isAgreed) {
      alert(t.agreementError);
      return;
    }

    const planDetails = t.pricingPlans[selectedPlan];
    const formattedCost = formatPrice(planDetails.basePrice, planDetails.isSub);
    const pMethodName = t.paymentMethods[paymentMethod];
    
    const confirmPayment = window.confirm(
      (lang === 'ru' ? 'Переход на защищенный шлюз (' + pMethodName + '). Тариф: ' : 'Redirecting to secure gateway (' + pMethodName + '). Plan: ') +
      planDetails.name + ' — ' + formattedCost + '\n\n' +
      (lang === 'ru' ? 'Нажмите ОК для симуляции успешной оплаты и разблокировки документов.' : 'Click OK to simulate successful payment and unlock documents.')
    );

    if (confirmPayment) {
      setIsPaid(true);
      alert(lang === 'ru' ? 'Оплата прошла успешно! Экспорт PDF документов без водяных знаков активирован.' : 'Payment successful! Watermark-free PDF document export is now active.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-6 md:p-16 font-sans relative overflow-hidden">
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
              onClick={() => setLang('ru')}
              className={'px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm ' + (lang === 'ru' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50' : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800')}
            >
              RU
            </button>
            <button
              onClick={() => setLang('en')}
              className={'px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm ' + (lang === 'en' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50' : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800')}
            >
              EN
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
            <div className="font-bold text-center mb-4 text-sm text-indigo-950">ОФИЦИАЛЬНЫЙ КОНТРАКТ ОКАЗАНИЯ УСЛУГ № 2026/SAMPLE</div>
            <p className="mb-2">г. London / Remote | Дата подписания: 12.12.2026</p>
            <p className="font-bold text-indigo-900 mt-3">I. ПРЕДМЕТ ДОГОВОРА И ОБЛАСТЬ РАБОТ</p>
            <p>1.1. Исполнитель обязуется выполнить работы по разработке распределенной системы на TypeScript и Next.js.</p>
            <p className="font-bold text-indigo-900 mt-3">II. СТОИМОСТЬ И РАСЧЕТЫ</p>
            <p>2.1. Общий бюджет проекта составляет 5000 USD с поэтапной оплатой через платежный шлюз Stripe.</p>
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
          <label className="block text-sm font-bold mb-6 text-cyan-400 uppercase tracking-wider">{t.pricingHeader}</label>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <span>💳</span> {t.payButton} ({formatPrice(t.pricingPlans[selectedPlan].basePrice, t.pricingPlans[selectedPlan].isSub)}) {isPaid && '✅ (Оплачено)'}
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
          <div className="mt-14 bg-slate-900/90 p-6 md:p-12 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-3">
              <span>📄</span> {t.contractTitle} {!isPaid && '🔒'}
 </h2>
            
            <div id="contract-printable-area" ref={contractRef}>
              <pre className="whitespace-pre-wrap bg-white text-slate-900 p-8 md:p-10 rounded-2xl border border-slate-300 font-mono text-xs md:text-sm mb-8 leading-relaxed shadow-inner select-all">
                {generatedContract}
              </pre>
            </div>
            
            <div className="flex flex-wrap gap-4">
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
                onClick={handleDownloadPdf}
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
              <span>⏱️</span> {t.historyHeader}
            </h2>
            <div className="space-y-4">
              {savedHistory.map((item) => (
                <div key={item.id} className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex justify-between items-center text-xs md:text-sm">
                  <div>
                    <span className="font-bold text-white mr-4">{item.title}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <button
                    onClick={() => setGeneratedContract(item.content)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.reviewsList.map((rev, i) => (
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
            <button onClick={() => setModalContent(t.support)} className="hover:text-cyan-400 transition cursor-pointer">{t.support}</button>
          </div>
        </footer>

        {modalContent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 p-8 md:p-10 rounded-3xl max-w-xl w-full shadow-2xl max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">{modalContent}</h3>
              <div className="text-xs md:text-sm text-slate-300 mb-8 space-y-4 leading-relaxed">
                <p>Все процессы обработки юридических данных и платежной информации сервиса AI Freelance Contract Generator Pro Max соответствуют строгим международным регламентам безопасности (GDPR, CCPA, PCI DSS).</p>
                <p>По любым юридическим или техническим вопросам обращайтесь в службу поддержки: support@ai-contract-generator-pro.com</p>
              </div>
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