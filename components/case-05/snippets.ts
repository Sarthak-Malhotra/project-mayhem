export interface ArchiveSnippet {
  title: string;
  section: string;
  records: string[];
  body: string[];
}

export const introMetaLines = [
  "FILE DESIGNATION: CF-05-ZA-2006",
  "ARCHIVE DEPTH: LEVEL IX (EYES ONLY)",
  "CLASSIFICATION: OMEGA",
  "STATUS: HIGHLY REDACTED",
  "ACCESSING ARCHIVED INVESTIGATION..."
];

export const introTextLines = [
  "South Africa, 2006.",
  "A classified research project attempted something previously believed impossible. Not mind control. Not hypnosis. The artificial creation of human memories.",
  "Subjects began recalling entire lives that never happened. People they had never met. Conversations that never occurred. Places that never existed.",
  "Multiple subjects remembered the same fabricated events. The project was terminated. Every researcher disappeared. Only three encrypted archives remain.",
];

export const archiveSnippets: Record<number, ArchiveSnippet> = {
  1: {
    title: "ARCHIVE 01 RECOVERED",
    section: "IMPOSSIBLE DISCOVERIES",
    records: ["Fast Inverse Square Root", "Wilhelm Scream"],
    body: [
      "At first glance...",
      "one is mathematics.",
      "The other is cinema.",
      "Neither should still exist exactly as they do.",
      "Patterns are beginning to emerge.",
    ]
  },
  2: {
    title: "ARCHIVE 02 RECOVERED",
    section: "UNEXPLAINED IDENTITIES",
    records: ["Taured Passport", "Kryptos Cipher"],
    body: [
      "One traveler came from a nation that never existed.",
      "One message remained sealed for decades.",
      "Both survived every attempt to explain them.",
      "Coincidence probability: 0.003%",
    ]
  },
  3: {
    title: "ARCHIVE 03 RECOVERED",
    section: "HUMAN VS MACHINE",
    records: ["Deep Blue", "Voyager Golden Record"],
    body: [
      "History reached two turning points.",
      "The first: a machine defeated the world’s greatest chess player.",
      "The second: human emotion was preserved forever and launched into deep space.",
      "Two events. One question.",
      "What should outlive humanity?",
    ]
  },
  4: {
    title: "ARCHIVE 04 RECOVERED",
    section: "DANGEROUS KNOWLEDGE",
    records: ["Demon Core", "Poe Cipher"],
    body: [
      "One killed without exploding.",
      "The other remained unread for over a century.",
      "Knowledge delayed... can be as dangerous as knowledge discovered.",
    ]
  }
};

export const loadingPhrases = [
  [
    "Mounting archive...",
    "Decrypting...",
    "Verifying checksum...",
    "Synchronizing temporal index...",
    "Loading historical cache..."
  ],
  [
    "Scanning record...",
    "Cross-referencing timeline...",
    "Recovering evidence...",
    "Integrity 91%...",
    "Recovered."
  ]
];

export const successPhrases = [
  "MATCH FOUND",
  "Historical anomaly confirmed.",
  "Evidence archived.",
  "Chronology stabilized."
];

export const finalLogLines = [
  "None of these events share a country.",
  "None share a century.",
  "None share a field of study.",
  "Yet every record was deliberately removed from the same classified archive.",
  "Someone wasn’t collecting mysteries. They were preserving anomalies.",
  "The Blue Ledger wasn’t documenting history. It was documenting events that history could never completely explain.",
  "Archive integrity restored.",
  "Synchronizing with NULL Archive..."
];

export const finalAccessLines = [
  "ACCESS STATUS UPDATED",
  "NEW EVIDENCE ADDED",
  "Cross-file anomaly correlation detected.",
  "Recovered historical anomalies: 8",
  "Unknown connection: ACTIVE",
  "Further investigation required."
];
