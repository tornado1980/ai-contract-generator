 'use client';

import React, { useState } from 'react';

type Language = 'en' | 'ru';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [formData, setFormData] = useState({
    clientName: '',
    freelancerName: '',
    serviceType: 'web-dev',
    projectAmount: '',
    deadlineDays: '',
  });
  const [contractLines, setContractLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const t = {
    en: {
      title: '1-Click Contract Generator',
      subtitle: 'Create professional freelance agreements in seconds.',
      detailsHeader: 'Agreement Details',
      clientLabel: 'Client Name / Company',
      clientPlaceholder: 'e.g., Acme Corp',
      freelancerLabel: 'Freelancer Name',
      freelancerPlaceholder: 'e.g., Alex Johnson',
      serviceLabel: 'Service Category',
      amountLabel: 'Amount ($ USD)',
      deadlineLabel: 'Deadline (Days)',
      generateBtn: 'Generate Contract',
      resultHeader: 'Generated Contract',
      copyBtn: 'Copy Text',
      copiedBtn: '✓ Copied!',
      downloadPdfBtn: 'Download PDF',
      emptyState: 'Fill in details and click "Generate Contract".',
      services: {
        'web-dev': 'Web & Software Development',
        'design': 'UI/UX & Graphic Design',
        'copywriting': 'Copywriting & Content',
        'marketing': 'Digital Marketing',
      },
    },
    ru: {
      title: 'Генератор Договоров в 1 Клик',
      subtitle: 'Создавайте соглашения для фриланса за пару секунд.',
      detailsHeader: 'Детали соглашения',
      clientLabel: 'Заказчик / Компания',
      clientPlaceholder: 'например, ООО «Вектор»',
      freelancerLabel: 'Имя Исполнителя',
      freelancerPlaceholder: 'например, Иван Иванов',
      serviceLabel: 'Категория услуг',
      amountLabel: 'Сумма ($ USD)',
      deadlineLabel: 'Срок (дней)',
      generateBtn: 'Сгенерировать договор',
      resultHeader: 'Готовый договор',
      copyBtn: 'Скопировать',
      copiedBtn: '✓ Скопировано!',
      downloadPdfBtn: 'Скачать PDF',
      emptyState: 'Заполните данные и нажмите «Сгенерировать договор».',
      services: {
        'web-dev': 'Веб-разработка и ПО',
        'design': 'UI/UX и Дизайн',
        'copywriting': 'Копирайтинг и Контент',
        'marketing': 'Цифровой маркетинг',
      },
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const isEn = lang === 'en';
    const date = new Date().toLocaleDateString(isEn ? 'en-US' : 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const client = formData.clientName || (isEn ? '[Client Name]' : '[Имя Заказчика]');
    const freelancer = formData.freelancerName || (isEn ? '[Freelancer Name]' : '[Имя Исполнителя]');
    const serviceKey = formData.serviceType as keyof typeof t.en.services;
    const service = t[lang].services[serviceKey];
    const amount = formData.projectAmount || '0.00';
    const days = formData.deadlineDays || 'X';

    const linesEn = [
      "INDEPENDENT CONTRACTOR AGREEMENT",
      "Date: " + date,
      "Client: " + client,
      "Freelancer: " + freelancer,
      "1. SERVICES PROVIDED:",
      "– " + service,
      "2. COMPENSATION:",
      "– Total: $" + amount + " USD (50% deposit, 50% upon completion)",
      "3. TIMELINE:",
      "– Completion within " + days + " business days.",
      "4. INTELLECTUAL PROPERTY:",
      "Upon full payment, all work products belong exclusively to the Client.",
      "5. CONFIDENTIALITY:",
      "Both parties agree to maintain strict confidentiality.",
      "Client Signature: _____",
      "Freelancer Signature: ____"
    ];
 const linesRu = [
      "ДОГОВОР НА ОКАЗАНИЕ ФРИЛАНС-УСЛУГ",
      "Дата: " + date,
      "Заказчик: " + client,
      "Исполнитель: " + freelancer,
      "1. ПРЕДМЕТ ДОГОВОРА:",
      "– " + service,
      "2. СТОИМОСТЬ УСЛУГ:",
      "– Общая сумма: $" + amount + " USD (50% предоплата, 50% после сдачи)",
      "3. СРОКИ:",
      "– Выполнение в течение " + days + " рабочих дней.",
      "4. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ:",
      "После полной оплаты все права переходят к Заказчику.",
      "5. КОНФИДЕНЦИАЛЬНОСТЬ:",
      "Стороны обязуются сохранять конфиденциальность.",
      "Подпись Заказчика: _____",
      "Подпись Исполнителя: ____"
    ];

    setContractLines(isEn ? linesEn : linesRu);
  };

  const handleCopy = () => {
    if (contractLines.length === 0) return;
    navigator.clipboard.writeText(contractLines.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (contractLines.length === 0) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const printContainer = document.createElement('div');
      printContainer.style.padding = '30px';
      printContainer.style.color = '#000000';
      printContainer.style.backgroundColor = '#ffffff';
      printContainer.style.fontFamily = 'Arial, sans-serif';
      printContainer.style.fontSize = '12pt';
      printContainer.style.lineHeight = '1.6';

      contractLines.forEach((line, index) => {
        const p = document.createElement('p');
        p.style.margin = '0 0 10px 0';

        if (index === 0) {
          p.style.fontWeight = 'bold';
          p.style.fontSize = '16pt';
          p.style.textAlign = 'center';
          p.style.marginBottom = '20px';
          p.style.borderBottom = '2px solid #333';
          p.style.paddingBottom = '10px';
        } else if (/^\d+\./.test(line)) {
          p.style.fontWeight = 'bold';
          p.style.marginTop = '15px';
        }

        p.innerText = line;
        printContainer.appendChild(p);
      });

      const opt = {
  margin: 15,
  filename: 'Contract_Agreement.pdf',
  image: { type: 'jpeg' as const, quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

      html2pdf().set(opt).from(printContainer).save();
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={lang === 'en' ? 'px-3 py-1 rounded-md text-sm font-semibold bg-blue-600 text-white' : 'px-3 py-1 rounded-md text-sm font-semibold text-slate-400 hover:text-white'}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLang('ru')}
          className={lang === 'ru' ? 'px-3 py-1 rounded-md text-sm font-semibold bg-blue-600 text-white' : 'px-3 py-1 rounded-md text-sm font-semibold text-slate-400 hover:text-white'}
        >
          RU
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 mt-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold sm:text-5xl text-white">
            {t[lang].title}
          </h1>
          <p className="text-slate-400 text-lg">{t[lang].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleGenerate} className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">{t[lang].detailsHeader}</h2>
 <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t[lang].clientLabel}</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder={t[lang].clientPlaceholder}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t[lang].freelancerLabel}</label>
              <input
                type="text"
                name="freelancerName"
                value={formData.freelancerName}
                onChange={handleInputChange}
                placeholder={t[lang].freelancerPlaceholder}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t[lang].serviceLabel}</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="web-dev">{t[lang].services['web-dev']}</option>
                <option value="design">{t[lang].services['design']}</option>
                <option value="copywriting">{t[lang].services['copywriting']}</option>
                <option value="marketing">{t[lang].services['marketing']}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t[lang].amountLabel}</label>
                <input
                  type="number"
                  name="projectAmount"
                  value={formData.projectAmount}
                  onChange={handleInputChange}
                  placeholder="1500"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t[lang].deadlineLabel}</label>
                <input
                  type="number"
                  name="deadlineDays"
                  value={formData.deadlineDays}
                  onChange={handleInputChange}
                  placeholder="14"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
            >
              {t[lang].generateBtn}
            </button>
          </form>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{t[lang].resultHeader}</h2>
              {contractLines.length > 0 && (
                <div className="flex space-x-2">
                  <button
 type="button"
                    onClick={handleCopy}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    {copied ? t[lang].copiedBtn : t[lang].copyBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="text-xs bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md transition-colors"
                  >
                    {t[lang].downloadPdfBtn}
                  </button>
                </div>
              )}
            </div>

            {contractLines.length > 0 ? (
              <div
                id="contract-text"
                className="w-full h-[380px] bg-slate-900 border border-slate-700 rounded-lg p-5 font-mono text-sm text-slate-200 overflow-y-auto space-y-3"
              >
                {contractLines.map((line, index) => {
                  const isTitle = index === 0;
                  const isSectionHeader = /^\d+\./.test(line);

                  let classNames = 'text-slate-300 pl-1';
                  if (isTitle) {
                    classNames = 'font-bold text-base text-blue-400 mb-4 pb-2 border-b border-slate-700';
                  } else if (isSectionHeader) {
                    classNames = 'font-semibold text-slate-100 mt-4';
                  }

                  return (
                    <div key={index} className={classNames}>
                      {line}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[380px] border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center p-6 text-center text-slate-500 text-sm">
                {t[lang].emptyState}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}