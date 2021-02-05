# Gallifreyo

![build](https://github.com/rossjrw/gallifreyo/workflows/build/badge.svg)
![test](https://github.com/rossjrw/gallifreyo/workflows/test/badge.svg)
![lint](https://github.com/rossjrw/gallifreyo/workflows/lint/badge.svg)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f?logo=jest)](https://github.com/facebook/jest)
[![made with bulma](https://img.shields.io/badge/made_with-bulma-00d1b2?logo=bulma)](https://bulma.io)

An English-to-Gallifreyan transliterator, based on
[Sherman's Gallifreyan](https://shermansplanet.com/gallifreyan/)
created by Loren Sherman.

Note that Sherman's Gallifreyan is a fan-made cipher and is not affiliated with
the BBC show Doctor Who.

[See it in action](https://rossjrw.com/gallifreyo)

## Project status

The goal of Gallifreyo is to be able to recreate the first image from the
[official guide](https://shermansplanet.com/gallifreyan/guide.pdf) to Sherman's
Gallifreyan &mdash; a transliteration of "hello sweetie" &mdash; to a
reasonable degree of accuracy.

This target image is simple but complex. It is a good indication of how well
Gallifreyo handles a range of requirements:

* low-level requirements like word positioning and sizing, letters and vowels,
  and sentence formation
* medium-level requirements like dots, lines, and variance between letter types
* high-level requirements like double-letter and -vowel merging, sentence
  outlining, and word interlocking

It's just missing punctuation, paragraphs (multiple sentences), and numbers.

Theirs | Ours (v0.2.0)
--- | ---
<image width="350" src="https://raw.githubusercontent.com/rossjrw/gallifreyo/master/assets/hello-sweetie-sherman.png"> | <image width="350" src="https://raw.githubusercontent.com/rossjrw/gallifreyo/master/assets/hello-sweetie-0.2.0.png">

Obviously, Gallifreyo is incomplete.

## Licensing

Gallifreyo is licensed under MIT.

Images produced by Gallifreyo are subject to the same licence of the text that
created them &mdash; if you wrote the text yourself, you own the copyright.
