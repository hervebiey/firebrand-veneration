import { type Key } from "@/components/Songs";
import { KeyMap } from "@/components/KeyMap";

const NOTE_INDEX: Record<string, number> = {
	C: 0,
	"C#": 1,
	"D♭": 1,
	D: 2,
	"D#": 3,
	"E♭": 3,
	E: 4,
	F: 5,
	"F#": 6,
	"G♭": 6,
	G: 7,
	"G#": 8,
	"A♭": 8,
	A: 9,
	"A#": 10,
	"B♭": 10,
	B: 11,
};

// Flat-preferring spellings, matching how the songbook writes keys.
const FLAT_NAMES = [
	"C",
	"D♭",
	"D",
	"E♭",
	"E",
	"F",
	"G♭",
	"G",
	"A♭",
	"A",
	"B♭",
	"B",
] as const;

export function transposeNote(note: string, semitones: number): string {
	const base = NOTE_INDEX[note];
	if (base === undefined) return note;
	return FLAT_NAMES[(base + ((semitones % 12) + 12)) % 12];
}

// "A♭" -> "A♭ (La♭)", matching the site's bilingual key labels.
export function keyLabel(note: string): string {
	const french = KeyMap[note as keyof typeof KeyMap];
	return french ? `${note} (${french})` : note;
}

export function transposedKeyLabel(key: Key, semitones: number): string {
	const note = transposeNote(key.note, semitones);
	return `${keyLabel(note)}${key.quality ? ` ${key.quality}` : ""}`;
}

// Transposes a chord symbol such as "E♭/G" or "B♭m".
export function transposeChord(chord: string, semitones: number): string {
	return chord
		.split("/")
		.map((part) => {
			const match = part.match(/^([A-G][#♭]?)(.*)$/);
			if (!match) return part;
			return transposeNote(match[1], semitones) + match[2];
		})
		.join("/");
}
