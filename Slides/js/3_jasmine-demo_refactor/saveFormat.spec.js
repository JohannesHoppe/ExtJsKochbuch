/// <reference path="../jquery-2.0.3.js" />
/// <reference path="saveFormat.js" />

describe("saveFormat_refactor", function () {

    var original = '{0} - {1} - {2}';

    it("should replace placeholders", function () {
        var expected = 'A - B - C';
        var formated = $.saveFormat(original, 'A', 'B', 'C');
        expect(formated).toEqual(expected);
    });

    it("should encode injected content", function () {
        var expected = 'A - &lt;b&gt;TEST&lt;/b&gt; - C';
        var formated = $.saveFormat(original, 'A', '<b>TEST</b>', 'C');
        expect(formated).toEqual(expected);
    });
});