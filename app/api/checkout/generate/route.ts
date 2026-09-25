import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      contractor,
      client,
      contractType,
      paymentTerms,
      startDate,
      endDate,
      projectDescription,
      amount,
      currency,
      language
    } = body;

    // 1. Убраны лишние кавычки из шаблонной строки
    const prompt = language === 'ru'
      ?` Напиши профессиональный договор (контракт) для фрилансера на русском языке.
Имя исполнителя: ${contractor || 'Фрилансер'}
Имя клиента: ${client}
Тип контракта: ${contractType}
Условия оплаты: ${paymentTerms}
Дата начала: ${startDate || 'не указана'}
Дата окончания: ${endDate || 'не указана'}
Описание проекта: ${projectDescription}
Сумма: ${amount} ${currency}`
      : `Write a professional freelance contract in English.
Contractor Name: ${contractor || 'Freelancer'}
Client Name: ${client}
Contract Type: ${contractType}
Payment Terms: ${paymentTerms}
Start Date: ${startDate || 'N/A'}
End Date: ${endDate || 'N/A'}
Project Description: ${projectDescription}
Amount: ${amount} ${currency}`;

    const response = await ai.models.generateContent({
      // 2. Исправлено имя модели на актуальную версию (gemini-2.5-flash)
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return NextResponse.json({ contract: response.text });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate contract' },
      { status: 500 }
    );
  }
}