var Remark = require('remark');
var html = require('remark-html')
var tweetThis = require('.');

var remark = new Remark().data(`settings`, {
    commonmark: true,
    footnotes: true,
    pedantic: true,
});

test('plugin should replace tweet tag by correct HTML', () => {

    const markdownText = `
<a><b>c</b></a>
[This is a text to be tweeted][tweet]
`;

    remark()
        .use(() => (markdownAST) => {
            markdownAST = tweetThis({ markdownAST });
            expect(markdownAST).toMatchSnapshot();
            return markdownAST;
        })
        .use(html)
        .process(markdownText, (err, file) => {
            if (err) throw err;
            console.log(String(file));
        });
});
