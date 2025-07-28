#!/usr/bin/env python3
"""
Phoneme to IPA Conversion Service
Converts Azure Speech Service phonemes to IPA with stress marks
"""

import json
import sys
import cmudict
import unicodedata
from typing import List, Dict, Tuple, Optional

# Initialize CMU dictionary
cmu = cmudict.dict()

# Phoneme to IPA mapping
PHONEME_TO_IPA = {
    # Vowels
    'ax': 'ə', 'ay': 'aɪ', 'ow': 'oʊ', 'iy': 'i', 'ih': 'ɪ', 
    'eh': 'ɛ', 'ae': 'æ', 'aa': 'ɑ', 'ao': 'ɔ', 'uw': 'u', 
    'uh': 'ʊ', 'er': 'ɜr', 'ey': 'eɪ', 'aw': 'aʊ', 'oy': 'ɔɪ',
    'ah': 'ʌ',
    
    # Consonants
    'dh': 'ð', 'th': 'θ', 'sh': 'ʃ', 'zh': 'ʒ', 'ch': 'tʃ', 
    'jh': 'dʒ', 'ng': 'ŋ', 'y': 'j',
    
    # Others remain unchanged
    'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
    'f': 'f', 'v': 'v', 's': 's', 'z': 'z', 'h': 'h', 'm': 'm',
    'n': 'n', 'l': 'l', 'r': 'r', 'w': 'w'
}

def is_vowel(phoneme: str) -> bool:
    """Check if a phoneme is a vowel"""
    vowels = {'ax', 'ay', 'ow', 'iy', 'ih', 'eh', 'ae', 'aa', 
              'ao', 'uw', 'uh', 'er', 'ey', 'aw', 'oy', 'ah'}
    return phoneme.lower() in vowels

def get_stress_from_cmu(word: str, azure_phonemes: List[str]) -> List[int]:
    """
    Get stress pattern from CMU dictionary
    Returns list of stress levels (0=no stress, 1=primary, 2=secondary)
    """
    word_lower = word.lower()
    
    # Try to find word in CMU dict
    if word_lower in cmu:
        cmu_entries = cmu[word_lower]
        
        # Use first pronunciation
        cmu_phonemes = cmu_entries[0]
        
        # Extract stress info from CMU phonemes
        stress_pattern = []
        for cmu_phoneme in cmu_phonemes:
            # CMU includes stress as numbers in vowels (e.g., 'AH0', 'AH1', 'AH2')
            if any(char.isdigit() for char in cmu_phoneme):
                if '1' in cmu_phoneme:
                    stress_pattern.append(1)  # Primary stress
                elif '2' in cmu_phoneme:
                    stress_pattern.append(2)  # Secondary stress
                else:
                    stress_pattern.append(0)  # No stress
        
        # Match stress pattern to Azure phonemes
        azure_vowel_count = sum(1 for p in azure_phonemes if is_vowel(p))
        
        # If counts match, return the pattern
        if len(stress_pattern) == azure_vowel_count:
            return stress_pattern
        
        # If Azure has fewer vowels (e.g., merged er+iy), try to match intelligently
        # For "entirely": CMU has IH0, AY1, ER0, IY0 but Azure might have ih, ay, iy
        if azure_vowel_count == 3 and len(stress_pattern) == 4:
            # Check if we're missing ER (common in Azure)
            azure_vowels = [p for p in azure_phonemes if is_vowel(p)]
            # If we have ih/eh, ay, iy then map stress pattern [0, 1, 0]
            if len(azure_vowels) == 3:
                return [stress_pattern[0], stress_pattern[1], stress_pattern[3]]
    
    # Fallback: stress first syllable for single/two syllables
    vowel_count = sum(1 for p in azure_phonemes if is_vowel(p))
    if vowel_count == 1:
        return [1]
    elif vowel_count == 2:
        return [1, 0]  # Default: stress first syllable
    else:
        # For longer words, stress first syllable
        pattern = [0] * vowel_count
        pattern[0] = 1
        return pattern

def convert_to_ipa(phonemes: List[str], word: str) -> str:
    """
    Convert Azure phonemes to IPA with stress marks
    """
    if not phonemes:
        return ''
    
    # Get stress pattern from CMU
    stress_pattern = get_stress_from_cmu(word, phonemes)
    
    ipa_result = ''
    vowel_index = 0
    
    for phoneme in phonemes:
        phoneme_lower = phoneme.lower()
        
        # Add stress mark before stressed vowels
        if is_vowel(phoneme_lower) and vowel_index < len(stress_pattern):
            if stress_pattern[vowel_index] == 1:
                ipa_result += 'ˈ'  # Primary stress
            elif stress_pattern[vowel_index] == 2:
                ipa_result += 'ˌ'  # Secondary stress
            vowel_index += 1
        
        # Convert phoneme to IPA
        ipa_symbol = PHONEME_TO_IPA.get(phoneme_lower, phoneme_lower)
        ipa_result += ipa_symbol
    
    # Normalize unicode
    ipa_result = unicodedata.normalize('NFC', ipa_result)
    
    # Wrap in forward slashes
    return f'/{ipa_result}/'

def convert_single_phoneme(phoneme: str) -> str:
    """Convert a single phoneme to IPA without stress"""
    return PHONEME_TO_IPA.get(phoneme.lower(), phoneme)

def main():
    """Main function to handle stdin/stdout communication"""
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        
        action = input_data.get('action', 'convert')
        
        if action == 'convert':
            # Convert full word with stress
            phonemes = input_data.get('phonemes', [])
            word = input_data.get('word', '')
            result = convert_to_ipa(phonemes, word)
            
        elif action == 'single':
            # Convert single phoneme
            phoneme = input_data.get('phoneme', '')
            result = convert_single_phoneme(phoneme)
            
        else:
            result = {'error': f'Unknown action: {action}'}
        
        # Output result as JSON
        print(json.dumps({'result': result}))
        
    except Exception as e:
        # Return error as JSON
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()