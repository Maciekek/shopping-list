import 'server-only';
import { ListItem } from '@/models';

const GEMINI_MODEL = 'gemini-2.5-flash';

// Order reflects a typical walk through a grocery store.
export const CATEGORY_ORDER = [
  'Warzywa i owoce',
  'Pieczywo',
  'Nabiał i jajka',
  'Mięso i wędliny',
  'Produkty sypkie i konserwy',
  'Mrożonki',
  'Napoje',
  'Słodycze i przekąski',
  'Chemia i higiena',
  'Inne'
];

type CategoryAssignment = {
  uuid: string;
  category: string;
};

export async function sortItemsByCategory(
  items: ListItem[]
): Promise<ListItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const itemsForPrompt = items.map(({ uuid, name }) => ({ uuid, name }));

  const prompt = [
    'Przypisz każdemu produktowi z listy zakupów dokładnie jedną kategorię.',
    `Dozwolone kategorie: ${CATEGORY_ORDER.join(', ')}.`,
    'Produkty spoza sklepu spożywczego lub niejednoznaczne przypisz do "Inne".',
    'Zwróć przypisanie dla każdego uuid z wejścia.',
    '',
    `Lista: ${JSON.stringify(itemsForPrompt)}`
  ].join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                uuid: { type: 'STRING' },
                category: { type: 'STRING', enum: CATEGORY_ORDER }
              },
              required: ['uuid', 'category']
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini API error: ${response.status} ${await response.text()}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an empty response');
  }

  const assignments: CategoryAssignment[] = JSON.parse(text);
  const categoryByUuid = new Map(
    assignments.map(({ uuid, category }) => [uuid, category])
  );

  const rank = (item: ListItem) => {
    const index = CATEGORY_ORDER.indexOf(categoryByUuid.get(item.uuid) ?? '');
    return index === -1 ? CATEGORY_ORDER.length : index;
  };

  // Array.prototype.sort is stable, so items keep their relative order
  // within a category; items the model missed go to the end.
  return [...items].sort((a, b) => rank(a) - rank(b));
}
