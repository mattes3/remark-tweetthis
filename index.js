'use strict';
const visit = require('unist-util-visit')
var u = require('unist-builder');

module.exports = ({ markdownAST }, pluginOptions = { siteUrl: 'https://example.com/blog', tweetAs: 'twitteruser' }) => {
    visit(markdownAST, 'linkReference', replaceTweet);
    return markdownAST;

    function replaceTweet(node) {
        if (
            node.type === 'linkReference'
            && node.identifier === 'tweet'
            && node.children
            && node.children.length === 1
        ) {
            // The word PAGE_SLUG needs to be replaced later when
            // rendering the entire page. It cannot be configured
            // in pluginOptions because it depends on the concrete page.
            let url = `${pluginOptions.siteUrl}PAGE_SLUG`;
            let text = node.children[0].value;
            let via = pluginOptions.tweetAs;
            let href = 'https://twitter.com/intent/tweet?' + encodeQueryData({ url, text, via });

            node.type = 'html';
            delete node.children;

            node.value = [
                '<span class="tweet-span-class">',
                '<span class="tweet-text-span-class">',
                `<a href="${href}" target="_blank" rel="noopener noreferrer nofollow">`,
                text,
                '</a>',
                '</span>',
                `<a href="${href}" target="_blank" rel="noopener noreferrer nofollow" class="tweet-button-span-class">`,
                'Tweet this',
                '</a>',
                '</span>',
            ].join('');

            return visit.SKIP;
        }
    }

    function encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

}
