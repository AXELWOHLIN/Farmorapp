import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-12 md:py-20">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-brown mb-6 leading-tight">
          Farmors Berättelser
        </h1>
        <p className="text-xl md:text-2xl text-brown-light mb-4 font-light leading-relaxed">
          Berätta ditt livs historia &ndash; för barn och barnbarn
        </p>
        <p className="text-lg text-brown-light/80 mb-10 max-w-lg mx-auto">
          Svara på frågor om ditt liv, kapitel för kapitel. Dina berättelser
          samlas och bevaras som en gåva till kommande generationer.
        </p>

        <Link
          href="/beratta"
          className="inline-block bg-gold hover:bg-gold-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          Börja berätta
        </Link>
      </div>

      <div className="max-w-3xl w-full mt-16 md:mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Dina kapitel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.key}
              className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark"
            >
              <div className="text-3xl mb-2">{chapter.icon}</div>
              <h3 className="text-lg font-bold mb-1">{chapter.title}</h3>
              <p className="text-brown-light/70 text-base">
                {chapter.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl text-center mt-16 px-4">
        <p className="text-brown-light/60 text-base">
          Dina berättelser sparas lokalt i din webbläsare. Ingen inloggning
          behövs.
        </p>
      </div>
    </div>
  );
}
