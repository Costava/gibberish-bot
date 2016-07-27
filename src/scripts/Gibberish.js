/**
 * Gibberish
 */
var Gibberish = {
	alphabet: "abcdefghijklmnopqrstuvwxyz",
	vowels: "aeiou",// No 'y'
	consonants: "bcdfghjklmnpqrstvwxyz",

	/**
	 * Returns a {number} (an integer) between {number} `min` and {number} `max` (both inclusive)
	 * `min` and `max` should be integers
	 */
	randomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	/**
	 * Returns a random vowel
	 * @returns {string}
	 */
	randomVowel: function() {
		var index = this.randomInt(0, this.vowels.length - 1);

		return this.vowels[index];
	},

	/**
	 * Returns a random consonant
	 * @returns {string}
	 */
	randomConsonant: function() {
		var index = this.randomInt(0, this.consonants.length - 1);

		return this.consonants[index];
	},

	// Probability of a word starting with a vowel
	initialVowelProbability: 0.5,// A number [0, 1]
	doubleConsonantProbability: 0.5,// A number [0, 1]

	/**
	 * Returns a random word of {number} `length`
	 * @returns {string}
	 */
	randomWord: function(length) {
		if (typeof length !== 'number') {
			throw "Non-number length argument";
		}
		else if (length <= 0) {
			return "";
		}
		else if (length === 1) {
			return this.randomVowel();
		}
		// else length >= 2

		var word = "";

		var vowelNext = Math.random() < this.initialVowelProbability;

		// Make sure word does not start with 2 consonants
		if (vowelNext) {
			word += this.randomVowel();
		}
		else {
			word += this.randomConsonant();
		}

		vowelNext = !vowelNext;

		while (word.length < length) {
			if (vowelNext) {
				word += this.randomVowel();
			}
			else {// Add consonant(s)
				var availableLength = length - word.length;

				// Word cannnot end with 2 consonants
				if (availableLength > 2) {
					if (Math.random() < this.doubleConsonantProbability) {
						word += this.randomConsonant();
						word += this.randomConsonant();
					}
					else {
						word += this.randomConsonant();
					}
				}
				else {
					word += this.randomConsonant();
				}
			}

			vowelNext = !vowelNext;
		}

		return word;
	},

	/**
	 * Returns a random sentence
	 * @param {object} o
	 * - @property {number} numWords
	 * - @property {number} wordMinLength
	 * - @property {number} wordMaxLength
	 * @returns {string}
	 */
	randomSentence: function(o) {
		var sentence = "";

		for (var i = 0; i < o.numWords; ++i) {
			var numLetters = Gibberish.randomInt(o.wordMinLength, o.wordMaxLength);

			sentence += Gibberish.randomWord(numLetters)

			if (i == o.numWords - 1) {
				sentence += ".";
			}
			else {
				sentence += " ";
			}
		}

		// Capitalize first letter
		sentence = sentence.charAt(0).toUpperCase() + sentence.substr(1);

		return sentence;
	},

	/**
	 * Returns a random paragraph
	 * @param {object} o
	 * - @property {number} numSentences
	 * - @property {number} sentenceMinWords
	 * - @property {number} sentenceMaxWords
	 * - @property {number} wordMinLength
	 * - @property {number} wordMaxLength
	 * @returns {string}
	 */
	randomParagraph: function(o) {
		var paragraph = "";

		for (var i = 0; i < o.numSentences; ++i) {
			var sentence = Gibberish.randomSentence({
				numWords: Gibberish.randomInt(o.sentenceMinWords, o.sentenceMaxWords),
				wordMinLength: o.wordMinLength,
				wordMaxLength: o.wordMaxLength
			});

			paragraph += sentence;

			if (i < o.numSentences - 1) {
				paragraph += " ";
			}
		}

		return paragraph;
	}
};

//////////

// console.log(Gibberish.randomParagraph({
// 	numSentences: Gibberish.randomInt(7, 11),
// 	sentenceMinWords: 3,
// 	sentenceMaxWords: 7,
// 	wordMinLength: 2,
// 	wordMaxLength: 7
// }));

//////////

// module.exports = Gibberish;

// export default Gibberish
