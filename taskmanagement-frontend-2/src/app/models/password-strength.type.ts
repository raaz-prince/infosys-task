export type StrengthLabel = 'Weak' | 'Fair' | 'Good' | 'Strong';

export type Strength = {
    score: 0 | 1 | 2 | 3 | 4;
    label: StrengthLabel;
}