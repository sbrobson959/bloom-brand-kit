export const COLORS = {
	true_black:  '#000000',
	true_white:  '#FFFFFF',
	carrot:      '#FE6705',
	kiwi:        '#C7D62A',
	lychee:      '#FD7699'
};

export const COLOR_NAMES = {
	true_black: 'True Black',
	true_white: 'True White',
	carrot: 'Carrot',
	kiwi: 'Kiwi',
	lychee: 'Lychee'
};

export const COLOR_ORDER = ['true_black', 'true_white', 'carrot', 'kiwi', 'lychee'];

export const LOGO_VARIANTS = ['horizontal', 'vertical', 'only'];
export const LOGO_VARIANT_NAMES = {
	horizontal: 'Horizontal',
	vertical: 'Vertical',
	only: 'Wordmark'
};

// Flower inventory
export const FLOWER_FILLED = ['carrot', 'kiwi', 'lychee', 'true_black'];
export const FLOWER_OPEN = ['carrot', 'kiwi', 'lychee', 'true_white'];
export const FLOWER_DUAL = [
	'carrot-kiwi', 'carrot-lychee', 'kiwi-carrot', 'kiwi-lychee',
	'lychee-carrot', 'lychee-kiwi', 'carrot-true_black', 'carrot-true_white',
	'kiwi-true_black', 'kiwi-true_white', 'lychee-true_black', 'lychee-true_white'
];

export function getFlowerFileNames() {
	const names = [];
	FLOWER_FILLED.forEach(c => names.push(`flower-${c}-filled`));
	FLOWER_OPEN.forEach(c => names.push(`flower-${c}-open`));
	FLOWER_DUAL.forEach(c => names.push(`flower-${c}`));
	names.push('flower-true_black-filled', 'flower-true_black-open', 'flower-true_white-filled', 'flower-true_white-open');
	return [...new Set(names)];
}

export function getLogoFileNames() {
	const names = [];
	LOGO_VARIANTS.forEach(v => {
		COLOR_ORDER.forEach(c => names.push(`bloom-${v}-${c}`));
	});
	return names;
}

// Blob shape numbers (01-20 for solid/multicolor, sides are special)
export const BLOB_SHAPES = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'));

// Multicolor blob permutations (based on actual files)
export const MULTI_PERMUTATIONS = [
	'carrot-kiwi', 'carrot-lychee', 'kiwi-carrot', 'kiwi-lychee',
	'lychee-carrot', 'lychee-kiwi',
	'carrot-kiwi-lychee', 'carrot-lychee-kiwi', 'kiwi-carrot-lychee',
	'kiwi-lychee-carrot', 'lychee-carrot-kiwi', 'lychee-kiwi-carrot'
];

export const SIDE_PERMUTATIONS = [
	'carrot-kiwi-lychee', 'carrot-lychee-kiwi', 'kiwi-carrot-lychee',
	'kiwi-lychee-carrot', 'lychee-carrot-kiwi', 'lychee-kiwi-carrot'
];
