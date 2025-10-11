export const universities = [
  'Lomonosov Moscow State University',
  'Saint Petersburg State University',
  'Novosibirsk State University',
  'Tomsk State University',
  'Bauman Moscow State Technical University',
] as const;

export const universityRequirements: Record<(typeof universities)[number], string> = {
  'Lomonosov Moscow State University':
    'Requires a notarized translation of the high school diploma and academic transcript into Russian. Must include an Apostille stamp if the issuing country is a member of the Hague Convention.',
  'Saint Petersburg State University':
    'All documents must be translated into Russian. Academic transcripts must show a GPA of at least 3.0 on a 4.0 scale. A medical certificate of general health is mandatory.',
  'Novosibirsk State University':
    'Focus on STEM subjects. Requires proof of advanced mathematics and physics coursework. Documents can be submitted in English or Russian.',
  'Tomsk State University':
    'Requires a detailed academic transcript. A portfolio may be required for creative arts programs. A letter of motivation is highly recommended.',
  'Bauman Moscow State Technical University':
    'Specializes in engineering and technology. Admission requires passing an online entrance exam in mathematics and physics in addition to standard document submission.',
};
