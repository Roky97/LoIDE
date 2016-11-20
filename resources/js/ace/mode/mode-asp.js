define('ace/mode/asp', [], function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var aspHighlightRules = require("ace/mode/asp_highlight_rules").aspHighlightRules;

var Mode = function() {
    this.HighlightRules = aspHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
   this.lineCommentStart = "%";
}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/asp_highlight_rules', [], function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var aspHighlightRules = function() {
var aggr = ("#count|#sum|#max|#min|#int|#maxint");
    var keywordMapper = this.createKeywordMapper({
            "keyword": aggr
        }, "identifier", true);

    this.$rules = {
            "start": [{
                token: "keyword",
                regex: "not|\\:~"

            }, {
                token: "string",
                regex: "[a-z]+",
                next: "blocktag"
            }, {
                token: "text",
                regex: ",|:-",
                next: "start"
            }, {
                token: "keyword.operator",
                regex: "\\-|\\+|\\*|\\/|\\<|\\<=|\\>|\\>=|\\=|\\!="
            }, {
                token: "constant.numeric",
                regex: "[0-9]+"
            }, {
                token: "lparen",
                regex: "[[{]"
            }, {

                token: "rparen",
                regex: "[\\]}]"
            }, {
                token: keywordMapper,
                regex: "\\#[a-z]+"

            }, {
                token: "text",
                regex: "\s+"
            },
            {
                token: "comment",
                regex: "\%.+"

            }],
            "blocktag": [

                {
                    token: "keyword",
                    regex: "\\(",
                    next: "blocktagproperties"
                }
            ],
            "blocktagproperties": [{
                    token: "keyword",
                    regex: "\\)",
                    next: "start"
                }, {
                    token: "parameter",
                    regex: "[a-zA-Z0-9]+"
                }

            ]
        };
    this.normalizeRules();
};

oop.inherits(aspHighlightRules, TextHighlightRules);

exports.aspHighlightRules = aspHighlightRules;
});

editor.session.setMode("ace/mode/asp");
