import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Shopylist - wspólne listy zakupów';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const items = [
  { name: 'Mleko', done: true },
  { name: 'Chleb', done: true },
  { name: 'Pomidory', done: false },
  { name: 'Kawa', done: false }
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 72
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: 'white',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
                fontWeight: 800
              }}
            >
              S
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>Shopylist</div>
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div>Jedna lista zakupów</div>
            <div>dla całego domu</div>
          </div>
          <div style={{ marginTop: 20, fontSize: 26, color: '#cbd5e1' }}>
            Shared shopping lists. Free, no ads.
          </div>
        </div>

        <div
          style={{
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: 'white',
              color: '#0f172a',
              borderRadius: 24,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 30px 60px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Zakupy</div>
            {items.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 24
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    border: '2px solid #0f172a',
                    background: item.done ? '#0f172a' : 'white'
                  }}
                />
                <div
                  style={{
                    color: item.done ? '#94a3b8' : '#0f172a',
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
