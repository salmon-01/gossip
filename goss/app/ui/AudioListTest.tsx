const jsonData = [
  {
    id: 's3://voice-cloning-zero-shot/d82d246c-148b-457f-9668-37b789520891/adolfosaad/manifest.json',
    name: 'Adolfo',
    sample: 'https://parrot-samples.s3.amazonaws.com/kettle/adolfo.wav',
    accent: 'american',
    age: 'adult',
    gender: 'male',
    language: 'English (US)',
    language_code: 'en-US',
    loudness: 'neutral',
    style: 'narrative',
    tempo: 'fast',
    texture: 'thick',
    is_cloned: false,
    voice_engine: 'PlayHT2.0',
  },
  {
    id: 's3://voice-cloning-zero-shot/a59cb96d-bba8-4e24-81f2-e60b888a0275/charlottenarrativesaad/manifest.json',
    name: 'Charlotte (Narrative)',
    sample:
      'https://parrot-samples.s3.amazonaws.com/kettle/charlotte+(narrative).wav',
    accent: 'canadian',
    age: 'adult',
    gender: 'female',
    language: 'English (CA)',
    language_code: 'en-CA',
    loudness: 'low',
    style: 'narrative',
    tempo: 'neutral',
    texture: 'smooth',
    is_cloned: false,
    voice_engine: 'PlayHT2.0',
  },
  {
    id: 's3://voice-cloning-zero-shot/9fc626dc-f6df-4f47-a112-39461e8066aa/oliviaadvertisingsaad/manifest.json',
    name: 'Olivia (Advertising)',
    sample:
      'https://parrot-samples.s3.amazonaws.com/kettle/olivia+advertising.wav',
    accent: 'canadian',
    age: null,
    gender: 'female',
    language: 'English (CA)',
    language_code: 'en-CA',
    loudness: null,
    style: 'advertising',
    tempo: null,
    texture: null,
    is_cloned: false,
    voice_engine: 'PlayHT2.0',
  },
  {
    id: 's3://voice-cloning-zero-shot/f6594c50-e59b-492c-bac2-047d57f8bdd8/susanadvertisingsaad/manifest.json',
    name: 'Susan (Advertising)',
    sample:
      'https://parrot-samples.s3.amazonaws.com/kettle/susan+(advertising).wav',
    accent: 'american',
    age: 'adult',
    gender: 'female',
    language: 'English (US)',
    language_code: 'en-US',
    loudness: 'high',
    style: 'advertising',
    tempo: 'neutral',
    texture: 'round',
    is_cloned: false,
    voice_engine: 'PlayHT2.0',
  },
  {
    id: 's3://voice-cloning-zero-shot/e5df2eb3-5153-40fa-9f6e-6e27bbb7a38e/original/manifest.json',
    name: 'Navya',
    sample: 'https://parrot-samples.s3.amazonaws.com/gargamel/Navya.wav',
    accent: 'indian',
    age: null,
    gender: 'female',
    language: 'English (IN)',
    language_code: 'en-IN',
    loudness: null,
    style: null,
    tempo: null,
    texture: null,
    is_cloned: false,
    voice_engine: 'PlayHT2.0',
  },
];

const AudioList = () => {
  return (
    <div>
      {jsonData.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.name}</h3>
          <audio controls>
            <source src={entry.sample} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default AudioList;
