import { DetailedElementData } from '../types';

// Base element details (language-independent numeric/scientific data)
interface ElementDetailBase {
  electronConfiguration: string;
  electronShells: string;
  oxidationStates: string;
  meltingPoint: string;
  boilingPoint: string;
  density: string;
  discoveryYear: string;
}

// Descriptions per language
interface ElementDescriptions {
  ru: string;
  en: string;
  kk: string;
}

interface ElementDetailEntry {
  base: ElementDetailBase;
  descriptions: ElementDescriptions;
}

const ELEMENT_DETAILS_DATA: Record<string, ElementDetailEntry> = {
  H: {
    base: { electronConfiguration: '1s¹', electronShells: '1', oxidationStates: '-1, +1', meltingPoint: '-259.16 °C', boilingPoint: '-252.87 °C', density: '0.00008988 г/см³', discoveryYear: '1766' },
    descriptions: {
      ru: 'Водород — самый лёгкий и распространённый элемент во Вселенной. Бесцветный газ без запаха, используется как топливо и в химическом синтезе.',
      en: 'Hydrogen is the lightest and most abundant element in the universe. A colorless, odorless gas used as fuel and in chemical synthesis.',
      kk: 'Сутегі — Әлемдегі ең жеңіл және кең таралған элемент. Түссіз, иіссіз газ, отын және химиялық синтезде қолданылады.'
    }
  },
  He: {
    base: { electronConfiguration: '1s²', electronShells: '2', oxidationStates: '0', meltingPoint: '-272.20 °C', boilingPoint: '-268.93 °C', density: '0.0001785 г/см³', discoveryYear: '1868' },
    descriptions: {
      ru: 'Гелий — инертный газ, второй по распространённости элемент во Вселенной. Используется для заполнения воздушных шаров и в криогенике.',
      en: 'Helium is a noble gas and the second most abundant element in the universe. Used to fill balloons and in cryogenics.',
      kk: 'Гелий — инертті газ, Әлемде екінші ең көп таралған элемент. Ауа шарларын толтыруда және криогеникада қолданылады.'
    }
  },
  Li: {
    base: { electronConfiguration: '1s² 2s¹', electronShells: '2, 1', oxidationStates: '+1', meltingPoint: '180.54 °C', boilingPoint: '1342 °C', density: '0.534 г/см³', discoveryYear: '1817' },
    descriptions: {
      ru: 'Литий — мягкий щелочной металл серебристо-белого цвета. Широко используется в аккумуляторах и в психиатрии.',
      en: 'Lithium is a soft, silvery-white alkali metal. Widely used in batteries and in psychiatric medicine.',
      kk: 'Литий — жұмсақ, күміс-ақ түсті сілтілік металл. Аккумуляторларда және психиатрияда кеңінен қолданылады.'
    }
  },
  Be: {
    base: { electronConfiguration: '1s² 2s²', electronShells: '2, 2', oxidationStates: '+2', meltingPoint: '1287 °C', boilingPoint: '2469 °C', density: '1.85 г/см³', discoveryYear: '1798' },
    descriptions: {
      ru: 'Бериллий — лёгкий щёлочноземельный металл. Применяется в аэрокосмической промышленности и рентгеновских аппаратах.',
      en: 'Beryllium is a lightweight alkaline earth metal. Used in aerospace industry and X-ray equipment.',
      kk: 'Бериллий — жеңіл сілтілі-жер металы. Аэроғарыш өнеркәсібінде және рентген аппараттарында қолданылады.'
    }
  },
  B: {
    base: { electronConfiguration: '1s² 2s² 2p¹', electronShells: '2, 3', oxidationStates: '+3', meltingPoint: '2076 °C', boilingPoint: '3927 °C', density: '2.34 г/см³', discoveryYear: '1808' },
    descriptions: {
      ru: 'Бор — металлоид, используемый в производстве стекла, керамики и моющих средств. Важен для растений.',
      en: 'Boron is a metalloid used in glass, ceramics, and detergent production. Important for plants.',
      kk: 'Бор — шыны, керамика және жуғыш заттар өндірісінде қолданылатын металлоид. Өсімдіктер үшін маңызды.'
    }
  },
  C: {
    base: { electronConfiguration: '1s² 2s² 2p²', electronShells: '2, 4', oxidationStates: '-4, -3, -2, -1, 0, +1, +2, +3, +4', meltingPoint: '3550 °C', boilingPoint: '4027 °C', density: '2.267 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Углерод — основа всей органической химии и жизни на Земле. Встречается в виде алмаза, графита и фуллеренов.',
      en: 'Carbon is the basis of all organic chemistry and life on Earth. Found as diamond, graphite, and fullerenes.',
      kk: 'Көміртегі — барлық органикалық химияның және Жердегі тіршіліктің негізі. Алмаз, графит және фуллерен түрінде кездеседі.'
    }
  },
  N: {
    base: { electronConfiguration: '1s² 2s² 2p³', electronShells: '2, 5', oxidationStates: '-3, -2, -1, +1, +2, +3, +4, +5', meltingPoint: '-210.00 °C', boilingPoint: '-195.79 °C', density: '0.0012506 г/см³', discoveryYear: '1772' },
    descriptions: {
      ru: 'Азот — бесцветный газ, составляющий 78% атмосферы Земли. Необходим для производства удобрений и взрывчатых веществ.',
      en: 'Nitrogen is a colorless gas making up 78% of Earth\'s atmosphere. Essential for fertilizer and explosives production.',
      kk: 'Азот — Жер атмосферасының 78%-ын құрайтын түссіз газ. Тыңайтқыштар мен жарылғыш заттар өндірісі үшін қажет.'
    }
  },
  O: {
    base: { electronConfiguration: '1s² 2s² 2p⁴', electronShells: '2, 6', oxidationStates: '-2, -1, +2', meltingPoint: '-218.79 °C', boilingPoint: '-182.96 °C', density: '0.001429 г/см³', discoveryYear: '1774' },
    descriptions: {
      ru: 'Кислород — жизненно важный газ для дыхания. Составляет 21% атмосферы и участвует в процессах горения.',
      en: 'Oxygen is a vital gas for respiration. Makes up 21% of the atmosphere and is involved in combustion processes.',
      kk: 'Оттегі — тыныс алу үшін өмірлік маңызды газ. Атмосфераның 21%-ын құрайды және жану процестеріне қатысады.'
    }
  },
  F: {
    base: { electronConfiguration: '1s² 2s² 2p⁵', electronShells: '2, 7', oxidationStates: '-1', meltingPoint: '-219.67 °C', boilingPoint: '-188.11 °C', density: '0.001696 г/см³', discoveryYear: '1886' },
    descriptions: {
      ru: 'Фтор — самый электроотрицательный и реакционноспособный элемент. Используется в зубных пастах и тефлоне.',
      en: 'Fluorine is the most electronegative and reactive element. Used in toothpaste and Teflon.',
      kk: 'Фтор — ең электртерістік және реакциялық элемент. Тіс пасталарында және тефлонда қолданылады.'
    }
  },
  Ne: {
    base: { electronConfiguration: '1s² 2s² 2p⁶', electronShells: '2, 8', oxidationStates: '0', meltingPoint: '-248.59 °C', boilingPoint: '-246.08 °C', density: '0.0008999 г/см³', discoveryYear: '1898' },
    descriptions: {
      ru: 'Неон — инертный газ, известный своим ярко-красным свечением в газоразрядных трубках. Используется в рекламных вывесках.',
      en: 'Neon is a noble gas known for its bright red glow in gas-discharge tubes. Used in advertising signs.',
      kk: 'Неон — газ-разрядтық түтіктерде жарқын қызыл жарығымен танымал инертті газ. Жарнамалық белгілерде қолданылады.'
    }
  },
  Na: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s¹', electronShells: '2, 8, 1', oxidationStates: '+1', meltingPoint: '97.72 °C', boilingPoint: '883 °C', density: '0.971 г/см³', discoveryYear: '1807' },
    descriptions: {
      ru: 'Натрий — мягкий щелочной металл, активно реагирующий с водой. Входит в состав поваренной соли (NaCl).',
      en: 'Sodium is a soft alkali metal that reacts vigorously with water. A component of table salt (NaCl).',
      kk: 'Натрий — сумен белсенді әрекеттесетін жұмсақ сілтілік металл. Ас тұзының (NaCl) құрамына кіреді.'
    }
  },
  Mg: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s²', electronShells: '2, 8, 2', oxidationStates: '+2', meltingPoint: '650 °C', boilingPoint: '1091 °C', density: '1.738 г/см³', discoveryYear: '1755' },
    descriptions: {
      ru: 'Магний — лёгкий металл, горящий ярким белым пламенем. Важен для биологических процессов и используется в сплавах.',
      en: 'Magnesium is a light metal that burns with a bright white flame. Important for biological processes and used in alloys.',
      kk: 'Магний — жарқын ақ жалынмен жанатын жеңіл металл. Биологиялық процестер үшін маңызды және қорытпаларда қолданылады.'
    }
  },
  Al: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p¹', electronShells: '2, 8, 3', oxidationStates: '+3', meltingPoint: '660.32 °C', boilingPoint: '2519 °C', density: '2.698 г/см³', discoveryYear: '1825' },
    descriptions: {
      ru: 'Алюминий — лёгкий, прочный и коррозионностойкий металл. Третий по распространённости элемент в земной коре.',
      en: 'Aluminum is a lightweight, strong, and corrosion-resistant metal. Third most abundant element in Earth\'s crust.',
      kk: 'Алюминий — жеңіл, берік және коррозияға төзімді металл. Жер қыртысындағы үшінші ең көп таралған элемент.'
    }
  },
  Si: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p²', electronShells: '2, 8, 4', oxidationStates: '-4, +4', meltingPoint: '1414 °C', boilingPoint: '3265 °C', density: '2.3296 г/см³', discoveryYear: '1824' },
    descriptions: {
      ru: 'Кремний — второй по распространённости элемент в земной коре. Основа полупроводниковой электроники.',
      en: 'Silicon is the second most abundant element in Earth\'s crust. The foundation of semiconductor electronics.',
      kk: 'Кремний — жер қыртысында екінші ең көп таралған элемент. Жартылай өткізгіш электрониканың негізі.'
    }
  },
  P: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p³', electronShells: '2, 8, 5', oxidationStates: '-3, +3, +5', meltingPoint: '44.15 °C', boilingPoint: '280.5 °C', density: '1.82 г/см³', discoveryYear: '1669' },
    descriptions: {
      ru: 'Фосфор — неметалл, необходимый для жизни. Существует в нескольких аллотропных формах: белый, красный и чёрный фосфор.',
      en: 'Phosphorus is a nonmetal essential for life. Exists in several allotropic forms: white, red, and black phosphorus.',
      kk: 'Фосфор — тіршілік үшін қажетті бейметалл. Бірнеше аллотропиялық формада болады: ақ, қызыл және қара фосфор.'
    }
  },
  S: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁴', electronShells: '2, 8, 6', oxidationStates: '-2, +4, +6', meltingPoint: '115.21 °C', boilingPoint: '444.60 °C', density: '2.067 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Сера — жёлтый неметалл с характерным запахом. Используется в производстве серной кислоты, вулканизации резины.',
      en: 'Sulfur is a yellow nonmetal with a characteristic smell. Used in sulfuric acid production and rubber vulcanization.',
      kk: 'Күкірт — тән иісі бар сары бейметалл. Күкірт қышқылы өндірісінде және резеңке вулканизациясында қолданылады.'
    }
  },
  Cl: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁵', electronShells: '2, 8, 7', oxidationStates: '-1, +1, +3, +5, +7', meltingPoint: '-101.5 °C', boilingPoint: '-34.04 °C', density: '0.003214 г/см³', discoveryYear: '1774' },
    descriptions: {
      ru: 'Хлор — жёлто-зелёный газ с резким запахом. Используется для обеззараживания воды и в производстве ПВХ.',
      en: 'Chlorine is a yellow-green gas with a pungent smell. Used for water disinfection and PVC production.',
      kk: 'Хлор — өткір иісі бар сары-жасыл газ. Суды залалсыздандыру және ПВХ өндірісінде қолданылады.'
    }
  },
  Ar: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁶', electronShells: '2, 8, 8', oxidationStates: '0', meltingPoint: '-189.34 °C', boilingPoint: '-185.85 °C', density: '0.0017837 г/см³', discoveryYear: '1894' },
    descriptions: {
      ru: 'Аргон — инертный газ, составляющий около 1% атмосферы. Используется в сварке и для заполнения ламп накаливания.',
      en: 'Argon is a noble gas making up about 1% of the atmosphere. Used in welding and filling incandescent lamps.',
      kk: 'Аргон — атмосфераның шамамен 1%-ын құрайтын инертті газ. Дәнекерлеуде және қыздыру шамдарын толтыруда қолданылады.'
    }
  },
  K: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹', electronShells: '2, 8, 8, 1', oxidationStates: '+1', meltingPoint: '63.38 °C', boilingPoint: '759 °C', density: '0.862 г/см³', discoveryYear: '1807' },
    descriptions: {
      ru: 'Калий — мягкий щелочной металл, необходимый для жизнедеятельности организма. Важен для работы нервной системы.',
      en: 'Potassium is a soft alkali metal essential for life. Important for nervous system function.',
      kk: 'Калий — тіршілік үшін қажетті жұмсақ сілтілік металл. Жүйке жүйесінің жұмысы үшін маңызды.'
    }
  },
  Ca: {
    base: { electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²', electronShells: '2, 8, 8, 2', oxidationStates: '+2', meltingPoint: '842 °C', boilingPoint: '1484 °C', density: '1.55 г/см³', discoveryYear: '1808' },
    descriptions: {
      ru: 'Кальций — щёлочноземельный металл, основа костей и зубов. Пятый по распространённости элемент в земной коре.',
      en: 'Calcium is an alkaline earth metal, the basis of bones and teeth. Fifth most abundant element in Earth\'s crust.',
      kk: 'Кальций — сүйектер мен тістердің негізі болатын сілтілі-жер металы. Жер қыртысында бесінші ең көп таралған элемент.'
    }
  },
  Sc: {
    base: { electronConfiguration: '[Ar] 3d¹ 4s²', electronShells: '2, 8, 9, 2', oxidationStates: '+3', meltingPoint: '1541 °C', boilingPoint: '2836 °C', density: '2.989 г/см³', discoveryYear: '1879' },
    descriptions: {
      ru: 'Скандий — лёгкий переходный металл. Используется в алюминиевых сплавах для аэрокосмической промышленности.',
      en: 'Scandium is a light transition metal. Used in aluminum alloys for the aerospace industry.',
      kk: 'Скандий — жеңіл өтпелі металл. Аэроғарыш өнеркәсібі үшін алюминий қорытпаларында қолданылады.'
    }
  },
  Ti: {
    base: { electronConfiguration: '[Ar] 3d² 4s²', electronShells: '2, 8, 10, 2', oxidationStates: '+2, +3, +4', meltingPoint: '1668 °C', boilingPoint: '3287 °C', density: '4.54 г/см³', discoveryYear: '1791' },
    descriptions: {
      ru: 'Титан — прочный, лёгкий и коррозионностойкий металл. Широко применяется в авиации и медицине.',
      en: 'Titanium is a strong, lightweight, and corrosion-resistant metal. Widely used in aviation and medicine.',
      kk: 'Титан — берік, жеңіл және коррозияға төзімді металл. Авиацияда және медицинада кеңінен қолданылады.'
    }
  },
  V: {
    base: { electronConfiguration: '[Ar] 3d³ 4s²', electronShells: '2, 8, 11, 2', oxidationStates: '+2, +3, +4, +5', meltingPoint: '1910 °C', boilingPoint: '3407 °C', density: '6.11 г/см³', discoveryYear: '1801' },
    descriptions: {
      ru: 'Ванадий — переходный металл, используемый для упрочнения стали. Названо в честь скандинавской богини Ванадис.',
      en: 'Vanadium is a transition metal used to strengthen steel. Named after the Scandinavian goddess Vanadis.',
      kk: 'Ванадий — болатты нығайту үшін қолданылатын өтпелі металл. Скандинавия құдайы Ванадистің құрметіне аталған.'
    }
  },
  Cr: {
    base: { electronConfiguration: '[Ar] 3d⁵ 4s¹', electronShells: '2, 8, 13, 1', oxidationStates: '+2, +3, +6', meltingPoint: '1907 °C', boilingPoint: '2671 °C', density: '7.15 г/см³', discoveryYear: '1797' },
    descriptions: {
      ru: 'Хром — блестящий переходный металл. Используется для хромирования и в производстве нержавеющей стали.',
      en: 'Chromium is a lustrous transition metal. Used for chrome plating and stainless steel production.',
      kk: 'Хром — жылтыр өтпелі металл. Хромдау және тот баспайтын болат өндірісінде қолданылады.'
    }
  },
  Mn: {
    base: { electronConfiguration: '[Ar] 3d⁵ 4s²', electronShells: '2, 8, 13, 2', oxidationStates: '+2, +3, +4, +7', meltingPoint: '1246 °C', boilingPoint: '2061 °C', density: '7.44 г/см³', discoveryYear: '1774' },
    descriptions: {
      ru: 'Марганец — переходный металл, необходимый для производства стали. Важен в биологических процессах.',
      en: 'Manganese is a transition metal essential for steel production. Important in biological processes.',
      kk: 'Марганец — болат өндірісі үшін қажетті өтпелі металл. Биологиялық процестерде маңызды.'
    }
  },
  Fe: {
    base: { electronConfiguration: '[Ar] 3d⁶ 4s²', electronShells: '2, 8, 14, 2', oxidationStates: '+2, +3', meltingPoint: '1538 °C', boilingPoint: '2862 °C', density: '7.874 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Железо — самый используемый металл на Земле. Основа стали, необходим для переноса кислорода в крови (гемоглобин).',
      en: 'Iron is the most used metal on Earth. The basis of steel, essential for oxygen transport in blood (hemoglobin).',
      kk: 'Темір — Жерде ең көп қолданылатын металл. Болаттың негізі, қандағы оттегі тасымалы үшін қажет (гемоглобин).'
    }
  },
  Co: {
    base: { electronConfiguration: '[Ar] 3d⁷ 4s²', electronShells: '2, 8, 15, 2', oxidationStates: '+2, +3', meltingPoint: '1495 °C', boilingPoint: '2927 °C', density: '8.90 г/см³', discoveryYear: '1735' },
    descriptions: {
      ru: 'Кобальт — переходный металл синеватого оттенка. Используется в сплавах, магнитах и литий-ионных батареях.',
      en: 'Cobalt is a transition metal with a bluish tint. Used in alloys, magnets, and lithium-ion batteries.',
      kk: 'Кобальт — көкшіл реңді өтпелі металл. Қорытпаларда, магниттерде және литий-ионды батареяларда қолданылады.'
    }
  },
  Ni: {
    base: { electronConfiguration: '[Ar] 3d⁸ 4s²', electronShells: '2, 8, 16, 2', oxidationStates: '+2, +3', meltingPoint: '1455 °C', boilingPoint: '2913 °C', density: '8.912 г/см³', discoveryYear: '1751' },
    descriptions: {
      ru: 'Никель — серебристо-белый металл, устойчивый к коррозии. Широко используется в монетах и нержавеющей стали.',
      en: 'Nickel is a silvery-white corrosion-resistant metal. Widely used in coins and stainless steel.',
      kk: 'Никель — коррозияға төзімді күміс-ақ металл. Монеталарда және тот баспайтын болатта кеңінен қолданылады.'
    }
  },
  Cu: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s¹', electronShells: '2, 8, 18, 1', oxidationStates: '+1, +2', meltingPoint: '1084.62 °C', boilingPoint: '2562 °C', density: '8.96 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Медь — один из первых металлов, освоенных человеком. Отличный проводник тепла и электричества.',
      en: 'Copper is one of the first metals used by humans. An excellent conductor of heat and electricity.',
      kk: 'Мыс — адам игерген алғашқы металдардың бірі. Жылу мен электр тогының тамаша өткізгіші.'
    }
  },
  Zn: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s²', electronShells: '2, 8, 18, 2', oxidationStates: '+2', meltingPoint: '419.53 °C', boilingPoint: '907 °C', density: '7.134 г/см³', discoveryYear: '1746' },
    descriptions: {
      ru: 'Цинк — голубовато-белый металл, используемый для оцинковки стали. Важный микроэлемент для организма.',
      en: 'Zinc is a bluish-white metal used for galvanizing steel. An important trace element for the body.',
      kk: 'Мырыш — болатты мырыштау үшін қолданылатын көкшіл-ақ металл. Ағза үшін маңызды микроэлемент.'
    }
  },
  Ga: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', electronShells: '2, 8, 18, 3', oxidationStates: '+3', meltingPoint: '29.76 °C', boilingPoint: '2204 °C', density: '5.907 г/см³', discoveryYear: '1875' },
    descriptions: {
      ru: 'Галлий — мягкий металл, плавящийся от тепла руки. Используется в полупроводниках и светодиодах.',
      en: 'Gallium is a soft metal that melts from body heat. Used in semiconductors and LEDs.',
      kk: 'Галлий — қол жылуынан еритін жұмсақ металл. Жартылай өткізгіштерде және жарық диодтарында қолданылады.'
    }
  },
  Ge: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', electronShells: '2, 8, 18, 4', oxidationStates: '+2, +4', meltingPoint: '938.25 °C', boilingPoint: '2833 °C', density: '5.323 г/см³', discoveryYear: '1886' },
    descriptions: {
      ru: 'Германий — полупроводник, использовавшийся в первых транзисторах. Применяется в оптоволокне и инфракрасной оптике.',
      en: 'Germanium is a semiconductor used in early transistors. Applied in fiber optics and infrared optics.',
      kk: 'Германий — алғашқы транзисторларда қолданылған жартылай өткізгіш. Оптикалық талшықта және инфрақызыл оптикада қолданылады.'
    }
  },
  As: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', electronShells: '2, 8, 18, 5', oxidationStates: '-3, +3, +5', meltingPoint: '817 °C', boilingPoint: '614 °C (возг.)', density: '5.776 г/см³', discoveryYear: '~1250' },
    descriptions: {
      ru: 'Мышьяк — ядовитый полуметалл, известный с древности. Используется в полупроводниках (GaAs) и пестицидах.',
      en: 'Arsenic is a poisonous metalloid known since antiquity. Used in semiconductors (GaAs) and pesticides.',
      kk: 'Мышьяк — ежелден белгілі улы жартылай металл. Жартылай өткізгіштерде (GaAs) және пестицидтерде қолданылады.'
    }
  },
  Se: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', electronShells: '2, 8, 18, 6', oxidationStates: '-2, +4, +6', meltingPoint: '221 °C', boilingPoint: '685 °C', density: '4.809 г/см³', discoveryYear: '1817' },
    descriptions: {
      ru: 'Селен — неметалл с фотоэлектрическими свойствами. Важный микроэлемент, используется в электронике.',
      en: 'Selenium is a nonmetal with photoelectric properties. An important trace element, used in electronics.',
      kk: 'Селен — фотоэлектрлік қасиеттері бар бейметалл. Маңызды микроэлемент, электроникада қолданылады.'
    }
  },
  Br: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', electronShells: '2, 8, 18, 7', oxidationStates: '-1, +1, +3, +5', meltingPoint: '-7.2 °C', boilingPoint: '58.8 °C', density: '3.122 г/см³', discoveryYear: '1826' },
    descriptions: {
      ru: 'Бром — единственный неметалл, жидкий при комнатной температуре. Тёмно-красная жидкость с резким запахом.',
      en: 'Bromine is the only nonmetal liquid at room temperature. A dark-red liquid with a pungent smell.',
      kk: 'Бром — бөлме температурасында сұйық жалғыз бейметалл. Өткір иісті қою қызыл сұйықтық.'
    }
  },
  Kr: {
    base: { electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', electronShells: '2, 8, 18, 8', oxidationStates: '0, +2', meltingPoint: '-157.36 °C', boilingPoint: '-153.22 °C', density: '0.003733 г/см³', discoveryYear: '1898' },
    descriptions: {
      ru: 'Криптон — инертный газ, используемый в фотографических вспышках и некоторых лазерах.',
      en: 'Krypton is a noble gas used in photographic flashes and some lasers.',
      kk: 'Криптон — фотографиялық жарқылдарда және кейбір лазерлерде қолданылатын инертті газ.'
    }
  },
  Rb: {
    base: { electronConfiguration: '[Kr] 5s¹', electronShells: '2, 8, 18, 8, 1', oxidationStates: '+1', meltingPoint: '39.31 °C', boilingPoint: '688 °C', density: '1.532 г/см³', discoveryYear: '1861' },
    descriptions: {
      ru: 'Рубидий — мягкий щелочной металл, воспламеняющийся на воздухе. Используется в атомных часах.',
      en: 'Rubidium is a soft alkali metal that ignites in air. Used in atomic clocks.',
      kk: 'Рубидий — ауада тұтанатын жұмсақ сілтілік металл. Атомдық сағаттарда қолданылады.'
    }
  },
  Sr: {
    base: { electronConfiguration: '[Kr] 5s²', electronShells: '2, 8, 18, 8, 2', oxidationStates: '+2', meltingPoint: '777 °C', boilingPoint: '1382 °C', density: '2.64 г/см³', discoveryYear: '1790' },
    descriptions: {
      ru: 'Стронций — щёлочноземельный металл, окрашивающий пламя в красный цвет. Используется в фейерверках.',
      en: 'Strontium is an alkaline earth metal that colors flames red. Used in fireworks.',
      kk: 'Стронций — жалынды қызыл түске бояйтын сілтілі-жер металы. Фейерверктерде қолданылады.'
    }
  },
  Y: {
    base: { electronConfiguration: '[Kr] 4d¹ 5s²', electronShells: '2, 8, 18, 9, 2', oxidationStates: '+3', meltingPoint: '1522 °C', boilingPoint: '3345 °C', density: '4.469 г/см³', discoveryYear: '1794' },
    descriptions: {
      ru: 'Иттрий — переходный металл, используемый в светодиодах и сверхпроводниках.',
      en: 'Yttrium is a transition metal used in LEDs and superconductors.',
      kk: 'Иттрий — жарық диодтарында және асаөткізгіштерде қолданылатын өтпелі металл.'
    }
  },
  Zr: {
    base: { electronConfiguration: '[Kr] 4d² 5s²', electronShells: '2, 8, 18, 10, 2', oxidationStates: '+4', meltingPoint: '1855 °C', boilingPoint: '4409 °C', density: '6.506 г/см³', discoveryYear: '1789' },
    descriptions: {
      ru: 'Цирконий — коррозионностойкий металл, широко применяемый в ядерной энергетике и медицинских имплантах.',
      en: 'Zirconium is a corrosion-resistant metal widely used in nuclear energy and medical implants.',
      kk: 'Цирконий — ядролық энергетикада және медициналық имплантаттарда кеңінен қолданылатын коррозияға төзімді металл.'
    }
  },
  Nb: {
    base: { electronConfiguration: '[Kr] 4d⁴ 5s¹', electronShells: '2, 8, 18, 12, 1', oxidationStates: '+3, +5', meltingPoint: '2477 °C', boilingPoint: '4744 °C', density: '8.57 г/см³', discoveryYear: '1801' },
    descriptions: {
      ru: 'Ниобий — переходный металл, используемый в сверхпроводящих магнитах и жаропрочных сплавах.',
      en: 'Niobium is a transition metal used in superconducting magnets and heat-resistant alloys.',
      kk: 'Ниобий — асаөткізгіш магниттерде және ыстыққа төзімді қорытпаларда қолданылатын өтпелі металл.'
    }
  },
  Mo: {
    base: { electronConfiguration: '[Kr] 4d⁵ 5s¹', electronShells: '2, 8, 18, 13, 1', oxidationStates: '+4, +6', meltingPoint: '2623 °C', boilingPoint: '4639 °C', density: '10.22 г/см³', discoveryYear: '1781' },
    descriptions: {
      ru: 'Молибден — тугоплавкий металл, используемый в высокопрочных сталях и катализаторах.',
      en: 'Molybdenum is a refractory metal used in high-strength steels and catalysts.',
      kk: 'Молибден — жоғары берік болаттарда және катализаторларда қолданылатын қиын балқитын металл.'
    }
  },
  Tc: {
    base: { electronConfiguration: '[Kr] 4d⁵ 5s²', electronShells: '2, 8, 18, 13, 2', oxidationStates: '+4, +7', meltingPoint: '2157 °C', boilingPoint: '4265 °C', density: '11.5 г/см³', discoveryYear: '1937' },
    descriptions: {
      ru: 'Технеций — первый искусственно полученный элемент. Все его изотопы радиоактивны. Используется в медицинской диагностике.',
      en: 'Technetium is the first artificially produced element. All its isotopes are radioactive. Used in medical diagnostics.',
      kk: 'Технеций — алғашқы жасанды алынған элемент. Барлық изотоптары радиоактивті. Медициналық диагностикада қолданылады.'
    }
  },
  Ru: {
    base: { electronConfiguration: '[Kr] 4d⁷ 5s¹', electronShells: '2, 8, 18, 15, 1', oxidationStates: '+3, +4', meltingPoint: '2334 °C', boilingPoint: '4150 °C', density: '12.37 г/см³', discoveryYear: '1844' },
    descriptions: {
      ru: 'Рутений — редкий переходный металл платиновой группы. Используется в электронике и катализе.',
      en: 'Ruthenium is a rare platinum group transition metal. Used in electronics and catalysis.',
      kk: 'Рутений — платина тобының сирек өтпелі металы. Электроникада және катализде қолданылады.'
    }
  },
  Rh: {
    base: { electronConfiguration: '[Kr] 4d⁸ 5s¹', electronShells: '2, 8, 18, 16, 1', oxidationStates: '+3', meltingPoint: '1964 °C', boilingPoint: '3695 °C', density: '12.41 г/см³', discoveryYear: '1803' },
    descriptions: {
      ru: 'Родий — редкий и дорогой металл. Используется в каталитических нейтрализаторах автомобилей.',
      en: 'Rhodium is a rare and expensive metal. Used in automotive catalytic converters.',
      kk: 'Родий — сирек және қымбат металл. Автомобильдердің каталитикалық нейтрализаторларында қолданылады.'
    }
  },
  Pd: {
    base: { electronConfiguration: '[Kr] 4d¹⁰', electronShells: '2, 8, 18, 18', oxidationStates: '+2, +4', meltingPoint: '1554.9 °C', boilingPoint: '2963 °C', density: '12.02 г/см³', discoveryYear: '1803' },
    descriptions: {
      ru: 'Палладий — драгоценный металл, поглощающий водород. Используется в каталитических конвертерах и электронике.',
      en: 'Palladium is a precious metal that absorbs hydrogen. Used in catalytic converters and electronics.',
      kk: 'Палладий — сутегіні сіңіретін бағалы металл. Каталитикалық конвертерлерде және электроникада қолданылады.'
    }
  },
  Ag: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s¹', electronShells: '2, 8, 18, 18, 1', oxidationStates: '+1', meltingPoint: '961.78 °C', boilingPoint: '2162 °C', density: '10.501 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Серебро — благородный металл с наивысшей электро- и теплопроводностью. Используется в ювелирном деле и электронике.',
      en: 'Silver is a noble metal with the highest electrical and thermal conductivity. Used in jewelry and electronics.',
      kk: 'Күміс — ең жоғары электр және жылу өткізгіштігі бар асыл металл. Зергерлік бұйымдарда және электроникада қолданылады.'
    }
  },
  Cd: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s²', electronShells: '2, 8, 18, 18, 2', oxidationStates: '+2', meltingPoint: '321.07 °C', boilingPoint: '767 °C', density: '8.69 г/см³', discoveryYear: '1817' },
    descriptions: {
      ru: 'Кадмий — токсичный тяжёлый металл. Ранее использовался в батареях, сейчас его применение ограничивается.',
      en: 'Cadmium is a toxic heavy metal. Previously used in batteries, its use is now being restricted.',
      kk: 'Кадмий — улы ауыр металл. Бұрын батареяларда қолданылған, қазір қолданылуы шектелуде.'
    }
  },
  In: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', electronShells: '2, 8, 18, 18, 3', oxidationStates: '+3', meltingPoint: '156.60 °C', boilingPoint: '2072 °C', density: '7.31 г/см³', discoveryYear: '1863' },
    descriptions: {
      ru: 'Индий — мягкий металл, используемый в сенсорных экранах (ITO) и полупроводниках.',
      en: 'Indium is a soft metal used in touchscreens (ITO) and semiconductors.',
      kk: 'Индий — сенсорлы экрандарда (ITO) және жартылай өткізгіштерде қолданылатын жұмсақ металл.'
    }
  },
  Sn: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', electronShells: '2, 8, 18, 18, 4', oxidationStates: '+2, +4', meltingPoint: '231.93 °C', boilingPoint: '2602 °C', density: '7.287 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Олово — мягкий металл, используемый в припоях и консервных банках. Известен с бронзового века.',
      en: 'Tin is a soft metal used in solders and tin cans. Known since the Bronze Age.',
      kk: 'Қалайы — дәнекерлерде және консерві банкаларда қолданылатын жұмсақ металл. Қола дәуірінен белгілі.'
    }
  },
  Sb: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', electronShells: '2, 8, 18, 18, 5', oxidationStates: '-3, +3, +5', meltingPoint: '630.63 °C', boilingPoint: '1587 °C', density: '6.685 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Сурьма — полуметалл, используемый в сплавах для повышения твёрдости и в антипиренах.',
      en: 'Antimony is a metalloid used in alloys to increase hardness and in flame retardants.',
      kk: 'Сурьма — қаттылықты арттыру үшін қорытпаларда және отқа төзімді заттарда қолданылатын жартылай металл.'
    }
  },
  Te: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', electronShells: '2, 8, 18, 18, 6', oxidationStates: '-2, +4, +6', meltingPoint: '449.51 °C', boilingPoint: '988 °C', density: '6.232 г/см³', discoveryYear: '1783' },
    descriptions: {
      ru: 'Теллур — редкий полуметалл, используемый в солнечных панелях и термоэлектрических устройствах.',
      en: 'Tellurium is a rare metalloid used in solar panels and thermoelectric devices.',
      kk: 'Теллур — күн панельдерінде және термоэлектрлік құрылғыларда қолданылатын сирек жартылай металл.'
    }
  },
  I: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', electronShells: '2, 8, 18, 18, 7', oxidationStates: '-1, +1, +5, +7', meltingPoint: '113.7 °C', boilingPoint: '184.3 °C', density: '4.93 г/см³', discoveryYear: '1811' },
    descriptions: {
      ru: 'Йод — галоген, необходимый для работы щитовидной железы. Тёмно-фиолетовые кристаллы с характерным запахом.',
      en: 'Iodine is a halogen essential for thyroid function. Dark-violet crystals with a characteristic smell.',
      kk: 'Йод — қалқанша безінің жұмысы үшін қажетті галоген. Тән иісі бар қою күлгін кристалдар.'
    }
  },
  Xe: {
    base: { electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', electronShells: '2, 8, 18, 18, 8', oxidationStates: '0, +2, +4, +6', meltingPoint: '-111.75 °C', boilingPoint: '-108.09 °C', density: '0.005887 г/см³', discoveryYear: '1898' },
    descriptions: {
      ru: 'Ксенон — инертный газ, способный образовывать соединения. Используется в фарах автомобилей и анестезии.',
      en: 'Xenon is a noble gas capable of forming compounds. Used in car headlights and anesthesia.',
      kk: 'Ксенон — қосылыстар түзе алатын инертті газ. Автомобиль фараларында және анестезияда қолданылады.'
    }
  },
  Cs: {
    base: { electronConfiguration: '[Xe] 6s¹', electronShells: '2, 8, 18, 18, 8, 1', oxidationStates: '+1', meltingPoint: '28.44 °C', boilingPoint: '671 °C', density: '1.873 г/см³', discoveryYear: '1860' },
    descriptions: {
      ru: 'Цезий — самый электроположительный стабильный элемент. Плавится от тепла руки. Используется в атомных часах.',
      en: 'Cesium is the most electropositive stable element. Melts from body heat. Used in atomic clocks.',
      kk: 'Цезий — ең электроположительті тұрақты элемент. Қол жылуынан ериді. Атомдық сағаттарда қолданылады.'
    }
  },
  Ba: {
    base: { electronConfiguration: '[Xe] 6s²', electronShells: '2, 8, 18, 18, 8, 2', oxidationStates: '+2', meltingPoint: '727 °C', boilingPoint: '1897 °C', density: '3.594 г/см³', discoveryYear: '1808' },
    descriptions: {
      ru: 'Барий — щёлочноземельный металл, окрашивающий пламя в зелёный цвет. Используется в рентгенодиагностике.',
      en: 'Barium is an alkaline earth metal that colors flames green. Used in X-ray diagnostics.',
      kk: 'Барий — жалынды жасыл түске бояйтын сілтілі-жер металы. Рентген диагностикасында қолданылады.'
    }
  },
  La: {
    base: { electronConfiguration: '[Xe] 5d¹ 6s²', electronShells: '2, 8, 18, 18, 9, 2', oxidationStates: '+3', meltingPoint: '920 °C', boilingPoint: '3464 °C', density: '6.145 г/см³', discoveryYear: '1839' },
    descriptions: {
      ru: 'Лантан — мягкий серебристый металл, давший название серии лантаноидов. Используется в оптике и катализаторах.',
      en: 'Lanthanum is a soft silvery metal that gave its name to the lanthanide series. Used in optics and catalysts.',
      kk: 'Лантан — лантаноидтар сериясына атын берген жұмсақ күмістей металл. Оптикада және катализаторларда қолданылады.'
    }
  },
  Ce: {
    base: { electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', electronShells: '2, 8, 18, 19, 9, 2', oxidationStates: '+3, +4', meltingPoint: '798 °C', boilingPoint: '3443 °C', density: '6.770 г/см³', discoveryYear: '1803' },
    descriptions: {
      ru: 'Церий — самый распространённый лантаноид. Используется в катализаторах, полировке стекла и зажигалках.',
      en: 'Cerium is the most abundant lanthanide. Used in catalysts, glass polishing, and lighters.',
      kk: 'Церий — ең көп таралған лантаноид. Катализаторларда, шыны жылтыратуда және тұтанғыштарда қолданылады.'
    }
  },
  Pr: {
    base: { electronConfiguration: '[Xe] 4f³ 6s²', electronShells: '2, 8, 18, 21, 8, 2', oxidationStates: '+3', meltingPoint: '931 °C', boilingPoint: '3520 °C', density: '6.773 г/см³', discoveryYear: '1885' },
    descriptions: {
      ru: 'Празеодим — лантаноид, придающий стеклу зелёный цвет. Используется в магнитах и лазерах.',
      en: 'Praseodymium is a lanthanide that gives glass a green color. Used in magnets and lasers.',
      kk: 'Празеодим — шыныға жасыл түс беретін лантаноид. Магниттерде және лазерлерде қолданылады.'
    }
  },
  Nd: {
    base: { electronConfiguration: '[Xe] 4f⁴ 6s²', electronShells: '2, 8, 18, 22, 8, 2', oxidationStates: '+3', meltingPoint: '1016 °C', boilingPoint: '3074 °C', density: '7.007 г/см³', discoveryYear: '1885' },
    descriptions: {
      ru: 'Неодим — лантаноид, из которого делают самые мощные постоянные магниты (NdFeB).',
      en: 'Neodymium is a lanthanide used to make the strongest permanent magnets (NdFeB).',
      kk: 'Неодим — ең қуатты тұрақты магниттер (NdFeB) жасалатын лантаноид.'
    }
  },
  Pm: {
    base: { electronConfiguration: '[Xe] 4f⁵ 6s²', electronShells: '2, 8, 18, 23, 8, 2', oxidationStates: '+3', meltingPoint: '1042 °C', boilingPoint: '3000 °C', density: '7.26 г/см³', discoveryYear: '1945' },
    descriptions: {
      ru: 'Прометий — единственный лантаноид без стабильных изотопов. Используется в атомных батареях.',
      en: 'Promethium is the only lanthanide without stable isotopes. Used in nuclear batteries.',
      kk: 'Прометий — тұрақты изотоптары жоқ жалғыз лантаноид. Атомдық батареяларда қолданылады.'
    }
  },
  Sm: {
    base: { electronConfiguration: '[Xe] 4f⁶ 6s²', electronShells: '2, 8, 18, 24, 8, 2', oxidationStates: '+2, +3', meltingPoint: '1072 °C', boilingPoint: '1794 °C', density: '7.52 г/см³', discoveryYear: '1879' },
    descriptions: {
      ru: 'Самарий — лантаноид, используемый в мощных магнитах (SmCo) и ядерных реакторах.',
      en: 'Samarium is a lanthanide used in powerful magnets (SmCo) and nuclear reactors.',
      kk: 'Самарий — қуатты магниттерде (SmCo) және ядролық реакторларда қолданылатын лантаноид.'
    }
  },
  Eu: {
    base: { electronConfiguration: '[Xe] 4f⁷ 6s²', electronShells: '2, 8, 18, 25, 8, 2', oxidationStates: '+2, +3', meltingPoint: '822 °C', boilingPoint: '1529 °C', density: '5.243 г/см³', discoveryYear: '1901' },
    descriptions: {
      ru: 'Европий — лантаноид, используемый в люминофорах для телевизоров и банкнот (защита от подделки).',
      en: 'Europium is a lanthanide used in phosphors for TVs and banknotes (anti-counterfeiting).',
      kk: 'Европий — теледидарлар мен банкноттар үшін люминофорларда (жалғандыққа қарсы) қолданылатын лантаноид.'
    }
  },
  Gd: {
    base: { electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', electronShells: '2, 8, 18, 25, 9, 2', oxidationStates: '+3', meltingPoint: '1313 °C', boilingPoint: '3273 °C', density: '7.895 г/см³', discoveryYear: '1880' },
    descriptions: {
      ru: 'Гадолиний — лантаноид с уникальными магнитными свойствами. Используется как контрастное вещество в МРТ.',
      en: 'Gadolinium is a lanthanide with unique magnetic properties. Used as a contrast agent in MRI.',
      kk: 'Гадолиний — бірегей магниттік қасиеттері бар лантаноид. МРТ-да контрастты зат ретінде қолданылады.'
    }
  },
  Tb: {
    base: { electronConfiguration: '[Xe] 4f⁹ 6s²', electronShells: '2, 8, 18, 27, 8, 2', oxidationStates: '+3, +4', meltingPoint: '1356 °C', boilingPoint: '3230 °C', density: '8.229 г/см³', discoveryYear: '1843' },
    descriptions: {
      ru: 'Тербий — лантаноид, используемый в зелёных люминофорах и магнитострикционных сплавах.',
      en: 'Terbium is a lanthanide used in green phosphors and magnetostrictive alloys.',
      kk: 'Тербий — жасыл люминофорларда және магнитострикциялық қорытпаларда қолданылатын лантаноид.'
    }
  },
  Dy: {
    base: { electronConfiguration: '[Xe] 4f¹⁰ 6s²', electronShells: '2, 8, 18, 28, 8, 2', oxidationStates: '+3', meltingPoint: '1412 °C', boilingPoint: '2567 °C', density: '8.55 г/см³', discoveryYear: '1886' },
    descriptions: {
      ru: 'Диспрозий — лантаноид, используемый в неодимовых магнитах для повышения термостойкости.',
      en: 'Dysprosium is a lanthanide used in neodymium magnets to improve heat resistance.',
      kk: 'Диспрозий — неодим магниттерінде ыстыққа төзімділікті арттыру үшін қолданылатын лантаноид.'
    }
  },
  Ho: {
    base: { electronConfiguration: '[Xe] 4f¹¹ 6s²', electronShells: '2, 8, 18, 29, 8, 2', oxidationStates: '+3', meltingPoint: '1474 °C', boilingPoint: '2700 °C', density: '8.795 г/см³', discoveryYear: '1878' },
    descriptions: {
      ru: 'Гольмий — лантаноид с наивысшим магнитным моментом. Используется в лазерах и ядерных реакторах.',
      en: 'Holmium is a lanthanide with the highest magnetic moment. Used in lasers and nuclear reactors.',
      kk: 'Гольмий — ең жоғары магниттік моменті бар лантаноид. Лазерлерде және ядролық реакторларда қолданылады.'
    }
  },
  Er: {
    base: { electronConfiguration: '[Xe] 4f¹² 6s²', electronShells: '2, 8, 18, 30, 8, 2', oxidationStates: '+3', meltingPoint: '1529 °C', boilingPoint: '2868 °C', density: '9.066 г/см³', discoveryYear: '1842' },
    descriptions: {
      ru: 'Эрбий — лантаноид розового цвета, используемый в оптоволоконных усилителях и лазерах.',
      en: 'Erbium is a pink-colored lanthanide used in fiber optic amplifiers and lasers.',
      kk: 'Эрбий — оптикалық талшық күшейткіштерде және лазерлерде қолданылатын қызғылт түсті лантаноид.'
    }
  },
  Tm: {
    base: { electronConfiguration: '[Xe] 4f¹³ 6s²', electronShells: '2, 8, 18, 31, 8, 2', oxidationStates: '+3', meltingPoint: '1545 °C', boilingPoint: '1950 °C', density: '9.321 г/см³', discoveryYear: '1879' },
    descriptions: {
      ru: 'Тулий — наименее распространённый лантаноид (кроме прометия). Используется в портативных рентгеновских аппаратах.',
      en: 'Thulium is the least abundant lanthanide (except promethium). Used in portable X-ray devices.',
      kk: 'Тулий — ең аз таралған лантаноид (прометийден басқа). Портативті рентген аппараттарында қолданылады.'
    }
  },
  Yb: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 6s²', electronShells: '2, 8, 18, 32, 8, 2', oxidationStates: '+2, +3', meltingPoint: '819 °C', boilingPoint: '1196 °C', density: '6.965 г/см³', discoveryYear: '1878' },
    descriptions: {
      ru: 'Иттербий — мягкий лантаноид, используемый в лазерах и как легирующая добавка к стали.',
      en: 'Ytterbium is a soft lanthanide used in lasers and as an alloying additive to steel.',
      kk: 'Иттербий — лазерлерде және болатқа легирлеуші қоспа ретінде қолданылатын жұмсақ лантаноид.'
    }
  },
  Lu: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', electronShells: '2, 8, 18, 32, 9, 2', oxidationStates: '+3', meltingPoint: '1663 °C', boilingPoint: '3402 °C', density: '9.84 г/см³', discoveryYear: '1907' },
    descriptions: {
      ru: 'Лютеций — самый тяжёлый и твёрдый лантаноид. Используется в ПЭТ-сканерах и катализаторах.',
      en: 'Lutetium is the heaviest and hardest lanthanide. Used in PET scanners and catalysts.',
      kk: 'Лютеций — ең ауыр және қатты лантаноид. ПЭТ-сканерлерде және катализаторларда қолданылады.'
    }
  },
  Hf: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', electronShells: '2, 8, 18, 32, 10, 2', oxidationStates: '+4', meltingPoint: '2233 °C', boilingPoint: '4603 °C', density: '13.31 г/см³', discoveryYear: '1923' },
    descriptions: {
      ru: 'Гафний — тугоплавкий металл, используемый в ядерных реакторах и процессорах.',
      en: 'Hafnium is a refractory metal used in nuclear reactors and processors.',
      kk: 'Гафний — ядролық реакторларда және процессорларда қолданылатын қиын балқитын металл.'
    }
  },
  Ta: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', electronShells: '2, 8, 18, 32, 11, 2', oxidationStates: '+5', meltingPoint: '3017 °C', boilingPoint: '5458 °C', density: '16.654 г/см³', discoveryYear: '1802' },
    descriptions: {
      ru: 'Тантал — коррозионностойкий тугоплавкий металл. Используется в конденсаторах и хирургических имплантах.',
      en: 'Tantalum is a corrosion-resistant refractory metal. Used in capacitors and surgical implants.',
      kk: 'Тантал — коррозияға төзімді қиын балқитын металл. Конденсаторларда және хирургиялық имплантаттарда қолданылады.'
    }
  },
  W: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronShells: '2, 8, 18, 32, 12, 2', oxidationStates: '+4, +6', meltingPoint: '3422 °C', boilingPoint: '5555 °C', density: '19.25 г/см³', discoveryYear: '1783' },
    descriptions: {
      ru: 'Вольфрам — металл с самой высокой температурой плавления. Используется в лампах накаливания и твёрдых сплавах.',
      en: 'Tungsten is the metal with the highest melting point. Used in incandescent lamps and hard alloys.',
      kk: 'Вольфрам — ең жоғары балқу температурасы бар металл. Қыздыру шамдарында және қатты қорытпаларда қолданылады.'
    }
  },
  Re: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronShells: '2, 8, 18, 32, 13, 2', oxidationStates: '+4, +7', meltingPoint: '3186 °C', boilingPoint: '5596 °C', density: '21.02 г/см³', discoveryYear: '1925' },
    descriptions: {
      ru: 'Рений — один из самых тугоплавких и редких металлов. Используется в жаропрочных сплавах для турбин.',
      en: 'Rhenium is one of the most refractory and rare metals. Used in heat-resistant alloys for turbines.',
      kk: 'Рений — ең қиын балқитын және сирек металдардың бірі. Турбиналар үшін ыстыққа төзімді қорытпаларда қолданылады.'
    }
  },
  Os: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronShells: '2, 8, 18, 32, 14, 2', oxidationStates: '+3, +4, +8', meltingPoint: '3033 °C', boilingPoint: '5012 °C', density: '22.59 г/см³', discoveryYear: '1803' },
    descriptions: {
      ru: 'Осмий — самый плотный природный элемент. Голубовато-серебристый металл с резким запахом оксида.',
      en: 'Osmium is the densest naturally occurring element. A bluish-silver metal with a pungent oxide smell.',
      kk: 'Осмий — табиғаттағы ең тығыз элемент. Оксидінің өткір иісі бар көкшіл-күмістей металл.'
    }
  },
  Ir: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronShells: '2, 8, 18, 32, 15, 2', oxidationStates: '+3, +4', meltingPoint: '2446 °C', boilingPoint: '4428 °C', density: '22.56 г/см³', discoveryYear: '1803' },
    descriptions: {
      ru: 'Иридий — один из самых плотных и коррозионностойких металлов. Используется в свечах зажигания и стандартах мер.',
      en: 'Iridium is one of the densest and most corrosion-resistant metals. Used in spark plugs and measurement standards.',
      kk: 'Иридий — ең тығыз және коррозияға төзімді металдардың бірі. Оттық шамдарда және өлшем стандарттарында қолданылады.'
    }
  },
  Pt: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronShells: '2, 8, 18, 32, 17, 1', oxidationStates: '+2, +4', meltingPoint: '1768.3 °C', boilingPoint: '3825 °C', density: '21.46 г/см³', discoveryYear: '1735' },
    descriptions: {
      ru: 'Платина — драгоценный металл, используемый в ювелирном деле, катализаторах и медицине.',
      en: 'Platinum is a precious metal used in jewelry, catalysts, and medicine.',
      kk: 'Платина — зергерлік бұйымдарда, катализаторларда және медицинада қолданылатын бағалы металл.'
    }
  },
  Au: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronShells: '2, 8, 18, 32, 18, 1', oxidationStates: '+1, +3', meltingPoint: '1064.18 °C', boilingPoint: '2856 °C', density: '19.282 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Золото — драгоценный металл жёлтого цвета, символ богатства. Не окисляется и используется в электронике.',
      en: 'Gold is a yellow precious metal and symbol of wealth. Does not oxidize and is used in electronics.',
      kk: 'Алтын — байлықтың символы, сары түсті бағалы металл. Тотықпайды және электроникада қолданылады.'
    }
  },
  Hg: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronShells: '2, 8, 18, 32, 18, 2', oxidationStates: '+1, +2', meltingPoint: '-38.83 °C', boilingPoint: '356.73 °C', density: '13.5336 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Ртуть — единственный металл, жидкий при комнатной температуре. Токсична. Ранее использовалась в термометрах.',
      en: 'Mercury is the only metal liquid at room temperature. Toxic. Previously used in thermometers.',
      kk: 'Сынап — бөлме температурасында сұйық жалғыз металл. Улы. Бұрын термометрлерде қолданылған.'
    }
  },
  Tl: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronShells: '2, 8, 18, 32, 18, 3', oxidationStates: '+1, +3', meltingPoint: '304 °C', boilingPoint: '1473 °C', density: '11.85 г/см³', discoveryYear: '1861' },
    descriptions: {
      ru: 'Таллий — мягкий токсичный металл. Ранее использовался как яд для грызунов, сейчас — в электронике.',
      en: 'Thallium is a soft toxic metal. Previously used as rodent poison, now used in electronics.',
      kk: 'Таллий — жұмсақ улы металл. Бұрын кеміргіштерге қарсы у ретінде, қазір электроникада қолданылады.'
    }
  },
  Pb: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronShells: '2, 8, 18, 32, 18, 4', oxidationStates: '+2, +4', meltingPoint: '327.46 °C', boilingPoint: '1749 °C', density: '11.342 г/см³', discoveryYear: 'Древность' },
    descriptions: {
      ru: 'Свинец — мягкий тяжёлый металл, известный с древности. Используется в аккумуляторах и защите от радиации.',
      en: 'Lead is a soft heavy metal known since antiquity. Used in batteries and radiation shielding.',
      kk: 'Қорғасын — ежелден белгілі жұмсақ ауыр металл. Аккумуляторларда және радиациядан қорғауда қолданылады.'
    }
  },
  Bi: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronShells: '2, 8, 18, 32, 18, 5', oxidationStates: '+3, +5', meltingPoint: '271.40 °C', boilingPoint: '1564 °C', density: '9.807 г/см³', discoveryYear: '1753' },
    descriptions: {
      ru: 'Висмут — самый диамагнитный металл с радужными оксидными кристаллами. Используется в медицине и косметике.',
      en: 'Bismuth is the most diamagnetic metal with iridescent oxide crystals. Used in medicine and cosmetics.',
      kk: 'Висмут — кемпірқосақ тәрізді оксидті кристалдары бар ең диамагнитті металл. Медицинада және косметикада қолданылады.'
    }
  },
  Po: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronShells: '2, 8, 18, 32, 18, 6', oxidationStates: '+2, +4', meltingPoint: '254 °C', boilingPoint: '962 °C', density: '9.32 г/см³', discoveryYear: '1898' },
    descriptions: {
      ru: 'Полоний — высокорадиоактивный элемент, открытый Марией Кюри. Используется как источник альфа-излучения.',
      en: 'Polonium is a highly radioactive element discovered by Marie Curie. Used as an alpha radiation source.',
      kk: 'Полоний — Мария Кюри ашқан жоғары радиоактивті элемент. Альфа сәулелену көзі ретінде қолданылады.'
    }
  },
  At: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronShells: '2, 8, 18, 32, 18, 7', oxidationStates: '-1, +1, +3, +5', meltingPoint: '302 °C', boilingPoint: '337 °C', density: '~7 г/см³', discoveryYear: '1940' },
    descriptions: {
      ru: 'Астат — самый редкий природный элемент. Радиоактивный галоген, исследуется для лечения рака.',
      en: 'Astatine is the rarest naturally occurring element. A radioactive halogen studied for cancer treatment.',
      kk: 'Астат — табиғаттағы ең сирек элемент. Қатерлі ісікті емдеу үшін зерттелетін радиоактивті галоген.'
    }
  },
  Rn: {
    base: { electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronShells: '2, 8, 18, 32, 18, 8', oxidationStates: '0, +2', meltingPoint: '-71 °C', boilingPoint: '-61.7 °C', density: '0.00973 г/см³', discoveryYear: '1900' },
    descriptions: {
      ru: 'Радон — радиоактивный инертный газ, образующийся при распаде радия. Опасен при накоплении в помещениях.',
      en: 'Radon is a radioactive noble gas formed from radium decay. Dangerous when accumulated indoors.',
      kk: 'Радон — радийдің ыдырауынан пайда болатын радиоактивті инертті газ. Бөлмелерде жиналғанда қауіпті.'
    }
  },
  Fr: {
    base: { electronConfiguration: '[Rn] 7s¹', electronShells: '2, 8, 18, 32, 18, 8, 1', oxidationStates: '+1', meltingPoint: '27 °C', boilingPoint: '677 °C', density: '~1.87 г/см³', discoveryYear: '1939' },
    descriptions: {
      ru: 'Франций — самый нестабильный из первых 101 элемента. Самый электроположительный и редкий щелочной металл.',
      en: 'Francium is the most unstable of the first 101 elements. The most electropositive and rarest alkali metal.',
      kk: 'Франций — алғашқы 101 элементтің ішіндегі ең тұрақсызы. Ең электроположительті және сирек сілтілік металл.'
    }
  },
  Ra: {
    base: { electronConfiguration: '[Rn] 7s²', electronShells: '2, 8, 18, 32, 18, 8, 2', oxidationStates: '+2', meltingPoint: '700 °C', boilingPoint: '1737 °C', density: '5.5 г/см³', discoveryYear: '1898' },
    descriptions: {
      ru: 'Радий — радиоактивный металл, открытый Пьером и Марией Кюри. Светится в темноте из-за радиоактивности.',
      en: 'Radium is a radioactive metal discovered by Pierre and Marie Curie. Glows in the dark due to radioactivity.',
      kk: 'Радий — Пьер және Мария Кюри ашқан радиоактивті металл. Радиоактивтілігіне байланысты қараңғыда жарқырайды.'
    }
  },
  Ac: {
    base: { electronConfiguration: '[Rn] 6d¹ 7s²', electronShells: '2, 8, 18, 32, 18, 9, 2', oxidationStates: '+3', meltingPoint: '1050 °C', boilingPoint: '3200 °C', density: '10.07 г/см³', discoveryYear: '1899' },
    descriptions: {
      ru: 'Актиний — радиоактивный металл, давший название серии актиноидов. Светится голубым светом.',
      en: 'Actinium is a radioactive metal that gave its name to the actinide series. Glows with a blue light.',
      kk: 'Актиний — актиноидтар сериясына атын берген радиоактивті металл. Көк жарықпен жарқырайды.'
    }
  },
  Th: {
    base: { electronConfiguration: '[Rn] 6d² 7s²', electronShells: '2, 8, 18, 32, 18, 10, 2', oxidationStates: '+4', meltingPoint: '1750 °C', boilingPoint: '4788 °C', density: '11.72 г/см³', discoveryYear: '1829' },
    descriptions: {
      ru: 'Торий — слаборадиоактивный металл, рассматриваемый как альтернативное ядерное топливо.',
      en: 'Thorium is a weakly radioactive metal considered as an alternative nuclear fuel.',
      kk: 'Торий — баламалы ядролық отын ретінде қарастырылатын әлсіз радиоактивті металл.'
    }
  },
  Pa: {
    base: { electronConfiguration: '[Rn] 5f² 6d¹ 7s²', electronShells: '2, 8, 18, 32, 20, 9, 2', oxidationStates: '+4, +5', meltingPoint: '1572 °C', boilingPoint: '4000 °C', density: '15.37 г/см³', discoveryYear: '1913' },
    descriptions: {
      ru: 'Протактиний — редкий радиоактивный актиноид. Один из самых дорогих и редких природных элементов.',
      en: 'Protactinium is a rare radioactive actinide. One of the most expensive and rare natural elements.',
      kk: 'Протактиний — сирек радиоактивті актиноид. Ең қымбат және сирек табиғи элементтердің бірі.'
    }
  },
  U: {
    base: { electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', electronShells: '2, 8, 18, 32, 21, 9, 2', oxidationStates: '+3, +4, +5, +6', meltingPoint: '1135 °C', boilingPoint: '4131 °C', density: '18.95 г/см³', discoveryYear: '1789' },
    descriptions: {
      ru: 'Уран — тяжёлый радиоактивный металл, основное ядерное топливо. Используется в атомных электростанциях.',
      en: 'Uranium is a heavy radioactive metal and the primary nuclear fuel. Used in nuclear power plants.',
      kk: 'Уран — ауыр радиоактивті металл, негізгі ядролық отын. Атом электр станцияларында қолданылады.'
    }
  },
  Np: {
    base: { electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', electronShells: '2, 8, 18, 32, 22, 9, 2', oxidationStates: '+3, +4, +5', meltingPoint: '644 °C', boilingPoint: '3902 °C', density: '20.45 г/см³', discoveryYear: '1940' },
    descriptions: {
      ru: 'Нептуний — первый трансурановый элемент. Побочный продукт ядерных реакторов.',
      en: 'Neptunium is the first transuranic element. A byproduct of nuclear reactors.',
      kk: 'Нептуний — алғашқы трансуранды элемент. Ядролық реакторлардың жанама өнімі.'
    }
  },
  Pu: {
    base: { electronConfiguration: '[Rn] 5f⁶ 7s²', electronShells: '2, 8, 18, 32, 24, 8, 2', oxidationStates: '+3, +4, +5, +6', meltingPoint: '640 °C', boilingPoint: '3228 °C', density: '19.84 г/см³', discoveryYear: '1940' },
    descriptions: {
      ru: 'Плутоний — радиоактивный актиноид, используемый в ядерном оружии и как топливо для космических аппаратов.',
      en: 'Plutonium is a radioactive actinide used in nuclear weapons and as fuel for spacecraft.',
      kk: 'Плутоний — ядролық қаруда және ғарыш аппараттары үшін отын ретінде қолданылатын радиоактивті актиноид.'
    }
  },
  Am: {
    base: { electronConfiguration: '[Rn] 5f⁷ 7s²', electronShells: '2, 8, 18, 32, 25, 8, 2', oxidationStates: '+3, +4, +5, +6', meltingPoint: '1176 °C', boilingPoint: '2011 °C', density: '13.69 г/см³', discoveryYear: '1944' },
    descriptions: {
      ru: 'Америций — искусственный радиоактивный элемент. Используется в детекторах дыма.',
      en: 'Americium is a synthetic radioactive element. Used in smoke detectors.',
      kk: 'Америций — жасанды радиоактивті элемент. Түтін детекторларында қолданылады.'
    }
  },
  Cm: {
    base: { electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', electronShells: '2, 8, 18, 32, 25, 9, 2', oxidationStates: '+3', meltingPoint: '1345 °C', boilingPoint: '3110 °C', density: '13.51 г/см³', discoveryYear: '1944' },
    descriptions: {
      ru: 'Кюрий — радиоактивный актиноид, названный в честь Пьера и Марии Кюри. Используется в космических зондах.',
      en: 'Curium is a radioactive actinide named after Pierre and Marie Curie. Used in space probes.',
      kk: 'Кюрий — Пьер және Мария Кюри құрметіне аталған радиоактивті актиноид. Ғарыштық зондтарда қолданылады.'
    }
  },
  Bk: {
    base: { electronConfiguration: '[Rn] 5f⁹ 7s²', electronShells: '2, 8, 18, 32, 27, 8, 2', oxidationStates: '+3, +4', meltingPoint: '986 °C', boilingPoint: '~2627 °C', density: '14.79 г/см³', discoveryYear: '1949' },
    descriptions: {
      ru: 'Берклий — искусственный радиоактивный актиноид. Получен в Калифорнийском университете в Беркли.',
      en: 'Berkelium is a synthetic radioactive actinide. Produced at the University of California, Berkeley.',
      kk: 'Берклий — жасанды радиоактивті актиноид. Калифорния университетінде Берклиде алынған.'
    }
  },
  Cf: {
    base: { electronConfiguration: '[Rn] 5f¹⁰ 7s²', electronShells: '2, 8, 18, 32, 28, 8, 2', oxidationStates: '+3', meltingPoint: '900 °C', boilingPoint: '~1470 °C', density: '15.1 г/см³', discoveryYear: '1950' },
    descriptions: {
      ru: 'Калифорний — мощный источник нейтронов. Один из самых дорогих веществ на Земле.',
      en: 'Californium is a powerful neutron source. One of the most expensive substances on Earth.',
      kk: 'Калифорний — қуатты нейтрон көзі. Жердегі ең қымбат заттардың бірі.'
    }
  },
  Es: {
    base: { electronConfiguration: '[Rn] 5f¹¹ 7s²', electronShells: '2, 8, 18, 32, 29, 8, 2', oxidationStates: '+3', meltingPoint: '860 °C', boilingPoint: '~996 °C', density: '8.84 г/см³', discoveryYear: '1952' },
    descriptions: {
      ru: 'Эйнштейний — искусственный элемент, названный в честь Альберта Эйнштейна. Обнаружен в продуктах ядерного взрыва.',
      en: 'Einsteinium is a synthetic element named after Albert Einstein. Found in nuclear explosion debris.',
      kk: 'Эйнштейний — Альберт Эйнштейннің құрметіне аталған жасанды элемент. Ядролық жарылыс өнімдерінен табылған.'
    }
  },
  Fm: {
    base: { electronConfiguration: '[Rn] 5f¹² 7s²', electronShells: '2, 8, 18, 32, 30, 8, 2', oxidationStates: '+3', meltingPoint: '1527 °C', boilingPoint: 'н/д', density: 'н/д', discoveryYear: '1952' },
    descriptions: {
      ru: 'Фермий — искусственный радиоактивный элемент, названный в честь Энрико Ферми.',
      en: 'Fermium is a synthetic radioactive element named after Enrico Fermi.',
      kk: 'Фермий — Энрико Фермидің құрметіне аталған жасанды радиоактивті элемент.'
    }
  },
  Md: {
    base: { electronConfiguration: '[Rn] 5f¹³ 7s²', electronShells: '2, 8, 18, 32, 31, 8, 2', oxidationStates: '+2, +3', meltingPoint: '827 °C', boilingPoint: 'н/д', density: 'н/д', discoveryYear: '1955' },
    descriptions: {
      ru: 'Менделевий — элемент, названный в честь Дмитрия Менделеева, создателя периодической таблицы.',
      en: 'Mendelevium is an element named after Dmitri Mendeleev, creator of the periodic table.',
      kk: 'Менделевий — периодтық кестенің жасаушысы Дмитрий Менделеевтің құрметіне аталған элемент.'
    }
  },
  No: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 7s²', electronShells: '2, 8, 18, 32, 32, 8, 2', oxidationStates: '+2, +3', meltingPoint: '827 °C', boilingPoint: 'н/д', density: 'н/д', discoveryYear: '1958' },
    descriptions: {
      ru: 'Нобелий — искусственный радиоактивный элемент, названный в честь Альфреда Нобеля.',
      en: 'Nobelium is a synthetic radioactive element named after Alfred Nobel.',
      kk: 'Нобелий — Альфред Нобельдің құрметіне аталған жасанды радиоактивті элемент.'
    }
  },
  Lr: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', electronShells: '2, 8, 18, 32, 32, 8, 3', oxidationStates: '+3', meltingPoint: '1627 °C', boilingPoint: 'н/д', density: 'н/д', discoveryYear: '1961' },
    descriptions: {
      ru: 'Лоуренсий — последний актиноид, названный в честь Эрнеста Лоуренса, изобретателя циклотрона.',
      en: 'Lawrencium is the last actinide, named after Ernest Lawrence, inventor of the cyclotron.',
      kk: 'Лоуренсий — циклотронның ойлап табушысы Эрнест Лоуренстің құрметіне аталған соңғы актиноид.'
    }
  },
  Rf: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', electronShells: '2, 8, 18, 32, 32, 10, 2', oxidationStates: '+4', meltingPoint: '~2100 °C', boilingPoint: '~5500 °C', density: '~23.2 г/см³', discoveryYear: '1964' },
    descriptions: {
      ru: 'Резерфордий — первый трансактиноидный элемент. Назван в честь Эрнеста Резерфорда.',
      en: 'Rutherfordium is the first transactinide element. Named after Ernest Rutherford.',
      kk: 'Резерфордий — алғашқы трансактиноидты элемент. Эрнест Резерфордтың құрметіне аталған.'
    }
  },
  Db: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', electronShells: '2, 8, 18, 32, 32, 11, 2', oxidationStates: '+5', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~29.3 г/см³', discoveryYear: '1967' },
    descriptions: {
      ru: 'Дубний — искусственный элемент, названный в честь города Дубна, где расположен ОИЯИ.',
      en: 'Dubnium is a synthetic element named after the city of Dubna, home of JINR.',
      kk: 'Дубний — БЯАИ орналасқан Дубна қаласының құрметіне аталған жасанды элемент.'
    }
  },
  Sg: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronShells: '2, 8, 18, 32, 32, 12, 2', oxidationStates: '+6', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~35 г/см³', discoveryYear: '1974' },
    descriptions: {
      ru: 'Сиборгий — искусственный элемент, названный в честь Гленна Сиборга, первооткрывателя многих актиноидов.',
      en: 'Seaborgium is a synthetic element named after Glenn Seaborg, discoverer of many actinides.',
      kk: 'Сиборгий — көптеген актиноидтарды ашқан Гленн Сиборгтың құрметіне аталған жасанды элемент.'
    }
  },
  Bh: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronShells: '2, 8, 18, 32, 32, 13, 2', oxidationStates: '+7', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~37 г/см³', discoveryYear: '1981' },
    descriptions: {
      ru: 'Борий — искусственный элемент, названный в честь Нильса Бора. Крайне нестабилен.',
      en: 'Bohrium is a synthetic element named after Niels Bohr. Extremely unstable.',
      kk: 'Борий — Нильс Бордың құрметіне аталған жасанды элемент. Өте тұрақсыз.'
    }
  },
  Hs: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronShells: '2, 8, 18, 32, 32, 14, 2', oxidationStates: '+8', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~41 г/см³', discoveryYear: '1984' },
    descriptions: {
      ru: 'Хассий — искусственный элемент, названный в честь немецкой земли Гессен.',
      en: 'Hassium is a synthetic element named after the German state of Hesse.',
      kk: 'Хассий — неміс жері Гессеннің құрметіне аталған жасанды элемент.'
    }
  },
  Mt: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronShells: '2, 8, 18, 32, 32, 15, 2', oxidationStates: '+3, +4', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~37.4 г/см³', discoveryYear: '1982' },
    descriptions: {
      ru: 'Мейтнерий — элемент, названный в честь Лизе Мейтнер, одной из первооткрывателей ядерного деления.',
      en: 'Meitnerium is named after Lise Meitner, one of the discoverers of nuclear fission.',
      kk: 'Мейтнерий — ядролық бөлінудің ашушыларының бірі Лизе Мейтнердің құрметіне аталған.'
    }
  },
  Ds: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', electronShells: '2, 8, 18, 32, 32, 16, 2', oxidationStates: '+6', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~34.8 г/см³', discoveryYear: '1994' },
    descriptions: {
      ru: 'Дармштадтий — искусственный элемент, названный в честь города Дармштадт в Германии.',
      en: 'Darmstadtium is a synthetic element named after the city of Darmstadt in Germany.',
      kk: 'Дармштадтий — Германиядағы Дармштадт қаласының құрметіне аталған жасанды элемент.'
    }
  },
  Rg: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', electronShells: '2, 8, 18, 32, 32, 17, 2', oxidationStates: '+3, +5', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~28.7 г/см³', discoveryYear: '1994' },
    descriptions: {
      ru: 'Рентгений — элемент, названный в честь Вильгельма Рентгена, открывшего рентгеновские лучи.',
      en: 'Roentgenium is named after Wilhelm Röntgen, discoverer of X-rays.',
      kk: 'Рентгений — рентген сәулелерін ашқан Вильгельм Рентгеннің құрметіне аталған.'
    }
  },
  Cn: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronShells: '2, 8, 18, 32, 32, 18, 2', oxidationStates: '+2', meltingPoint: 'н/д', boilingPoint: '~80 °C', density: '~23.7 г/см³', discoveryYear: '1996' },
    descriptions: {
      ru: 'Коперниций — сверхтяжёлый элемент, названный в честь Николая Коперника.',
      en: 'Copernicium is a superheavy element named after Nicolaus Copernicus.',
      kk: 'Коперниций — Николай Коперниктің құрметіне аталған аса ауыр элемент.'
    }
  },
  Nh: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronShells: '2, 8, 18, 32, 32, 18, 3', oxidationStates: '+1', meltingPoint: '~430 °C', boilingPoint: '~1100 °C', density: '~16 г/см³', discoveryYear: '2003' },
    descriptions: {
      ru: 'Нихоний — сверхтяжёлый элемент, названный в честь Японии (Нихон). Синтезирован в институте RIKEN.',
      en: 'Nihonium is a superheavy element named after Japan (Nihon). Synthesized at RIKEN.',
      kk: 'Нихоний — Жапонияның (Нихон) құрметіне аталған аса ауыр элемент. RIKEN институтында синтезделген.'
    }
  },
  Fl: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronShells: '2, 8, 18, 32, 32, 18, 4', oxidationStates: '+2, +4', meltingPoint: '~70 °C', boilingPoint: '~150 °C', density: '~14 г/см³', discoveryYear: '1998' },
    descriptions: {
      ru: 'Флеровий — сверхтяжёлый элемент, названный в честь Лаборатории ядерных реакций им. Флёрова в ОИЯИ.',
      en: 'Flerovium is a superheavy element named after the Flerov Laboratory of Nuclear Reactions at JINR.',
      kk: 'Флеровий — БЯАИ-дегі Флёров атындағы ядролық реакциялар зертханасының құрметіне аталған аса ауыр элемент.'
    }
  },
  Mc: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronShells: '2, 8, 18, 32, 32, 18, 5', oxidationStates: '+1, +3', meltingPoint: '~400 °C', boilingPoint: '~1100 °C', density: '~13.5 г/см³', discoveryYear: '2003' },
    descriptions: {
      ru: 'Московий — сверхтяжёлый элемент, названный в честь Московской области.',
      en: 'Moscovium is a superheavy element named after Moscow Oblast.',
      kk: 'Московий — Мәскеу облысының құрметіне аталған аса ауыр элемент.'
    }
  },
  Lv: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronShells: '2, 8, 18, 32, 32, 18, 6', oxidationStates: '+2, +4', meltingPoint: '~420 °C', boilingPoint: '~800 °C', density: '~12.9 г/см³', discoveryYear: '2000' },
    descriptions: {
      ru: 'Ливерморий — сверхтяжёлый элемент, названный в честь Ливерморской национальной лаборатории.',
      en: 'Livermorium is a superheavy element named after Lawrence Livermore National Laboratory.',
      kk: 'Ливерморий — Ливермор ұлттық зертханасының құрметіне аталған аса ауыр элемент.'
    }
  },
  Ts: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronShells: '2, 8, 18, 32, 32, 18, 7', oxidationStates: '+1, +3, +5', meltingPoint: '~350 °C', boilingPoint: '~610 °C', density: '~7.2 г/см³', discoveryYear: '2009' },
    descriptions: {
      ru: 'Теннессин — сверхтяжёлый элемент, названный в честь штата Теннесси, США.',
      en: 'Tennessine is a superheavy element named after the state of Tennessee, USA.',
      kk: 'Теннессин — АҚШ-тың Теннесси штатының құрметіне аталған аса ауыр элемент.'
    }
  },
  Og: {
    base: { electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronShells: '2, 8, 18, 32, 32, 18, 8', oxidationStates: '0, +2, +4, +6', meltingPoint: 'н/д', boilingPoint: 'н/д', density: '~5.0 г/см³', discoveryYear: '2002' },
    descriptions: {
      ru: 'Оганесон — последний известный элемент. Назван в честь Юрия Оганесяна — единственный элемент, названный при жизни учёного.',
      en: 'Oganesson is the last known element. Named after Yuri Oganessian — the only element named after a living scientist.',
      kk: 'Оганесон — соңғы белгілі элемент. Юрий Оганесянның құрметіне аталған — тірі ғалымның атымен аталған жалғыз элемент.'
    }
  },
};

/**
 * Get element details from local fallback data (no AI needed)
 */
export function getElementDetailsFallback(
  symbol: string,
  language: 'ru' | 'en' | 'kk' = 'ru'
): DetailedElementData | null {
  const entry = ELEMENT_DETAILS_DATA[symbol];
  if (!entry) return null;

  return {
    ...entry.base,
    description: entry.descriptions[language] || entry.descriptions.ru,
  };
}

export { ELEMENT_DETAILS_DATA };
