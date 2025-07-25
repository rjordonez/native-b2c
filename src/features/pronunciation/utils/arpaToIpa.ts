/**
 * ARPABET to IPA conversion mapping
 * Based on Carnegie Mellon University Pronouncing Dictionary
 */

const ARPABET_TO_IPA: Record<string, string> = {
  // Vowels
  'AA': 'ɑ',    // father
  'AE': 'æ',    // cat
  'AH': 'ʌ',    // cut
  'AO': 'ɔ',    // caught
  'AW': 'aʊ',   // cow
  'AX': 'ə',    // about (schwa)
  'AY': 'aɪ',   // bite
  'EH': 'ɛ',    // bet
  'ER': 'ɚ',    // bird (r-colored)
  'EY': 'eɪ',   // bait
  'IH': 'ɪ',    // bit
  'IY': 'i',    // beat
  'OW': 'oʊ',   // boat
  'OY': 'ɔɪ',   // boy
  'UH': 'ʊ',    // book
  'UW': 'u',    // boot
  
  // Consonants
  'B': 'b',     // bee
  'CH': 'tʃ',   // cheese
  'D': 'd',     // dee
  'DH': 'ð',    // the
  'F': 'f',     // fee
  'G': 'g',     // green
  'HH': 'h',    // he
  'JH': 'dʒ',   // gee
  'K': 'k',     // key
  'L': 'l',     // lee
  'M': 'm',     // me
  'N': 'n',     // knee
  'NG': 'ŋ',    // ping
  'P': 'p',     // pee
  'R': 'ɹ',     // read
  'S': 's',     // sea
  'SH': 'ʃ',    // she
  'T': 't',     // tea
  'TH': 'θ',    // think
  'V': 'v',     // vee
  'W': 'w',     // we
  'Y': 'j',     // yield
  'Z': 'z',     // zee
  'ZH': 'ʒ',    // seizure
};

/**
 * Convert ARPABET phoneme to IPA
 */
export function arpaToIpa(arpabet: string): string {
  // Remove stress markers (0, 1, 2)
  const cleanArpa = arpabet.replace(/[012]/g, '');
  
  // Convert to IPA
  const ipa = ARPABET_TO_IPA[cleanArpa.toUpperCase()];
  
  if (!ipa) {
    console.warn(`Unknown ARPABET phoneme: ${arpabet}`);
    return cleanArpa.toLowerCase(); // fallback
  }
  
  return ipa;
}

/**
 * Convert array of ARPABET phonemes to full IPA transcription
 */
export function arpaArrayToIpa(phonemes: Array<{ phoneme: string; score?: number }>): string {
  return phonemes
    .map(p => arpaToIpa(p.phoneme))
    .join('');
}