# How do I install new spell check dictionaries?

Due to license restrictions for spell check dictionaries, MarkdownPad can only include a limited set of dictionaries. However, you can install new dictionaries following the instructions below.

1. Find the dictionary you'd like to use, which must be in Hunspell/Aspell format. You can find many spell check dictionaries from the OpenOffice [Dictionary Repository](http://extensions.services.openoffice.org/dictionary).

2. The downloaded dictionary file should be in `.zip` format. If it is in a different format, change the file extension to .zip manually.

3. Open the downloaded `.zip` file and extract its contents.

3. Locate two files: one that ends in `.aff` and one that ends in `.dic`.

4. On your computer, navigate to the following folder:
	* For 32-bit operating systems: `C:\Program Files\MarkdownPad 2\SpellCheck\dictionaries\`
	* For 64-bit operating systems: `C:\Program Files (x86)\MarkdownPad 2\SpellCheck\dictionaries\`

5. Copy the `.aff` and `.dic` files from Step 3 to the dictionaries directory in Step 4.

6. Make sure the `.aff` and `.dic` files are named using the [standardized, official Culture Info name](http://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo(v=vs.71).aspx), with the language code separated from the culture code with an underscore (`_`).

7. For example, the files for German (Switzerland) would be `de_CH.dic` and `de_CH.aff`.

8. Click on the book icon at the status bar.
