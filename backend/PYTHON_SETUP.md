# Python Setup for IPA Conversion

The backend includes a Python service for accurate phoneme-to-IPA conversion using the CMU Pronouncing Dictionary.

## Prerequisites

1. Python 3.7 or higher
2. pip3 package manager

## Installation

After installing Node dependencies, run:

```bash
npm run setup:python
```

Or manually:

```bash
pip3 install -r requirements.txt
```

## Troubleshooting

If you get an error about `cmudict`:

1. Make sure Python 3 is installed:
   ```bash
   python3 --version
   ```

2. Install pip3 if needed:
   ```bash
   # macOS
   brew install python3
   
   # Ubuntu/Debian
   sudo apt-get install python3-pip
   ```

3. Try installing cmudict directly:
   ```bash
   pip3 install cmudict
   ```

## How it Works

The IPA service:
1. Receives Azure phonemes from the pronunciation service
2. Uses CMU dictionary to determine stress patterns
3. Converts phonemes to IPA symbols with proper stress marks
4. Returns IPA transcription like: /ˈhɛloʊ/

## Fallback

If Python/cmudict is not available, the system will use a JavaScript fallback with reduced accuracy for stress placement.