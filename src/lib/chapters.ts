import { Chapter, ChapterKey } from './types';

export const chapters: Chapter[] = [
  {
    key: 'barndom',
    title: 'Barndom',
    description: 'Uppväxt, familj, hem och skola',
    icon: '💂',
    questions: [
      'Var växte du upp? Berätta om platsen där du tillbringade din barndom.',
      'Berätta om ditt barndomshem. Hur såg det ut? Vilka bodde där?',
      'Vad lekte du som barn? Hade du några favoritlekar?',
      'Berätta om din familj när du var liten. Hur var dina föräldrar?',
      'Hur var det i skolan? Hade du en favoritlärare?',
      'Vad är ditt allra starkaste minne från barndomen?',
      'Firade ni några speciella traditioner i din familj?',
      'Hade du några husdjur som barn?',
    ],
  },
  {
    key: 'ungdom',
    title: 'Ungdom',
    description: 'Tonår, vänner och drömmar',
    icon: '🌟',
    questions: [
      'Berätta om din tonårstid. Hur var det att vara ung då?',
      'Vilka var dina bästa vänner? Vad gjorde ni tillsammans?',
      'Vad drömde du om som ung? Vad ville du bli?',
      'Hur var det att gå i skolan som tonåring?',
      'Vilken musik lyssnade du på? Vilka var dina idoler?',
      'Berätta om ett äventyr du hade som ung.',
      'Vad gjorde du på somrarna?',
    ],
  },
  {
    key: 'karlek',
    title: 'Kärlek',
    description: 'Möten, relationer och kärlek',
    icon: '❤️',
    questions: [
      'Hur träffade du din livskamrat? Berätta om ert första möte.',
      'Kommer du ihåg er första dejt? Vad gjorde ni?',
      'Hur och var gifte ni er? Berätta om bröllopet.',
      'Vad är hemligheten bakom en lång och lycklig relation?',
      'Berätta om ett romantiskt minne som du bär med dig.',
      'Vad har kärleken lärt dig?',
    ],
  },
  {
    key: 'familj',
    title: 'Familj',
    description: 'Barn, föräldraskap och familjeliv',
    icon: '👨‍👩‍👧‍👦',
    questions: [
      'Berätta om när du blev förälder för första gången. Hur kändes det?',
      'Vad är ditt finaste familjeminne?',
      'Hur var vardagen med små barn hemma?',
      'Vilka traditioner har ni haft i familjen?',
      'Berätta om dina barn och barnbarn. Vad gör dig stolt?',
      'Vad har du lärt dig av att vara förälder?',
      'Berätta om en rolig händelse i familjen som ni fortfarande skrattar åt.',
    ],
  },
  {
    key: 'arbete',
    title: 'Arbete',
    description: 'Karriär, kollegor och utmaningar',
    icon: '💼',
    questions: [
      'Vad blev du när du blev stor? Berätta om ditt yrkesliv.',
      'Berätta om ditt allra första jobb.',
      'Vilka kollegor eller chefer har betytt mest för dig?',
      'Vad var den största utmaningen i ditt arbetsliv?',
      'Berätta om en arbetsdag som du aldrig glömmer.',
      'Om du fick välja om – hade du valt samma yrke?',
      'Vad var det bästa med ditt jobb?',
    ],
  },
  {
    key: 'livsvisdom',
    title: 'Livsvisdom',
    description: 'Lärdomar, råd och reflektioner',
    icon: '🌿',
    questions: [
      'Vad har livet lärt dig som du önskar att du visste som ung?',
      'Vilket råd vill du ge dina barnbarn?',
      'Vad är du mest tacksam för i livet?',
      'Om du fick leva om ett ögonblick, vilket skulle det vara?',
      'Vilken person har betytt allra mest i ditt liv?',
      'Vad gör dig lycklig idag?',
      'Finns det något du ångrar – eller något du är extra glad att du gjorde?',
    ],
  },
  {
    key: 'ovrigt',
    title: 'Övrigt',
    description: 'Allt annat du vill berätta',
    icon: '✨',
    questions: [
      'Finns det något mer du vill berätta som vi inte har pratat om?',
      'Har du ett favoritminne som inte passar i något av de andra kapitlen?',
      'Finns det en historia som alltid berättas vid familjemiddagar?',
      'Vill du berätta om en resa som betydde mycket för dig?',
      'Finns det något speciellt du vill att dina barnbarn ska veta om dig?',
    ],
  },
];

export function getChapter(key: ChapterKey): Chapter {
  return chapters.find((c) => c.key === key)!;
}

export function getNextQuestion(
  chapterKey: ChapterKey,
  answeredCount: number
): string | null {
  const chapter = getChapter(chapterKey);
  if (answeredCount >= chapter.questions.length) return null;
  return chapter.questions[answeredCount];
}
