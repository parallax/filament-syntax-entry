var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/highlight.js/lib/core.js
var require_core = __commonJS({
  "node_modules/highlight.js/lib/core.js"(exports, module) {
    function deepFreeze(obj) {
      if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
          throw new Error("map is read-only");
        };
      } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
          throw new Error("set is read-only");
        };
      }
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach((name) => {
        const prop = obj[name];
        const type = typeof prop;
        if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      });
      return obj;
    }
    var Response = class {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        if (mode.data === void 0)
          mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
      }
      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    };
    function escapeHTML(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function inherit$1(original, ...objects) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return (
        /** @type {T} */
        result
      );
    }
    var SPAN_CLOSE = "</span>";
    var emitsWrappingTags = (node) => {
      return !!node.scope;
    };
    var scopeToCSSClass = (name, { prefix }) => {
      if (name.startsWith("language:")) {
        return name.replace("language:", "language-");
      }
      if (name.includes(".")) {
        const pieces = name.split(".");
        return [
          `${prefix}${pieces.shift()}`,
          ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
        ].join(" ");
      }
      return `${prefix}${name}`;
    };
    var HTMLRenderer = class {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }
      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML(text);
      }
      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node))
          return;
        const className = scopeToCSSClass(
          node.scope,
          { prefix: this.classPrefix }
        );
        this.span(className);
      }
      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node))
          return;
        this.buffer += SPAN_CLOSE;
      }
      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }
      // helpers
      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    };
    var newNode = (opts = {}) => {
      const result = { children: [] };
      Object.assign(result, opts);
      return result;
    };
    var TokenTree = class _TokenTree {
      constructor() {
        this.rootNode = newNode();
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }
      /** @param {string} scope */
      openNode(scope) {
        const node = newNode({ scope });
        this.add(node);
        this.stack.push(node);
      }
      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        return void 0;
      }
      closeAllNodes() {
        while (this.closeNode())
          ;
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
      }
      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }
      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string")
          return;
        if (!node.children)
          return;
        if (node.children.every((el) => typeof el === "string")) {
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            _TokenTree._collapse(child);
          });
        }
      }
    };
    var TokenTreeEmitter = class extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }
      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") {
          return;
        }
        this.add(text);
      }
      /** @param {string} scope */
      startScope(scope) {
        this.openNode(scope);
      }
      endScope() {
        this.closeNode();
      }
      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      __addSublanguage(emitter, name) {
        const node = emitter.root;
        if (name)
          node.scope = `language:${name}`;
        this.add(node);
      }
      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }
      finalize() {
        this.closeAllNodes();
        return true;
      }
    };
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function anyNumberOfTimes(re) {
      return concat("(?:", re, ")*");
    }
    function optional(re) {
      return concat("(?:", re, ")?");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];
      if (typeof opts === "object" && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function countMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }
    var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;
      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = "";
        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === "\\" && match[1]) {
            out += "\\" + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === "(") {
              numCaptures++;
            }
          }
        }
        return out;
      }).map((re) => `(${re})`).join(joinWith);
    }
    var MATCH_NOTHING_RE = /\b\B/;
    var IDENT_RE3 = "[a-zA-Z]\\w*";
    var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
    var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
    var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    var BINARY_NUMBER_RE = "\\b(0b[01]+)";
    var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    var SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/
        );
      }
      return inherit$1({
        scope: "meta",
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0)
            resp.ignoreMatch();
        }
      }, opts);
    };
    var BACKSLASH_ESCAPE = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    };
    var APOS_STRING_MODE = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var QUOTE_STRING_MODE = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    var COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: "comment",
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: "doctag",
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/,
        // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/
        // allow capitalized words at beginning of sentences
      );
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---
          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827
          begin: concat(
            /[ ]+/,
            // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            "(",
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            "){3}"
          )
          // look for 3 words in a row
        }
      );
      return mode;
    };
    var C_LINE_COMMENT_MODE = COMMENT("//", "$");
    var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
    var HASH_COMMENT_MODE = COMMENT("#", "$");
    var NUMBER_MODE = {
      scope: "number",
      begin: NUMBER_RE,
      relevance: 0
    };
    var C_NUMBER_MODE = {
      scope: "number",
      begin: C_NUMBER_RE,
      relevance: 0
    };
    var BINARY_NUMBER_MODE = {
      scope: "number",
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    var REGEXP_MODE = {
      scope: "regexp",
      begin: /\/(?=[^/\n]*\/)/,
      end: /\/[gimuy]*/,
      contains: [
        BACKSLASH_ESCAPE,
        {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [BACKSLASH_ESCAPE]
        }
      ]
    };
    var TITLE_MODE = {
      scope: "title",
      begin: IDENT_RE3,
      relevance: 0
    };
    var UNDERSCORE_TITLE_MODE = {
      scope: "title",
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(
        mode,
        {
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          /** @type {ModeCallback} */
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1])
              resp.ignoreMatch();
          }
        }
      );
    };
    var MODES3 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      APOS_STRING_MODE,
      BACKSLASH_ESCAPE,
      BINARY_NUMBER_MODE,
      BINARY_NUMBER_RE,
      COMMENT,
      C_BLOCK_COMMENT_MODE,
      C_LINE_COMMENT_MODE,
      C_NUMBER_MODE,
      C_NUMBER_RE,
      END_SAME_AS_BEGIN,
      HASH_COMMENT_MODE,
      IDENT_RE: IDENT_RE3,
      MATCH_NOTHING_RE,
      METHOD_GUARD,
      NUMBER_MODE,
      NUMBER_RE,
      PHRASAL_WORDS_MODE,
      QUOTE_STRING_MODE,
      REGEXP_MODE,
      RE_STARTERS_RE,
      SHEBANG,
      TITLE_MODE,
      UNDERSCORE_IDENT_RE,
      UNDERSCORE_TITLE_MODE
    });
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }
    function scopeClassName(mode, _parent) {
      if (mode.className !== void 0) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }
    function beginKeywords(mode, parent) {
      if (!parent)
        return;
      if (!mode.beginKeywords)
        return;
      mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;
      if (mode.relevance === void 0)
        mode.relevance = 0;
    }
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal))
        return;
      mode.illegal = either(...mode.illegal);
    }
    function compileMatch(mode, _parent) {
      if (!mode.match)
        return;
      if (mode.begin || mode.end)
        throw new Error("begin & end are not supported with match");
      mode.begin = mode.match;
      delete mode.match;
    }
    function compileRelevance(mode, _parent) {
      if (mode.relevance === void 0)
        mode.relevance = 1;
    }
    var beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch)
        return;
      if (mode.starts)
        throw new Error("beforeMatch cannot be used with starts");
      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key) => {
        delete mode[key];
      });
      mode.keywords = originalMode.keywords;
      mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;
      delete originalMode.beforeMatch;
    };
    var COMMON_KEYWORDS = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      // common variable name
      "list",
      // common variable name
      "value"
      // common variable name
    ];
    var DEFAULT_KEYWORD_SCOPE = "keyword";
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      const compiledKeywords = /* @__PURE__ */ Object.create(null);
      if (typeof rawKeywords === "string") {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName2) {
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
          );
        });
      }
      return compiledKeywords;
      function compileList(scopeName2, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map((x) => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split("|");
          compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }
    function scoreForKeyword(keyword, providedScore) {
      if (providedScore) {
        return Number(providedScore);
      }
      return commonKeyword(keyword) ? 0 : 1;
    }
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }
    var seenDeprecations = {};
    var error = (message) => {
      console.error(message);
    };
    var warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };
    var deprecated = (version2, message) => {
      if (seenDeprecations[`${version2}/${message}`])
        return;
      console.log(`Deprecated as of ${version2}. ${message}`);
      seenDeprecations[`${version2}/${message}`] = true;
    };
    var MultiClassError = new Error();
    function remapScopeNames(mode, regexes, { key }) {
      let offset = 0;
      const scopeNames = mode[key];
      const emit = {};
      const positions = {};
      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      mode[key] = positions;
      mode[key]._emit = emit;
      mode[key]._multi = true;
    }
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin))
        return;
      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.begin, { key: "beginScope" });
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end))
        return;
      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.end, { key: "endScope" });
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }
    function MultiClass(mode) {
      scopeSugar(mode);
      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }
      beginMultiClass(mode);
      endMultiClass(mode);
    }
    function compileLanguage(language) {
      function langRe(value, global) {
        return new RegExp(
          source(value),
          "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
        );
      }
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
          if (this.regexes.length === 0) {
            this.exec = () => null;
          }
          const terminators = this.regexes.map((el) => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
          this.lastIndex = 0;
        }
        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) {
            return null;
          }
          const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
          const matchData = this.matchIndexes[i];
          match.splice(0, i);
          return Object.assign(match, matchData);
        }
      }
      class ResumableMultiRegex {
        constructor() {
          this.rules = [];
          this.multiRegexes = [];
          this.count = 0;
          this.lastIndex = 0;
          this.regexIndex = 0;
        }
        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index])
            return this.multiRegexes[index];
          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin")
            this.count++;
        }
        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex)
              ;
            else {
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }
          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              this.considerAll();
            }
          }
          return result;
        }
      }
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }
        return mm;
      }
      function compileMode(mode, parent) {
        const cmode = (
          /** @type CompiledMode */
          mode
        );
        if (mode.isCompiled)
          return cmode;
        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach((ext) => ext(mode, parent));
        language.compilerExtensions.forEach((ext) => ext(mode, parent));
        mode.__beforeBegin = null;
        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach((ext) => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;
        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
          if (!mode.begin)
            mode.begin = /\B|\b/;
          cmode.beginRe = langRe(cmode.begin);
          if (!mode.end && !mode.endsWithParent)
            mode.end = /\B|\b/;
          if (mode.end)
            cmode.endRe = langRe(cmode.end);
          cmode.terminatorEnd = source(cmode.end) || "";
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
          }
        }
        if (mode.illegal)
          cmode.illegalRe = langRe(
            /** @type {RegExp | string} */
            mode.illegal
          );
        if (!mode.contains)
          mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === "self" ? mode : c);
        }));
        mode.contains.forEach(function(c) {
          compileMode(
            /** @type Mode */
            c,
            cmode
          );
        });
        if (mode.starts) {
          compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }
      if (!language.compilerExtensions)
        language.compilerExtensions = [];
      if (language.contains && language.contains.includes("self")) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }
      language.classNameAliases = inherit$1(language.classNameAliases || {});
      return compileMode(
        /** @type Mode */
        language
      );
    }
    function dependencyOnParent(mode) {
      if (!mode)
        return false;
      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }
      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }
      return mode;
    }
    var version = "11.9.0";
    var HTMLInjectionError = class extends Error {
      constructor(reason, html) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html;
      }
    };
    var escape = escapeHTML;
    var inherit = inherit$1;
    var NO_MATCH = Symbol("nomatch");
    var MAX_KEYWORD_HITS = 7;
    var HLJS = function(hljs) {
      const languages = /* @__PURE__ */ Object.create(null);
      const aliases = /* @__PURE__ */ Object.create(null);
      const plugins = [];
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
      let options = {
        ignoreUnescapedHTML: false,
        throwUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        cssSelector: "pre code",
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }
      function blockLanguage(block) {
        let classes = block.className + " ";
        classes += block.parentNode ? block.parentNode.className : "";
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : "no-highlight";
        }
        return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }
      function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }
        if (ignoreIllegals === void 0) {
          ignoreIllegals = true;
        }
        const context = {
          code,
          language: languageName
        };
        fire("before:highlight", context);
        const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
      }
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = /* @__PURE__ */ Object.create(null);
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }
        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }
          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";
          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";
              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS)
                relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substring(lastIndex);
          emitter.addText(buf);
        }
        function processSubLanguage() {
          if (modeBuffer === "")
            return;
          let result2 = null;
          if (typeof top.subLanguage === "string") {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */
            result2._top;
          } else {
            result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }
          if (top.relevance > 0) {
            relevance += result2.relevance;
          }
          emitter.__addSublanguage(result2._emitter, result2.language);
        }
        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = "";
        }
        function emitKeyword(keyword, scope) {
          if (keyword === "")
            return;
          emitter.startScope(scope);
          emitter.addText(keyword);
          emitter.endScope();
        }
        function emitMultiClass(scope, match) {
          let i = 1;
          const max = match.length - 1;
          while (i <= max) {
            if (!scope._emit[i]) {
              i++;
              continue;
            }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text = match[i];
            if (klass) {
              emitKeyword(text, klass);
            } else {
              modeBuffer = text;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            if (mode.beginScope._wrap) {
              emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);
          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored)
                matched = false;
            }
            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            modeBuffer += lexeme[0];
            return 1;
          } else {
            resumeScanAtSamePosition = true;
            return 0;
          }
        }
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;
          const resp = new Response(newMode);
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb)
              continue;
            cb(match, resp);
            if (resp.isMatchIgnored)
              return doIgnore(lexeme);
          }
          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substring(match.index);
          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) {
            return NO_MATCH;
          }
          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list.unshift(current.scope);
            }
          }
          list.forEach((item) => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];
          modeBuffer += textBeforeMatch;
          if (lexeme == null) {
            processBuffer();
            return 0;
          }
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;
          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }
          if (match.type === "illegal" && lexeme === "") {
            return 1;
          }
          if (iterations > 1e5 && iterations > match.index * 3) {
            const err = new Error("potential infinite loop, way more iterations than matches");
            throw err;
          }
          modeBuffer += lexeme;
          return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language);
        let result = "";
        let top = continuation || md;
        const continuations = {};
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = "";
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
          if (!language.__emitTokens) {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (resumeScanAtSamePosition) {
                resumeScanAtSamePosition = false;
              } else {
                top.matcher.considerAll();
              }
              top.matcher.lastIndex = index;
              const match = top.matcher.exec(codeToHighlight);
              if (!match)
                break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substring(index));
          } else {
            language.__emitTokens(codeToHighlight, emitter);
          }
          emitter.finalize();
          result = emitter.toHTML();
          return {
            language: languageName,
            value: result,
            relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes("Illegal")) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }
      function justTextHighlightResult(code) {
        const result = {
          value: escape(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
      }
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
          (name) => _highlight(name, code, false)
        );
        results.unshift(plaintext);
        const sorted = results.sort((a, b) => {
          if (a.relevance !== b.relevance)
            return b.relevance - a.relevance;
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }
          return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.secondBest = secondBest;
        return result;
      }
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang && aliases[currentLang] || resultLang;
        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }
      function highlightElement(element) {
        let node = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language))
          return;
        fire(
          "before:highlightElement",
          { el: element, language }
        );
        if (element.dataset.highlighted) {
          console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
          return;
        }
        if (element.children.length > 0) {
          if (!options.ignoreUnescapedHTML) {
            console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
            console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
            console.warn("The element with unescaped HTML:");
            console.warn(element);
          }
          if (options.throwUnescapedHTML) {
            const err = new HTMLInjectionError(
              "One of your code blocks includes unescaped HTML.",
              element.innerHTML
            );
            throw err;
          }
        }
        node = element;
        const text = node.textContent;
        const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
        element.innerHTML = result.value;
        element.dataset.highlighted = "yes";
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }
        fire("after:highlightElement", { el: element, result, text });
      }
      function configure(userOptions) {
        options = inherit(options, userOptions);
      }
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }
      let wantsHighlight = false;
      function highlightAll() {
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }
        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
      }
      function boot() {
        if (wantsHighlight)
          highlightAll();
      }
      if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("DOMContentLoaded", boot, false);
      }
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          if (!SAFE_MODE) {
            throw error$1;
          } else {
            error(error$1);
          }
          lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name)
          lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);
        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }
      function listLanguages() {
        return Object.keys(languages);
      }
      function getLanguage(name) {
        name = (name || "").toLowerCase();
        return languages[name] || languages[aliases[name]];
      }
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === "string") {
          aliasList = [aliasList];
        }
        aliasList.forEach((alias) => {
          aliases[alias.toLowerCase()] = languageName;
        });
      }
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }
      function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }
      function removePlugin(plugin) {
        const index = plugins.indexOf(plugin);
        if (index !== -1) {
          plugins.splice(index, 1);
        }
      }
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
      }
      Object.assign(hljs, {
        highlight: highlight2,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin,
        removePlugin
      });
      hljs.debugMode = function() {
        SAFE_MODE = false;
      };
      hljs.safeMode = function() {
        SAFE_MODE = true;
      };
      hljs.versionString = version;
      hljs.regex = {
        concat,
        lookahead,
        either,
        optional,
        anyNumberOfTimes
      };
      for (const key in MODES3) {
        if (typeof MODES3[key] === "object") {
          deepFreeze(MODES3[key]);
        }
      }
      Object.assign(hljs, MODES3);
      return hljs;
    };
    var highlight = HLJS({});
    highlight.newInstance = () => HLJS({});
    module.exports = highlight;
    highlight.HighlightJS = highlight;
    highlight.default = highlight;
  }
});

// node_modules/highlight.js/es/core.js
var import_core = __toESM(require_core(), 1);
var core_default = import_core.default;

// node_modules/highlight.js/es/languages/bash.js
function bash(hljs) {
  const regex = hljs.regex;
  const VAR = {};
  const BRACED_VAR = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [VAR]
      }
      // default values
    ]
  };
  Object.assign(VAR, {
    className: "variable",
    variants: [
      { begin: regex.concat(
        /\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        `(?![\\w\\d])(?![$])`
      ) },
      BRACED_VAR
    ]
  });
  const SUBST = {
    className: "subst",
    begin: /\$\(/,
    end: /\)/,
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  const HERE_DOC = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      hljs.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  };
  const QUOTE_STRING = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      SUBST
    ]
  };
  SUBST.contains.push(QUOTE_STRING);
  const ESCAPED_QUOTE = {
    match: /\\"/
  };
  const APOS_STRING = {
    className: "string",
    begin: /'/,
    end: /'/
  };
  const ESCAPED_APOS = {
    match: /\\'/
  };
  const ARITHMETIC = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      hljs.NUMBER_MODE,
      VAR
    ]
  };
  const SH_LIKE_SHELLS = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ];
  const KNOWN_SHEBANG = hljs.SHEBANG({
    binary: `(${SH_LIKE_SHELLS.join("|")})`,
    relevance: 10
  });
  const FUNCTION = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: true,
    contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  };
  const KEYWORDS3 = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "for",
    "while",
    "until",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "function",
    "select"
  ];
  const LITERALS3 = [
    "true",
    "false"
  ];
  const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
  const SHELL_BUILT_INS = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ];
  const BASH_BUILT_INS = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ];
  const ZSH_BUILT_INS = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ];
  const GNU_CORE_UTILS = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];
  return {
    name: "Bash",
    aliases: ["sh"],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: KEYWORDS3,
      literal: LITERALS3,
      built_in: [
        ...SHELL_BUILT_INS,
        ...BASH_BUILT_INS,
        // Shell modifiers
        "set",
        "shopt",
        ...ZSH_BUILT_INS,
        ...GNU_CORE_UTILS
      ]
    },
    contains: [
      KNOWN_SHEBANG,
      // to catch known shells and boost relevancy
      hljs.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      FUNCTION,
      ARITHMETIC,
      hljs.HASH_COMMENT_MODE,
      HERE_DOC,
      PATH_MODE,
      QUOTE_STRING,
      ESCAPED_QUOTE,
      APOS_STRING,
      ESCAPED_APOS,
      VAR
    ]
  };
}

// node_modules/highlight.js/es/languages/css.js
var MODES = (hljs) => {
  return {
    IMPORTANT: {
      scope: "meta",
      begin: "!important"
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z_][A-Za-z0-9_-]*/
    }
  };
};
var TAGS = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "p",
  "q",
  "quote",
  "samp",
  "section",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
];
var MEDIA_FEATURES = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  // TODO: find a better solution?
  "min-width",
  "max-width",
  "min-height",
  "max-height"
];
var PSEUDO_CLASSES = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  // dir()
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  // has()
  "host",
  // host or host()
  "host-context",
  // host-context()
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  // is()
  "lang",
  // lang()
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  // not()
  "nth-child",
  // nth-child()
  "nth-col",
  // nth-col()
  "nth-last-child",
  // nth-last-child()
  "nth-last-col",
  // nth-last-col()
  "nth-last-of-type",
  //nth-last-of-type()
  "nth-of-type",
  //nth-of-type()
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
  // where()
];
var PSEUDO_ELEMENTS = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
];
var ATTRIBUTES = [
  "align-content",
  "align-items",
  "align-self",
  "all",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "direction",
  "display",
  "empty-cells",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flow",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-size",
  "font-size-adjust",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "gap",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "inline-size",
  "isolation",
  "justify-content",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "pointer-events",
  "position",
  "quotes",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "row-gap",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "speak",
  "speak-as",
  "src",
  // @font-face
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-style",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-transform",
  "text-underline-position",
  "top",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "unicode-bidi",
  "vertical-align",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "z-index"
  // reverse makes sure longer attributes `font-weight` are matched fully
  // instead of getting false positives on say `font`
].reverse();
function css(hljs) {
  const regex = hljs.regex;
  const modes = MODES(hljs);
  const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
  const AT_MODIFIERS = "and or not only";
  const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const STRINGS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ];
  return {
    name: "CSS",
    case_insensitive: true,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      // for visual continuity with `tag {}` and because we
      // don't have a great class for this?
      keyframePosition: "selector-tag"
    },
    contains: [
      modes.BLOCK_COMMENT,
      VENDOR_PREFIX,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + IDENT_RE3,
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
          { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          modes.BLOCK_COMMENT,
          modes.HEXCOLOR,
          modes.IMPORTANT,
          modes.CSS_NUMBER_MODE,
          ...STRINGS,
          // needed to highlight these as strings and to avoid issues with
          // illegal characters that might be inside urls that would tigger the
          // languages illegal stack
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            // from keywords
            keywords: { built_in: "url data-uri" },
            contains: [
              ...STRINGS,
              {
                className: "string",
                // any character other than `)` as in `url()` will be the start
                // of a string, which ends with `)` (from the parent mode)
                begin: /[^)]/,
                endsWithParent: true,
                excludeEnd: true
              }
            ]
          },
          modes.FUNCTION_DISPATCH
        ]
      },
      {
        begin: regex.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        // break on Less variables @var: ...
        contains: [
          {
            className: "keyword",
            begin: AT_PROPERTY_RE
          },
          {
            begin: /\s/,
            endsWithParent: true,
            excludeEnd: true,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: AT_MODIFIERS,
              attribute: MEDIA_FEATURES.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...STRINGS,
              modes.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS.join("|") + ")\\b"
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/dockerfile.js
function dockerfile(hljs) {
  const KEYWORDS3 = [
    "from",
    "maintainer",
    "expose",
    "env",
    "arg",
    "user",
    "onbuild",
    "stopsignal"
  ];
  return {
    name: "Dockerfile",
    aliases: ["docker"],
    case_insensitive: true,
    keywords: KEYWORDS3,
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
        starts: {
          end: /[^\\]$/,
          subLanguage: "bash"
        }
      }
    ],
    illegal: "</"
  };
}

// node_modules/highlight.js/es/languages/graphql.js
function graphql(hljs) {
  const regex = hljs.regex;
  const GQL_NAME = /[_A-Za-z][_0-9A-Za-z]*/;
  return {
    name: "GraphQL",
    aliases: ["gql"],
    case_insensitive: true,
    disableAutodetect: false,
    keywords: {
      keyword: [
        "query",
        "mutation",
        "subscription",
        "type",
        "input",
        "schema",
        "directive",
        "interface",
        "union",
        "scalar",
        "fragment",
        "enum",
        "on"
      ],
      literal: [
        "true",
        "false",
        "null"
      ]
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        scope: "punctuation",
        match: /[.]{3}/,
        relevance: 0
      },
      {
        scope: "punctuation",
        begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
        relevance: 0
      },
      {
        scope: "variable",
        begin: /\$/,
        end: /\W/,
        excludeEnd: true,
        relevance: 0
      },
      {
        scope: "meta",
        match: /@\w+/,
        excludeEnd: true
      },
      {
        scope: "symbol",
        begin: regex.concat(GQL_NAME, regex.lookahead(/\s*:/)),
        relevance: 0
      }
    ],
    illegal: [
      /[;<']/,
      /BEGIN/
    ]
  };
}

// node_modules/highlight.js/es/languages/javascript.js
var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
var KEYWORDS = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
var LITERALS = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var TYPES = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];
var ERROR_TYPES = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var BUILT_IN_GLOBALS = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var BUILT_IN_VARIABLES = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
];
var BUILT_INS = [].concat(
  BUILT_IN_GLOBALS,
  TYPES,
  ERROR_TYPES
);
function javascript(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: "html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: "css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: "gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS,
        "super",
        "import"
      ]),
      IDENT_RE$1,
      regex.lookahead(/\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        className: "attr",
        begin: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/json.js
function json(hljs) {
  const ATTRIBUTE = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS3 = [
    "true",
    "false",
    "null"
  ];
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS3.join(" ")
  };
  return {
    name: "JSON",
    keywords: {
      literal: LITERALS3
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}

// node_modules/highlight.js/es/languages/markdown.js
function markdown(hljs) {
  const regex = hljs.regex;
  const INLINE_HTML = {
    begin: /<\/?[A-Za-z_]/,
    end: ">",
    subLanguage: "xml",
    relevance: 0
  };
  const HORIZONTAL_RULE = {
    begin: "^[-\\*]{3,}",
    end: "$"
  };
  const CODE = {
    className: "code",
    variants: [
      // TODO: fix to allow these to work with sublanguage also
      { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
      { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
      // needed to allow markdown as a sublanguage to work
      {
        begin: "```",
        end: "```+[ ]*$"
      },
      {
        begin: "~~~",
        end: "~~~+[ ]*$"
      },
      { begin: "`.+?`" },
      {
        begin: "(?=^( {4}|\\t))",
        // use contains to gobble up multiple lines to allow the block to be whatever size
        // but only have a single open/close tag vs one per line
        contains: [
          {
            begin: "^( {4}|\\t)",
            end: "(\\n)$"
          }
        ],
        relevance: 0
      }
    ]
  };
  const LIST = {
    className: "bullet",
    begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
    end: "\\s+",
    excludeEnd: true
  };
  const LINK_REFERENCE = {
    begin: /^\[[^\n]+\]:/,
    returnBegin: true,
    contains: [
      {
        className: "symbol",
        begin: /\[/,
        end: /\]/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "link",
        begin: /:\s*/,
        end: /$/,
        excludeBegin: true
      }
    ]
  };
  const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
  const LINK = {
    variants: [
      // too much like nested array access in so many languages
      // to have any real relevance
      {
        begin: /\[.+?\]\[.*?\]/,
        relevance: 0
      },
      // popular internet URLs
      {
        begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
        relevance: 2
      },
      {
        begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
        relevance: 2
      },
      // relative urls
      {
        begin: /\[.+?\]\([./?&#].*?\)/,
        relevance: 1
      },
      // whatever else, lower relevance (might not be a link at all)
      {
        begin: /\[.*?\]\(.*?\)/,
        relevance: 0
      }
    ],
    returnBegin: true,
    contains: [
      {
        // empty strings for alt or link text
        match: /\[(?=\])/
      },
      {
        className: "string",
        relevance: 0,
        begin: "\\[",
        end: "\\]",
        excludeBegin: true,
        returnEnd: true
      },
      {
        className: "link",
        relevance: 0,
        begin: "\\]\\(",
        end: "\\)",
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "symbol",
        relevance: 0,
        begin: "\\]\\[",
        end: "\\]",
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
  const BOLD = {
    className: "strong",
    contains: [],
    // defined later
    variants: [
      {
        begin: /_{2}(?!\s)/,
        end: /_{2}/
      },
      {
        begin: /\*{2}(?!\s)/,
        end: /\*{2}/
      }
    ]
  };
  const ITALIC = {
    className: "emphasis",
    contains: [],
    // defined later
    variants: [
      {
        begin: /\*(?![*\s])/,
        end: /\*/
      },
      {
        begin: /_(?![_\s])/,
        end: /_/,
        relevance: 0
      }
    ]
  };
  const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
  const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
  BOLD.contains.push(ITALIC_WITHOUT_BOLD);
  ITALIC.contains.push(BOLD_WITHOUT_ITALIC);
  let CONTAINABLE = [
    INLINE_HTML,
    LINK
  ];
  [
    BOLD,
    ITALIC,
    BOLD_WITHOUT_ITALIC,
    ITALIC_WITHOUT_BOLD
  ].forEach((m) => {
    m.contains = m.contains.concat(CONTAINABLE);
  });
  CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
  const HEADER = {
    className: "section",
    variants: [
      {
        begin: "^#{1,6}",
        end: "$",
        contains: CONTAINABLE
      },
      {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [
          { begin: "^[=-]*$" },
          {
            begin: "^",
            end: "\\n",
            contains: CONTAINABLE
          }
        ]
      }
    ]
  };
  const BLOCKQUOTE = {
    className: "quote",
    begin: "^>\\s+",
    contains: CONTAINABLE,
    end: "$"
  };
  return {
    name: "Markdown",
    aliases: [
      "md",
      "mkdown",
      "mkd"
    ],
    contains: [
      HEADER,
      INLINE_HTML,
      LIST,
      BOLD,
      ITALIC,
      BLOCKQUOTE,
      CODE,
      HORIZONTAL_RULE,
      LINK,
      LINK_REFERENCE
    ]
  };
}

// node_modules/highlight.js/es/languages/php.js
function php(hljs) {
  const regex = hljs.regex;
  const NOT_PERL_ETC = /(?![A-Za-z0-9])(?![$])/;
  const IDENT_RE3 = regex.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    NOT_PERL_ETC
  );
  const PASCAL_CASE_CLASS_NAME_RE = regex.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    NOT_PERL_ETC
  );
  const VARIABLE = {
    scope: "variable",
    match: "\\$+" + IDENT_RE3
  };
  const PREPROCESSOR = {
    scope: "meta",
    variants: [
      { begin: /<\?php/, relevance: 10 },
      // boost for obvious PHP
      { begin: /<\?=/ },
      // less relevant per PSR-1 which says not to use short-tags
      { begin: /<\?/, relevance: 0.1 },
      { begin: /\?>/ }
      // end php tag
    ]
  };
  const SUBST = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  };
  const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null });
  const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
    illegal: null,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
  });
  const HEREDOC = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
    "on:begin": (m, resp) => {
      resp.data._beginMatch = m[1] || m[2];
    },
    "on:end": (m, resp) => {
      if (resp.data._beginMatch !== m[1])
        resp.ignoreMatch();
    }
  };
  const NOWDOC = hljs.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  });
  const WHITESPACE = "[ 	\n]";
  const STRING = {
    scope: "string",
    variants: [
      DOUBLE_QUOTED,
      SINGLE_QUOTED,
      HEREDOC,
      NOWDOC
    ]
  };
  const NUMBER = {
    scope: "number",
    variants: [
      { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
      // Binary w/ underscore support
      { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
      // Octals w/ underscore support
      { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
      // Hex w/ underscore support
      // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
      { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
    ],
    relevance: 0
  };
  const LITERALS3 = [
    "false",
    "null",
    "true"
  ];
  const KWS = [
    // Magic constants:
    // <https://www.php.net/manual/en/language.constants.predefined.php>
    "__CLASS__",
    "__DIR__",
    "__FILE__",
    "__FUNCTION__",
    "__COMPILER_HALT_OFFSET__",
    "__LINE__",
    "__METHOD__",
    "__NAMESPACE__",
    "__TRAIT__",
    // Function that look like language construct or language construct that look like function:
    // List of keywords that may not require parenthesis
    "die",
    "echo",
    "exit",
    "include",
    "include_once",
    "print",
    "require",
    "require_once",
    // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
    // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
    // Other keywords:
    // <https://www.php.net/manual/en/reserved.php>
    // <https://www.php.net/manual/en/language.types.type-juggling.php>
    "array",
    "abstract",
    "and",
    "as",
    "binary",
    "bool",
    "boolean",
    "break",
    "callable",
    "case",
    "catch",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "double",
    "else",
    "elseif",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "enum",
    "eval",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "foreach",
    "from",
    "global",
    "goto",
    "if",
    "implements",
    "instanceof",
    "insteadof",
    "int",
    "integer",
    "interface",
    "isset",
    "iterable",
    "list",
    "match|0",
    "mixed",
    "new",
    "never",
    "object",
    "or",
    "private",
    "protected",
    "public",
    "readonly",
    "real",
    "return",
    "string",
    "switch",
    "throw",
    "trait",
    "try",
    "unset",
    "use",
    "var",
    "void",
    "while",
    "xor",
    "yield"
  ];
  const BUILT_INS3 = [
    // Standard PHP library:
    // <https://www.php.net/manual/en/book.spl.php>
    "Error|0",
    "AppendIterator",
    "ArgumentCountError",
    "ArithmeticError",
    "ArrayIterator",
    "ArrayObject",
    "AssertionError",
    "BadFunctionCallException",
    "BadMethodCallException",
    "CachingIterator",
    "CallbackFilterIterator",
    "CompileError",
    "Countable",
    "DirectoryIterator",
    "DivisionByZeroError",
    "DomainException",
    "EmptyIterator",
    "ErrorException",
    "Exception",
    "FilesystemIterator",
    "FilterIterator",
    "GlobIterator",
    "InfiniteIterator",
    "InvalidArgumentException",
    "IteratorIterator",
    "LengthException",
    "LimitIterator",
    "LogicException",
    "MultipleIterator",
    "NoRewindIterator",
    "OutOfBoundsException",
    "OutOfRangeException",
    "OuterIterator",
    "OverflowException",
    "ParentIterator",
    "ParseError",
    "RangeException",
    "RecursiveArrayIterator",
    "RecursiveCachingIterator",
    "RecursiveCallbackFilterIterator",
    "RecursiveDirectoryIterator",
    "RecursiveFilterIterator",
    "RecursiveIterator",
    "RecursiveIteratorIterator",
    "RecursiveRegexIterator",
    "RecursiveTreeIterator",
    "RegexIterator",
    "RuntimeException",
    "SeekableIterator",
    "SplDoublyLinkedList",
    "SplFileInfo",
    "SplFileObject",
    "SplFixedArray",
    "SplHeap",
    "SplMaxHeap",
    "SplMinHeap",
    "SplObjectStorage",
    "SplObserver",
    "SplPriorityQueue",
    "SplQueue",
    "SplStack",
    "SplSubject",
    "SplTempFileObject",
    "TypeError",
    "UnderflowException",
    "UnexpectedValueException",
    "UnhandledMatchError",
    // Reserved interfaces:
    // <https://www.php.net/manual/en/reserved.interfaces.php>
    "ArrayAccess",
    "BackedEnum",
    "Closure",
    "Fiber",
    "Generator",
    "Iterator",
    "IteratorAggregate",
    "Serializable",
    "Stringable",
    "Throwable",
    "Traversable",
    "UnitEnum",
    "WeakReference",
    "WeakMap",
    // Reserved classes:
    // <https://www.php.net/manual/en/reserved.classes.php>
    "Directory",
    "__PHP_Incomplete_Class",
    "parent",
    "php_user_filter",
    "self",
    "static",
    "stdClass"
  ];
  const dualCase = (items) => {
    const result = [];
    items.forEach((item) => {
      result.push(item);
      if (item.toLowerCase() === item) {
        result.push(item.toUpperCase());
      } else {
        result.push(item.toLowerCase());
      }
    });
    return result;
  };
  const KEYWORDS3 = {
    keyword: KWS,
    literal: dualCase(LITERALS3),
    built_in: BUILT_INS3
  };
  const normalizeKeywords = (items) => {
    return items.map((item) => {
      return item.replace(/\|\d+$/, "");
    });
  };
  const CONSTRUCTOR_CALL = { variants: [
    {
      match: [
        /new/,
        regex.concat(WHITESPACE, "+"),
        // to prevent built ins from being confused as the class constructor call
        regex.concat("(?!", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
        PASCAL_CASE_CLASS_NAME_RE
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] };
  const CONSTANT_REFERENCE = regex.concat(IDENT_RE3, "\\b(?!\\()");
  const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = { variants: [
    {
      match: [
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: { 2: "variable.constant" }
    },
    {
      match: [
        /::/,
        /class/
      ],
      scope: { 2: "variable.language" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: {
        1: "title.class",
        3: "variable.constant"
      }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          "::",
          regex.lookahead(/(?!class\b)/)
        )
      ],
      scope: { 1: "title.class" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        /::/,
        /class/
      ],
      scope: {
        1: "title.class",
        3: "variable.language"
      }
    }
  ] };
  const NAMED_ARGUMENT = {
    scope: "attr",
    match: regex.concat(IDENT_RE3, regex.lookahead(":"), regex.lookahead(/(?!::)/))
  };
  const PARAMS_MODE = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: KEYWORDS3,
    contains: [
      NAMED_ARGUMENT,
      VARIABLE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING,
      NUMBER,
      CONSTRUCTOR_CALL
    ]
  };
  const FUNCTION_INVOKE = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
      IDENT_RE3,
      regex.concat(WHITESPACE, "*"),
      regex.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [PARAMS_MODE]
  };
  PARAMS_MODE.contains.push(FUNCTION_INVOKE);
  const ATTRIBUTE_CONTAINS = [
    NAMED_ARGUMENT,
    LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
    hljs.C_BLOCK_COMMENT_MODE,
    STRING,
    NUMBER,
    CONSTRUCTOR_CALL
  ];
  const ATTRIBUTES3 = {
    begin: regex.concat(/#\[\s*/, PASCAL_CASE_CLASS_NAME_RE),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: LITERALS3,
      keyword: [
        "new",
        "array"
      ]
    },
    contains: [
      {
        begin: /\[/,
        end: /]/,
        keywords: {
          literal: LITERALS3,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...ATTRIBUTE_CONTAINS
        ]
      },
      ...ATTRIBUTE_CONTAINS,
      {
        scope: "meta",
        match: PASCAL_CASE_CLASS_NAME_RE
      }
    ]
  };
  return {
    case_insensitive: false,
    keywords: KEYWORDS3,
    contains: [
      ATTRIBUTES3,
      hljs.HASH_COMMENT_MODE,
      hljs.COMMENT("//", "$"),
      hljs.COMMENT(
        "/\\*",
        "\\*/",
        { contains: [
          {
            scope: "doctag",
            match: "@[A-Za-z]+"
          }
        ] }
      ),
      {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: hljs.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: true
            }
          ]
        }
      },
      PREPROCESSOR,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      VARIABLE,
      FUNCTION_INVOKE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      {
        match: [
          /const/,
          /\s/,
          IDENT_RE3
        ],
        scope: {
          1: "keyword",
          3: "variable.constant"
        }
      },
      CONSTRUCTOR_CALL,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: true,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          hljs.UNDERSCORE_TITLE_MODE,
          {
            begin: "=>",
            // No markup, just a relevance booster
            endsParent: true
          },
          {
            scope: "params",
            begin: "\\(",
            end: "\\)",
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS3,
            contains: [
              "self",
              VARIABLE,
              LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
              hljs.C_BLOCK_COMMENT_MODE,
              STRING,
              NUMBER
            ]
          }
        ]
      },
      {
        scope: "class",
        variants: [
          {
            beginKeywords: "enum",
            illegal: /[($"]/
          },
          {
            beginKeywords: "class interface trait",
            illegal: /[:($"]/
          }
        ],
        relevance: 0,
        end: /\{/,
        excludeEnd: true,
        contains: [
          { beginKeywords: "extends implements" },
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      // both use and namespace still use "old style" rules (vs multi-match)
      // because the namespace name can include `\` and we still want each
      // element to be treated as its own *individual* title
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
      },
      {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [
          // TODO: title.function vs title.class
          {
            match: /\b(as|const|function)\b/,
            scope: "keyword"
          },
          // TODO: could be title.class or title.function
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      STRING,
      NUMBER
    ]
  };
}

// node_modules/highlight.js/es/languages/scss.js
var MODES2 = (hljs) => {
  return {
    IMPORTANT: {
      scope: "meta",
      begin: "!important"
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z_][A-Za-z0-9_-]*/
    }
  };
};
var TAGS2 = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "p",
  "q",
  "quote",
  "samp",
  "section",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
];
var MEDIA_FEATURES2 = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  // TODO: find a better solution?
  "min-width",
  "max-width",
  "min-height",
  "max-height"
];
var PSEUDO_CLASSES2 = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  // dir()
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  // has()
  "host",
  // host or host()
  "host-context",
  // host-context()
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  // is()
  "lang",
  // lang()
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  // not()
  "nth-child",
  // nth-child()
  "nth-col",
  // nth-col()
  "nth-last-child",
  // nth-last-child()
  "nth-last-col",
  // nth-last-col()
  "nth-last-of-type",
  //nth-last-of-type()
  "nth-of-type",
  //nth-of-type()
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
  // where()
];
var PSEUDO_ELEMENTS2 = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
];
var ATTRIBUTES2 = [
  "align-content",
  "align-items",
  "align-self",
  "all",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "direction",
  "display",
  "empty-cells",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flow",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-size",
  "font-size-adjust",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "gap",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "inline-size",
  "isolation",
  "justify-content",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "pointer-events",
  "position",
  "quotes",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "row-gap",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "speak",
  "speak-as",
  "src",
  // @font-face
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-style",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-transform",
  "text-underline-position",
  "top",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "unicode-bidi",
  "vertical-align",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "z-index"
  // reverse makes sure longer attributes `font-weight` are matched fully
  // instead of getting false positives on say `font`
].reverse();
function scss(hljs) {
  const modes = MODES2(hljs);
  const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS2;
  const PSEUDO_CLASSES$1 = PSEUDO_CLASSES2;
  const AT_IDENTIFIER = "@[a-z-]+";
  const AT_MODIFIERS = "and or not only";
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const VARIABLE = {
    className: "variable",
    begin: "(\\$" + IDENT_RE3 + ")\\b",
    relevance: 0
  };
  return {
    name: "SCSS",
    case_insensitive: true,
    illegal: "[=/|']",
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: "#[A-Za-z0-9_-]+",
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\.[A-Za-z0-9_-]+",
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS2.join("|") + ")\\b",
        // was there, before, but why?
        relevance: 0
      },
      {
        className: "selector-pseudo",
        begin: ":(" + PSEUDO_CLASSES$1.join("|") + ")"
      },
      {
        className: "selector-pseudo",
        begin: ":(:)?(" + PSEUDO_ELEMENTS$1.join("|") + ")"
      },
      VARIABLE,
      {
        // pseudo-selector params
        begin: /\(/,
        end: /\)/,
        contains: [modes.CSS_NUMBER_MODE]
      },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES2.join("|") + ")\\b"
      },
      { begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
      {
        begin: /:/,
        end: /[;}{]/,
        relevance: 0,
        contains: [
          modes.BLOCK_COMMENT,
          VARIABLE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.IMPORTANT,
          modes.FUNCTION_DISPATCH
        ]
      },
      // matching these here allows us to treat them more like regular CSS
      // rules so everything between the {} gets regular rule highlighting,
      // which is what we want for page and font-face
      {
        begin: "@(page|font-face)",
        keywords: {
          $pattern: AT_IDENTIFIER,
          keyword: "@page @font-face"
        }
      },
      {
        begin: "@",
        end: "[{;]",
        returnBegin: true,
        keywords: {
          $pattern: /[a-z-]+/,
          keyword: AT_MODIFIERS,
          attribute: MEDIA_FEATURES2.join(" ")
        },
        contains: [
          {
            begin: AT_IDENTIFIER,
            className: "keyword"
          },
          {
            begin: /[a-z-]+(?=:)/,
            className: "attribute"
          },
          VARIABLE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE
        ]
      },
      modes.FUNCTION_DISPATCH
    ]
  };
}

// node_modules/highlight.js/es/languages/shell.js
function shell(hljs) {
  return {
    name: "Shell Session",
    aliases: [
      "console",
      "shellsession"
    ],
    contains: [
      {
        className: "meta.prompt",
        // We cannot add \s (spaces) in the regular expression otherwise it will be too broad and produce unexpected result.
        // For instance, in the following example, it would match "echo /path/to/home >" as a prompt:
        // echo /path/to/home > t.exe
        begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
        starts: {
          end: /[^\\](?=\s*$)/,
          subLanguage: "bash"
        }
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/sql.js
function sql(hljs) {
  const regex = hljs.regex;
  const COMMENT_MODE = hljs.COMMENT("--", "$");
  const STRING = {
    className: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ begin: /''/ }]
      }
    ]
  };
  const QUOTED_IDENTIFIER = {
    begin: /"/,
    end: /"/,
    contains: [{ begin: /""/ }]
  };
  const LITERALS3 = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ];
  const MULTI_WORD_TYPES = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ];
  const TYPES3 = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "time",
    "timestamp",
    "varchar",
    "varying",
    // modifier (character varying)
    "varbinary"
  ];
  const NON_RESERVED_WORDS = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ];
  const RESERVED_WORDS = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year"
  ];
  const RESERVED_FUNCTIONS = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket"
  ];
  const POSSIBLE_WITHOUT_PARENS = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ];
  const COMBOS = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ];
  const FUNCTIONS = RESERVED_FUNCTIONS;
  const KEYWORDS3 = [
    ...RESERVED_WORDS,
    ...NON_RESERVED_WORDS
  ].filter((keyword) => {
    return !RESERVED_FUNCTIONS.includes(keyword);
  });
  const VARIABLE = {
    className: "variable",
    begin: /@[a-z0-9][a-z0-9_]*/
  };
  const OPERATOR = {
    className: "operator",
    begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  };
  const FUNCTION_CALL = {
    begin: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
    relevance: 0,
    keywords: { built_in: FUNCTIONS }
  };
  function reduceRelevancy(list, {
    exceptions,
    when
  } = {}) {
    const qualifyFn = when;
    exceptions = exceptions || [];
    return list.map((item) => {
      if (item.match(/\|\d+$/) || exceptions.includes(item)) {
        return item;
      } else if (qualifyFn(item)) {
        return `${item}|0`;
      } else {
        return item;
      }
    });
  }
  return {
    name: "SQL",
    case_insensitive: true,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: reduceRelevancy(KEYWORDS3, { when: (x) => x.length < 3 }),
      literal: LITERALS3,
      type: TYPES3,
      built_in: POSSIBLE_WITHOUT_PARENS
    },
    contains: [
      {
        begin: regex.either(...COMBOS),
        relevance: 0,
        keywords: {
          $pattern: /[\w\.]+/,
          keyword: KEYWORDS3.concat(COMBOS),
          literal: LITERALS3,
          type: TYPES3
        }
      },
      {
        className: "type",
        begin: regex.either(...MULTI_WORD_TYPES)
      },
      FUNCTION_CALL,
      VARIABLE,
      STRING,
      QUOTED_IDENTIFIER,
      hljs.C_NUMBER_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      OPERATOR
    ]
  };
}

// node_modules/highlight.js/es/languages/typescript.js
var IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
var KEYWORDS2 = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
var LITERALS2 = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var TYPES2 = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];
var ERROR_TYPES2 = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var BUILT_IN_GLOBALS2 = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var BUILT_IN_VARIABLES2 = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
];
var BUILT_INS2 = [].concat(
  BUILT_IN_GLOBALS2,
  TYPES2,
  ERROR_TYPES2
);
function javascript2(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE2;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2,
    literal: LITERALS2,
    built_in: BUILT_INS2,
    "variable.language": BUILT_IN_VARIABLES2
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: "html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: "css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: "gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES2,
        ...ERROR_TYPES2
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS2,
        "super",
        "import"
      ]),
      IDENT_RE$1,
      regex.lookahead(/\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        className: "attr",
        begin: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function typescript(hljs) {
  const tsLanguage = javascript2(hljs);
  const IDENT_RE$1 = IDENT_RE2;
  const TYPES3 = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ];
  const NAMESPACE = {
    beginKeywords: "namespace",
    end: /\{/,
    excludeEnd: true,
    contains: [tsLanguage.exports.CLASS_REFERENCE]
  };
  const INTERFACE = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: "interface extends",
      built_in: TYPES3
    },
    contains: [tsLanguage.exports.CLASS_REFERENCE]
  };
  const USE_STRICT = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  };
  const TS_SPECIFIC_KEYWORDS = [
    "type",
    "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override"
  ];
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
    literal: LITERALS2,
    built_in: BUILT_INS2.concat(TYPES3),
    "variable.language": BUILT_IN_VARIABLES2
  };
  const DECORATOR = {
    className: "meta",
    begin: "@" + IDENT_RE$1
  };
  const swapMode = (mode, label, replacement) => {
    const indx = mode.contains.findIndex((m) => m.label === label);
    if (indx === -1) {
      throw new Error("can not find mode to replace");
    }
    mode.contains.splice(indx, 1, replacement);
  };
  Object.assign(tsLanguage.keywords, KEYWORDS$1);
  tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
  tsLanguage.contains = tsLanguage.contains.concat([
    DECORATOR,
    NAMESPACE,
    INTERFACE
  ]);
  swapMode(tsLanguage, "shebang", hljs.SHEBANG());
  swapMode(tsLanguage, "use_strict", USE_STRICT);
  const functionDeclaration = tsLanguage.contains.find((m) => m.label === "func.def");
  functionDeclaration.relevance = 0;
  Object.assign(tsLanguage, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  });
  return tsLanguage;
}

// node_modules/highlight.js/es/languages/xml.js
function xml(hljs) {
  const regex = hljs.regex;
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const XML_META_KEYWORDS = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  };
  const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
    begin: /\(/,
    end: /\)/
  });
  const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
  const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [XML_ENTITIES]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [XML_ENTITIES]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          XML_META_KEYWORDS,
          QUOTE_META_STRING_MODE,
          APOS_META_STRING_MODE,
          XML_META_PAR_KEYWORDS,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  XML_META_KEYWORDS,
                  XML_META_PAR_KEYWORDS,
                  QUOTE_META_STRING_MODE,
                  APOS_META_STRING_MODE
                ]
              }
            ]
          }
        ]
      },
      hljs.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      XML_ENTITIES,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              QUOTE_META_STRING_MODE
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      // we need this for now for jSX
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: "tag",
        begin: regex.concat(
          /</,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            // <tag/>
            // <tag>
            // <tag ...
            regex.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0,
            starts: TAG_INTERNALS
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: regex.concat(
          /<\//,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/yaml.js
function yaml(hljs) {
  const LITERALS3 = "true false yes no null";
  const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
  const KEY = {
    className: "attr",
    variants: [
      { begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)" },
      {
        // double quoted keys
        begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'
      },
      {
        // single quoted keys
        begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"
      }
    ]
  };
  const TEMPLATE_VARIABLES = {
    className: "template-variable",
    variants: [
      {
        // jinja templates Ansible
        begin: /\{\{/,
        end: /\}\}/
      },
      {
        // Ruby i18n
        begin: /%\{/,
        end: /\}/
      }
    ]
  };
  const STRING = {
    className: "string",
    relevance: 0,
    variants: [
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      },
      { begin: /\S+/ }
    ],
    contains: [
      hljs.BACKSLASH_ESCAPE,
      TEMPLATE_VARIABLES
    ]
  };
  const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
    {
      begin: /'/,
      end: /'/
    },
    {
      begin: /"/,
      end: /"/
    },
    { begin: /[^\s,{}[\]]+/ }
  ] });
  const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
  const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
  const FRACTION_RE = "(\\.[0-9]*)?";
  const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
  const TIMESTAMP = {
    className: "number",
    begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
  };
  const VALUE_CONTAINER = {
    end: ",",
    endsWithParent: true,
    excludeEnd: true,
    keywords: LITERALS3,
    relevance: 0
  };
  const OBJECT = {
    begin: /\{/,
    end: /\}/,
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const ARRAY = {
    begin: "\\[",
    end: "\\]",
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const MODES3 = [
    KEY,
    {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    },
    {
      // multi line string
      // Blocks start with a | or > followed by a newline
      //
      // Indentation of subsequent lines must be the same to
      // be considered part of the block
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    },
    {
      // Ruby/Rails erb
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    },
    {
      // named tags
      className: "type",
      begin: "!\\w+!" + URI_CHARACTERS
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + URI_CHARACTERS + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + URI_CHARACTERS
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + URI_CHARACTERS
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    hljs.HASH_COMMENT_MODE,
    {
      beginKeywords: LITERALS3,
      keywords: { literal: LITERALS3 }
    },
    TIMESTAMP,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: hljs.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    OBJECT,
    ARRAY,
    STRING
  ];
  const VALUE_MODES = [...MODES3];
  VALUE_MODES.pop();
  VALUE_MODES.push(CONTAINER_STRING);
  VALUE_CONTAINER.contains = VALUE_MODES;
  return {
    name: "YAML",
    case_insensitive: true,
    aliases: ["yml"],
    contains: MODES3
  };
}

// resources/js/index.js
core_default.registerLanguage("bash", bash);
core_default.registerLanguage("css", css);
core_default.registerLanguage("dockerfile", dockerfile);
core_default.registerLanguage("graphql", graphql);
core_default.registerLanguage("javascript", javascript);
core_default.registerLanguage("json", json);
core_default.registerLanguage("markdown", markdown);
core_default.registerLanguage("php", php);
core_default.registerLanguage("scss", scss);
core_default.registerLanguage("shell", shell);
core_default.registerLanguage("sql", sql);
core_default.registerLanguage("typescript", typescript);
core_default.registerLanguage("xml", xml);
core_default.registerLanguage("yaml", yaml);
document.querySelectorAll(".filament-syntax-entry pre code").forEach((el) => {
  core_default.highlightElement(el);
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9saWIvY29yZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2NvcmUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMvYmFzaC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9jc3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMvZG9ja2VyZmlsZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9ncmFwaHFsLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXMvbGFuZ3VhZ2VzL2phdmFzY3JpcHQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMvanNvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9tYXJrZG93bi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9waHAuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMvc2Nzcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9zaGVsbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy9zcWwuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMvdHlwZXNjcmlwdC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VzL2xhbmd1YWdlcy94bWwuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9sYW5ndWFnZXMveWFtbC5qcyIsICIuLi9qcy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktYXNzaWduICovXG5cbmZ1bmN0aW9uIGRlZXBGcmVlemUob2JqKSB7XG4gIGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcbiAgICBvYmouY2xlYXIgPVxuICAgICAgb2JqLmRlbGV0ZSA9XG4gICAgICBvYmouc2V0ID1cbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWFwIGlzIHJlYWQtb25seScpO1xuICAgICAgICB9O1xuICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFNldCkge1xuICAgIG9iai5hZGQgPVxuICAgICAgb2JqLmNsZWFyID1cbiAgICAgIG9iai5kZWxldGUgPVxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXQgaXMgcmVhZC1vbmx5Jyk7XG4gICAgICAgIH07XG4gIH1cblxuICAvLyBGcmVlemUgc2VsZlxuICBPYmplY3QuZnJlZXplKG9iaik7XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgY29uc3QgcHJvcCA9IG9ialtuYW1lXTtcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHByb3A7XG5cbiAgICAvLyBGcmVlemUgcHJvcCBpZiBpdCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gYW5kIGFsc28gbm90IGFscmVhZHkgZnJvemVuXG4gICAgaWYgKCh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKSAmJiAhT2JqZWN0LmlzRnJvemVuKHByb3ApKSB7XG4gICAgICBkZWVwRnJlZXplKHByb3ApO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNhbGxiYWNrUmVzcG9uc2V9IENhbGxiYWNrUmVzcG9uc2UgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZSAqL1xuLyoqIEBpbXBsZW1lbnRzIENhbGxiYWNrUmVzcG9uc2UgKi9cblxuY2xhc3MgUmVzcG9uc2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG1vZGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgaWYgKG1vZGUuZGF0YSA9PT0gdW5kZWZpbmVkKSBtb2RlLmRhdGEgPSB7fTtcblxuICAgIHRoaXMuZGF0YSA9IG1vZGUuZGF0YTtcbiAgICB0aGlzLmlzTWF0Y2hJZ25vcmVkID0gZmFsc2U7XG4gIH1cblxuICBpZ25vcmVNYXRjaCgpIHtcbiAgICB0aGlzLmlzTWF0Y2hJZ25vcmVkID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlSFRNTCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWVcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmI3gyNzsnKTtcbn1cblxuLyoqXG4gKiBwZXJmb3JtcyBhIHNoYWxsb3cgbWVyZ2Ugb2YgbXVsdGlwbGUgb2JqZWN0cyBpbnRvIG9uZVxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge1R9IG9yaWdpbmFsXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsYW55PltdfSBvYmplY3RzXG4gKiBAcmV0dXJucyB7VH0gYSBzaW5nbGUgbmV3IG9iamVjdFxuICovXG5mdW5jdGlvbiBpbmhlcml0JDEob3JpZ2luYWwsIC4uLm9iamVjdHMpIHtcbiAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsYW55PiAqL1xuICBjb25zdCByZXN1bHQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZvciAoY29uc3Qga2V5IGluIG9yaWdpbmFsKSB7XG4gICAgcmVzdWx0W2tleV0gPSBvcmlnaW5hbFtrZXldO1xuICB9XG4gIG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKHJlc3VsdCk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gUmVuZGVyZXJcbiAqIEBwcm9wZXJ0eSB7KHRleHQ6IHN0cmluZykgPT4gdm9pZH0gYWRkVGV4dFxuICogQHByb3BlcnR5IHsobm9kZTogTm9kZSkgPT4gdm9pZH0gb3Blbk5vZGVcbiAqIEBwcm9wZXJ0eSB7KG5vZGU6IE5vZGUpID0+IHZvaWR9IGNsb3NlTm9kZVxuICogQHByb3BlcnR5IHsoKSA9PiBzdHJpbmd9IHZhbHVlXG4gKi9cblxuLyoqIEB0eXBlZGVmIHt7c2NvcGU/OiBzdHJpbmcsIGxhbmd1YWdlPzogc3RyaW5nLCBzdWJsYW5ndWFnZT86IGJvb2xlYW59fSBOb2RlICovXG4vKiogQHR5cGVkZWYge3t3YWxrOiAocjogUmVuZGVyZXIpID0+IHZvaWR9fSBUcmVlICovXG4vKiogKi9cblxuY29uc3QgU1BBTl9DTE9TRSA9ICc8L3NwYW4+JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgbm9kZSBuZWVkcyB0byBiZSB3cmFwcGVkIGluIDxzcGFuPlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuY29uc3QgZW1pdHNXcmFwcGluZ1RhZ3MgPSAobm9kZSkgPT4ge1xuICAvLyByYXJlbHkgd2UgY2FuIGhhdmUgYSBzdWJsYW5ndWFnZSB3aGVyZSBsYW5ndWFnZSBpcyB1bmRlZmluZWRcbiAgLy8gVE9ETzogdHJhY2sgZG93biB3aHlcbiAgcmV0dXJuICEhbm9kZS5zY29wZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge3twcmVmaXg6c3RyaW5nfX0gb3B0aW9uc1xuICovXG5jb25zdCBzY29wZVRvQ1NTQ2xhc3MgPSAobmFtZSwgeyBwcmVmaXggfSkgPT4ge1xuICAvLyBzdWItbGFuZ3VhZ2VcbiAgaWYgKG5hbWUuc3RhcnRzV2l0aChcImxhbmd1YWdlOlwiKSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoXCJsYW5ndWFnZTpcIiwgXCJsYW5ndWFnZS1cIik7XG4gIH1cbiAgLy8gdGllcmVkIHNjb3BlOiBjb21tZW50LmxpbmVcbiAgaWYgKG5hbWUuaW5jbHVkZXMoXCIuXCIpKSB7XG4gICAgY29uc3QgcGllY2VzID0gbmFtZS5zcGxpdChcIi5cIik7XG4gICAgcmV0dXJuIFtcbiAgICAgIGAke3ByZWZpeH0ke3BpZWNlcy5zaGlmdCgpfWAsXG4gICAgICAuLi4ocGllY2VzLm1hcCgoeCwgaSkgPT4gYCR7eH0ke1wiX1wiLnJlcGVhdChpICsgMSl9YCkpXG4gICAgXS5qb2luKFwiIFwiKTtcbiAgfVxuICAvLyBzaW1wbGUgc2NvcGVcbiAgcmV0dXJuIGAke3ByZWZpeH0ke25hbWV9YDtcbn07XG5cbi8qKiBAdHlwZSB7UmVuZGVyZXJ9ICovXG5jbGFzcyBIVE1MUmVuZGVyZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBIVE1MUmVuZGVyZXJcbiAgICpcbiAgICogQHBhcmFtIHtUcmVlfSBwYXJzZVRyZWUgLSB0aGUgcGFyc2UgdHJlZSAobXVzdCBzdXBwb3J0IGB3YWxrYCBBUEkpXG4gICAqIEBwYXJhbSB7e2NsYXNzUHJlZml4OiBzdHJpbmd9fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJzZVRyZWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XG4gICAgdGhpcy5jbGFzc1ByZWZpeCA9IG9wdGlvbnMuY2xhc3NQcmVmaXg7XG4gICAgcGFyc2VUcmVlLndhbGsodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0ZXh0cyB0byB0aGUgb3V0cHV0IHN0cmVhbVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAqL1xuICBhZGRUZXh0KHRleHQpIHtcbiAgICB0aGlzLmJ1ZmZlciArPSBlc2NhcGVIVE1MKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBub2RlIG9wZW4gdG8gdGhlIG91dHB1dCBzdHJlYW0gKGlmIG5lZWRlZClcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIG9wZW5Ob2RlKG5vZGUpIHtcbiAgICBpZiAoIWVtaXRzV3JhcHBpbmdUYWdzKG5vZGUpKSByZXR1cm47XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSBzY29wZVRvQ1NTQ2xhc3Mobm9kZS5zY29wZSxcbiAgICAgIHsgcHJlZml4OiB0aGlzLmNsYXNzUHJlZml4IH0pO1xuICAgIHRoaXMuc3BhbihjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBub2RlIGNsb3NlIHRvIHRoZSBvdXRwdXQgc3RyZWFtIChpZiBuZWVkZWQpXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuICBjbG9zZU5vZGUobm9kZSkge1xuICAgIGlmICghZW1pdHNXcmFwcGluZ1RhZ3Mobm9kZSkpIHJldHVybjtcblxuICAgIHRoaXMuYnVmZmVyICs9IFNQQU5fQ0xPU0U7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgYnVmZmVyXG4gICovXG4gIHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlcjtcbiAgfVxuXG4gIC8vIGhlbHBlcnNcblxuICAvKipcbiAgICogQnVpbGRzIGEgc3BhbiBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgKi9cbiAgc3BhbihjbGFzc05hbWUpIHtcbiAgICB0aGlzLmJ1ZmZlciArPSBgPHNwYW4gY2xhc3M9XCIke2NsYXNzTmFtZX1cIj5gO1xuICB9XG59XG5cbi8qKiBAdHlwZWRlZiB7e3Njb3BlPzogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZywgY2hpbGRyZW46IE5vZGVbXX0gfCBzdHJpbmd9IE5vZGUgKi9cbi8qKiBAdHlwZWRlZiB7e3Njb3BlPzogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZywgY2hpbGRyZW46IE5vZGVbXX0gfSBEYXRhTm9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkVtaXR0ZXJ9IEVtaXR0ZXIgKi9cbi8qKiAgKi9cblxuLyoqIEByZXR1cm5zIHtEYXRhTm9kZX0gKi9cbmNvbnN0IG5ld05vZGUgPSAob3B0cyA9IHt9KSA9PiB7XG4gIC8qKiBAdHlwZSBEYXRhTm9kZSAqL1xuICBjb25zdCByZXN1bHQgPSB7IGNoaWxkcmVuOiBbXSB9O1xuICBPYmplY3QuYXNzaWduKHJlc3VsdCwgb3B0cyk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jbGFzcyBUb2tlblRyZWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKiogQHR5cGUgRGF0YU5vZGUgKi9cbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Tm9kZSgpO1xuICAgIHRoaXMuc3RhY2sgPSBbdGhpcy5yb290Tm9kZV07XG4gIH1cblxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuICBnZXQgcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdE5vZGU7IH1cblxuICAvKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIGFkZChub2RlKSB7XG4gICAgdGhpcy50b3AuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0ge3N0cmluZ30gc2NvcGUgKi9cbiAgb3Blbk5vZGUoc2NvcGUpIHtcbiAgICAvKiogQHR5cGUgTm9kZSAqL1xuICAgIGNvbnN0IG5vZGUgPSBuZXdOb2RlKHsgc2NvcGUgfSk7XG4gICAgdGhpcy5hZGQobm9kZSk7XG4gICAgdGhpcy5zdGFjay5wdXNoKG5vZGUpO1xuICB9XG5cbiAgY2xvc2VOb2RlKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNsb3NlQWxsTm9kZXMoKSB7XG4gICAgd2hpbGUgKHRoaXMuY2xvc2VOb2RlKCkpO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3ROb2RlLCBudWxsLCA0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7IGltcG9ydChcIi4vaHRtbF9yZW5kZXJlclwiKS5SZW5kZXJlciB9IFJlbmRlcmVyXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IGJ1aWxkZXJcbiAgICovXG4gIHdhbGsoYnVpbGRlcikge1xuICAgIC8vIHRoaXMgZG9lcyBub3RcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgICAvLyB0aGlzIHdvcmtzXG4gICAgLy8gcmV0dXJuIFRva2VuVHJlZS5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSBidWlsZGVyXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKi9cbiAgc3RhdGljIF93YWxrKGJ1aWxkZXIsIG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGJ1aWxkZXIuYWRkVGV4dChub2RlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGJ1aWxkZXIub3Blbk5vZGUobm9kZSk7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLl93YWxrKGJ1aWxkZXIsIGNoaWxkKSk7XG4gICAgICBidWlsZGVyLmNsb3NlTm9kZShub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1aWxkZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqL1xuICBzdGF0aWMgX2NvbGxhcHNlKG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHJldHVybjtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHJldHVybjtcblxuICAgIGlmIChub2RlLmNoaWxkcmVuLmV2ZXJ5KGVsID0+IHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgIC8vIG5vZGUudGV4dCA9IG5vZGUuY2hpbGRyZW4uam9pbihcIlwiKTtcbiAgICAgIC8vIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtub2RlLmNoaWxkcmVuLmpvaW4oXCJcIildO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIFRva2VuVHJlZS5fY29sbGFwc2UoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICBDdXJyZW50bHkgdGhpcyBpcyBhbGwgcHJpdmF0ZSBBUEksIGJ1dCB0aGlzIGlzIHRoZSBtaW5pbWFsIEFQSSBuZWNlc3NhcnlcbiAgdGhhdCBhbiBFbWl0dGVyIG11c3QgaW1wbGVtZW50IHRvIGZ1bGx5IHN1cHBvcnQgdGhlIHBhcnNlci5cblxuICBNaW5pbWFsIGludGVyZmFjZTpcblxuICAtIGFkZFRleHQodGV4dClcbiAgLSBfX2FkZFN1Ymxhbmd1YWdlKGVtaXR0ZXIsIHN1Ykxhbmd1YWdlTmFtZSlcbiAgLSBzdGFydFNjb3BlKHNjb3BlKVxuICAtIGVuZFNjb3BlKClcbiAgLSBmaW5hbGl6ZSgpXG4gIC0gdG9IVE1MKClcblxuKi9cblxuLyoqXG4gKiBAaW1wbGVtZW50cyB7RW1pdHRlcn1cbiAqL1xuY2xhc3MgVG9rZW5UcmVlRW1pdHRlciBleHRlbmRzIFRva2VuVHJlZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICovXG4gIGFkZFRleHQodGV4dCkge1xuICAgIGlmICh0ZXh0ID09PSBcIlwiKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5hZGQodGV4dCk7XG4gIH1cblxuICAvKiogQHBhcmFtIHtzdHJpbmd9IHNjb3BlICovXG4gIHN0YXJ0U2NvcGUoc2NvcGUpIHtcbiAgICB0aGlzLm9wZW5Ob2RlKHNjb3BlKTtcbiAgfVxuXG4gIGVuZFNjb3BlKCkge1xuICAgIHRoaXMuY2xvc2VOb2RlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbWl0dGVyICYge3Jvb3Q6IERhdGFOb2RlfX0gZW1pdHRlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgX19hZGRTdWJsYW5ndWFnZShlbWl0dGVyLCBuYW1lKSB7XG4gICAgLyoqIEB0eXBlIERhdGFOb2RlICovXG4gICAgY29uc3Qgbm9kZSA9IGVtaXR0ZXIucm9vdDtcbiAgICBpZiAobmFtZSkgbm9kZS5zY29wZSA9IGBsYW5ndWFnZToke25hbWV9YDtcblxuICAgIHRoaXMuYWRkKG5vZGUpO1xuICB9XG5cbiAgdG9IVE1MKCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IEhUTUxSZW5kZXJlcih0aGlzLCB0aGlzLm9wdGlvbnMpO1xuICAgIHJldHVybiByZW5kZXJlci52YWx1ZSgpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5jbG9zZUFsbE5vZGVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtSZWdFeHB9XG4gKiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHNvdXJjZShyZSkge1xuICBpZiAoIXJlKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGVvZiByZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHJlO1xuXG4gIHJldHVybiByZS5zb3VyY2U7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbG9va2FoZWFkKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/PScsIHJlLCAnKScpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGFueU51bWJlck9mVGltZXMocmUpIHtcbiAgcmV0dXJuIGNvbmNhdCgnKD86JywgcmUsICcpKicpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG9wdGlvbmFsKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/OicsIHJlLCAnKT8nKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gey4uLihSZWdFeHAgfCBzdHJpbmcpIH0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY29uY2F0KC4uLmFyZ3MpIHtcbiAgY29uc3Qgam9pbmVkID0gYXJncy5tYXAoKHgpID0+IHNvdXJjZSh4KSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGpvaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyBBcnJheTxzdHJpbmcgfCBSZWdFeHAgfCBPYmplY3Q+IH0gYXJnc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncykge1xuICBjb25zdCBvcHRzID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgJiYgb3B0cy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgYXJncy5zcGxpY2UoYXJncy5sZW5ndGggLSAxLCAxKTtcbiAgICByZXR1cm4gb3B0cztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHsge2NhcHR1cmU/OiBib29sZWFufSB9IFJlZ2V4RWl0aGVyT3B0aW9ucyAqL1xuXG4vKipcbiAqIEFueSBvZiB0aGUgcGFzc2VkIGV4cHJlc3NzaW9ucyBtYXkgbWF0Y2hcbiAqXG4gKiBDcmVhdGVzIGEgaHVnZSB0aGlzIHwgdGhpcyB8IHRoYXQgfCB0aGF0IG1hdGNoXG4gKiBAcGFyYW0geyhSZWdFeHAgfCBzdHJpbmcpW10gfCBbLi4uKFJlZ0V4cCB8IHN0cmluZylbXSwgUmVnZXhFaXRoZXJPcHRpb25zXX0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZWl0aGVyKC4uLmFyZ3MpIHtcbiAgLyoqIEB0eXBlIHsgb2JqZWN0ICYge2NhcHR1cmU/OiBib29sZWFufSB9ICAqL1xuICBjb25zdCBvcHRzID0gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncyk7XG4gIGNvbnN0IGpvaW5lZCA9ICcoJ1xuICAgICsgKG9wdHMuY2FwdHVyZSA/IFwiXCIgOiBcIj86XCIpXG4gICAgKyBhcmdzLm1hcCgoeCkgPT4gc291cmNlKHgpKS5qb2luKFwifFwiKSArIFwiKVwiO1xuICByZXR1cm4gam9pbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nfSByZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gY291bnRNYXRjaEdyb3VwcyhyZSkge1xuICByZXR1cm4gKG5ldyBSZWdFeHAocmUudG9TdHJpbmcoKSArICd8JykpLmV4ZWMoJycpLmxlbmd0aCAtIDE7XG59XG5cbi8qKlxuICogRG9lcyBsZXhlbWUgc3RhcnQgd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaCBhdCB0aGUgYmVnaW5uaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSB7c3RyaW5nfSBsZXhlbWVcbiAqL1xuZnVuY3Rpb24gc3RhcnRzV2l0aChyZSwgbGV4ZW1lKSB7XG4gIGNvbnN0IG1hdGNoID0gcmUgJiYgcmUuZXhlYyhsZXhlbWUpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2guaW5kZXggPT09IDA7XG59XG5cbi8vIEJBQ0tSRUZfUkUgbWF0Y2hlcyBhbiBvcGVuIHBhcmVudGhlc2lzIG9yIGJhY2tyZWZlcmVuY2UuIFRvIGF2b2lkXG4vLyBhbiBpbmNvcnJlY3QgcGFyc2UsIGl0IGFkZGl0aW9uYWxseSBtYXRjaGVzIHRoZSBmb2xsb3dpbmc6XG4vLyAtIFsuLi5dIGVsZW1lbnRzLCB3aGVyZSB0aGUgbWVhbmluZyBvZiBwYXJlbnRoZXNlcyBhbmQgZXNjYXBlcyBjaGFuZ2Vcbi8vIC0gb3RoZXIgZXNjYXBlIHNlcXVlbmNlcywgc28gd2UgZG8gbm90IG1pc3BhcnNlIGVzY2FwZSBzZXF1ZW5jZXMgYXNcbi8vICAgaW50ZXJlc3RpbmcgZWxlbWVudHNcbi8vIC0gbm9uLW1hdGNoaW5nIG9yIGxvb2thaGVhZCBwYXJlbnRoZXNlcywgd2hpY2ggZG8gbm90IGNhcHR1cmUuIFRoZXNlXG4vLyAgIGZvbGxvdyB0aGUgJygnIHdpdGggYSAnPycuXG5jb25zdCBCQUNLUkVGX1JFID0gL1xcWyg/OlteXFxcXFxcXV18XFxcXC4pKlxcXXxcXChcXD8/fFxcXFwoWzEtOV1bMC05XSopfFxcXFwuLztcblxuLy8gKipJTlRFUk5BTCoqIE5vdCBpbnRlbmRlZCBmb3Igb3V0c2lkZSB1c2FnZVxuLy8gam9pbiBsb2dpY2FsbHkgY29tcHV0ZXMgcmVnZXhwcy5qb2luKHNlcGFyYXRvciksIGJ1dCBmaXhlcyB0aGVcbi8vIGJhY2tyZWZlcmVuY2VzIHNvIHRoZXkgY29udGludWUgdG8gbWF0Y2guXG4vLyBpdCBhbHNvIHBsYWNlcyBlYWNoIGluZGl2aWR1YWwgcmVndWxhciBleHByZXNzaW9uIGludG8gaXQncyBvd25cbi8vIG1hdGNoIGdyb3VwLCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBzZXF1ZW5jaW5nIG9mIHRob3NlIG1hdGNoIGdyb3Vwc1xuLy8gaXMgY3VycmVudGx5IGFuIGV4ZXJjaXNlIGZvciB0aGUgY2FsbGVyLiA6LSlcbi8qKlxuICogQHBhcmFtIHsoc3RyaW5nIHwgUmVnRXhwKVtdfSByZWdleHBzXG4gKiBAcGFyYW0ge3tqb2luV2l0aDogc3RyaW5nfX0gb3B0c1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyhyZWdleHBzLCB7IGpvaW5XaXRoIH0pIHtcbiAgbGV0IG51bUNhcHR1cmVzID0gMDtcblxuICByZXR1cm4gcmVnZXhwcy5tYXAoKHJlZ2V4KSA9PiB7XG4gICAgbnVtQ2FwdHVyZXMgKz0gMTtcbiAgICBjb25zdCBvZmZzZXQgPSBudW1DYXB0dXJlcztcbiAgICBsZXQgcmUgPSBzb3VyY2UocmVnZXgpO1xuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlIChyZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IEJBQ0tSRUZfUkUuZXhlYyhyZSk7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIG91dCArPSByZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBvdXQgKz0gcmUuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgIHJlID0gcmUuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChtYXRjaFswXVswXSA9PT0gJ1xcXFwnICYmIG1hdGNoWzFdKSB7XG4gICAgICAgIC8vIEFkanVzdCB0aGUgYmFja3JlZmVyZW5jZS5cbiAgICAgICAgb3V0ICs9ICdcXFxcJyArIFN0cmluZyhOdW1iZXIobWF0Y2hbMV0pICsgb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSBtYXRjaFswXTtcbiAgICAgICAgaWYgKG1hdGNoWzBdID09PSAnKCcpIHtcbiAgICAgICAgICBudW1DYXB0dXJlcysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0pLm1hcChyZSA9PiBgKCR7cmV9KWApLmpvaW4oam9pbldpdGgpO1xufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTW9kZX0gTW9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLk1vZGVDYWxsYmFja30gTW9kZUNhbGxiYWNrICovXG5cbi8vIENvbW1vbiByZWdleHBzXG5jb25zdCBNQVRDSF9OT1RISU5HX1JFID0gL1xcYlxcQi87XG5jb25zdCBJREVOVF9SRSA9ICdbYS16QS1aXVxcXFx3Kic7XG5jb25zdCBVTkRFUlNDT1JFX0lERU5UX1JFID0gJ1thLXpBLVpfXVxcXFx3Kic7XG5jb25zdCBOVU1CRVJfUkUgPSAnXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG5jb25zdCBDX05VTUJFUl9SRSA9ICcoLT8pKFxcXFxiMFt4WF1bYS1mQS1GMC05XSt8KFxcXFxiXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KSc7IC8vIDB4Li4uLCAwLi4uLCBkZWNpbWFsLCBmbG9hdFxuY29uc3QgQklOQVJZX05VTUJFUl9SRSA9ICdcXFxcYigwYlswMV0rKSc7IC8vIDBiLi4uXG5jb25zdCBSRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfC18LT18Lz18L3w6fDt8PDx8PDw9fDw9fDx8PT09fD09fD18Pj4+PXw+Pj18Pj18Pj4+fD4+fD58XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4vKipcbiogQHBhcmFtIHsgUGFydGlhbDxNb2RlPiAmIHtiaW5hcnk/OiBzdHJpbmcgfCBSZWdFeHB9IH0gb3B0c1xuKi9cbmNvbnN0IFNIRUJBTkcgPSAob3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IGJlZ2luU2hlYmFuZyA9IC9eIyFbIF0qXFwvLztcbiAgaWYgKG9wdHMuYmluYXJ5KSB7XG4gICAgb3B0cy5iZWdpbiA9IGNvbmNhdChcbiAgICAgIGJlZ2luU2hlYmFuZyxcbiAgICAgIC8uKlxcYi8sXG4gICAgICBvcHRzLmJpbmFyeSxcbiAgICAgIC9cXGIuKi8pO1xuICB9XG4gIHJldHVybiBpbmhlcml0JDEoe1xuICAgIHNjb3BlOiAnbWV0YScsXG4gICAgYmVnaW46IGJlZ2luU2hlYmFuZyxcbiAgICBlbmQ6IC8kLyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgXCJvbjpiZWdpblwiOiAobSwgcmVzcCkgPT4ge1xuICAgICAgaWYgKG0uaW5kZXggIT09IDApIHJlc3AuaWdub3JlTWF0Y2goKTtcbiAgICB9XG4gIH0sIG9wdHMpO1xufTtcblxuLy8gQ29tbW9uIG1vZGVzXG5jb25zdCBCQUNLU0xBU0hfRVNDQVBFID0ge1xuICBiZWdpbjogJ1xcXFxcXFxcW1xcXFxzXFxcXFNdJywgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQVBPU19TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1xcJycsXG4gIGVuZDogJ1xcJycsXG4gIGlsbGVnYWw6ICdcXFxcbicsXG4gIGNvbnRhaW5zOiBbQkFDS1NMQVNIX0VTQ0FQRV1cbn07XG5jb25zdCBRVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1wiJyxcbiAgZW5kOiAnXCInLFxuICBpbGxlZ2FsOiAnXFxcXG4nLFxuICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG59O1xuY29uc3QgUEhSQVNBTF9XT1JEU19NT0RFID0ge1xuICBiZWdpbjogL1xcYihhfGFufHRoZXxhcmV8SSdtfGlzbid0fGRvbid0fGRvZXNuJ3R8d29uJ3R8YnV0fGp1c3R8c2hvdWxkfHByZXR0eXxzaW1wbHl8ZW5vdWdofGdvbm5hfGdvaW5nfHd0Znxzb3xzdWNofHdpbGx8eW91fHlvdXJ8dGhleXxsaWtlfG1vcmUpXFxiL1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIGNvbW1lbnQgbW9kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUmVnRXhwfSBiZWdpblxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWdFeHB9IGVuZFxuICogQHBhcmFtIHtNb2RlIHwge319IFttb2RlT3B0aW9uc11cbiAqIEByZXR1cm5zIHtQYXJ0aWFsPE1vZGU+fVxuICovXG5jb25zdCBDT01NRU5UID0gZnVuY3Rpb24oYmVnaW4sIGVuZCwgbW9kZU9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBtb2RlID0gaW5oZXJpdCQxKFxuICAgIHtcbiAgICAgIHNjb3BlOiAnY29tbWVudCcsXG4gICAgICBiZWdpbixcbiAgICAgIGVuZCxcbiAgICAgIGNvbnRhaW5zOiBbXVxuICAgIH0sXG4gICAgbW9kZU9wdGlvbnNcbiAgKTtcbiAgbW9kZS5jb250YWlucy5wdXNoKHtcbiAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgLy8gaGFjayB0byBhdm9pZCB0aGUgc3BhY2UgZnJvbSBiZWluZyBpbmNsdWRlZC4gdGhlIHNwYWNlIGlzIG5lY2Vzc2FyeSB0b1xuICAgIC8vIG1hdGNoIGhlcmUgdG8gcHJldmVudCB0aGUgcGxhaW4gdGV4dCBydWxlIGJlbG93IGZyb20gZ29iYmxpbmcgdXAgZG9jdGFnc1xuICAgIGJlZ2luOiAnWyBdKig/PShUT0RPfEZJWE1FfE5PVEV8QlVHfE9QVElNSVpFfEhBQ0t8WFhYKTopJyxcbiAgICBlbmQ6IC8oVE9ET3xGSVhNRXxOT1RFfEJVR3xPUFRJTUlaRXxIQUNLfFhYWCk6LyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH0pO1xuICBjb25zdCBFTkdMSVNIX1dPUkQgPSBlaXRoZXIoXG4gICAgLy8gbGlzdCBvZiBjb21tb24gMSBhbmQgMiBsZXR0ZXIgd29yZHMgaW4gRW5nbGlzaFxuICAgIFwiSVwiLFxuICAgIFwiYVwiLFxuICAgIFwiaXNcIixcbiAgICBcInNvXCIsXG4gICAgXCJ1c1wiLFxuICAgIFwidG9cIixcbiAgICBcImF0XCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcIml0XCIsXG4gICAgXCJvblwiLFxuICAgIC8vIG5vdGU6IHRoaXMgaXMgbm90IGFuIGV4aGF1c3RpdmUgbGlzdCBvZiBjb250cmFjdGlvbnMsIGp1c3QgcG9wdWxhciBvbmVzXG4gICAgL1tBLVphLXpdK1snXShkfHZlfHJlfGxsfHR8c3xuKS8sIC8vIGNvbnRyYWN0aW9ucyAtIGNhbid0IHdlJ2QgdGhleSdyZSBsZXQncywgZXRjXG4gICAgL1tBLVphLXpdK1stXVthLXpdKy8sIC8vIGBuby13YXlgLCBldGMuXG4gICAgL1tBLVphLXpdW2Etel17Mix9LyAvLyBhbGxvdyBjYXBpdGFsaXplZCB3b3JkcyBhdCBiZWdpbm5pbmcgb2Ygc2VudGVuY2VzXG4gICk7XG4gIC8vIGxvb2tpbmcgbGlrZSBwbGFpbiB0ZXh0LCBtb3JlIGxpa2VseSB0byBiZSBhIGNvbW1lbnRcbiAgbW9kZS5jb250YWlucy5wdXNoKFxuICAgIHtcbiAgICAgIC8vIFRPRE86IGhvdyB0byBpbmNsdWRlIFwiLCAoLCApIHdpdGhvdXQgYnJlYWtpbmcgZ3JhbW1hcnMgdGhhdCB1c2UgdGhlc2UgZm9yXG4gICAgICAvLyBjb21tZW50IGRlbGltaXRlcnM/XG4gICAgICAvLyBiZWdpbjogL1sgXSsoWygpXCJdPyhbQS1aYS16Jy1dezMsfXxpc3xhfEl8c298dXN8W3RUXVtvT118YXR8aWZ8aW58aXR8b24pWy5dP1soKVwiOl0/KFsuXVsgXXxbIF18XFwpKSl7M30vXG4gICAgICAvLyAtLS1cblxuICAgICAgLy8gdGhpcyB0cmllcyB0byBmaW5kIHNlcXVlbmNlcyBvZiAzIGVuZ2xpc2ggd29yZHMgaW4gYSByb3cgKHdpdGhvdXQgYW55XG4gICAgICAvLyBcInByb2dyYW1taW5nXCIgdHlwZSBzeW50YXgpIHRoaXMgZ2l2ZXMgdXMgYSBzdHJvbmcgc2lnbmFsIHRoYXQgd2UndmVcbiAgICAgIC8vIFRSVUxZIGZvdW5kIGEgY29tbWVudCAtIHZzIHBlcmhhcHMgc2Nhbm5pbmcgd2l0aCB0aGUgd3JvbmcgbGFuZ3VhZ2UuXG4gICAgICAvLyBJdCdzIHBvc3NpYmxlIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQgTE9PS1MgbGlrZSB0aGUgc3RhcnQgb2YgdGhlXG4gICAgICAvLyBjb21tZW50IC0gYnV0IHRoZW4gaWYgdGhlcmUgaXMgbm8gcmVhZGFibGUgdGV4dCAtIGdvb2QgY2hhbmNlIGl0IGlzIGFcbiAgICAgIC8vIGZhbHNlIG1hdGNoIGFuZCBub3QgYSBjb21tZW50LlxuICAgICAgLy9cbiAgICAgIC8vIGZvciBhIHZpc3VhbCBleGFtcGxlIHBsZWFzZSBzZWU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yODI3XG5cbiAgICAgIGJlZ2luOiBjb25jYXQoXG4gICAgICAgIC9bIF0rLywgLy8gbmVjZXNzYXJ5IHRvIHByZXZlbnQgdXMgZ29iYmxpbmcgdXAgZG9jdGFncyBsaWtlIC8qIEBhdXRob3IgQm9iIE1jZ2lsbCAqL1xuICAgICAgICAnKCcsXG4gICAgICAgIEVOR0xJU0hfV09SRCxcbiAgICAgICAgL1suXT9bOl0/KFsuXVsgXXxbIF0pLyxcbiAgICAgICAgJyl7M30nKSAvLyBsb29rIGZvciAzIHdvcmRzIGluIGEgcm93XG4gICAgfVxuICApO1xuICByZXR1cm4gbW9kZTtcbn07XG5jb25zdCBDX0xJTkVfQ09NTUVOVF9NT0RFID0gQ09NTUVOVCgnLy8nLCAnJCcpO1xuY29uc3QgQ19CTE9DS19DT01NRU5UX01PREUgPSBDT01NRU5UKCcvXFxcXConLCAnXFxcXCovJyk7XG5jb25zdCBIQVNIX0NPTU1FTlRfTU9ERSA9IENPTU1FTlQoJyMnLCAnJCcpO1xuY29uc3QgTlVNQkVSX01PREUgPSB7XG4gIHNjb3BlOiAnbnVtYmVyJyxcbiAgYmVnaW46IE5VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQ19OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQ19OVU1CRVJfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IEJJTkFSWV9OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQklOQVJZX05VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgUkVHRVhQX01PREUgPSB7XG4gIHNjb3BlOiBcInJlZ2V4cFwiLFxuICBiZWdpbjogL1xcLyg/PVteL1xcbl0qXFwvKS8sXG4gIGVuZDogL1xcL1tnaW11eV0qLyxcbiAgY29udGFpbnM6IFtcbiAgICBCQUNLU0xBU0hfRVNDQVBFLFxuICAgIHtcbiAgICAgIGJlZ2luOiAvXFxbLyxcbiAgICAgIGVuZDogL1xcXS8sXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfVxuICBdXG59O1xuY29uc3QgVElUTEVfTU9ERSA9IHtcbiAgc2NvcGU6ICd0aXRsZScsXG4gIGJlZ2luOiBJREVOVF9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgVU5ERVJTQ09SRV9USVRMRV9NT0RFID0ge1xuICBzY29wZTogJ3RpdGxlJyxcbiAgYmVnaW46IFVOREVSU0NPUkVfSURFTlRfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IE1FVEhPRF9HVUFSRCA9IHtcbiAgLy8gZXhjbHVkZXMgbWV0aG9kIG5hbWVzIGZyb20ga2V5d29yZCBwcm9jZXNzaW5nXG4gIGJlZ2luOiAnXFxcXC5cXFxccyonICsgVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuXG4vKipcbiAqIEFkZHMgZW5kIHNhbWUgYXMgYmVnaW4gbWVjaGFuaWNzIHRvIGEgbW9kZVxuICpcbiAqIFlvdXIgbW9kZSBtdXN0IGluY2x1ZGUgYXQgbGVhc3QgYSBzaW5nbGUgKCkgbWF0Y2ggZ3JvdXAgYXMgdGhhdCBmaXJzdCBtYXRjaFxuICogZ3JvdXAgaXMgd2hhdCBpcyB1c2VkIGZvciBjb21wYXJpc29uXG4gKiBAcGFyYW0ge1BhcnRpYWw8TW9kZT59IG1vZGVcbiAqL1xuY29uc3QgRU5EX1NBTUVfQVNfQkVHSU4gPSBmdW5jdGlvbihtb2RlKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKG1vZGUsXG4gICAge1xuICAgICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgICAnb246YmVnaW4nOiAobSwgcmVzcCkgPT4geyByZXNwLmRhdGEuX2JlZ2luTWF0Y2ggPSBtWzFdOyB9LFxuICAgICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgICAnb246ZW5kJzogKG0sIHJlc3ApID0+IHsgaWYgKHJlc3AuZGF0YS5fYmVnaW5NYXRjaCAhPT0gbVsxXSkgcmVzcC5pZ25vcmVNYXRjaCgpOyB9XG4gICAgfSk7XG59O1xuXG52YXIgTU9ERVMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgQVBPU19TVFJJTkdfTU9ERTogQVBPU19TVFJJTkdfTU9ERSxcbiAgQkFDS1NMQVNIX0VTQ0FQRTogQkFDS1NMQVNIX0VTQ0FQRSxcbiAgQklOQVJZX05VTUJFUl9NT0RFOiBCSU5BUllfTlVNQkVSX01PREUsXG4gIEJJTkFSWV9OVU1CRVJfUkU6IEJJTkFSWV9OVU1CRVJfUkUsXG4gIENPTU1FTlQ6IENPTU1FTlQsXG4gIENfQkxPQ0tfQ09NTUVOVF9NT0RFOiBDX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgQ19MSU5FX0NPTU1FTlRfTU9ERTogQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgQ19OVU1CRVJfTU9ERTogQ19OVU1CRVJfTU9ERSxcbiAgQ19OVU1CRVJfUkU6IENfTlVNQkVSX1JFLFxuICBFTkRfU0FNRV9BU19CRUdJTjogRU5EX1NBTUVfQVNfQkVHSU4sXG4gIEhBU0hfQ09NTUVOVF9NT0RFOiBIQVNIX0NPTU1FTlRfTU9ERSxcbiAgSURFTlRfUkU6IElERU5UX1JFLFxuICBNQVRDSF9OT1RISU5HX1JFOiBNQVRDSF9OT1RISU5HX1JFLFxuICBNRVRIT0RfR1VBUkQ6IE1FVEhPRF9HVUFSRCxcbiAgTlVNQkVSX01PREU6IE5VTUJFUl9NT0RFLFxuICBOVU1CRVJfUkU6IE5VTUJFUl9SRSxcbiAgUEhSQVNBTF9XT1JEU19NT0RFOiBQSFJBU0FMX1dPUkRTX01PREUsXG4gIFFVT1RFX1NUUklOR19NT0RFOiBRVU9URV9TVFJJTkdfTU9ERSxcbiAgUkVHRVhQX01PREU6IFJFR0VYUF9NT0RFLFxuICBSRV9TVEFSVEVSU19SRTogUkVfU1RBUlRFUlNfUkUsXG4gIFNIRUJBTkc6IFNIRUJBTkcsXG4gIFRJVExFX01PREU6IFRJVExFX01PREUsXG4gIFVOREVSU0NPUkVfSURFTlRfUkU6IFVOREVSU0NPUkVfSURFTlRfUkUsXG4gIFVOREVSU0NPUkVfVElUTEVfTU9ERTogVU5ERVJTQ09SRV9USVRMRV9NT0RFXG59KTtcblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5DYWxsYmFja1Jlc3BvbnNlfSBDYWxsYmFja1Jlc3BvbnNlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlckV4dH0gQ29tcGlsZXJFeHRcbiovXG5cbi8vIEdyYW1tYXIgZXh0ZW5zaW9ucyAvIHBsdWdpbnNcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjgzM1xuXG4vLyBHcmFtbWFyIGV4dGVuc2lvbnMgYWxsb3cgXCJzeW50YWN0aWMgc3VnYXJcIiB0byBiZSBhZGRlZCB0byB0aGUgZ3JhbW1hciBtb2Rlc1xuLy8gd2l0aG91dCByZXF1aXJpbmcgYW55IHVuZGVybHlpbmcgY2hhbmdlcyB0byB0aGUgY29tcGlsZXIgaW50ZXJuYWxzLlxuXG4vLyBgY29tcGlsZU1hdGNoYCBiZWluZyB0aGUgcGVyZmVjdCBzbWFsbCBleGFtcGxlIG9mIG5vdyBhbGxvd2luZyBhIGdyYW1tYXJcbi8vIGF1dGhvciB0byB3cml0ZSBgbWF0Y2hgIHdoZW4gdGhleSBkZXNpcmUgdG8gbWF0Y2ggYSBzaW5nbGUgZXhwcmVzc2lvbiByYXRoZXJcbi8vIHRoYW4gYmVpbmcgZm9yY2VkIHRvIHVzZSBgYmVnaW5gLiAgVGhlIGV4dGVuc2lvbiB0aGVuIGp1c3QgbW92ZXMgYG1hdGNoYCBpbnRvXG4vLyBgYmVnaW5gIHdoZW4gaXQgcnVucy4gIEllLCBubyBmZWF0dXJlcyBoYXZlIGJlZW4gYWRkZWQsIGJ1dCB3ZSd2ZSBqdXN0IG1hZGVcbi8vIHRoZSBleHBlcmllbmNlIG9mIHdyaXRpbmcgKGFuZCByZWFkaW5nIGdyYW1tYXJzKSBhIGxpdHRsZSBiaXQgbmljZXIuXG5cbi8vIC0tLS0tLVxuXG4vLyBUT0RPOiBXZSBuZWVkIG5lZ2F0aXZlIGxvb2stYmVoaW5kIHN1cHBvcnQgdG8gZG8gdGhpcyBwcm9wZXJseVxuLyoqXG4gKiBTa2lwIGEgbWF0Y2ggaWYgaXQgaGFzIGEgcHJlY2VkaW5nIGRvdFxuICpcbiAqIFRoaXMgaXMgdXNlZCBmb3IgYGJlZ2luS2V5d29yZHNgIHRvIHByZXZlbnQgbWF0Y2hpbmcgZXhwcmVzc2lvbnMgc3VjaCBhc1xuICogYGJvYi5rZXl3b3JkLmRvKClgLiBUaGUgbW9kZSBjb21waWxlciBhdXRvbWF0aWNhbGx5IHdpcmVzIHRoaXMgdXAgYXMgYVxuICogc3BlY2lhbCBfaW50ZXJuYWxfICdvbjpiZWdpbicgY2FsbGJhY2sgZm9yIG1vZGVzIHdpdGggYGJlZ2luS2V5d29yZHNgXG4gKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gKiBAcGFyYW0ge0NhbGxiYWNrUmVzcG9uc2V9IHJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIHNraXBJZkhhc1ByZWNlZGluZ0RvdChtYXRjaCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgYmVmb3JlID0gbWF0Y2guaW5wdXRbbWF0Y2guaW5kZXggLSAxXTtcbiAgaWYgKGJlZm9yZSA9PT0gXCIuXCIpIHtcbiAgICByZXNwb25zZS5pZ25vcmVNYXRjaCgpO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gc2NvcGVDbGFzc05hbWUobW9kZSwgX3BhcmVudCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gIGlmIChtb2RlLmNsYXNzTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kZS5zY29wZSA9IG1vZGUuY2xhc3NOYW1lO1xuICAgIGRlbGV0ZSBtb2RlLmNsYXNzTmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIGBiZWdpbktleXdvcmRzYCBzeW50YWN0aWMgc3VnYXJcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gYmVnaW5LZXl3b3Jkcyhtb2RlLCBwYXJlbnQpIHtcbiAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgaWYgKCFtb2RlLmJlZ2luS2V5d29yZHMpIHJldHVybjtcblxuICAvLyBmb3IgbGFuZ3VhZ2VzIHdpdGgga2V5d29yZHMgdGhhdCBpbmNsdWRlIG5vbi13b3JkIGNoYXJhY3RlcnMgY2hlY2tpbmcgZm9yXG4gIC8vIGEgd29yZCBib3VuZGFyeSBpcyBub3Qgc3VmZmljaWVudCwgc28gaW5zdGVhZCB3ZSBjaGVjayBmb3IgYSB3b3JkIGJvdW5kYXJ5XG4gIC8vIG9yIHdoaXRlc3BhY2UgLSB0aGlzIGRvZXMgbm8gaGFybSBpbiBhbnkgY2FzZSBzaW5jZSBvdXIga2V5d29yZCBlbmdpbmVcbiAgLy8gZG9lc24ndCBhbGxvdyBzcGFjZXMgaW4ga2V5d29yZHMgYW55d2F5cyBhbmQgd2Ugc3RpbGwgY2hlY2sgZm9yIHRoZSBib3VuZGFyeVxuICAvLyBmaXJzdFxuICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBtb2RlLmJlZ2luS2V5d29yZHMuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKSg/IVxcXFwuKSg/PVxcXFxifFxcXFxzKSc7XG4gIG1vZGUuX19iZWZvcmVCZWdpbiA9IHNraXBJZkhhc1ByZWNlZGluZ0RvdDtcbiAgbW9kZS5rZXl3b3JkcyA9IG1vZGUua2V5d29yZHMgfHwgbW9kZS5iZWdpbktleXdvcmRzO1xuICBkZWxldGUgbW9kZS5iZWdpbktleXdvcmRzO1xuXG4gIC8vIHByZXZlbnRzIGRvdWJsZSByZWxldmFuY2UsIHRoZSBrZXl3b3JkcyB0aGVtc2VsdmVzIHByb3ZpZGVcbiAgLy8gcmVsZXZhbmNlLCB0aGUgbW9kZSBkb2Vzbid0IG5lZWQgdG8gZG91YmxlIGl0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpIG1vZGUucmVsZXZhbmNlID0gMDtcbn1cblxuLyoqXG4gKiBBbGxvdyBgaWxsZWdhbGAgdG8gY29udGFpbiBhbiBhcnJheSBvZiBpbGxlZ2FsIHZhbHVlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlSWxsZWdhbChtb2RlLCBfcGFyZW50KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtb2RlLmlsbGVnYWwpKSByZXR1cm47XG5cbiAgbW9kZS5pbGxlZ2FsID0gZWl0aGVyKC4uLm1vZGUuaWxsZWdhbCk7XG59XG5cbi8qKlxuICogYG1hdGNoYCB0byBtYXRjaCBhIHNpbmdsZSBleHByZXNzaW9uIGZvciByZWFkYWJpbGl0eVxuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlTWF0Y2gobW9kZSwgX3BhcmVudCkge1xuICBpZiAoIW1vZGUubWF0Y2gpIHJldHVybjtcbiAgaWYgKG1vZGUuYmVnaW4gfHwgbW9kZS5lbmQpIHRocm93IG5ldyBFcnJvcihcImJlZ2luICYgZW5kIGFyZSBub3Qgc3VwcG9ydGVkIHdpdGggbWF0Y2hcIik7XG5cbiAgbW9kZS5iZWdpbiA9IG1vZGUubWF0Y2g7XG4gIGRlbGV0ZSBtb2RlLm1hdGNoO1xufVxuXG4vKipcbiAqIHByb3ZpZGVzIHRoZSBkZWZhdWx0IDEgcmVsZXZhbmNlIHRvIGFsbCBtb2Rlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlUmVsZXZhbmNlKG1vZGUsIF9wYXJlbnQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZCkgbW9kZS5yZWxldmFuY2UgPSAxO1xufVxuXG4vLyBhbGxvdyBiZWZvcmVNYXRjaCB0byBhY3QgYXMgYSBcInF1YWxpZmllclwiIGZvciB0aGUgbWF0Y2hcbi8vIHRoZSBmdWxsIG1hdGNoIGJlZ2luIG11c3QgYmUgW2JlZm9yZU1hdGNoXVtiZWdpbl1cbmNvbnN0IGJlZm9yZU1hdGNoRXh0ID0gKG1vZGUsIHBhcmVudCkgPT4ge1xuICBpZiAoIW1vZGUuYmVmb3JlTWF0Y2gpIHJldHVybjtcbiAgLy8gc3RhcnRzIGNvbmZsaWN0cyB3aXRoIGVuZHNQYXJlbnQgd2hpY2ggd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIGNoaWxkXG4gIC8vIHJ1bGUgaXMgbm90IG1hdGNoZWQgbXVsdGlwbGUgdGltZXNcbiAgaWYgKG1vZGUuc3RhcnRzKSB0aHJvdyBuZXcgRXJyb3IoXCJiZWZvcmVNYXRjaCBjYW5ub3QgYmUgdXNlZCB3aXRoIHN0YXJ0c1wiKTtcblxuICBjb25zdCBvcmlnaW5hbE1vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBtb2RlKTtcbiAgT2JqZWN0LmtleXMobW9kZSkuZm9yRWFjaCgoa2V5KSA9PiB7IGRlbGV0ZSBtb2RlW2tleV07IH0pO1xuXG4gIG1vZGUua2V5d29yZHMgPSBvcmlnaW5hbE1vZGUua2V5d29yZHM7XG4gIG1vZGUuYmVnaW4gPSBjb25jYXQob3JpZ2luYWxNb2RlLmJlZm9yZU1hdGNoLCBsb29rYWhlYWQob3JpZ2luYWxNb2RlLmJlZ2luKSk7XG4gIG1vZGUuc3RhcnRzID0ge1xuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAgT2JqZWN0LmFzc2lnbihvcmlnaW5hbE1vZGUsIHsgZW5kc1BhcmVudDogdHJ1ZSB9KVxuICAgIF1cbiAgfTtcbiAgbW9kZS5yZWxldmFuY2UgPSAwO1xuXG4gIGRlbGV0ZSBvcmlnaW5hbE1vZGUuYmVmb3JlTWF0Y2g7XG59O1xuXG4vLyBrZXl3b3JkcyB0aGF0IHNob3VsZCBoYXZlIG5vIGRlZmF1bHQgcmVsZXZhbmNlIHZhbHVlXG5jb25zdCBDT01NT05fS0VZV09SRFMgPSBbXG4gICdvZicsXG4gICdhbmQnLFxuICAnZm9yJyxcbiAgJ2luJyxcbiAgJ25vdCcsXG4gICdvcicsXG4gICdpZicsXG4gICd0aGVuJyxcbiAgJ3BhcmVudCcsIC8vIGNvbW1vbiB2YXJpYWJsZSBuYW1lXG4gICdsaXN0JywgLy8gY29tbW9uIHZhcmlhYmxlIG5hbWVcbiAgJ3ZhbHVlJyAvLyBjb21tb24gdmFyaWFibGUgbmFtZVxuXTtcblxuY29uc3QgREVGQVVMVF9LRVlXT1JEX1NDT1BFID0gXCJrZXl3b3JkXCI7XG5cbi8qKlxuICogR2l2ZW4gcmF3IGtleXdvcmRzIGZyb20gYSBsYW5ndWFnZSBkZWZpbml0aW9uLCBjb21waWxlIHRoZW0uXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLHN0cmluZ3xzdHJpbmdbXT4gfCBBcnJheTxzdHJpbmc+fSByYXdLZXl3b3Jkc1xuICogQHBhcmFtIHtib29sZWFufSBjYXNlSW5zZW5zaXRpdmVcbiAqL1xuZnVuY3Rpb24gY29tcGlsZUtleXdvcmRzKHJhd0tleXdvcmRzLCBjYXNlSW5zZW5zaXRpdmUsIHNjb3BlTmFtZSA9IERFRkFVTFRfS0VZV09SRF9TQ09QRSkge1xuICAvKiogQHR5cGUge2ltcG9ydChcImhpZ2hsaWdodC5qcy9wcml2YXRlXCIpLktleXdvcmREaWN0fSAqL1xuICBjb25zdCBjb21waWxlZEtleXdvcmRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvLyBpbnB1dCBjYW4gYmUgYSBzdHJpbmcgb2Yga2V5d29yZHMsIGFuIGFycmF5IG9mIGtleXdvcmRzLCBvciBhIG9iamVjdCB3aXRoXG4gIC8vIG5hbWVkIGtleXMgcmVwcmVzZW50aW5nIHNjb3BlTmFtZSAod2hpY2ggY2FuIHRoZW4gcG9pbnQgdG8gYSBzdHJpbmcgb3IgYXJyYXkpXG4gIGlmICh0eXBlb2YgcmF3S2V5d29yZHMgPT09ICdzdHJpbmcnKSB7XG4gICAgY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCByYXdLZXl3b3Jkcy5zcGxpdChcIiBcIikpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3S2V5d29yZHMpKSB7XG4gICAgY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCByYXdLZXl3b3Jkcyk7XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmtleXMocmF3S2V5d29yZHMpLmZvckVhY2goZnVuY3Rpb24oc2NvcGVOYW1lKSB7XG4gICAgICAvLyBjb2xsYXBzZSBhbGwgb3VyIG9iamVjdHMgYmFjayBpbnRvIHRoZSBwYXJlbnQgb2JqZWN0XG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICBjb21waWxlZEtleXdvcmRzLFxuICAgICAgICBjb21waWxlS2V5d29yZHMocmF3S2V5d29yZHNbc2NvcGVOYW1lXSwgY2FzZUluc2Vuc2l0aXZlLCBzY29wZU5hbWUpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb21waWxlZEtleXdvcmRzO1xuXG4gIC8vIC0tLVxuXG4gIC8qKlxuICAgKiBDb21waWxlcyBhbiBpbmRpdmlkdWFsIGxpc3Qgb2Yga2V5d29yZHNcbiAgICpcbiAgICogRXg6IFwiZm9yIGlmIHdoZW4gd2hpbGV8NVwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29wZU5hbWVcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBrZXl3b3JkTGlzdFxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCBrZXl3b3JkTGlzdCkge1xuICAgIGlmIChjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICAgIGtleXdvcmRMaXN0ID0ga2V5d29yZExpc3QubWFwKHggPT4geC50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG4gICAga2V5d29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihrZXl3b3JkKSB7XG4gICAgICBjb25zdCBwYWlyID0ga2V5d29yZC5zcGxpdCgnfCcpO1xuICAgICAgY29tcGlsZWRLZXl3b3Jkc1twYWlyWzBdXSA9IFtzY29wZU5hbWUsIHNjb3JlRm9yS2V5d29yZChwYWlyWzBdLCBwYWlyWzFdKV07XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwcm9wZXIgc2NvcmUgZm9yIGEgZ2l2ZW4ga2V5d29yZFxuICpcbiAqIEFsc28gdGFrZXMgaW50byBhY2NvdW50IGNvbW1lbnQga2V5d29yZHMsIHdoaWNoIHdpbGwgYmUgc2NvcmVkIDAgVU5MRVNTXG4gKiBhbm90aGVyIHNjb3JlIGhhcyBiZWVuIG1hbnVhbGx5IGFzc2lnbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvdmlkZWRTY29yZV1cbiAqL1xuZnVuY3Rpb24gc2NvcmVGb3JLZXl3b3JkKGtleXdvcmQsIHByb3ZpZGVkU2NvcmUpIHtcbiAgLy8gbWFudWFsIHNjb3JlcyBhbHdheXMgd2luIG92ZXIgY29tbW9uIGtleXdvcmRzXG4gIC8vIHNvIHlvdSBjYW4gZm9yY2UgYSBzY29yZSBvZiAxIGlmIHlvdSByZWFsbHkgaW5zaXN0XG4gIGlmIChwcm92aWRlZFNjb3JlKSB7XG4gICAgcmV0dXJuIE51bWJlcihwcm92aWRlZFNjb3JlKTtcbiAgfVxuXG4gIHJldHVybiBjb21tb25LZXl3b3JkKGtleXdvcmQpID8gMCA6IDE7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIGdpdmVuIGtleXdvcmQgaXMgY29tbW9uIG9yIG5vdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkICovXG5mdW5jdGlvbiBjb21tb25LZXl3b3JkKGtleXdvcmQpIHtcbiAgcmV0dXJuIENPTU1PTl9LRVlXT1JEUy5pbmNsdWRlcyhrZXl3b3JkLnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKlxuXG5Gb3IgdGhlIHJlYXNvbmluZyBiZWhpbmQgdGhpcyBwbGVhc2Ugc2VlOlxuaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjg4MCNpc3N1ZWNvbW1lbnQtNzQ3Mjc1NDE5XG5cbiovXG5cbi8qKlxuICogQHR5cGUge1JlY29yZDxzdHJpbmcsIGJvb2xlYW4+fVxuICovXG5jb25zdCBzZWVuRGVwcmVjYXRpb25zID0ge307XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqL1xuY29uc3QgZXJyb3IgPSAobWVzc2FnZSkgPT4ge1xuICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqL1xuY29uc3Qgd2FybiA9IChtZXNzYWdlLCAuLi5hcmdzKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBXQVJOOiAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICovXG5jb25zdCBkZXByZWNhdGVkID0gKHZlcnNpb24sIG1lc3NhZ2UpID0+IHtcbiAgaWYgKHNlZW5EZXByZWNhdGlvbnNbYCR7dmVyc2lvbn0vJHttZXNzYWdlfWBdKSByZXR1cm47XG5cbiAgY29uc29sZS5sb2coYERlcHJlY2F0ZWQgYXMgb2YgJHt2ZXJzaW9ufS4gJHttZXNzYWdlfWApO1xuICBzZWVuRGVwcmVjYXRpb25zW2Ake3ZlcnNpb259LyR7bWVzc2FnZX1gXSA9IHRydWU7XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby10aHJvdy1saXRlcmFsICovXG5cbi8qKlxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRNb2RlfSBDb21waWxlZE1vZGVcbiovXG5cbmNvbnN0IE11bHRpQ2xhc3NFcnJvciA9IG5ldyBFcnJvcigpO1xuXG4vKipcbiAqIFJlbnVtYmVycyBsYWJlbGVkIHNjb3BlIG5hbWVzIHRvIGFjY291bnQgZm9yIGFkZGl0aW9uYWwgaW5uZXIgbWF0Y2hcbiAqIGdyb3VwcyB0aGF0IG90aGVyd2lzZSB3b3VsZCBicmVhayBldmVyeXRoaW5nLlxuICpcbiAqIExldHMgc2F5IHdlIDMgbWF0Y2ggc2NvcGVzOlxuICpcbiAqICAgeyAxID0+IC4uLiwgMiA9PiAuLi4sIDMgPT4gLi4uIH1cbiAqXG4gKiBTbyB3aGF0IHdlIG5lZWQgaXMgYSBjbGVhbiBtYXRjaCBsaWtlIHRoaXM6XG4gKlxuICogICAoYSkoYikoYykgPT4gWyBcImFcIiwgXCJiXCIsIFwiY1wiIF1cbiAqXG4gKiBCdXQgdGhpcyBmYWxscyBhcGFydCB3aXRoIGlubmVyIG1hdGNoIGdyb3VwczpcbiAqXG4gKiAoYSkoKChiKSkpKGMpID0+IFtcImFcIiwgXCJiXCIsIFwiYlwiLCBcImJcIiwgXCJjXCIgXVxuICpcbiAqIE91ciBzY29wZXMgYXJlIG5vdyBcIm91dCBvZiBhbGlnbm1lbnRcIiBhbmQgd2UncmUgcmVwZWF0aW5nIGBiYCAzIHRpbWVzLlxuICogV2hhdCBuZWVkcyB0byBoYXBwZW4gaXMgdGhlIG51bWJlcnMgYXJlIHJlbWFwcGVkOlxuICpcbiAqICAgeyAxID0+IC4uLiwgMiA9PiAuLi4sIDUgPT4gLi4uIH1cbiAqXG4gKiBXZSBhbHNvIG5lZWQgdG8ga25vdyB0aGF0IHRoZSBPTkxZIGdyb3VwcyB0aGF0IHNob3VsZCBiZSBvdXRwdXRcbiAqIGFyZSAxLCAyLCBhbmQgNS4gIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyB0aGlzIGJlaGF2aW9yLlxuICpcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKiBAcGFyYW0ge0FycmF5PFJlZ0V4cCB8IHN0cmluZz59IHJlZ2V4ZXNcbiAqIEBwYXJhbSB7e2tleTogXCJiZWdpblNjb3BlXCJ8XCJlbmRTY29wZVwifX0gb3B0c1xuICovXG5mdW5jdGlvbiByZW1hcFNjb3BlTmFtZXMobW9kZSwgcmVnZXhlcywgeyBrZXkgfSkge1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgY29uc3Qgc2NvcGVOYW1lcyA9IG1vZGVba2V5XTtcbiAgLyoqIEB0eXBlIFJlY29yZDxudW1iZXIsYm9vbGVhbj4gKi9cbiAgY29uc3QgZW1pdCA9IHt9O1xuICAvKiogQHR5cGUgUmVjb3JkPG51bWJlcixzdHJpbmc+ICovXG4gIGNvbnN0IHBvc2l0aW9ucyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IHJlZ2V4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBwb3NpdGlvbnNbaSArIG9mZnNldF0gPSBzY29wZU5hbWVzW2ldO1xuICAgIGVtaXRbaSArIG9mZnNldF0gPSB0cnVlO1xuICAgIG9mZnNldCArPSBjb3VudE1hdGNoR3JvdXBzKHJlZ2V4ZXNbaSAtIDFdKTtcbiAgfVxuICAvLyB3ZSB1c2UgX2VtaXQgdG8ga2VlcCB0cmFjayBvZiB3aGljaCBtYXRjaCBncm91cHMgYXJlIFwidG9wLWxldmVsXCIgdG8gYXZvaWQgZG91YmxlXG4gIC8vIG91dHB1dCBmcm9tIGluc2lkZSBtYXRjaCBncm91cHNcbiAgbW9kZVtrZXldID0gcG9zaXRpb25zO1xuICBtb2RlW2tleV0uX2VtaXQgPSBlbWl0O1xuICBtb2RlW2tleV0uX211bHRpID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBiZWdpbk11bHRpQ2xhc3MobW9kZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobW9kZS5iZWdpbikpIHJldHVybjtcblxuICBpZiAobW9kZS5za2lwIHx8IG1vZGUuZXhjbHVkZUJlZ2luIHx8IG1vZGUucmV0dXJuQmVnaW4pIHtcbiAgICBlcnJvcihcInNraXAsIGV4Y2x1ZGVCZWdpbiwgcmV0dXJuQmVnaW4gbm90IGNvbXBhdGlibGUgd2l0aCBiZWdpblNjb3BlOiB7fVwiKTtcbiAgICB0aHJvdyBNdWx0aUNsYXNzRXJyb3I7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZGUuYmVnaW5TY29wZSAhPT0gXCJvYmplY3RcIiB8fCBtb2RlLmJlZ2luU2NvcGUgPT09IG51bGwpIHtcbiAgICBlcnJvcihcImJlZ2luU2NvcGUgbXVzdCBiZSBvYmplY3RcIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgcmVtYXBTY29wZU5hbWVzKG1vZGUsIG1vZGUuYmVnaW4sIHsga2V5OiBcImJlZ2luU2NvcGVcIiB9KTtcbiAgbW9kZS5iZWdpbiA9IF9yZXdyaXRlQmFja3JlZmVyZW5jZXMobW9kZS5iZWdpbiwgeyBqb2luV2l0aDogXCJcIiB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBlbmRNdWx0aUNsYXNzKG1vZGUpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGUuZW5kKSkgcmV0dXJuO1xuXG4gIGlmIChtb2RlLnNraXAgfHwgbW9kZS5leGNsdWRlRW5kIHx8IG1vZGUucmV0dXJuRW5kKSB7XG4gICAgZXJyb3IoXCJza2lwLCBleGNsdWRlRW5kLCByZXR1cm5FbmQgbm90IGNvbXBhdGlibGUgd2l0aCBlbmRTY29wZToge31cIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2RlLmVuZFNjb3BlICE9PSBcIm9iamVjdFwiIHx8IG1vZGUuZW5kU2NvcGUgPT09IG51bGwpIHtcbiAgICBlcnJvcihcImVuZFNjb3BlIG11c3QgYmUgb2JqZWN0XCIpO1xuICAgIHRocm93IE11bHRpQ2xhc3NFcnJvcjtcbiAgfVxuXG4gIHJlbWFwU2NvcGVOYW1lcyhtb2RlLCBtb2RlLmVuZCwgeyBrZXk6IFwiZW5kU2NvcGVcIiB9KTtcbiAgbW9kZS5lbmQgPSBfcmV3cml0ZUJhY2tyZWZlcmVuY2VzKG1vZGUuZW5kLCB7IGpvaW5XaXRoOiBcIlwiIH0pO1xufVxuXG4vKipcbiAqIHRoaXMgZXhpc3RzIG9ubHkgdG8gYWxsb3cgYHNjb3BlOiB7fWAgdG8gYmUgdXNlZCBiZXNpZGUgYG1hdGNoOmBcbiAqIE90aGVyd2lzZSBgYmVnaW5TY29wZWAgd291bGQgbmVjZXNzYXJ5IGFuZCB0aGF0IHdvdWxkIGxvb2sgd2VpcmRcblxuICB7XG4gICAgbWF0Y2g6IFsgL2RlZi8sIC9cXHcrLyBdXG4gICAgc2NvcGU6IHsgMTogXCJrZXl3b3JkXCIgLCAyOiBcInRpdGxlXCIgfVxuICB9XG5cbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIHNjb3BlU3VnYXIobW9kZSkge1xuICBpZiAobW9kZS5zY29wZSAmJiB0eXBlb2YgbW9kZS5zY29wZSA9PT0gXCJvYmplY3RcIiAmJiBtb2RlLnNjb3BlICE9PSBudWxsKSB7XG4gICAgbW9kZS5iZWdpblNjb3BlID0gbW9kZS5zY29wZTtcbiAgICBkZWxldGUgbW9kZS5zY29wZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIE11bHRpQ2xhc3MobW9kZSkge1xuICBzY29wZVN1Z2FyKG1vZGUpO1xuXG4gIGlmICh0eXBlb2YgbW9kZS5iZWdpblNjb3BlID09PSBcInN0cmluZ1wiKSB7XG4gICAgbW9kZS5iZWdpblNjb3BlID0geyBfd3JhcDogbW9kZS5iZWdpblNjb3BlIH07XG4gIH1cbiAgaWYgKHR5cGVvZiBtb2RlLmVuZFNjb3BlID09PSBcInN0cmluZ1wiKSB7XG4gICAgbW9kZS5lbmRTY29wZSA9IHsgX3dyYXA6IG1vZGUuZW5kU2NvcGUgfTtcbiAgfVxuXG4gIGJlZ2luTXVsdGlDbGFzcyhtb2RlKTtcbiAgZW5kTXVsdGlDbGFzcyhtb2RlKTtcbn1cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2V9IExhbmd1YWdlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTUGx1Z2lufSBITEpTUGx1Z2luXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZExhbmd1YWdlfSBDb21waWxlZExhbmd1YWdlXG4qL1xuXG4vLyBjb21waWxhdGlvblxuXG4vKipcbiAqIENvbXBpbGVzIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiByZXN1bHRcbiAqXG4gKiBHaXZlbiB0aGUgcmF3IHJlc3VsdCBvZiBhIGxhbmd1YWdlIGRlZmluaXRpb24gKExhbmd1YWdlKSwgY29tcGlsZXMgdGhpcyBzb1xuICogdGhhdCBpdCBpcyByZWFkeSBmb3IgaGlnaGxpZ2h0aW5nIGNvZGUuXG4gKiBAcGFyYW0ge0xhbmd1YWdlfSBsYW5ndWFnZVxuICogQHJldHVybnMge0NvbXBpbGVkTGFuZ3VhZ2V9XG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSkge1xuICAvKipcbiAgICogQnVpbGRzIGEgcmVnZXggd2l0aCB0aGUgY2FzZSBzZW5zaXRpdml0eSBvZiB0aGUgY3VycmVudCBsYW5ndWFnZVxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cCB8IHN0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBbZ2xvYmFsXVxuICAgKi9cbiAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICAgIHNvdXJjZSh2YWx1ZSksXG4gICAgICAnbSdcbiAgICAgICsgKGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyAnaScgOiAnJylcbiAgICAgICsgKGxhbmd1YWdlLnVuaWNvZGVSZWdleCA/ICd1JyA6ICcnKVxuICAgICAgKyAoZ2xvYmFsID8gJ2cnIDogJycpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgIFN0b3JlcyBtdWx0aXBsZSByZWd1bGFyIGV4cHJlc3Npb25zIGFuZCBhbGxvd3MgeW91IHRvIHF1aWNrbHkgc2VhcmNoIGZvclxuICAgIHRoZW0gYWxsIGluIGEgc3RyaW5nIHNpbXVsdGFuZW91c2x5IC0gcmV0dXJuaW5nIHRoZSBmaXJzdCBtYXRjaC4gIEl0IGRvZXNcbiAgICB0aGlzIGJ5IGNyZWF0aW5nIGEgaHVnZSAoYXxifGMpIHJlZ2V4IC0gZWFjaCBpbmRpdmlkdWFsIGl0ZW0gd3JhcHBlZCB3aXRoICgpXG4gICAgYW5kIGpvaW5lZCBieSBgfGAgLSB1c2luZyBtYXRjaCBncm91cHMgdG8gdHJhY2sgcG9zaXRpb24uICBXaGVuIGEgbWF0Y2ggaXNcbiAgICBmb3VuZCBjaGVja2luZyB3aGljaCBwb3NpdGlvbiBpbiB0aGUgYXJyYXkgaGFzIGNvbnRlbnQgYWxsb3dzIHVzIHRvIGZpZ3VyZVxuICAgIG91dCB3aGljaCBvZiB0aGUgb3JpZ2luYWwgcmVnZXhlcyAvIG1hdGNoIGdyb3VwcyB0cmlnZ2VyZWQgdGhlIG1hdGNoLlxuXG4gICAgVGhlIG1hdGNoIG9iamVjdCBpdHNlbGYgKHRoZSByZXN1bHQgb2YgYFJlZ2V4LmV4ZWNgKSBpcyByZXR1cm5lZCBidXQgYWxzb1xuICAgIGVuaGFuY2VkIGJ5IG1lcmdpbmcgaW4gYW55IG1ldGEtZGF0YSB0aGF0IHdhcyByZWdpc3RlcmVkIHdpdGggdGhlIHJlZ2V4LlxuICAgIFRoaXMgaXMgaG93IHdlIGtlZXAgdHJhY2sgb2Ygd2hpY2ggbW9kZSBtYXRjaGVkLCBhbmQgd2hhdCB0eXBlIG9mIHJ1bGVcbiAgICAoYGlsbGVnYWxgLCBgYmVnaW5gLCBlbmQsIGV0YykuXG4gICovXG4gIGNsYXNzIE11bHRpUmVnZXgge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5tYXRjaEluZGV4ZXMgPSB7fTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucmVnZXhlcyA9IFtdO1xuICAgICAgdGhpcy5tYXRjaEF0ID0gMTtcbiAgICAgIHRoaXMucG9zaXRpb24gPSAwO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhZGRSdWxlKHJlLCBvcHRzKSB7XG4gICAgICBvcHRzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbisrO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5tYXRjaEluZGV4ZXNbdGhpcy5tYXRjaEF0XSA9IG9wdHM7XG4gICAgICB0aGlzLnJlZ2V4ZXMucHVzaChbb3B0cywgcmVdKTtcbiAgICAgIHRoaXMubWF0Y2hBdCArPSBjb3VudE1hdGNoR3JvdXBzKHJlKSArIDE7XG4gICAgfVxuXG4gICAgY29tcGlsZSgpIHtcbiAgICAgIGlmICh0aGlzLnJlZ2V4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGF2b2lkcyB0aGUgbmVlZCB0byBjaGVjayBsZW5ndGggZXZlcnkgdGltZSBleGVjIGlzIGNhbGxlZFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuZXhlYyA9ICgpID0+IG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXJtaW5hdG9ycyA9IHRoaXMucmVnZXhlcy5tYXAoZWwgPT4gZWxbMV0pO1xuICAgICAgdGhpcy5tYXRjaGVyUmUgPSBsYW5nUmUoX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyh0ZXJtaW5hdG9ycywgeyBqb2luV2l0aDogJ3wnIH0pLCB0cnVlKTtcbiAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvKiogQHBhcmFtIHtzdHJpbmd9IHMgKi9cbiAgICBleGVjKHMpIHtcbiAgICAgIHRoaXMubWF0Y2hlclJlLmxhc3RJbmRleCA9IHRoaXMubGFzdEluZGV4O1xuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLm1hdGNoZXJSZS5leGVjKHMpO1xuICAgICAgaWYgKCFtYXRjaCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgICBjb25zdCBpID0gbWF0Y2guZmluZEluZGV4KChlbCwgaSkgPT4gaSA+IDAgJiYgZWwgIT09IHVuZGVmaW5lZCk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBtYXRjaERhdGEgPSB0aGlzLm1hdGNoSW5kZXhlc1tpXTtcbiAgICAgIC8vIHRyaW0gb2ZmIGFueSBlYXJsaWVyIG5vbi1yZWxldmFudCBtYXRjaCBncm91cHMgKGllLCB0aGUgb3RoZXIgcmVnZXhcbiAgICAgIC8vIG1hdGNoIGdyb3VwcyB0aGF0IG1ha2UgdXAgdGhlIG11bHRpLW1hdGNoZXIpXG4gICAgICBtYXRjaC5zcGxpY2UoMCwgaSk7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG1hdGNoLCBtYXRjaERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAgQ3JlYXRlZCB0byBzb2x2ZSB0aGUga2V5IGRlZmljaWVudGx5IHdpdGggTXVsdGlSZWdleCAtIHRoZXJlIGlzIG5vIHdheSB0b1xuICAgIHRlc3QgZm9yIG11bHRpcGxlIG1hdGNoZXMgYXQgYSBzaW5nbGUgbG9jYXRpb24uICBXaHkgd291bGQgd2UgbmVlZCB0byBkb1xuICAgIHRoYXQ/ICBJbiB0aGUgZnV0dXJlIGEgbW9yZSBkeW5hbWljIGVuZ2luZSB3aWxsIGFsbG93IGNlcnRhaW4gbWF0Y2hlcyB0byBiZVxuICAgIGlnbm9yZWQuICBBbiBleGFtcGxlOiBpZiB3ZSBtYXRjaGVkIHNheSB0aGUgM3JkIHJlZ2V4IGluIGEgbGFyZ2UgZ3JvdXAgYnV0XG4gICAgZGVjaWRlZCB0byBpZ25vcmUgaXQgLSB3ZSdkIG5lZWQgdG8gc3RhcnRlZCB0ZXN0aW5nIGFnYWluIGF0IHRoZSA0dGhcbiAgICByZWdleC4uLiBidXQgTXVsdGlSZWdleCBpdHNlbGYgZ2l2ZXMgdXMgbm8gcmVhbCB3YXkgdG8gZG8gdGhhdC5cblxuICAgIFNvIHdoYXQgdGhpcyBjbGFzcyBjcmVhdGVzIE11bHRpUmVnZXhzIG9uIHRoZSBmbHkgZm9yIHdoYXRldmVyIHNlYXJjaFxuICAgIHBvc2l0aW9uIHRoZXkgYXJlIG5lZWRlZC5cblxuICAgIE5PVEU6IFRoZXNlIGFkZGl0aW9uYWwgTXVsdGlSZWdleCBvYmplY3RzIGFyZSBjcmVhdGVkIGR5bmFtaWNhbGx5LiAgRm9yIG1vc3RcbiAgICBncmFtbWFycyBtb3N0IG9mIHRoZSB0aW1lIHdlIHdpbGwgbmV2ZXIgYWN0dWFsbHkgbmVlZCBhbnl0aGluZyBtb3JlIHRoYW4gdGhlXG4gICAgZmlyc3QgTXVsdGlSZWdleCAtIHNvIHRoaXMgc2hvdWxkbid0IGhhdmUgdG9vIG11Y2ggb3ZlcmhlYWQuXG5cbiAgICBTYXkgdGhpcyBpcyBvdXIgc2VhcmNoIGdyb3VwLCBhbmQgd2UgbWF0Y2ggcmVnZXgzLCBidXQgd2lzaCB0byBpZ25vcmUgaXQuXG5cbiAgICAgIHJlZ2V4MSB8IHJlZ2V4MiB8IHJlZ2V4MyB8IHJlZ2V4NCB8IHJlZ2V4NSAgICAnIGllLCBzdGFydEF0ID0gMFxuXG4gICAgV2hhdCB3ZSBuZWVkIGlzIGEgbmV3IE11bHRpUmVnZXggdGhhdCBvbmx5IGluY2x1ZGVzIHRoZSByZW1haW5pbmdcbiAgICBwb3NzaWJpbGl0aWVzOlxuXG4gICAgICByZWdleDQgfCByZWdleDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBpZSwgc3RhcnRBdCA9IDNcblxuICAgIFRoaXMgY2xhc3Mgd3JhcHMgYWxsIHRoYXQgY29tcGxleGl0eSB1cCBpbiBhIHNpbXBsZSBBUEkuLi4gYHN0YXJ0QXRgIGRlY2lkZXNcbiAgICB3aGVyZSBpbiB0aGUgYXJyYXkgb2YgZXhwcmVzc2lvbnMgdG8gc3RhcnQgZG9pbmcgdGhlIG1hdGNoaW5nLiBJdFxuICAgIGF1dG8taW5jcmVtZW50cywgc28gaWYgYSBtYXRjaCBpcyBmb3VuZCBhdCBwb3NpdGlvbiAyLCB0aGVuIHN0YXJ0QXQgd2lsbCBiZVxuICAgIHNldCB0byAzLiAgSWYgdGhlIGVuZCBpcyByZWFjaGVkIHN0YXJ0QXQgd2lsbCByZXR1cm4gdG8gMC5cblxuICAgIE1PU1Qgb2YgdGhlIHRpbWUgdGhlIHBhcnNlciB3aWxsIGJlIHNldHRpbmcgc3RhcnRBdCBtYW51YWxseSB0byAwLlxuICAqL1xuICBjbGFzcyBSZXN1bWFibGVNdWx0aVJlZ2V4IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucnVsZXMgPSBbXTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMubXVsdGlSZWdleGVzID0gW107XG4gICAgICB0aGlzLmNvdW50ID0gMDtcblxuICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgdGhpcy5yZWdleEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2V0TWF0Y2hlcihpbmRleCkge1xuICAgICAgaWYgKHRoaXMubXVsdGlSZWdleGVzW2luZGV4XSkgcmV0dXJuIHRoaXMubXVsdGlSZWdleGVzW2luZGV4XTtcblxuICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNdWx0aVJlZ2V4KCk7XG4gICAgICB0aGlzLnJ1bGVzLnNsaWNlKGluZGV4KS5mb3JFYWNoKChbcmUsIG9wdHNdKSA9PiBtYXRjaGVyLmFkZFJ1bGUocmUsIG9wdHMpKTtcbiAgICAgIG1hdGNoZXIuY29tcGlsZSgpO1xuICAgICAgdGhpcy5tdWx0aVJlZ2V4ZXNbaW5kZXhdID0gbWF0Y2hlcjtcbiAgICAgIHJldHVybiBtYXRjaGVyO1xuICAgIH1cblxuICAgIHJlc3VtaW5nU2NhbkF0U2FtZVBvc2l0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVnZXhJbmRleCAhPT0gMDtcbiAgICB9XG5cbiAgICBjb25zaWRlckFsbCgpIHtcbiAgICAgIHRoaXMucmVnZXhJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFkZFJ1bGUocmUsIG9wdHMpIHtcbiAgICAgIHRoaXMucnVsZXMucHVzaChbcmUsIG9wdHNdKTtcbiAgICAgIGlmIChvcHRzLnR5cGUgPT09IFwiYmVnaW5cIikgdGhpcy5jb3VudCsrO1xuICAgIH1cblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gcyAqL1xuICAgIGV4ZWMocykge1xuICAgICAgY29uc3QgbSA9IHRoaXMuZ2V0TWF0Y2hlcih0aGlzLnJlZ2V4SW5kZXgpO1xuICAgICAgbS5sYXN0SW5kZXggPSB0aGlzLmxhc3RJbmRleDtcbiAgICAgIGxldCByZXN1bHQgPSBtLmV4ZWMocyk7XG5cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgYmVjYXVzZSB3ZSBoYXZlIG5vIGVhc3kgd2F5IHRvIHNheSBcInJlc3VtZSBzY2FubmluZyBhdCB0aGVcbiAgICAgIC8vIGV4aXN0aW5nIHBvc2l0aW9uIGJ1dCBhbHNvIHNraXAgdGhlIGN1cnJlbnQgcnVsZSBPTkxZXCIuIFdoYXQgaGFwcGVucyBpc1xuICAgICAgLy8gYWxsIHByaW9yIHJ1bGVzIGFyZSBhbHNvIHNraXBwZWQgd2hpY2ggY2FuIHJlc3VsdCBpbiBtYXRjaGluZyB0aGUgd3JvbmdcbiAgICAgIC8vIHRoaW5nLiBFeGFtcGxlIG9mIG1hdGNoaW5nIFwiYm9vZ2VyXCI6XG5cbiAgICAgIC8vIG91ciBtYXRjaGVyIGlzIFtzdHJpbmcsIFwiYm9vZ2VyXCIsIG51bWJlcl1cbiAgICAgIC8vXG4gICAgICAvLyAuLi4uYm9vZ2VyLi4uLlxuXG4gICAgICAvLyBpZiBcImJvb2dlclwiIGlzIGlnbm9yZWQgdGhlbiB3ZSdkIHJlYWxseSBuZWVkIGEgcmVnZXggdG8gc2NhbiBmcm9tIHRoZVxuICAgICAgLy8gU0FNRSBwb3NpdGlvbiBmb3Igb25seTogW3N0cmluZywgbnVtYmVyXSBidXQgaWdub3JpbmcgXCJib29nZXJcIiAoaWYgaXRcbiAgICAgIC8vIHdhcyB0aGUgZmlyc3QgbWF0Y2gpLCBhIHNpbXBsZSByZXN1bWUgd291bGQgc2NhbiBhaGVhZCB3aG8ga25vd3MgaG93XG4gICAgICAvLyBmYXIgbG9va2luZyBvbmx5IGZvciBcIm51bWJlclwiLCBpZ25vcmluZyBwb3RlbnRpYWwgc3RyaW5nIG1hdGNoZXMgKG9yXG4gICAgICAvLyBmdXR1cmUgXCJib29nZXJcIiBtYXRjaGVzIHRoYXQgbWlnaHQgYmUgdmFsaWQuKVxuXG4gICAgICAvLyBTbyB3aGF0IHdlIGRvOiBXZSBleGVjdXRlIHR3byBtYXRjaGVycywgb25lIHJlc3VtaW5nIGF0IHRoZSBzYW1lXG4gICAgICAvLyBwb3NpdGlvbiwgYnV0IHRoZSBzZWNvbmQgZnVsbCBtYXRjaGVyIHN0YXJ0aW5nIGF0IHRoZSBwb3NpdGlvbiBhZnRlcjpcblxuICAgICAgLy8gICAgIC8tLS0gcmVzdW1lIGZpcnN0IHJlZ2V4IG1hdGNoIGhlcmUgKGZvciBbbnVtYmVyXSlcbiAgICAgIC8vICAgICB8Ly0tLS0gZnVsbCBtYXRjaCBoZXJlIGZvciBbc3RyaW5nLCBcImJvb2dlclwiLCBudW1iZXJdXG4gICAgICAvLyAgICAgdnZcbiAgICAgIC8vIC4uLi5ib29nZXIuLi4uXG5cbiAgICAgIC8vIFdoaWNoIGV2ZXIgcmVzdWx0cyBpbiBhIG1hdGNoIGZpcnN0IGlzIHRoZW4gdXNlZC4gU28gdGhpcyAzLTQgc3RlcFxuICAgICAgLy8gcHJvY2VzcyBlc3NlbnRpYWxseSBhbGxvd3MgdXMgdG8gc2F5IFwibWF0Y2ggYXQgdGhpcyBwb3NpdGlvbiwgZXhjbHVkaW5nXG4gICAgICAvLyBhIHByaW9yIHJ1bGUgdGhhdCB3YXMgaWdub3JlZFwiLlxuICAgICAgLy9cbiAgICAgIC8vIDEuIE1hdGNoIFwiYm9vZ2VyXCIgZmlyc3QsIGlnbm9yZS4gQWxzbyBwcm92ZXMgdGhhdCBbc3RyaW5nXSBkb2VzIG5vbiBtYXRjaC5cbiAgICAgIC8vIDIuIFJlc3VtZSBtYXRjaGluZyBmb3IgW251bWJlcl1cbiAgICAgIC8vIDMuIE1hdGNoIGF0IGluZGV4ICsgMSBmb3IgW3N0cmluZywgXCJib29nZXJcIiwgbnVtYmVyXVxuICAgICAgLy8gNC4gSWYgIzIgYW5kICMzIHJlc3VsdCBpbiBtYXRjaGVzLCB3aGljaCBjYW1lIGZpcnN0P1xuICAgICAgaWYgKHRoaXMucmVzdW1pbmdTY2FuQXRTYW1lUG9zaXRpb24oKSkge1xuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5pbmRleCA9PT0gdGhpcy5sYXN0SW5kZXgpIDsgZWxzZSB7IC8vIHVzZSB0aGUgc2Vjb25kIG1hdGNoZXIgcmVzdWx0XG4gICAgICAgICAgY29uc3QgbTIgPSB0aGlzLmdldE1hdGNoZXIoMCk7XG4gICAgICAgICAgbTIubGFzdEluZGV4ID0gdGhpcy5sYXN0SW5kZXggKyAxO1xuICAgICAgICAgIHJlc3VsdCA9IG0yLmV4ZWMocyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnJlZ2V4SW5kZXggKz0gcmVzdWx0LnBvc2l0aW9uICsgMTtcbiAgICAgICAgaWYgKHRoaXMucmVnZXhJbmRleCA9PT0gdGhpcy5jb3VudCkge1xuICAgICAgICAgIC8vIHdyYXAtYXJvdW5kIHRvIGNvbnNpZGVyaW5nIGFsbCBtYXRjaGVzIGFnYWluXG4gICAgICAgICAgdGhpcy5jb25zaWRlckFsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgbW9kZSwgYnVpbGRzIGEgaHVnZSBSZXN1bWFibGVNdWx0aVJlZ2V4IHRoYXQgY2FuIGJlIHVzZWQgdG8gd2Fsa1xuICAgKiB0aGUgY29udGVudCBhbmQgZmluZCBtYXRjaGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICAgKiBAcmV0dXJucyB7UmVzdW1hYmxlTXVsdGlSZWdleH1cbiAgICovXG4gIGZ1bmN0aW9uIGJ1aWxkTW9kZVJlZ2V4KG1vZGUpIHtcbiAgICBjb25zdCBtbSA9IG5ldyBSZXN1bWFibGVNdWx0aVJlZ2V4KCk7XG5cbiAgICBtb2RlLmNvbnRhaW5zLmZvckVhY2godGVybSA9PiBtbS5hZGRSdWxlKHRlcm0uYmVnaW4sIHsgcnVsZTogdGVybSwgdHlwZTogXCJiZWdpblwiIH0pKTtcblxuICAgIGlmIChtb2RlLnRlcm1pbmF0b3JFbmQpIHtcbiAgICAgIG1tLmFkZFJ1bGUobW9kZS50ZXJtaW5hdG9yRW5kLCB7IHR5cGU6IFwiZW5kXCIgfSk7XG4gICAgfVxuICAgIGlmIChtb2RlLmlsbGVnYWwpIHtcbiAgICAgIG1tLmFkZFJ1bGUobW9kZS5pbGxlZ2FsLCB7IHR5cGU6IFwiaWxsZWdhbFwiIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtbTtcbiAgfVxuXG4gIC8qKiBza2lwIHZzIGFib3J0IHZzIGlnbm9yZVxuICAgKlxuICAgKiBAc2tpcCAgIC0gVGhlIG1vZGUgaXMgc3RpbGwgZW50ZXJlZCBhbmQgZXhpdGVkIG5vcm1hbGx5IChhbmQgY29udGFpbnMgcnVsZXMgYXBwbHkpLFxuICAgKiAgICAgICAgICAgYnV0IGFsbCBjb250ZW50IGlzIGhlbGQgYW5kIGFkZGVkIHRvIHRoZSBwYXJlbnQgYnVmZmVyIHJhdGhlciB0aGFuIGJlaW5nXG4gICAqICAgICAgICAgICBvdXRwdXQgd2hlbiB0aGUgbW9kZSBlbmRzLiAgTW9zdGx5IHVzZWQgd2l0aCBgc3VibGFuZ3VhZ2VgIHRvIGJ1aWxkIHVwXG4gICAqICAgICAgICAgICBhIHNpbmdsZSBsYXJnZSBidWZmZXIgdGhhbiBjYW4gYmUgcGFyc2VkIGJ5IHN1Ymxhbmd1YWdlLlxuICAgKlxuICAgKiAgICAgICAgICAgICAtIFRoZSBtb2RlIGJlZ2luIGFuZHMgZW5kcyBub3JtYWxseS5cbiAgICogICAgICAgICAgICAgLSBDb250ZW50IG1hdGNoZWQgaXMgYWRkZWQgdG8gdGhlIHBhcmVudCBtb2RlIGJ1ZmZlci5cbiAgICogICAgICAgICAgICAgLSBUaGUgcGFyc2VyIGN1cnNvciBpcyBtb3ZlZCBmb3J3YXJkIG5vcm1hbGx5LlxuICAgKlxuICAgKiBAYWJvcnQgIC0gQSBoYWNrIHBsYWNlaG9sZGVyIHVudGlsIHdlIGhhdmUgaWdub3JlLiAgQWJvcnRzIHRoZSBtb2RlIChhcyBpZiBpdFxuICAgKiAgICAgICAgICAgbmV2ZXIgbWF0Y2hlZCkgYnV0IERPRVMgTk9UIGNvbnRpbnVlIHRvIG1hdGNoIHN1YnNlcXVlbnQgYGNvbnRhaW5zYFxuICAgKiAgICAgICAgICAgbW9kZXMuICBBYm9ydCBpcyBiYWQvc3Vib3B0aW1hbCBiZWNhdXNlIGl0IGNhbiByZXN1bHQgaW4gbW9kZXNcbiAgICogICAgICAgICAgIGZhcnRoZXIgZG93biBub3QgZ2V0dGluZyBhcHBsaWVkIGJlY2F1c2UgYW4gZWFybGllciBydWxlIGVhdHMgdGhlXG4gICAqICAgICAgICAgICBjb250ZW50IGJ1dCB0aGVuIGFib3J0cy5cbiAgICpcbiAgICogICAgICAgICAgICAgLSBUaGUgbW9kZSBkb2VzIG5vdCBiZWdpbi5cbiAgICogICAgICAgICAgICAgLSBDb250ZW50IG1hdGNoZWQgYnkgYGJlZ2luYCBpcyBhZGRlZCB0byB0aGUgbW9kZSBidWZmZXIuXG4gICAqICAgICAgICAgICAgIC0gVGhlIHBhcnNlciBjdXJzb3IgaXMgbW92ZWQgZm9yd2FyZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQGlnbm9yZSAtIElnbm9yZXMgdGhlIG1vZGUgKGFzIGlmIGl0IG5ldmVyIG1hdGNoZWQpIGFuZCBjb250aW51ZXMgdG8gbWF0Y2ggYW55XG4gICAqICAgICAgICAgICBzdWJzZXF1ZW50IGBjb250YWluc2AgbW9kZXMuICBJZ25vcmUgaXNuJ3QgdGVjaG5pY2FsbHkgcG9zc2libGUgd2l0aFxuICAgKiAgICAgICAgICAgdGhlIGN1cnJlbnQgcGFyc2VyIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiAgICAgICAgICAgICAtIFRoZSBtb2RlIGRvZXMgbm90IGJlZ2luLlxuICAgKiAgICAgICAgICAgICAtIENvbnRlbnQgbWF0Y2hlZCBieSBgYmVnaW5gIGlzIGlnbm9yZWQuXG4gICAqICAgICAgICAgICAgIC0gVGhlIHBhcnNlciBjdXJzb3IgaXMgbm90IG1vdmVkIGZvcndhcmQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDb21waWxlcyBhbiBpbmRpdmlkdWFsIG1vZGVcbiAgICpcbiAgICogVGhpcyBjYW4gcmFpc2UgYW4gZXJyb3IgaWYgdGhlIG1vZGUgY29udGFpbnMgY2VydGFpbiBkZXRlY3RhYmxlIGtub3duIGxvZ2ljXG4gICAqIGlzc3Vlcy5cbiAgICogQHBhcmFtIHtNb2RlfSBtb2RlXG4gICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlIHwgbnVsbH0gW3BhcmVudF1cbiAgICogQHJldHVybnMge0NvbXBpbGVkTW9kZSB8IG5ldmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGlsZU1vZGUobW9kZSwgcGFyZW50KSB7XG4gICAgY29uc3QgY21vZGUgPSAvKiogQHR5cGUgQ29tcGlsZWRNb2RlICovIChtb2RlKTtcbiAgICBpZiAobW9kZS5pc0NvbXBpbGVkKSByZXR1cm4gY21vZGU7XG5cbiAgICBbXG4gICAgICBzY29wZUNsYXNzTmFtZSxcbiAgICAgIC8vIGRvIHRoaXMgZWFybHkgc28gY29tcGlsZXIgZXh0ZW5zaW9ucyBnZW5lcmFsbHkgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dFxuICAgICAgLy8gdGhlIGRpc3RpbmN0aW9uIGJldHdlZW4gbWF0Y2gvYmVnaW5cbiAgICAgIGNvbXBpbGVNYXRjaCxcbiAgICAgIE11bHRpQ2xhc3MsXG4gICAgICBiZWZvcmVNYXRjaEV4dFxuICAgIF0uZm9yRWFjaChleHQgPT4gZXh0KG1vZGUsIHBhcmVudCkpO1xuXG4gICAgbGFuZ3VhZ2UuY29tcGlsZXJFeHRlbnNpb25zLmZvckVhY2goZXh0ID0+IGV4dChtb2RlLCBwYXJlbnQpKTtcblxuICAgIC8vIF9fYmVmb3JlQmVnaW4gaXMgY29uc2lkZXJlZCBwcml2YXRlIEFQSSwgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICBtb2RlLl9fYmVmb3JlQmVnaW4gPSBudWxsO1xuXG4gICAgW1xuICAgICAgYmVnaW5LZXl3b3JkcyxcbiAgICAgIC8vIGRvIHRoaXMgbGF0ZXIgc28gY29tcGlsZXIgZXh0ZW5zaW9ucyB0aGF0IGNvbWUgZWFybGllciBoYXZlIGFjY2VzcyB0byB0aGVcbiAgICAgIC8vIHJhdyBhcnJheSBpZiB0aGV5IHdhbnRlZCB0byBwZXJoYXBzIG1hbmlwdWxhdGUgaXQsIGV0Yy5cbiAgICAgIGNvbXBpbGVJbGxlZ2FsLFxuICAgICAgLy8gZGVmYXVsdCB0byAxIHJlbGV2YW5jZSBpZiBub3Qgc3BlY2lmaWVkXG4gICAgICBjb21waWxlUmVsZXZhbmNlXG4gICAgXS5mb3JFYWNoKGV4dCA9PiBleHQobW9kZSwgcGFyZW50KSk7XG5cbiAgICBtb2RlLmlzQ29tcGlsZWQgPSB0cnVlO1xuXG4gICAgbGV0IGtleXdvcmRQYXR0ZXJuID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIG1vZGUua2V5d29yZHMgPT09IFwib2JqZWN0XCIgJiYgbW9kZS5rZXl3b3Jkcy4kcGF0dGVybikge1xuICAgICAgLy8gd2UgbmVlZCBhIGNvcHkgYmVjYXVzZSBrZXl3b3JkcyBtaWdodCBiZSBjb21waWxlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gc28gd2UgY2FuJ3QgZ28gZGVsZXRpbmcgJHBhdHRlcm4gZnJvbSB0aGUgb3JpZ2luYWwgb24gdGhlIGZpcnN0XG4gICAgICAvLyBwYXNzXG4gICAgICBtb2RlLmtleXdvcmRzID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kZS5rZXl3b3Jkcyk7XG4gICAgICBrZXl3b3JkUGF0dGVybiA9IG1vZGUua2V5d29yZHMuJHBhdHRlcm47XG4gICAgICBkZWxldGUgbW9kZS5rZXl3b3Jkcy4kcGF0dGVybjtcbiAgICB9XG4gICAga2V5d29yZFBhdHRlcm4gPSBrZXl3b3JkUGF0dGVybiB8fCAvXFx3Ky87XG5cbiAgICBpZiAobW9kZS5rZXl3b3Jkcykge1xuICAgICAgbW9kZS5rZXl3b3JkcyA9IGNvbXBpbGVLZXl3b3Jkcyhtb2RlLmtleXdvcmRzLCBsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlKTtcbiAgICB9XG5cbiAgICBjbW9kZS5rZXl3b3JkUGF0dGVyblJlID0gbGFuZ1JlKGtleXdvcmRQYXR0ZXJuLCB0cnVlKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICghbW9kZS5iZWdpbikgbW9kZS5iZWdpbiA9IC9cXEJ8XFxiLztcbiAgICAgIGNtb2RlLmJlZ2luUmUgPSBsYW5nUmUoY21vZGUuYmVnaW4pO1xuICAgICAgaWYgKCFtb2RlLmVuZCAmJiAhbW9kZS5lbmRzV2l0aFBhcmVudCkgbW9kZS5lbmQgPSAvXFxCfFxcYi87XG4gICAgICBpZiAobW9kZS5lbmQpIGNtb2RlLmVuZFJlID0gbGFuZ1JlKGNtb2RlLmVuZCk7XG4gICAgICBjbW9kZS50ZXJtaW5hdG9yRW5kID0gc291cmNlKGNtb2RlLmVuZCkgfHwgJyc7XG4gICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCAmJiBwYXJlbnQudGVybWluYXRvckVuZCkge1xuICAgICAgICBjbW9kZS50ZXJtaW5hdG9yRW5kICs9IChtb2RlLmVuZCA/ICd8JyA6ICcnKSArIHBhcmVudC50ZXJtaW5hdG9yRW5kO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobW9kZS5pbGxlZ2FsKSBjbW9kZS5pbGxlZ2FsUmUgPSBsYW5nUmUoLyoqIEB0eXBlIHtSZWdFeHAgfCBzdHJpbmd9ICovIChtb2RlLmlsbGVnYWwpKTtcbiAgICBpZiAoIW1vZGUuY29udGFpbnMpIG1vZGUuY29udGFpbnMgPSBbXTtcblxuICAgIG1vZGUuY29udGFpbnMgPSBbXS5jb25jYXQoLi4ubW9kZS5jb250YWlucy5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgcmV0dXJuIGV4cGFuZE9yQ2xvbmVNb2RlKGMgPT09ICdzZWxmJyA/IG1vZGUgOiBjKTtcbiAgICB9KSk7XG4gICAgbW9kZS5jb250YWlucy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHsgY29tcGlsZU1vZGUoLyoqIEB0eXBlIE1vZGUgKi8gKGMpLCBjbW9kZSk7IH0pO1xuXG4gICAgaWYgKG1vZGUuc3RhcnRzKSB7XG4gICAgICBjb21waWxlTW9kZShtb2RlLnN0YXJ0cywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBjbW9kZS5tYXRjaGVyID0gYnVpbGRNb2RlUmVnZXgoY21vZGUpO1xuICAgIHJldHVybiBjbW9kZTtcbiAgfVxuXG4gIGlmICghbGFuZ3VhZ2UuY29tcGlsZXJFeHRlbnNpb25zKSBsYW5ndWFnZS5jb21waWxlckV4dGVuc2lvbnMgPSBbXTtcblxuICAvLyBzZWxmIGlzIG5vdCB2YWxpZCBhdCB0aGUgdG9wLWxldmVsXG4gIGlmIChsYW5ndWFnZS5jb250YWlucyAmJiBsYW5ndWFnZS5jb250YWlucy5pbmNsdWRlcygnc2VsZicpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRVJSOiBjb250YWlucyBgc2VsZmAgaXMgbm90IHN1cHBvcnRlZCBhdCB0aGUgdG9wLWxldmVsIG9mIGEgbGFuZ3VhZ2UuICBTZWUgZG9jdW1lbnRhdGlvbi5cIik7XG4gIH1cblxuICAvLyB3ZSBuZWVkIGEgbnVsbCBvYmplY3QsIHdoaWNoIGluaGVyaXQgd2lsbCBndWFyYW50ZWVcbiAgbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlcyA9IGluaGVyaXQkMShsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzIHx8IHt9KTtcblxuICByZXR1cm4gY29tcGlsZU1vZGUoLyoqIEB0eXBlIE1vZGUgKi8gKGxhbmd1YWdlKSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIG1vZGUgaGFzIGEgZGVwZW5kZW5jeSBvbiBpdCdzIHBhcmVudCBvciBub3RcbiAqXG4gKiBJZiBhIG1vZGUgZG9lcyBoYXZlIGEgcGFyZW50IGRlcGVuZGVuY3kgdGhlbiBvZnRlbiB3ZSBuZWVkIHRvIGNsb25lIGl0IGlmXG4gKiBpdCdzIHVzZWQgaW4gbXVsdGlwbGUgcGxhY2VzIHNvIHRoYXQgZWFjaCBjb3B5IHBvaW50cyB0byB0aGUgY29ycmVjdCBwYXJlbnQsXG4gKiB3aGVyZS1hcyBtb2RlcyB3aXRob3V0IGEgcGFyZW50IGNhbiBvZnRlbiBzYWZlbHkgYmUgcmUtdXNlZCBhdCB0aGUgYm90dG9tIG9mXG4gKiBhIG1vZGUgY2hhaW4uXG4gKlxuICogQHBhcmFtIHtNb2RlIHwgbnVsbH0gbW9kZVxuICogQHJldHVybnMge2Jvb2xlYW59IC0gaXMgdGhlcmUgYSBkZXBlbmRlbmN5IG9uIHRoZSBwYXJlbnQ/XG4gKiAqL1xuZnVuY3Rpb24gZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUpIHtcbiAgaWYgKCFtb2RlKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIG1vZGUuZW5kc1dpdGhQYXJlbnQgfHwgZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUuc3RhcnRzKTtcbn1cblxuLyoqXG4gKiBFeHBhbmRzIGEgbW9kZSBvciBjbG9uZXMgaXQgaWYgbmVjZXNzYXJ5XG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgZm9yIG1vZGVzIHdpdGggcGFyZW50YWwgZGVwZW5kZW5jZWlzIChzZWUgbm90ZXMgb25cbiAqIGBkZXBlbmRlbmN5T25QYXJlbnRgKSBhbmQgZm9yIG5vZGVzIHRoYXQgaGF2ZSBgdmFyaWFudHNgIC0gd2hpY2ggbXVzdCB0aGVuIGJlXG4gKiBleHBsb2RlZCBpbnRvIHRoZWlyIG93biBpbmRpdmlkdWFsIG1vZGVzIGF0IGNvbXBpbGUgdGltZS5cbiAqXG4gKiBAcGFyYW0ge01vZGV9IG1vZGVcbiAqIEByZXR1cm5zIHtNb2RlIHwgTW9kZVtdfVxuICogKi9cbmZ1bmN0aW9uIGV4cGFuZE9yQ2xvbmVNb2RlKG1vZGUpIHtcbiAgaWYgKG1vZGUudmFyaWFudHMgJiYgIW1vZGUuY2FjaGVkVmFyaWFudHMpIHtcbiAgICBtb2RlLmNhY2hlZFZhcmlhbnRzID0gbW9kZS52YXJpYW50cy5tYXAoZnVuY3Rpb24odmFyaWFudCkge1xuICAgICAgcmV0dXJuIGluaGVyaXQkMShtb2RlLCB7IHZhcmlhbnRzOiBudWxsIH0sIHZhcmlhbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRVhQQU5EXG4gIC8vIGlmIHdlIGhhdmUgdmFyaWFudHMgdGhlbiBlc3NlbnRpYWxseSBcInJlcGxhY2VcIiB0aGUgbW9kZSB3aXRoIHRoZSB2YXJpYW50c1xuICAvLyB0aGlzIGhhcHBlbnMgaW4gY29tcGlsZU1vZGUsIHdoZXJlIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZyb21cbiAgaWYgKG1vZGUuY2FjaGVkVmFyaWFudHMpIHtcbiAgICByZXR1cm4gbW9kZS5jYWNoZWRWYXJpYW50cztcbiAgfVxuXG4gIC8vIENMT05FXG4gIC8vIGlmIHdlIGhhdmUgZGVwZW5kZW5jaWVzIG9uIHBhcmVudHMgdGhlbiB3ZSBuZWVkIGEgdW5pcXVlXG4gIC8vIGluc3RhbmNlIG9mIG91cnNlbHZlcywgc28gd2UgY2FuIGJlIHJldXNlZCB3aXRoIG1hbnlcbiAgLy8gZGlmZmVyZW50IHBhcmVudHMgd2l0aG91dCBpc3N1ZVxuICBpZiAoZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUpKSB7XG4gICAgcmV0dXJuIGluaGVyaXQkMShtb2RlLCB7IHN0YXJ0czogbW9kZS5zdGFydHMgPyBpbmhlcml0JDEobW9kZS5zdGFydHMpIDogbnVsbCB9KTtcbiAgfVxuXG4gIGlmIChPYmplY3QuaXNGcm96ZW4obW9kZSkpIHtcbiAgICByZXR1cm4gaW5oZXJpdCQxKG1vZGUpO1xuICB9XG5cbiAgLy8gbm8gc3BlY2lhbCBkZXBlbmRlbmN5IGlzc3VlcywganVzdCByZXR1cm4gb3Vyc2VsdmVzXG4gIHJldHVybiBtb2RlO1xufVxuXG52YXIgdmVyc2lvbiA9IFwiMTEuOS4wXCI7XG5cbmNsYXNzIEhUTUxJbmplY3Rpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IocmVhc29uLCBodG1sKSB7XG4gICAgc3VwZXIocmVhc29uKTtcbiAgICB0aGlzLm5hbWUgPSBcIkhUTUxJbmplY3Rpb25FcnJvclwiO1xuICAgIHRoaXMuaHRtbCA9IGh0bWw7XG4gIH1cbn1cblxuLypcblN5bnRheCBoaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBhdXRvZGV0ZWN0aW9uLlxuaHR0cHM6Ly9oaWdobGlnaHRqcy5vcmcvXG4qL1xuXG5cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRTY29wZX0gQ29tcGlsZWRTY29wZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2V9IExhbmd1YWdlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTQXBpfSBITEpTQXBpXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTUGx1Z2lufSBITEpTUGx1Z2luXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5QbHVnaW5FdmVudH0gUGx1Z2luRXZlbnRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNPcHRpb25zfSBITEpTT3B0aW9uc1xuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2VGbn0gTGFuZ3VhZ2VGblxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQmVmb3JlSGlnaGxpZ2h0Q29udGV4dH0gQmVmb3JlSGlnaGxpZ2h0Q29udGV4dFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5NYXRjaFR5cGV9IE1hdGNoVHlwZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5LZXl3b3JkRGF0YX0gS2V5d29yZERhdGFcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcy9wcml2YXRlJykuRW5oYW5jZWRNYXRjaH0gRW5oYW5jZWRNYXRjaFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5Bbm5vdGF0ZWRFcnJvcn0gQW5ub3RhdGVkRXJyb3JcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkF1dG9IaWdobGlnaHRSZXN1bHR9IEF1dG9IaWdobGlnaHRSZXN1bHRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodE9wdGlvbnN9IEhpZ2hsaWdodE9wdGlvbnNcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodFJlc3VsdH0gSGlnaGxpZ2h0UmVzdWx0XG4qL1xuXG5cbmNvbnN0IGVzY2FwZSA9IGVzY2FwZUhUTUw7XG5jb25zdCBpbmhlcml0ID0gaW5oZXJpdCQxO1xuY29uc3QgTk9fTUFUQ0ggPSBTeW1ib2woXCJub21hdGNoXCIpO1xuY29uc3QgTUFYX0tFWVdPUkRfSElUUyA9IDc7XG5cbi8qKlxuICogQHBhcmFtIHthbnl9IGhsanMgLSBvYmplY3QgdGhhdCBpcyBleHRlbmRlZCAobGVnYWN5KVxuICogQHJldHVybnMge0hMSlNBcGl9XG4gKi9cbmNvbnN0IEhMSlMgPSBmdW5jdGlvbihobGpzKSB7XG4gIC8vIEdsb2JhbCBpbnRlcm5hbCB2YXJpYWJsZXMgdXNlZCB3aXRoaW4gdGhlIGhpZ2hsaWdodC5qcyBsaWJyYXJ5LlxuICAvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIExhbmd1YWdlPn0gKi9cbiAgY29uc3QgbGFuZ3VhZ2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICBjb25zdCBhbGlhc2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtITEpTUGx1Z2luW119ICovXG4gIGNvbnN0IHBsdWdpbnMgPSBbXTtcblxuICAvLyBzYWZlL3Byb2R1Y3Rpb24gbW9kZSAtIHN3YWxsb3dzIG1vcmUgZXJyb3JzLCB0cmllcyB0byBrZWVwIHJ1bm5pbmdcbiAgLy8gZXZlbiBpZiBhIHNpbmdsZSBzeW50YXggb3IgcGFyc2UgaGl0cyBhIGZhdGFsIGVycm9yXG4gIGxldCBTQUZFX01PREUgPSB0cnVlO1xuICBjb25zdCBMQU5HVUFHRV9OT1RfRk9VTkQgPSBcIkNvdWxkIG5vdCBmaW5kIHRoZSBsYW5ndWFnZSAne30nLCBkaWQgeW91IGZvcmdldCB0byBsb2FkL2luY2x1ZGUgYSBsYW5ndWFnZSBtb2R1bGU/XCI7XG4gIC8qKiBAdHlwZSB7TGFuZ3VhZ2V9ICovXG4gIGNvbnN0IFBMQUlOVEVYVF9MQU5HVUFHRSA9IHsgZGlzYWJsZUF1dG9kZXRlY3Q6IHRydWUsIG5hbWU6ICdQbGFpbiB0ZXh0JywgY29udGFpbnM6IFtdIH07XG5cbiAgLy8gR2xvYmFsIG9wdGlvbnMgdXNlZCB3aGVuIHdpdGhpbiBleHRlcm5hbCBBUElzLiBUaGlzIGlzIG1vZGlmaWVkIHdoZW5cbiAgLy8gY2FsbGluZyB0aGUgYGhsanMuY29uZmlndXJlYCBmdW5jdGlvbi5cbiAgLyoqIEB0eXBlIEhMSlNPcHRpb25zICovXG4gIGxldCBvcHRpb25zID0ge1xuICAgIGlnbm9yZVVuZXNjYXBlZEhUTUw6IGZhbHNlLFxuICAgIHRocm93VW5lc2NhcGVkSFRNTDogZmFsc2UsXG4gICAgbm9IaWdobGlnaHRSZTogL14obm8tP2hpZ2hsaWdodCkkL2ksXG4gICAgbGFuZ3VhZ2VEZXRlY3RSZTogL1xcYmxhbmcoPzp1YWdlKT8tKFtcXHctXSspXFxiL2ksXG4gICAgY2xhc3NQcmVmaXg6ICdobGpzLScsXG4gICAgY3NzU2VsZWN0b3I6ICdwcmUgY29kZScsXG4gICAgbGFuZ3VhZ2VzOiBudWxsLFxuICAgIC8vIGJldGEgY29uZmlndXJhdGlvbiBvcHRpb25zLCBzdWJqZWN0IHRvIGNoYW5nZSwgd2VsY29tZSB0byBkaXNjdXNzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMTA4NlxuICAgIF9fZW1pdHRlcjogVG9rZW5UcmVlRW1pdHRlclxuICB9O1xuXG4gIC8qIFV0aWxpdHkgZnVuY3Rpb25zICovXG5cbiAgLyoqXG4gICAqIFRlc3RzIGEgbGFuZ3VhZ2UgbmFtZSB0byBzZWUgaWYgaGlnaGxpZ2h0aW5nIHNob3VsZCBiZSBza2lwcGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZE5vdEhpZ2hsaWdodChsYW5ndWFnZU5hbWUpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5ub0hpZ2hsaWdodFJlLnRlc3QobGFuZ3VhZ2VOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGJsb2NrIC0gdGhlIEhUTUwgZWxlbWVudCB0byBkZXRlcm1pbmUgbGFuZ3VhZ2UgZm9yXG4gICAqL1xuICBmdW5jdGlvbiBibG9ja0xhbmd1YWdlKGJsb2NrKSB7XG4gICAgbGV0IGNsYXNzZXMgPSBibG9jay5jbGFzc05hbWUgKyAnICc7XG5cbiAgICBjbGFzc2VzICs9IGJsb2NrLnBhcmVudE5vZGUgPyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSA6ICcnO1xuXG4gICAgLy8gbGFuZ3VhZ2UtKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgbm9uLXByZWZpeGVkIGNsYXNzIG5hbWVzLlxuICAgIGNvbnN0IG1hdGNoID0gb3B0aW9ucy5sYW5ndWFnZURldGVjdFJlLmV4ZWMoY2xhc3Nlcyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IGdldExhbmd1YWdlKG1hdGNoWzFdKTtcbiAgICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgICAgd2FybihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIG1hdGNoWzFdKSk7XG4gICAgICAgIHdhcm4oXCJGYWxsaW5nIGJhY2sgdG8gbm8taGlnaGxpZ2h0IG1vZGUgZm9yIHRoaXMgYmxvY2suXCIsIGJsb2NrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsYW5ndWFnZSA/IG1hdGNoWzFdIDogJ25vLWhpZ2hsaWdodCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzZXNcbiAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAuZmluZCgoX2NsYXNzKSA9PiBzaG91bGROb3RIaWdobGlnaHQoX2NsYXNzKSB8fCBnZXRMYW5ndWFnZShfY2xhc3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JlIGhpZ2hsaWdodGluZyBmdW5jdGlvbi5cbiAgICpcbiAgICogT0xEIEFQSVxuICAgKiBoaWdobGlnaHQobGFuZywgY29kZSwgaWdub3JlSWxsZWdhbHMsIGNvbnRpbnVhdGlvbilcbiAgICpcbiAgICogTkVXIEFQSVxuICAgKiBoaWdobGlnaHQoY29kZSwge2xhbmcsIGlnbm9yZUlsbGVnYWxzfSlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGVPckxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhpZ2hsaWdodE9wdGlvbnN9IG9wdGlvbnNPckNvZGUgLSB0aGUgY29kZSB0byBoaWdobGlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSBbaWdub3JlSWxsZWdhbHNdIC0gd2hldGhlciB0byBpZ25vcmUgaWxsZWdhbCBtYXRjaGVzLCBkZWZhdWx0IGlzIHRvIGJhaWxcbiAgICpcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH0gUmVzdWx0IC0gYW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsYW5ndWFnZSAtIHRoZSBsYW5ndWFnZSBuYW1lXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWxldmFuY2UgLSB0aGUgcmVsZXZhbmNlIHNjb3JlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBoaWdobGlnaHRlZCBIVE1MIGNvZGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUgLSB0aGUgb3JpZ2luYWwgcmF3IGNvZGVcbiAgICogQHByb3BlcnR5IHtDb21waWxlZE1vZGV9IHRvcCAtIHRvcCBvZiB0aGUgY3VycmVudCBtb2RlIHN0YWNrXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaWxsZWdhbCAtIGluZGljYXRlcyB3aGV0aGVyIGFueSBpbGxlZ2FsIG1hdGNoZXMgd2VyZSBmb3VuZFxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHQoY29kZU9yTGFuZ3VhZ2VOYW1lLCBvcHRpb25zT3JDb2RlLCBpZ25vcmVJbGxlZ2Fscykge1xuICAgIGxldCBjb2RlID0gXCJcIjtcbiAgICBsZXQgbGFuZ3VhZ2VOYW1lID0gXCJcIjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPckNvZGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvZGUgPSBjb2RlT3JMYW5ndWFnZU5hbWU7XG4gICAgICBpZ25vcmVJbGxlZ2FscyA9IG9wdGlvbnNPckNvZGUuaWdub3JlSWxsZWdhbHM7XG4gICAgICBsYW5ndWFnZU5hbWUgPSBvcHRpb25zT3JDb2RlLmxhbmd1YWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbGQgQVBJXG4gICAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiaGlnaGxpZ2h0KGxhbmcsIGNvZGUsIC4uLmFyZ3MpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcIlBsZWFzZSB1c2UgaGlnaGxpZ2h0KGNvZGUsIG9wdGlvbnMpIGluc3RlYWQuXFxuaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjI3N1wiKTtcbiAgICAgIGxhbmd1YWdlTmFtZSA9IGNvZGVPckxhbmd1YWdlTmFtZTtcbiAgICAgIGNvZGUgPSBvcHRpb25zT3JDb2RlO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzMxNDlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgaWYgKGlnbm9yZUlsbGVnYWxzID09PSB1bmRlZmluZWQpIHsgaWdub3JlSWxsZWdhbHMgPSB0cnVlOyB9XG5cbiAgICAvKiogQHR5cGUge0JlZm9yZUhpZ2hsaWdodENvbnRleHR9ICovXG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VOYW1lXG4gICAgfTtcbiAgICAvLyB0aGUgcGx1Z2luIGNhbiBjaGFuZ2UgdGhlIGRlc2lyZWQgbGFuZ3VhZ2Ugb3IgdGhlIGNvZGUgdG8gYmUgaGlnaGxpZ2h0ZWRcbiAgICAvLyBqdXN0IGJlIGNoYW5naW5nIHRoZSBvYmplY3QgaXQgd2FzIHBhc3NlZFxuICAgIGZpcmUoXCJiZWZvcmU6aGlnaGxpZ2h0XCIsIGNvbnRleHQpO1xuXG4gICAgLy8gYSBiZWZvcmUgcGx1Z2luIGNhbiB1c3VycCB0aGUgcmVzdWx0IGNvbXBsZXRlbHkgYnkgcHJvdmlkaW5nIGl0J3Mgb3duXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB3ZSBkb24ndCBldmVuIG5lZWQgdG8gY2FsbCBoaWdobGlnaHRcbiAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LnJlc3VsdFxuICAgICAgPyBjb250ZXh0LnJlc3VsdFxuICAgICAgOiBfaGlnaGxpZ2h0KGNvbnRleHQubGFuZ3VhZ2UsIGNvbnRleHQuY29kZSwgaWdub3JlSWxsZWdhbHMpO1xuXG4gICAgcmVzdWx0LmNvZGUgPSBjb250ZXh0LmNvZGU7XG4gICAgLy8gdGhlIHBsdWdpbiBjYW4gY2hhbmdlIGFueXRoaW5nIGluIHJlc3VsdCB0byBzdWl0ZSBpdFxuICAgIGZpcmUoXCJhZnRlcjpoaWdobGlnaHRcIiwgcmVzdWx0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogcHJpdmF0ZSBoaWdobGlnaHQgdGhhdCdzIHVzZWQgaW50ZXJuYWxseSBhbmQgZG9lcyBub3QgZmlyZSBjYWxsYmFja3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVRvSGlnaGxpZ2h0IC0gdGhlIGNvZGUgdG8gaGlnaGxpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IFtpZ25vcmVJbGxlZ2Fsc10gLSB3aGV0aGVyIHRvIGlnbm9yZSBpbGxlZ2FsIG1hdGNoZXMsIGRlZmF1bHQgaXMgdG8gYmFpbFxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZT99IFtjb250aW51YXRpb25dIC0gY3VycmVudCBjb250aW51YXRpb24gbW9kZSwgaWYgYW55XG4gICAqIEByZXR1cm5zIHtIaWdobGlnaHRSZXN1bHR9IC0gcmVzdWx0IG9mIHRoZSBoaWdobGlnaHQgb3BlcmF0aW9uXG4gICovXG4gIGZ1bmN0aW9uIF9oaWdobGlnaHQobGFuZ3VhZ2VOYW1lLCBjb2RlVG9IaWdobGlnaHQsIGlnbm9yZUlsbGVnYWxzLCBjb250aW51YXRpb24pIHtcbiAgICBjb25zdCBrZXl3b3JkSGl0cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4ga2V5d29yZCBkYXRhIGlmIGEgbWF0Y2ggaXMgYSBrZXl3b3JkXG4gICAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGUgLSBjdXJyZW50IG1vZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hUZXh0IC0gdGhlIHRleHR1YWwgbWF0Y2hcbiAgICAgKiBAcmV0dXJucyB7S2V5d29yZERhdGEgfCBmYWxzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBrZXl3b3JkRGF0YShtb2RlLCBtYXRjaFRleHQpIHtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzW21hdGNoVGV4dF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0tleXdvcmRzKCkge1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpIHtcbiAgICAgICAgZW1pdHRlci5hZGRUZXh0KG1vZGVCdWZmZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBsYXN0SW5kZXggPSAwO1xuICAgICAgdG9wLmtleXdvcmRQYXR0ZXJuUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIGxldCBtYXRjaCA9IHRvcC5rZXl3b3JkUGF0dGVyblJlLmV4ZWMobW9kZUJ1ZmZlcik7XG4gICAgICBsZXQgYnVmID0gXCJcIjtcblxuICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGJ1ZiArPSBtb2RlQnVmZmVyLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgY29uc3Qgd29yZCA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICAgIGNvbnN0IGRhdGEgPSBrZXl3b3JkRGF0YSh0b3AsIHdvcmQpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnN0IFtraW5kLCBrZXl3b3JkUmVsZXZhbmNlXSA9IGRhdGE7XG4gICAgICAgICAgZW1pdHRlci5hZGRUZXh0KGJ1Zik7XG4gICAgICAgICAgYnVmID0gXCJcIjtcblxuICAgICAgICAgIGtleXdvcmRIaXRzW3dvcmRdID0gKGtleXdvcmRIaXRzW3dvcmRdIHx8IDApICsgMTtcbiAgICAgICAgICBpZiAoa2V5d29yZEhpdHNbd29yZF0gPD0gTUFYX0tFWVdPUkRfSElUUykgcmVsZXZhbmNlICs9IGtleXdvcmRSZWxldmFuY2U7XG4gICAgICAgICAgaWYgKGtpbmQuc3RhcnRzV2l0aChcIl9cIikpIHtcbiAgICAgICAgICAgIC8vIF8gaW1wbGllZCBmb3IgcmVsZXZhbmNlIG9ubHksIGRvIG5vdCBoaWdobGlnaHRcbiAgICAgICAgICAgIC8vIGJ5IGFwcGx5aW5nIGEgY2xhc3MgbmFtZVxuICAgICAgICAgICAgYnVmICs9IG1hdGNoWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjc3NDbGFzcyA9IGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNba2luZF0gfHwga2luZDtcbiAgICAgICAgICAgIGVtaXRLZXl3b3JkKG1hdGNoWzBdLCBjc3NDbGFzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1ZiArPSBtYXRjaFswXTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0SW5kZXggPSB0b3Aua2V5d29yZFBhdHRlcm5SZS5sYXN0SW5kZXg7XG4gICAgICAgIG1hdGNoID0gdG9wLmtleXdvcmRQYXR0ZXJuUmUuZXhlYyhtb2RlQnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIGJ1ZiArPSBtb2RlQnVmZmVyLnN1YnN0cmluZyhsYXN0SW5kZXgpO1xuICAgICAgZW1pdHRlci5hZGRUZXh0KGJ1Zik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkge1xuICAgICAgaWYgKG1vZGVCdWZmZXIgPT09IFwiXCIpIHJldHVybjtcbiAgICAgIC8qKiBAdHlwZSBIaWdobGlnaHRSZXN1bHQgKi9cbiAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHRvcC5zdWJMYW5ndWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCFsYW5ndWFnZXNbdG9wLnN1Ykxhbmd1YWdlXSkge1xuICAgICAgICAgIGVtaXR0ZXIuYWRkVGV4dChtb2RlQnVmZmVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gX2hpZ2hsaWdodCh0b3Auc3ViTGFuZ3VhZ2UsIG1vZGVCdWZmZXIsIHRydWUsIGNvbnRpbnVhdGlvbnNbdG9wLnN1Ykxhbmd1YWdlXSk7XG4gICAgICAgIGNvbnRpbnVhdGlvbnNbdG9wLnN1Ykxhbmd1YWdlXSA9IC8qKiBAdHlwZSB7Q29tcGlsZWRNb2RlfSAqLyAocmVzdWx0Ll90b3ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaGlnaGxpZ2h0QXV0byhtb2RlQnVmZmVyLCB0b3Auc3ViTGFuZ3VhZ2UubGVuZ3RoID8gdG9wLnN1Ykxhbmd1YWdlIDogbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvdW50aW5nIGVtYmVkZGVkIGxhbmd1YWdlIHNjb3JlIHRvd2FyZHMgdGhlIGhvc3QgbGFuZ3VhZ2UgbWF5IGJlIGRpc2FibGVkXG4gICAgICAvLyB3aXRoIHplcm9pbmcgdGhlIGNvbnRhaW5pbmcgbW9kZSByZWxldmFuY2UuIFVzZSBjYXNlIGluIHBvaW50IGlzIE1hcmtkb3duIHRoYXRcbiAgICAgIC8vIGFsbG93cyBYTUwgZXZlcnl3aGVyZSBhbmQgbWFrZXMgZXZlcnkgWE1MIHNuaXBwZXQgdG8gaGF2ZSBhIG11Y2ggbGFyZ2VyIE1hcmtkb3duXG4gICAgICAvLyBzY29yZS5cbiAgICAgIGlmICh0b3AucmVsZXZhbmNlID4gMCkge1xuICAgICAgICByZWxldmFuY2UgKz0gcmVzdWx0LnJlbGV2YW5jZTtcbiAgICAgIH1cbiAgICAgIGVtaXR0ZXIuX19hZGRTdWJsYW5ndWFnZShyZXN1bHQuX2VtaXR0ZXIsIHJlc3VsdC5sYW5ndWFnZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0J1ZmZlcigpIHtcbiAgICAgIGlmICh0b3Auc3ViTGFuZ3VhZ2UgIT0gbnVsbCkge1xuICAgICAgICBwcm9jZXNzU3ViTGFuZ3VhZ2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3NLZXl3b3JkcygpO1xuICAgICAgfVxuICAgICAgbW9kZUJ1ZmZlciA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW1pdEtleXdvcmQoa2V5d29yZCwgc2NvcGUpIHtcbiAgICAgIGlmIChrZXl3b3JkID09PSBcIlwiKSByZXR1cm47XG5cbiAgICAgIGVtaXR0ZXIuc3RhcnRTY29wZShzY29wZSk7XG4gICAgICBlbWl0dGVyLmFkZFRleHQoa2V5d29yZCk7XG4gICAgICBlbWl0dGVyLmVuZFNjb3BlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDb21waWxlZFNjb3BlfSBzY29wZVxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0TXVsdGlDbGFzcyhzY29wZSwgbWF0Y2gpIHtcbiAgICAgIGxldCBpID0gMTtcbiAgICAgIGNvbnN0IG1heCA9IG1hdGNoLmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAoaSA8PSBtYXgpIHtcbiAgICAgICAgaWYgKCFzY29wZS5fZW1pdFtpXSkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIGNvbnN0IGtsYXNzID0gbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlc1tzY29wZVtpXV0gfHwgc2NvcGVbaV07XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaFtpXTtcbiAgICAgICAgaWYgKGtsYXNzKSB7XG4gICAgICAgICAgZW1pdEtleXdvcmQodGV4dCwga2xhc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSB0ZXh0O1xuICAgICAgICAgIHByb2Nlc3NLZXl3b3JkcygpO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZSAtIG5ldyBtb2RlIHRvIHN0YXJ0XG4gICAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0YXJ0TmV3TW9kZShtb2RlLCBtYXRjaCkge1xuICAgICAgaWYgKG1vZGUuc2NvcGUgJiYgdHlwZW9mIG1vZGUuc2NvcGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZW1pdHRlci5vcGVuTm9kZShsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzW21vZGUuc2NvcGVdIHx8IG1vZGUuc2NvcGUpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuYmVnaW5TY29wZSkge1xuICAgICAgICAvLyBiZWdpblNjb3BlIGp1c3Qgd3JhcHMgdGhlIGJlZ2luIG1hdGNoIGl0c2VsZiBpbiBhIHNjb3BlXG4gICAgICAgIGlmIChtb2RlLmJlZ2luU2NvcGUuX3dyYXApIHtcbiAgICAgICAgICBlbWl0S2V5d29yZChtb2RlQnVmZmVyLCBsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzW21vZGUuYmVnaW5TY29wZS5fd3JhcF0gfHwgbW9kZS5iZWdpblNjb3BlLl93cmFwKTtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlLmJlZ2luU2NvcGUuX211bHRpKSB7XG4gICAgICAgICAgLy8gYXQgdGhpcyBwb2ludCBtb2RlQnVmZmVyIHNob3VsZCBqdXN0IGJlIHRoZSBtYXRjaFxuICAgICAgICAgIGVtaXRNdWx0aUNsYXNzKG1vZGUuYmVnaW5TY29wZSwgbWF0Y2gpO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRvcCA9IE9iamVjdC5jcmVhdGUobW9kZSwgeyBwYXJlbnQ6IHsgdmFsdWU6IHRvcCB9IH0pO1xuICAgICAgcmV0dXJuIHRvcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZSB9IG1vZGUgLSB0aGUgbW9kZSB0byBwb3RlbnRpYWxseSBlbmRcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoIC0gdGhlIGxhdGVzdCBtYXRjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFBsdXNSZW1haW5kZXIgLSBtYXRjaCBwbHVzIHJlbWFpbmRlciBvZiBjb250ZW50XG4gICAgICogQHJldHVybnMge0NvbXBpbGVkTW9kZSB8IHZvaWR9IC0gdGhlIG5leHQgbW9kZSwgb3IgaWYgdm9pZCBjb250aW51ZSBvbiBpbiBjdXJyZW50IG1vZGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbmRPZk1vZGUobW9kZSwgbWF0Y2gsIG1hdGNoUGx1c1JlbWFpbmRlcikge1xuICAgICAgbGV0IG1hdGNoZWQgPSBzdGFydHNXaXRoKG1vZGUuZW5kUmUsIG1hdGNoUGx1c1JlbWFpbmRlcik7XG5cbiAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgIGlmIChtb2RlW1wib246ZW5kXCJdKSB7XG4gICAgICAgICAgY29uc3QgcmVzcCA9IG5ldyBSZXNwb25zZShtb2RlKTtcbiAgICAgICAgICBtb2RlW1wib246ZW5kXCJdKG1hdGNoLCByZXNwKTtcbiAgICAgICAgICBpZiAocmVzcC5pc01hdGNoSWdub3JlZCkgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICB3aGlsZSAobW9kZS5lbmRzUGFyZW50ICYmIG1vZGUucGFyZW50KSB7XG4gICAgICAgICAgICBtb2RlID0gbW9kZS5wYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBldmVuIGlmIG9uOmVuZCBmaXJlcyBhbiBgaWdub3JlYCBpdCdzIHN0aWxsIHBvc3NpYmxlXG4gICAgICAvLyB0aGF0IHdlIG1pZ2h0IHRyaWdnZXIgdGhlIGVuZCBub2RlIGJlY2F1c2Ugb2YgYSBwYXJlbnQgbW9kZVxuICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVuZE9mTW9kZShtb2RlLnBhcmVudCwgbWF0Y2gsIG1hdGNoUGx1c1JlbWFpbmRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIG1hdGNoaW5nIGJ1dCB0aGVuIGlnbm9yaW5nIGEgc2VxdWVuY2Ugb2YgdGV4dFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxleGVtZSAtIHN0cmluZyBjb250YWluaW5nIGZ1bGwgbWF0Y2ggdGV4dFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvSWdub3JlKGxleGVtZSkge1xuICAgICAgaWYgKHRvcC5tYXRjaGVyLnJlZ2V4SW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gbm8gbW9yZSByZWdleGVzIHRvIHBvdGVudGlhbGx5IG1hdGNoIGhlcmUsIHNvIHdlIG1vdmUgdGhlIGN1cnNvciBmb3J3YXJkIG9uZVxuICAgICAgICAvLyBzcGFjZVxuICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZVswXTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBubyBuZWVkIHRvIG1vdmUgdGhlIGN1cnNvciwgd2Ugc3RpbGwgaGF2ZSBhZGRpdGlvbmFsIHJlZ2V4ZXMgdG8gdHJ5IGFuZFxuICAgICAgICAvLyBtYXRjaCBhdCB0aGlzIHZlcnkgc3BvdFxuICAgICAgICByZXN1bWVTY2FuQXRTYW1lUG9zaXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHN0YXJ0IG9mIGEgbmV3IHBvdGVudGlhbCBtb2RlIG1hdGNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VuaGFuY2VkTWF0Y2h9IG1hdGNoIC0gdGhlIGN1cnJlbnQgbWF0Y2hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBob3cgZmFyIHRvIGFkdmFuY2UgdGhlIHBhcnNlIGN1cnNvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvQmVnaW5NYXRjaChtYXRjaCkge1xuICAgICAgY29uc3QgbGV4ZW1lID0gbWF0Y2hbMF07XG4gICAgICBjb25zdCBuZXdNb2RlID0gbWF0Y2gucnVsZTtcblxuICAgICAgY29uc3QgcmVzcCA9IG5ldyBSZXNwb25zZShuZXdNb2RlKTtcbiAgICAgIC8vIGZpcnN0IGludGVybmFsIGJlZm9yZSBjYWxsYmFja3MsIHRoZW4gdGhlIHB1YmxpYyBvbmVzXG4gICAgICBjb25zdCBiZWZvcmVDYWxsYmFja3MgPSBbbmV3TW9kZS5fX2JlZm9yZUJlZ2luLCBuZXdNb2RlW1wib246YmVnaW5cIl1dO1xuICAgICAgZm9yIChjb25zdCBjYiBvZiBiZWZvcmVDYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKCFjYikgY29udGludWU7XG4gICAgICAgIGNiKG1hdGNoLCByZXNwKTtcbiAgICAgICAgaWYgKHJlc3AuaXNNYXRjaElnbm9yZWQpIHJldHVybiBkb0lnbm9yZShsZXhlbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3TW9kZS5za2lwKSB7XG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5ld01vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciArPSBsZXhlbWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBpZiAoIW5ld01vZGUucmV0dXJuQmVnaW4gJiYgIW5ld01vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhcnROZXdNb2RlKG5ld01vZGUsIG1hdGNoKTtcbiAgICAgIHJldHVybiBuZXdNb2RlLnJldHVybkJlZ2luID8gMCA6IGxleGVtZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBwb3RlbnRpYWwgZW5kIG9mIG1vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2ggLSB0aGUgY3VycmVudCBtYXRjaFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvRW5kTWF0Y2gobWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxleGVtZSA9IG1hdGNoWzBdO1xuICAgICAgY29uc3QgbWF0Y2hQbHVzUmVtYWluZGVyID0gY29kZVRvSGlnaGxpZ2h0LnN1YnN0cmluZyhtYXRjaC5pbmRleCk7XG5cbiAgICAgIGNvbnN0IGVuZE1vZGUgPSBlbmRPZk1vZGUodG9wLCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcbiAgICAgIGlmICghZW5kTW9kZSkgeyByZXR1cm4gTk9fTUFUQ0g7IH1cblxuICAgICAgY29uc3Qgb3JpZ2luID0gdG9wO1xuICAgICAgaWYgKHRvcC5lbmRTY29wZSAmJiB0b3AuZW5kU2NvcGUuX3dyYXApIHtcbiAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBlbWl0S2V5d29yZChsZXhlbWUsIHRvcC5lbmRTY29wZS5fd3JhcCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcC5lbmRTY29wZSAmJiB0b3AuZW5kU2NvcGUuX211bHRpKSB7XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgZW1pdE11bHRpQ2xhc3ModG9wLmVuZFNjb3BlLCBtYXRjaCk7XG4gICAgICB9IGVsc2UgaWYgKG9yaWdpbi5za2lwKSB7XG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEob3JpZ2luLnJldHVybkVuZCB8fCBvcmlnaW4uZXhjbHVkZUVuZCkpIHtcbiAgICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGlmIChvcmlnaW4uZXhjbHVkZUVuZCkge1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBsZXhlbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRvcC5zY29wZSkge1xuICAgICAgICAgIGVtaXR0ZXIuY2xvc2VOb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3Auc2tpcCAmJiAhdG9wLnN1Ykxhbmd1YWdlKSB7XG4gICAgICAgICAgcmVsZXZhbmNlICs9IHRvcC5yZWxldmFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgIH0gd2hpbGUgKHRvcCAhPT0gZW5kTW9kZS5wYXJlbnQpO1xuICAgICAgaWYgKGVuZE1vZGUuc3RhcnRzKSB7XG4gICAgICAgIHN0YXJ0TmV3TW9kZShlbmRNb2RlLnN0YXJ0cywgbWF0Y2gpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbi5yZXR1cm5FbmQgPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQ29udGludWF0aW9ucygpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgIGZvciAobGV0IGN1cnJlbnQgPSB0b3A7IGN1cnJlbnQgIT09IGxhbmd1YWdlOyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuc2NvcGUpIHtcbiAgICAgICAgICBsaXN0LnVuc2hpZnQoY3VycmVudC5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QuZm9yRWFjaChpdGVtID0+IGVtaXR0ZXIub3Blbk5vZGUoaXRlbSkpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7e3R5cGU/OiBNYXRjaFR5cGUsIGluZGV4PzogbnVtYmVyLCBydWxlPzogTW9kZX19fSAqL1xuICAgIGxldCBsYXN0TWF0Y2ggPSB7fTtcblxuICAgIC8qKlxuICAgICAqICBQcm9jZXNzIGFuIGluZGl2aWR1YWwgbWF0Y2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QmVmb3JlTWF0Y2ggLSB0ZXh0IHByZWNlZGluZyB0aGUgbWF0Y2ggKHNpbmNlIHRoZSBsYXN0IG1hdGNoKVxuICAgICAqIEBwYXJhbSB7RW5oYW5jZWRNYXRjaH0gW21hdGNoXSAtIHRoZSBtYXRjaCBpdHNlbGZcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW1lKHRleHRCZWZvcmVNYXRjaCwgbWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxleGVtZSA9IG1hdGNoICYmIG1hdGNoWzBdO1xuXG4gICAgICAvLyBhZGQgbm9uLW1hdGNoZWQgdGV4dCB0byB0aGUgY3VycmVudCBtb2RlIGJ1ZmZlclxuICAgICAgbW9kZUJ1ZmZlciArPSB0ZXh0QmVmb3JlTWF0Y2g7XG5cbiAgICAgIGlmIChsZXhlbWUgPT0gbnVsbCkge1xuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICAvLyB3ZSd2ZSBmb3VuZCBhIDAgd2lkdGggbWF0Y2ggYW5kIHdlJ3JlIHN0dWNrLCBzbyB3ZSBuZWVkIHRvIGFkdmFuY2VcbiAgICAgIC8vIHRoaXMgaGFwcGVucyB3aGVuIHdlIGhhdmUgYmFkbHkgYmVoYXZlZCBydWxlcyB0aGF0IGhhdmUgb3B0aW9uYWwgbWF0Y2hlcnMgdG8gdGhlIGRlZ3JlZSB0aGF0XG4gICAgICAvLyBzb21ldGltZXMgdGhleSBjYW4gZW5kIHVwIG1hdGNoaW5nIG5vdGhpbmcgYXQgYWxsXG4gICAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzIxNDBcbiAgICAgIGlmIChsYXN0TWF0Y2gudHlwZSA9PT0gXCJiZWdpblwiICYmIG1hdGNoLnR5cGUgPT09IFwiZW5kXCIgJiYgbGFzdE1hdGNoLmluZGV4ID09PSBtYXRjaC5pbmRleCAmJiBsZXhlbWUgPT09IFwiXCIpIHtcbiAgICAgICAgLy8gc3BpdCB0aGUgXCJza2lwcGVkXCIgY2hhcmFjdGVyIHRoYXQgb3VyIHJlZ2V4IGNob2tlZCBvbiBiYWNrIGludG8gdGhlIG91dHB1dCBzZXF1ZW5jZVxuICAgICAgICBtb2RlQnVmZmVyICs9IGNvZGVUb0hpZ2hsaWdodC5zbGljZShtYXRjaC5pbmRleCwgbWF0Y2guaW5kZXggKyAxKTtcbiAgICAgICAgaWYgKCFTQUZFX01PREUpIHtcbiAgICAgICAgICAvKiogQHR5cGUge0Fubm90YXRlZEVycm9yfSAqL1xuICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgMCB3aWR0aCBtYXRjaCByZWdleCAoJHtsYW5ndWFnZU5hbWV9KWApO1xuICAgICAgICAgIGVyci5sYW5ndWFnZU5hbWUgPSBsYW5ndWFnZU5hbWU7XG4gICAgICAgICAgZXJyLmJhZFJ1bGUgPSBsYXN0TWF0Y2gucnVsZTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBsYXN0TWF0Y2ggPSBtYXRjaDtcblxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiYmVnaW5cIikge1xuICAgICAgICByZXR1cm4gZG9CZWdpbk1hdGNoKG1hdGNoKTtcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2gudHlwZSA9PT0gXCJpbGxlZ2FsXCIgJiYgIWlnbm9yZUlsbGVnYWxzKSB7XG4gICAgICAgIC8vIGlsbGVnYWwgbWF0Y2gsIHdlIGRvIG5vdCBjb250aW51ZSBwcm9jZXNzaW5nXG4gICAgICAgIC8qKiBAdHlwZSB7QW5ub3RhdGVkRXJyb3J9ICovXG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignSWxsZWdhbCBsZXhlbWUgXCInICsgbGV4ZW1lICsgJ1wiIGZvciBtb2RlIFwiJyArICh0b3Auc2NvcGUgfHwgJzx1bm5hbWVkPicpICsgJ1wiJyk7XG4gICAgICAgIGVyci5tb2RlID0gdG9wO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGVsc2UgaWYgKG1hdGNoLnR5cGUgPT09IFwiZW5kXCIpIHtcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkID0gZG9FbmRNYXRjaChtYXRjaCk7XG4gICAgICAgIGlmIChwcm9jZXNzZWQgIT09IE5PX01BVENIKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBlZGdlIGNhc2UgZm9yIHdoZW4gaWxsZWdhbCBtYXRjaGVzICQgKGVuZCBvZiBsaW5lKSB3aGljaCBpcyB0ZWNobmljYWxseVxuICAgICAgLy8gYSAwIHdpZHRoIG1hdGNoIGJ1dCBub3QgYSBiZWdpbi9lbmQgbWF0Y2ggc28gaXQncyBub3QgY2F1Z2h0IGJ5IHRoZVxuICAgICAgLy8gZmlyc3QgaGFuZGxlciAod2hlbiBpZ25vcmVJbGxlZ2FscyBpcyB0cnVlKVxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiaWxsZWdhbFwiICYmIGxleGVtZSA9PT0gXCJcIikge1xuICAgICAgICAvLyBhZHZhbmNlIHNvIHdlIGFyZW4ndCBzdHVjayBpbiBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuXG4gICAgICAvLyBpbmZpbml0ZSBsb29wcyBhcmUgQkFELCB0aGlzIGlzIGEgbGFzdCBkaXRjaCBjYXRjaCBhbGwuIGlmIHdlIGhhdmUgYVxuICAgICAgLy8gZGVjZW50IG51bWJlciBvZiBpdGVyYXRpb25zIHlldCBvdXIgaW5kZXggKGN1cnNvciBwb3NpdGlvbiBpbiBvdXJcbiAgICAgIC8vIHBhcnNpbmcpIHN0aWxsIDN4IGJlaGluZCBvdXIgaW5kZXggdGhlbiBzb21ldGhpbmcgaXMgdmVyeSB3cm9uZ1xuICAgICAgLy8gc28gd2UgYmFpbFxuICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgJiYgaXRlcmF0aW9ucyA+IG1hdGNoLmluZGV4ICogMykge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ3BvdGVudGlhbCBpbmZpbml0ZSBsb29wLCB3YXkgbW9yZSBpdGVyYXRpb25zIHRoYW4gbWF0Y2hlcycpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBXaHkgbWlnaHQgYmUgZmluZCBvdXJzZWx2ZXMgaGVyZT8gIEFuIHBvdGVudGlhbCBlbmQgbWF0Y2ggdGhhdCB3YXNcbiAgICAgIHRyaWdnZXJlZCBidXQgY291bGQgbm90IGJlIGNvbXBsZXRlZC4gIElFLCBgZG9FbmRNYXRjaGAgcmV0dXJuZWQgTk9fTUFUQ0guXG4gICAgICAodGhpcyBjb3VsZCBiZSBiZWNhdXNlIGEgY2FsbGJhY2sgcmVxdWVzdHMgdGhlIG1hdGNoIGJlIGlnbm9yZWQsIGV0YylcblxuICAgICAgVGhpcyBjYXVzZXMgbm8gcmVhbCBoYXJtIG90aGVyIHRoYW4gc3RvcHBpbmcgYSBmZXcgdGltZXMgdG9vIG1hbnkuXG4gICAgICAqL1xuXG4gICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgIHJldHVybiBsZXhlbWUubGVuZ3RoO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZ2V0TGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lKTtcbiAgICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgICBlcnJvcihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIGxhbmd1YWdlTmFtZSkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlOiBcIicgKyBsYW5ndWFnZU5hbWUgKyAnXCInKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZCA9IGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIC8qKiBAdHlwZSB7Q29tcGlsZWRNb2RlfSAqL1xuICAgIGxldCB0b3AgPSBjb250aW51YXRpb24gfHwgbWQ7XG4gICAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsQ29tcGlsZWRNb2RlPiAqL1xuICAgIGNvbnN0IGNvbnRpbnVhdGlvbnMgPSB7fTsgLy8ga2VlcCBjb250aW51YXRpb25zIGZvciBzdWItbGFuZ3VhZ2VzXG4gICAgY29uc3QgZW1pdHRlciA9IG5ldyBvcHRpb25zLl9fZW1pdHRlcihvcHRpb25zKTtcbiAgICBwcm9jZXNzQ29udGludWF0aW9ucygpO1xuICAgIGxldCBtb2RlQnVmZmVyID0gJyc7XG4gICAgbGV0IHJlbGV2YW5jZSA9IDA7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgbGV0IHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghbGFuZ3VhZ2UuX19lbWl0VG9rZW5zKSB7XG4gICAgICAgIHRvcC5tYXRjaGVyLmNvbnNpZGVyQWxsKCk7XG5cbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICBpZiAocmVzdW1lU2NhbkF0U2FtZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAvLyBvbmx5IHJlZ2V4ZXMgbm90IG1hdGNoZWQgcHJldmlvdXNseSB3aWxsIG5vdyBiZVxuICAgICAgICAgICAgLy8gY29uc2lkZXJlZCBmb3IgYSBwb3RlbnRpYWwgbWF0Y2hcbiAgICAgICAgICAgIHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3AubWF0Y2hlci5jb25zaWRlckFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b3AubWF0Y2hlci5sYXN0SW5kZXggPSBpbmRleDtcblxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gdG9wLm1hdGNoZXIuZXhlYyhjb2RlVG9IaWdobGlnaHQpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibWF0Y2hcIiwgbWF0Y2hbMF0sIG1hdGNoLnJ1bGUgJiYgbWF0Y2gucnVsZS5iZWdpbilcblxuICAgICAgICAgIGlmICghbWF0Y2gpIGJyZWFrO1xuXG4gICAgICAgICAgY29uc3QgYmVmb3JlTWF0Y2ggPSBjb2RlVG9IaWdobGlnaHQuc3Vic3RyaW5nKGluZGV4LCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgY29uc3QgcHJvY2Vzc2VkQ291bnQgPSBwcm9jZXNzTGV4ZW1lKGJlZm9yZU1hdGNoLCBtYXRjaCk7XG4gICAgICAgICAgaW5kZXggPSBtYXRjaC5pbmRleCArIHByb2Nlc3NlZENvdW50O1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NMZXhlbWUoY29kZVRvSGlnaGxpZ2h0LnN1YnN0cmluZyhpbmRleCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFuZ3VhZ2UuX19lbWl0VG9rZW5zKGNvZGVUb0hpZ2hsaWdodCwgZW1pdHRlcik7XG4gICAgICB9XG5cbiAgICAgIGVtaXR0ZXIuZmluYWxpemUoKTtcbiAgICAgIHJlc3VsdCA9IGVtaXR0ZXIudG9IVE1MKCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgIHJlbGV2YW5jZSxcbiAgICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICAgIF9lbWl0dGVyOiBlbWl0dGVyLFxuICAgICAgICBfdG9wOiB0b3BcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0lsbGVnYWwnKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZShjb2RlVG9IaWdobGlnaHQpLFxuICAgICAgICAgIGlsbGVnYWw6IHRydWUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIF9pbGxlZ2FsQnk6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjb250ZXh0OiBjb2RlVG9IaWdobGlnaHQuc2xpY2UoaW5kZXggLSAxMDAsIGluZGV4ICsgMTAwKSxcbiAgICAgICAgICAgIG1vZGU6IGVyci5tb2RlLFxuICAgICAgICAgICAgcmVzdWx0U29GYXI6IHJlc3VsdFxuICAgICAgICAgIH0sXG4gICAgICAgICAgX2VtaXR0ZXI6IGVtaXR0ZXJcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoU0FGRV9NT0RFKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlTmFtZSxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKGNvZGVUb0hpZ2hsaWdodCksXG4gICAgICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGVycm9yUmFpc2VkOiBlcnIsXG4gICAgICAgICAgX2VtaXR0ZXI6IGVtaXR0ZXIsXG4gICAgICAgICAgX3RvcDogdG9wXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSB2YWxpZCBoaWdobGlnaHQgcmVzdWx0LCB3aXRob3V0IGFjdHVhbGx5IGRvaW5nIGFueSBhY3R1YWwgd29yayxcbiAgICogYXV0byBoaWdobGlnaHQgc3RhcnRzIHdpdGggdGhpcyBhbmQgaXQncyBwb3NzaWJsZSBmb3Igc21hbGwgc25pcHBldHMgdGhhdFxuICAgKiBhdXRvLWRldGVjdGlvbiBtYXkgbm90IGZpbmQgYSBiZXR0ZXIgbWF0Y2hcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGVcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH1cbiAgICovXG4gIGZ1bmN0aW9uIGp1c3RUZXh0SGlnaGxpZ2h0UmVzdWx0KGNvZGUpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICB2YWx1ZTogZXNjYXBlKGNvZGUpLFxuICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBfdG9wOiBQTEFJTlRFWFRfTEFOR1VBR0UsXG4gICAgICBfZW1pdHRlcjogbmV3IG9wdGlvbnMuX19lbWl0dGVyKG9wdGlvbnMpXG4gICAgfTtcbiAgICByZXN1bHQuX2VtaXR0ZXIuYWRkVGV4dChjb2RlKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gIEhpZ2hsaWdodGluZyB3aXRoIGxhbmd1YWdlIGRldGVjdGlvbi4gQWNjZXB0cyBhIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvXG4gIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cbiAgLSBsYW5ndWFnZSAoZGV0ZWN0ZWQgbGFuZ3VhZ2UpXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcbiAgLSBzZWNvbmRCZXN0IChvYmplY3Qgd2l0aCB0aGUgc2FtZSBzdHJ1Y3R1cmUgZm9yIHNlY29uZC1iZXN0IGhldXJpc3RpY2FsbHlcbiAgICBkZXRlY3RlZCBsYW5ndWFnZSwgbWF5IGJlIGFic2VudClcblxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gICAgQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBbbGFuZ3VhZ2VTdWJzZXRdXG4gICAgQHJldHVybnMge0F1dG9IaWdobGlnaHRSZXN1bHR9XG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEF1dG8oY29kZSwgbGFuZ3VhZ2VTdWJzZXQpIHtcbiAgICBsYW5ndWFnZVN1YnNldCA9IGxhbmd1YWdlU3Vic2V0IHx8IG9wdGlvbnMubGFuZ3VhZ2VzIHx8IE9iamVjdC5rZXlzKGxhbmd1YWdlcyk7XG4gICAgY29uc3QgcGxhaW50ZXh0ID0ganVzdFRleHRIaWdobGlnaHRSZXN1bHQoY29kZSk7XG5cbiAgICBjb25zdCByZXN1bHRzID0gbGFuZ3VhZ2VTdWJzZXQuZmlsdGVyKGdldExhbmd1YWdlKS5maWx0ZXIoYXV0b0RldGVjdGlvbikubWFwKG5hbWUgPT5cbiAgICAgIF9oaWdobGlnaHQobmFtZSwgY29kZSwgZmFsc2UpXG4gICAgKTtcbiAgICByZXN1bHRzLnVuc2hpZnQocGxhaW50ZXh0KTsgLy8gcGxhaW50ZXh0IGlzIGFsd2F5cyBhbiBvcHRpb25cblxuICAgIGNvbnN0IHNvcnRlZCA9IHJlc3VsdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgLy8gc29ydCBiYXNlIG9uIHJlbGV2YW5jZVxuICAgICAgaWYgKGEucmVsZXZhbmNlICE9PSBiLnJlbGV2YW5jZSkgcmV0dXJuIGIucmVsZXZhbmNlIC0gYS5yZWxldmFuY2U7XG5cbiAgICAgIC8vIGFsd2F5cyBhd2FyZCB0aGUgdGllIHRvIHRoZSBiYXNlIGxhbmd1YWdlXG4gICAgICAvLyBpZSBpZiBDKysgYW5kIEFyZHVpbm8gYXJlIHRpZWQsIGl0J3MgbW9yZSBsaWtlbHkgdG8gYmUgQysrXG4gICAgICBpZiAoYS5sYW5ndWFnZSAmJiBiLmxhbmd1YWdlKSB7XG4gICAgICAgIGlmIChnZXRMYW5ndWFnZShhLmxhbmd1YWdlKS5zdXBlcnNldE9mID09PSBiLmxhbmd1YWdlKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0TGFuZ3VhZ2UoYi5sYW5ndWFnZSkuc3VwZXJzZXRPZiA9PT0gYS5sYW5ndWFnZSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBvdGhlcndpc2Ugc2F5IHRoZXkgYXJlIGVxdWFsLCB3aGljaCBoYXMgdGhlIGVmZmVjdCBvZiBzb3J0aW5nIG9uXG4gICAgICAvLyByZWxldmFuY2Ugd2hpbGUgcHJlc2VydmluZyB0aGUgb3JpZ2luYWwgb3JkZXJpbmcgLSB3aGljaCBpcyBob3cgdGllc1xuICAgICAgLy8gaGF2ZSBoaXN0b3JpY2FsbHkgYmVlbiBzZXR0bGVkLCBpZSB0aGUgbGFuZ3VhZ2UgdGhhdCBjb21lcyBmaXJzdCBhbHdheXNcbiAgICAgIC8vIHdpbnMgaW4gdGhlIGNhc2Ugb2YgYSB0aWVcbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgY29uc3QgW2Jlc3QsIHNlY29uZEJlc3RdID0gc29ydGVkO1xuXG4gICAgLyoqIEB0eXBlIHtBdXRvSGlnaGxpZ2h0UmVzdWx0fSAqL1xuICAgIGNvbnN0IHJlc3VsdCA9IGJlc3Q7XG4gICAgcmVzdWx0LnNlY29uZEJlc3QgPSBzZWNvbmRCZXN0O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgbmV3IGNsYXNzIG5hbWUgZm9yIGJsb2NrIGdpdmVuIHRoZSBsYW5ndWFnZSBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtjdXJyZW50TGFuZ11cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtyZXN1bHRMYW5nXVxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlQ2xhc3NOYW1lKGVsZW1lbnQsIGN1cnJlbnRMYW5nLCByZXN1bHRMYW5nKSB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSAoY3VycmVudExhbmcgJiYgYWxpYXNlc1tjdXJyZW50TGFuZ10pIHx8IHJlc3VsdExhbmc7XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJobGpzXCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbGFuZ3VhZ2UtJHtsYW5ndWFnZX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhIERPTSBub2RlIGNvbnRhaW5pbmcgY29kZS5cbiAgICpcbiAgICogQHBhcmFtIHtIaWdobGlnaHRlZEhUTUxFbGVtZW50fSBlbGVtZW50IC0gdGhlIEhUTUwgZWxlbWVudCB0byBoaWdobGlnaHRcbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50KSB7XG4gICAgLyoqIEB0eXBlIEhUTUxFbGVtZW50ICovXG4gICAgbGV0IG5vZGUgPSBudWxsO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShlbGVtZW50KTtcblxuICAgIGlmIChzaG91bGROb3RIaWdobGlnaHQobGFuZ3VhZ2UpKSByZXR1cm47XG5cbiAgICBmaXJlKFwiYmVmb3JlOmhpZ2hsaWdodEVsZW1lbnRcIixcbiAgICAgIHsgZWw6IGVsZW1lbnQsIGxhbmd1YWdlIH0pO1xuXG4gICAgaWYgKGVsZW1lbnQuZGF0YXNldC5oaWdobGlnaHRlZCkge1xuICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IHByZXZpb3VzbHkgaGlnaGxpZ2h0ZWQuIFRvIGhpZ2hsaWdodCBhZ2FpbiwgZmlyc3QgdW5zZXQgYGRhdGFzZXQuaGlnaGxpZ2h0ZWRgLlwiLCBlbGVtZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgYmUgYWxsIHRleHQsIG5vIGNoaWxkIG5vZGVzICh1bmVzY2FwZWQgSFRNTCkgLSB0aGlzIGlzIHBvc3NpYmx5XG4gICAgLy8gYW4gSFRNTCBpbmplY3Rpb24gYXR0YWNrIC0gaXQncyBsaWtlbHkgdG9vIGxhdGUgaWYgdGhpcyBpcyBhbHJlYWR5IGluXG4gICAgLy8gcHJvZHVjdGlvbiAodGhlIGNvZGUgaGFzIGxpa2VseSBhbHJlYWR5IGRvbmUgaXRzIGRhbWFnZSBieSB0aGUgdGltZVxuICAgIC8vIHdlJ3JlIHNlZWluZyBpdCkuLi4gYnV0IHdlIHllbGwgbG91ZGx5IGFib3V0IHRoaXMgc28gdGhhdCBob3BlZnVsbHkgaXQnc1xuICAgIC8vIG1vcmUgbGlrZWx5IHRvIGJlIGNhdWdodCBpbiBkZXZlbG9wbWVudCBiZWZvcmUgbWFraW5nIGl0IHRvIHByb2R1Y3Rpb25cbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIW9wdGlvbnMuaWdub3JlVW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJPbmUgb2YgeW91ciBjb2RlIGJsb2NrcyBpbmNsdWRlcyB1bmVzY2FwZWQgSFRNTC4gVGhpcyBpcyBhIHBvdGVudGlhbGx5IHNlcmlvdXMgc2VjdXJpdHkgcmlzay5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcImh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvd2lraS9zZWN1cml0eVwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVGhlIGVsZW1lbnQgd2l0aCB1bmVzY2FwZWQgSFRNTDpcIik7XG4gICAgICAgIGNvbnNvbGUud2FybihlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnRocm93VW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgSFRNTEluamVjdGlvbkVycm9yKFxuICAgICAgICAgIFwiT25lIG9mIHlvdXIgY29kZSBibG9ja3MgaW5jbHVkZXMgdW5lc2NhcGVkIEhUTUwuXCIsXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUgPSBlbGVtZW50O1xuICAgIGNvbnN0IHRleHQgPSBub2RlLnRleHRDb250ZW50O1xuICAgIGNvbnN0IHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KHRleHQsIHsgbGFuZ3VhZ2UsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcblxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIGVsZW1lbnQuZGF0YXNldC5oaWdobGlnaHRlZCA9IFwieWVzXCI7XG4gICAgdXBkYXRlQ2xhc3NOYW1lKGVsZW1lbnQsIGxhbmd1YWdlLCByZXN1bHQubGFuZ3VhZ2UpO1xuICAgIGVsZW1lbnQucmVzdWx0ID0ge1xuICAgICAgbGFuZ3VhZ2U6IHJlc3VsdC5sYW5ndWFnZSxcbiAgICAgIC8vIFRPRE86IHJlbW92ZSB3aXRoIHZlcnNpb24gMTEuMFxuICAgICAgcmU6IHJlc3VsdC5yZWxldmFuY2UsXG4gICAgICByZWxldmFuY2U6IHJlc3VsdC5yZWxldmFuY2VcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuc2Vjb25kQmVzdCkge1xuICAgICAgZWxlbWVudC5zZWNvbmRCZXN0ID0ge1xuICAgICAgICBsYW5ndWFnZTogcmVzdWx0LnNlY29uZEJlc3QubGFuZ3VhZ2UsXG4gICAgICAgIHJlbGV2YW5jZTogcmVzdWx0LnNlY29uZEJlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZpcmUoXCJhZnRlcjpoaWdobGlnaHRFbGVtZW50XCIsIHsgZWw6IGVsZW1lbnQsIHJlc3VsdCwgdGV4dCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGhpZ2hsaWdodC5qcyBnbG9iYWwgb3B0aW9ucyB3aXRoIHRoZSBwYXNzZWQgb3B0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge1BhcnRpYWw8SExKU09wdGlvbnM+fSB1c2VyT3B0aW9uc1xuICAgKi9cbiAgZnVuY3Rpb24gY29uZmlndXJlKHVzZXJPcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGluaGVyaXQob3B0aW9ucywgdXNlck9wdGlvbnMpO1xuICB9XG5cbiAgLy8gVE9ETzogcmVtb3ZlIHYxMiwgZGVwcmVjYXRlZFxuICBjb25zdCBpbml0SGlnaGxpZ2h0aW5nID0gKCkgPT4ge1xuICAgIGhpZ2hsaWdodEFsbCgpO1xuICAgIGRlcHJlY2F0ZWQoXCIxMC42LjBcIiwgXCJpbml0SGlnaGxpZ2h0aW5nKCkgZGVwcmVjYXRlZC4gIFVzZSBoaWdobGlnaHRBbGwoKSBub3cuXCIpO1xuICB9O1xuXG4gIC8vIFRPRE86IHJlbW92ZSB2MTIsIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIHtcbiAgICBoaWdobGlnaHRBbGwoKTtcbiAgICBkZXByZWNhdGVkKFwiMTAuNi4wXCIsIFwiaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIGRlcHJlY2F0ZWQuICBVc2UgaGlnaGxpZ2h0QWxsKCkgbm93LlwiKTtcbiAgfVxuXG4gIGxldCB3YW50c0hpZ2hsaWdodCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBhdXRvLWhpZ2hsaWdodHMgYWxsIHByZT5jb2RlIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRBbGwoKSB7XG4gICAgLy8gaWYgd2UgYXJlIGNhbGxlZCB0b28gZWFybHkgaW4gdGhlIGxvYWRpbmcgcHJvY2Vzc1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgICAgd2FudHNIaWdobGlnaHQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5jc3NTZWxlY3Rvcik7XG4gICAgYmxvY2tzLmZvckVhY2goaGlnaGxpZ2h0RWxlbWVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBib290KCkge1xuICAgIC8vIGlmIGEgaGlnaGxpZ2h0IHdhcyByZXF1ZXN0ZWQgYmVmb3JlIERPTSB3YXMgbG9hZGVkLCBkbyBub3dcbiAgICBpZiAod2FudHNIaWdobGlnaHQpIGhpZ2hsaWdodEFsbCgpO1xuICB9XG5cbiAgLy8gbWFrZSBzdXJlIHdlIGFyZSBpbiB0aGUgYnJvd3NlciBlbnZpcm9ubWVudFxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGJvb3QsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxhbmd1YWdlIGdyYW1tYXIgbW9kdWxlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICogQHBhcmFtIHtMYW5ndWFnZUZufSBsYW5ndWFnZURlZmluaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lLCBsYW5ndWFnZURlZmluaXRpb24pIHtcbiAgICBsZXQgbGFuZyA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGxhbmcgPSBsYW5ndWFnZURlZmluaXRpb24oaGxqcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IkMSkge1xuICAgICAgZXJyb3IoXCJMYW5ndWFnZSBkZWZpbml0aW9uIGZvciAne30nIGNvdWxkIG5vdCBiZSByZWdpc3RlcmVkLlwiLnJlcGxhY2UoXCJ7fVwiLCBsYW5ndWFnZU5hbWUpKTtcbiAgICAgIC8vIGhhcmQgb3Igc29mdCBlcnJvclxuICAgICAgaWYgKCFTQUZFX01PREUpIHsgdGhyb3cgZXJyb3IkMTsgfSBlbHNlIHsgZXJyb3IoZXJyb3IkMSk7IH1cbiAgICAgIC8vIGxhbmd1YWdlcyB0aGF0IGhhdmUgc2VyaW91cyBlcnJvcnMgYXJlIHJlcGxhY2VkIHdpdGggZXNzZW50aWFsbHkgYVxuICAgICAgLy8gXCJwbGFpbnRleHRcIiBzdGFuZC1pbiBzbyB0aGF0IHRoZSBjb2RlIGJsb2NrcyB3aWxsIHN0aWxsIGdldCBub3JtYWxcbiAgICAgIC8vIGNzcyBjbGFzc2VzIGFwcGxpZWQgdG8gdGhlbSAtIGFuZCBvbmUgYmFkIGxhbmd1YWdlIHdvbid0IGJyZWFrIHRoZVxuICAgICAgLy8gZW50aXJlIGhpZ2hsaWdodGVyXG4gICAgICBsYW5nID0gUExBSU5URVhUX0xBTkdVQUdFO1xuICAgIH1cbiAgICAvLyBnaXZlIGl0IGEgdGVtcG9yYXJ5IG5hbWUgaWYgaXQgZG9lc24ndCBoYXZlIG9uZSBpbiB0aGUgbWV0YS1kYXRhXG4gICAgaWYgKCFsYW5nLm5hbWUpIGxhbmcubmFtZSA9IGxhbmd1YWdlTmFtZTtcbiAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VOYW1lXSA9IGxhbmc7XG4gICAgbGFuZy5yYXdEZWZpbml0aW9uID0gbGFuZ3VhZ2VEZWZpbml0aW9uLmJpbmQobnVsbCwgaGxqcyk7XG5cbiAgICBpZiAobGFuZy5hbGlhc2VzKSB7XG4gICAgICByZWdpc3RlckFsaWFzZXMobGFuZy5hbGlhc2VzLCB7IGxhbmd1YWdlTmFtZSB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGFuZ3VhZ2UgZ3JhbW1hciBtb2R1bGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gdW5yZWdpc3Rlckxhbmd1YWdlKGxhbmd1YWdlTmFtZSkge1xuICAgIGRlbGV0ZSBsYW5ndWFnZXNbbGFuZ3VhZ2VOYW1lXTtcbiAgICBmb3IgKGNvbnN0IGFsaWFzIG9mIE9iamVjdC5rZXlzKGFsaWFzZXMpKSB7XG4gICAgICBpZiAoYWxpYXNlc1thbGlhc10gPT09IGxhbmd1YWdlTmFtZSkge1xuICAgICAgICBkZWxldGUgYWxpYXNlc1thbGlhc107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gTGlzdCBvZiBsYW5ndWFnZSBpbnRlcm5hbCBuYW1lc1xuICAgKi9cbiAgZnVuY3Rpb24gbGlzdExhbmd1YWdlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobGFuZ3VhZ2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIGxhbmd1YWdlIHRvIHJldHJpZXZlXG4gICAqIEByZXR1cm5zIHtMYW5ndWFnZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldExhbmd1YWdlKG5hbWUpIHtcbiAgICBuYW1lID0gKG5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxhbmd1YWdlc1tuYW1lXSB8fCBsYW5ndWFnZXNbYWxpYXNlc1tuYW1lXV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGFsaWFzTGlzdCAtIHNpbmdsZSBhbGlhcyBvciBsaXN0IG9mIGFsaWFzZXNcbiAgICogQHBhcmFtIHt7bGFuZ3VhZ2VOYW1lOiBzdHJpbmd9fSBvcHRzXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3RlckFsaWFzZXMoYWxpYXNMaXN0LCB7IGxhbmd1YWdlTmFtZSB9KSB7XG4gICAgaWYgKHR5cGVvZiBhbGlhc0xpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhbGlhc0xpc3QgPSBbYWxpYXNMaXN0XTtcbiAgICB9XG4gICAgYWxpYXNMaXN0LmZvckVhY2goYWxpYXMgPT4geyBhbGlhc2VzW2FsaWFzLnRvTG93ZXJDYXNlKCldID0gbGFuZ3VhZ2VOYW1lOyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGEgZ2l2ZW4gbGFuZ3VhZ2UgaGFzIGF1dG8tZGV0ZWN0aW9uIGVuYWJsZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxuICAgKi9cbiAgZnVuY3Rpb24gYXV0b0RldGVjdGlvbihuYW1lKSB7XG4gICAgY29uc3QgbGFuZyA9IGdldExhbmd1YWdlKG5hbWUpO1xuICAgIHJldHVybiBsYW5nICYmICFsYW5nLmRpc2FibGVBdXRvZGV0ZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIHRoZSBvbGQgaGlnaGxpZ2h0QmxvY2sgcGx1Z2lucyB0byB0aGUgbmV3XG4gICAqIGhpZ2hsaWdodEVsZW1lbnQgQVBJXG4gICAqIEBwYXJhbSB7SExKU1BsdWdpbn0gcGx1Z2luXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlUGx1Z2luQVBJKHBsdWdpbikge1xuICAgIC8vIFRPRE86IHJlbW92ZSB3aXRoIHYxMlxuICAgIGlmIChwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0QmxvY2tcIl0gJiYgIXBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRFbGVtZW50XCJdKSB7XG4gICAgICBwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0RWxlbWVudFwiXSA9IChkYXRhKSA9PiB7XG4gICAgICAgIHBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRCbG9ja1wiXShcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHsgYmxvY2s6IGRhdGEuZWwgfSwgZGF0YSlcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChwbHVnaW5bXCJhZnRlcjpoaWdobGlnaHRCbG9ja1wiXSAmJiAhcGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0RWxlbWVudFwiXSkge1xuICAgICAgcGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0RWxlbWVudFwiXSA9IChkYXRhKSA9PiB7XG4gICAgICAgIHBsdWdpbltcImFmdGVyOmhpZ2hsaWdodEJsb2NrXCJdKFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oeyBibG9jazogZGF0YS5lbCB9LCBkYXRhKVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtITEpTUGx1Z2lufSBwbHVnaW5cbiAgICovXG4gIGZ1bmN0aW9uIGFkZFBsdWdpbihwbHVnaW4pIHtcbiAgICB1cGdyYWRlUGx1Z2luQVBJKHBsdWdpbik7XG4gICAgcGx1Z2lucy5wdXNoKHBsdWdpbik7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtITEpTUGx1Z2lufSBwbHVnaW5cbiAgICovXG4gIGZ1bmN0aW9uIHJlbW92ZVBsdWdpbihwbHVnaW4pIHtcbiAgICBjb25zdCBpbmRleCA9IHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtQbHVnaW5FdmVudH0gZXZlbnRcbiAgICogQHBhcmFtIHthbnl9IGFyZ3NcbiAgICovXG4gIGZ1bmN0aW9uIGZpcmUoZXZlbnQsIGFyZ3MpIHtcbiAgICBjb25zdCBjYiA9IGV2ZW50O1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgIGlmIChwbHVnaW5bY2JdKSB7XG4gICAgICAgIHBsdWdpbltjYl0oYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGVsXG4gICAqL1xuICBmdW5jdGlvbiBkZXByZWNhdGVIaWdobGlnaHRCbG9jayhlbCkge1xuICAgIGRlcHJlY2F0ZWQoXCIxMC43LjBcIiwgXCJoaWdobGlnaHRCbG9jayB3aWxsIGJlIHJlbW92ZWQgZW50aXJlbHkgaW4gdjEyLjBcIik7XG4gICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcIlBsZWFzZSB1c2UgaGlnaGxpZ2h0RWxlbWVudCBub3cuXCIpO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodEVsZW1lbnQoZWwpO1xuICB9XG5cbiAgLyogSW50ZXJmYWNlIGRlZmluaXRpb24gKi9cbiAgT2JqZWN0LmFzc2lnbihobGpzLCB7XG4gICAgaGlnaGxpZ2h0LFxuICAgIGhpZ2hsaWdodEF1dG8sXG4gICAgaGlnaGxpZ2h0QWxsLFxuICAgIGhpZ2hsaWdodEVsZW1lbnQsXG4gICAgLy8gVE9ETzogUmVtb3ZlIHdpdGggdjEyIEFQSVxuICAgIGhpZ2hsaWdodEJsb2NrOiBkZXByZWNhdGVIaWdobGlnaHRCbG9jayxcbiAgICBjb25maWd1cmUsXG4gICAgaW5pdEhpZ2hsaWdodGluZyxcbiAgICBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkLFxuICAgIHJlZ2lzdGVyTGFuZ3VhZ2UsXG4gICAgdW5yZWdpc3Rlckxhbmd1YWdlLFxuICAgIGxpc3RMYW5ndWFnZXMsXG4gICAgZ2V0TGFuZ3VhZ2UsXG4gICAgcmVnaXN0ZXJBbGlhc2VzLFxuICAgIGF1dG9EZXRlY3Rpb24sXG4gICAgaW5oZXJpdCxcbiAgICBhZGRQbHVnaW4sXG4gICAgcmVtb3ZlUGx1Z2luXG4gIH0pO1xuXG4gIGhsanMuZGVidWdNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IGZhbHNlOyB9O1xuICBobGpzLnNhZmVNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IHRydWU7IH07XG4gIGhsanMudmVyc2lvblN0cmluZyA9IHZlcnNpb247XG5cbiAgaGxqcy5yZWdleCA9IHtcbiAgICBjb25jYXQ6IGNvbmNhdCxcbiAgICBsb29rYWhlYWQ6IGxvb2thaGVhZCxcbiAgICBlaXRoZXI6IGVpdGhlcixcbiAgICBvcHRpb25hbDogb3B0aW9uYWwsXG4gICAgYW55TnVtYmVyT2ZUaW1lczogYW55TnVtYmVyT2ZUaW1lc1xuICB9O1xuXG4gIGZvciAoY29uc3Qga2V5IGluIE1PREVTKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh0eXBlb2YgTU9ERVNba2V5XSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZGVlcEZyZWV6ZShNT0RFU1trZXldKTtcbiAgICB9XG4gIH1cblxuICAvLyBtZXJnZSBhbGwgdGhlIG1vZGVzL3JlZ2V4ZXMgaW50byBvdXIgbWFpbiBvYmplY3RcbiAgT2JqZWN0LmFzc2lnbihobGpzLCBNT0RFUyk7XG5cbiAgcmV0dXJuIGhsanM7XG59O1xuXG4vLyBPdGhlciBuYW1lcyBmb3IgdGhlIHZhcmlhYmxlIG1heSBicmVhayBidWlsZCBzY3JpcHRcbmNvbnN0IGhpZ2hsaWdodCA9IEhMSlMoe30pO1xuXG4vLyByZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBoaWdobGlnaHRlciB0byBiZSB1c2VkIGZvciBleHRlbnNpb25zXG4vLyBjaGVjayBodHRwczovL2dpdGh1Yi5jb20vd29vb3JtL2xvd2xpZ2h0L2lzc3Vlcy80N1xuaGlnaGxpZ2h0Lm5ld0luc3RhbmNlID0gKCkgPT4gSExKUyh7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0O1xuaGlnaGxpZ2h0LkhpZ2hsaWdodEpTID0gaGlnaGxpZ2h0O1xuaGlnaGxpZ2h0LmRlZmF1bHQgPSBoaWdobGlnaHQ7XG4iLCAiLy8gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wYWNrYWdlcy5odG1sI3BhY2thZ2VzX3dyaXRpbmdfZHVhbF9wYWNrYWdlc193aGlsZV9hdm9pZGluZ19vcl9taW5pbWl6aW5nX2hhemFyZHNcbmltcG9ydCBIaWdobGlnaHRKUyBmcm9tICcuLi9saWIvY29yZS5qcyc7XG5leHBvcnQgeyBIaWdobGlnaHRKUyB9O1xuZXhwb3J0IGRlZmF1bHQgSGlnaGxpZ2h0SlM7XG4iLCAiLypcbkxhbmd1YWdlOiBCYXNoXG5BdXRob3I6IHZhaCA8dmFodGVuYmVyZ0BnbWFpbC5jb20+XG5Db250cmlidXRyb3JzOiBCZW5qYW1pbiBQYW5uZWxsIDxjb250YWN0QHNpZXJyYXNvZnR3b3Jrcy5jb20+XG5XZWJzaXRlOiBodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2Jhc2gvXG5DYXRlZ29yeTogY29tbW9uXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gYmFzaChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgVkFSID0ge307XG4gIGNvbnN0IEJSQUNFRF9WQVIgPSB7XG4gICAgYmVnaW46IC9cXCRcXHsvLFxuICAgIGVuZDogL1xcfS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFwic2VsZlwiLFxuICAgICAge1xuICAgICAgICBiZWdpbjogLzotLyxcbiAgICAgICAgY29udGFpbnM6IFsgVkFSIF1cbiAgICAgIH0gLy8gZGVmYXVsdCB2YWx1ZXNcbiAgICBdXG4gIH07XG4gIE9iamVjdC5hc3NpZ24oVkFSLCB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IGJlZ2luOiByZWdleC5jb25jYXQoL1xcJFtcXHdcXGQjQF1bXFx3XFxkX10qLyxcbiAgICAgICAgLy8gbmVnYXRpdmUgbG9vay1haGVhZCB0cmllcyB0byBhdm9pZCBtYXRjaGluZyBwYXR0ZXJucyB0aGF0IGFyZSBub3RcbiAgICAgICAgLy8gUGVybCBhdCBhbGwgbGlrZSAkaWRlbnQkLCBAaWRlbnRALCBldGMuXG4gICAgICAgIGAoPyFbXFxcXHdcXFxcZF0pKD8hWyRdKWApIH0sXG4gICAgICBCUkFDRURfVkFSXG4gICAgXVxuICB9KTtcblxuICBjb25zdCBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46IC9cXCRcXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF1cbiAgfTtcbiAgY29uc3QgSEVSRV9ET0MgPSB7XG4gICAgYmVnaW46IC88PC0/XFxzKig/PVxcdyspLyxcbiAgICBzdGFydHM6IHsgY29udGFpbnM6IFtcbiAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICBiZWdpbjogLyhcXHcrKS8sXG4gICAgICAgIGVuZDogLyhcXHcrKS8sXG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZydcbiAgICAgIH0pXG4gICAgXSB9XG4gIH07XG4gIGNvbnN0IFFVT1RFX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvXCIvLFxuICAgIGVuZDogL1wiLyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgVkFSLFxuICAgICAgU1VCU1RcbiAgICBdXG4gIH07XG4gIFNVQlNULmNvbnRhaW5zLnB1c2goUVVPVEVfU1RSSU5HKTtcbiAgY29uc3QgRVNDQVBFRF9RVU9URSA9IHtcbiAgICBtYXRjaDogL1xcXFxcIi9cbiAgfTtcbiAgY29uc3QgQVBPU19TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogLycvLFxuICAgIGVuZDogLycvXG4gIH07XG4gIGNvbnN0IEVTQ0FQRURfQVBPUyA9IHtcbiAgICBtYXRjaDogL1xcXFwnL1xuICB9O1xuICBjb25zdCBBUklUSE1FVElDID0ge1xuICAgIGJlZ2luOiAvXFwkP1xcKFxcKC8sXG4gICAgZW5kOiAvXFwpXFwpLyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcZCsjWzAtOWEtZl0rLyxcbiAgICAgICAgY2xhc3NOYW1lOiBcIm51bWJlclwiXG4gICAgICB9LFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIFZBUlxuICAgIF1cbiAgfTtcbiAgY29uc3QgU0hfTElLRV9TSEVMTFMgPSBbXG4gICAgXCJmaXNoXCIsXG4gICAgXCJiYXNoXCIsXG4gICAgXCJ6c2hcIixcbiAgICBcInNoXCIsXG4gICAgXCJjc2hcIixcbiAgICBcImtzaFwiLFxuICAgIFwidGNzaFwiLFxuICAgIFwiZGFzaFwiLFxuICAgIFwic2NzaFwiLFxuICBdO1xuICBjb25zdCBLTk9XTl9TSEVCQU5HID0gaGxqcy5TSEVCQU5HKHtcbiAgICBiaW5hcnk6IGAoJHtTSF9MSUtFX1NIRUxMUy5qb2luKFwifFwiKX0pYCxcbiAgICByZWxldmFuY2U6IDEwXG4gIH0pO1xuICBjb25zdCBGVU5DVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW46IC9cXHdbXFx3XFxkX10qXFxzKlxcKFxccypcXClcXHMqXFx7LyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICBjb250YWluczogWyBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGJlZ2luOiAvXFx3W1xcd1xcZF9dKi8gfSkgXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICBcImlmXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbGlmXCIsXG4gICAgXCJmaVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwidW50aWxcIixcbiAgICBcImluXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZG9uZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiZXNhY1wiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcInNlbGVjdFwiXG4gIF07XG5cbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiXG4gIF07XG5cbiAgLy8gdG8gY29uc3VtZSBwYXRocyB0byBwcmV2ZW50IGtleXdvcmQgbWF0Y2hlcyBpbnNpZGUgdGhlbVxuICBjb25zdCBQQVRIX01PREUgPSB7IG1hdGNoOiAvKFxcL1thLXouXy1dKykrLyB9O1xuXG4gIC8vIGh0dHA6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9iYXNoL21hbnVhbC9odG1sX25vZGUvU2hlbGwtQnVpbHRpbi1Db21tYW5kcy5odG1sXG4gIGNvbnN0IFNIRUxMX0JVSUxUX0lOUyA9IFtcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjZFwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImV2YWxcIixcbiAgICBcImV4ZWNcIixcbiAgICBcImV4aXRcIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiZ2V0b3B0c1wiLFxuICAgIFwiaGFzaFwiLFxuICAgIFwicHdkXCIsXG4gICAgXCJyZWFkb25seVwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzaGlmdFwiLFxuICAgIFwidGVzdFwiLFxuICAgIFwidGltZXNcIixcbiAgICBcInRyYXBcIixcbiAgICBcInVtYXNrXCIsXG4gICAgXCJ1bnNldFwiXG4gIF07XG5cbiAgY29uc3QgQkFTSF9CVUlMVF9JTlMgPSBbXG4gICAgXCJhbGlhc1wiLFxuICAgIFwiYmluZFwiLFxuICAgIFwiYnVpbHRpblwiLFxuICAgIFwiY2FsbGVyXCIsXG4gICAgXCJjb21tYW5kXCIsXG4gICAgXCJkZWNsYXJlXCIsXG4gICAgXCJlY2hvXCIsXG4gICAgXCJlbmFibGVcIixcbiAgICBcImhlbHBcIixcbiAgICBcImxldFwiLFxuICAgIFwibG9jYWxcIixcbiAgICBcImxvZ291dFwiLFxuICAgIFwibWFwZmlsZVwiLFxuICAgIFwicHJpbnRmXCIsXG4gICAgXCJyZWFkXCIsXG4gICAgXCJyZWFkYXJyYXlcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwidHlwZXNldFwiLFxuICAgIFwidWxpbWl0XCIsXG4gICAgXCJ1bmFsaWFzXCJcbiAgXTtcblxuICBjb25zdCBaU0hfQlVJTFRfSU5TID0gW1xuICAgIFwiYXV0b2xvYWRcIixcbiAgICBcImJnXCIsXG4gICAgXCJiaW5ka2V5XCIsXG4gICAgXCJieWVcIixcbiAgICBcImNhcFwiLFxuICAgIFwiY2hkaXJcIixcbiAgICBcImNsb25lXCIsXG4gICAgXCJjb21wYXJndW1lbnRzXCIsXG4gICAgXCJjb21wY2FsbFwiLFxuICAgIFwiY29tcGN0bFwiLFxuICAgIFwiY29tcGRlc2NyaWJlXCIsXG4gICAgXCJjb21wZmlsZXNcIixcbiAgICBcImNvbXBncm91cHNcIixcbiAgICBcImNvbXBxdW90ZVwiLFxuICAgIFwiY29tcHRhZ3NcIixcbiAgICBcImNvbXB0cnlcIixcbiAgICBcImNvbXB2YWx1ZXNcIixcbiAgICBcImRpcnNcIixcbiAgICBcImRpc2FibGVcIixcbiAgICBcImRpc293blwiLFxuICAgIFwiZWNob3RjXCIsXG4gICAgXCJlY2hvdGlcIixcbiAgICBcImVtdWxhdGVcIixcbiAgICBcImZjXCIsXG4gICAgXCJmZ1wiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcImZ1bmN0aW9uc1wiLFxuICAgIFwiZ2V0Y2FwXCIsXG4gICAgXCJnZXRsblwiLFxuICAgIFwiaGlzdG9yeVwiLFxuICAgIFwiaW50ZWdlclwiLFxuICAgIFwiam9ic1wiLFxuICAgIFwia2lsbFwiLFxuICAgIFwibGltaXRcIixcbiAgICBcImxvZ1wiLFxuICAgIFwibm9nbG9iXCIsXG4gICAgXCJwb3BkXCIsXG4gICAgXCJwcmludFwiLFxuICAgIFwicHVzaGRcIixcbiAgICBcInB1c2hsblwiLFxuICAgIFwicmVoYXNoXCIsXG4gICAgXCJzY2hlZFwiLFxuICAgIFwic2V0Y2FwXCIsXG4gICAgXCJzZXRvcHRcIixcbiAgICBcInN0YXRcIixcbiAgICBcInN1c3BlbmRcIixcbiAgICBcInR0eWN0bFwiLFxuICAgIFwidW5mdW5jdGlvblwiLFxuICAgIFwidW5oYXNoXCIsXG4gICAgXCJ1bmxpbWl0XCIsXG4gICAgXCJ1bnNldG9wdFwiLFxuICAgIFwidmFyZWRcIixcbiAgICBcIndhaXRcIixcbiAgICBcIndoZW5jZVwiLFxuICAgIFwid2hlcmVcIixcbiAgICBcIndoaWNoXCIsXG4gICAgXCJ6Y29tcGlsZVwiLFxuICAgIFwiemZvcm1hdFwiLFxuICAgIFwiemZ0cFwiLFxuICAgIFwiemxlXCIsXG4gICAgXCJ6bW9kbG9hZFwiLFxuICAgIFwienBhcnNlb3B0c1wiLFxuICAgIFwienByb2ZcIixcbiAgICBcInpwdHlcIixcbiAgICBcInpyZWdleHBhcnNlXCIsXG4gICAgXCJ6c29ja2V0XCIsXG4gICAgXCJ6c3R5bGVcIixcbiAgICBcInp0Y3BcIlxuICBdO1xuXG4gIGNvbnN0IEdOVV9DT1JFX1VUSUxTID0gW1xuICAgIFwiY2hjb25cIixcbiAgICBcImNoZ3JwXCIsXG4gICAgXCJjaG93blwiLFxuICAgIFwiY2htb2RcIixcbiAgICBcImNwXCIsXG4gICAgXCJkZFwiLFxuICAgIFwiZGZcIixcbiAgICBcImRpclwiLFxuICAgIFwiZGlyY29sb3JzXCIsXG4gICAgXCJsblwiLFxuICAgIFwibHNcIixcbiAgICBcIm1rZGlyXCIsXG4gICAgXCJta2ZpZm9cIixcbiAgICBcIm1rbm9kXCIsXG4gICAgXCJta3RlbXBcIixcbiAgICBcIm12XCIsXG4gICAgXCJyZWFscGF0aFwiLFxuICAgIFwicm1cIixcbiAgICBcInJtZGlyXCIsXG4gICAgXCJzaHJlZFwiLFxuICAgIFwic3luY1wiLFxuICAgIFwidG91Y2hcIixcbiAgICBcInRydW5jYXRlXCIsXG4gICAgXCJ2ZGlyXCIsXG4gICAgXCJiMnN1bVwiLFxuICAgIFwiYmFzZTMyXCIsXG4gICAgXCJiYXNlNjRcIixcbiAgICBcImNhdFwiLFxuICAgIFwiY2tzdW1cIixcbiAgICBcImNvbW1cIixcbiAgICBcImNzcGxpdFwiLFxuICAgIFwiY3V0XCIsXG4gICAgXCJleHBhbmRcIixcbiAgICBcImZtdFwiLFxuICAgIFwiZm9sZFwiLFxuICAgIFwiaGVhZFwiLFxuICAgIFwiam9pblwiLFxuICAgIFwibWQ1c3VtXCIsXG4gICAgXCJubFwiLFxuICAgIFwibnVtZm10XCIsXG4gICAgXCJvZFwiLFxuICAgIFwicGFzdGVcIixcbiAgICBcInB0eFwiLFxuICAgIFwicHJcIixcbiAgICBcInNoYTFzdW1cIixcbiAgICBcInNoYTIyNHN1bVwiLFxuICAgIFwic2hhMjU2c3VtXCIsXG4gICAgXCJzaGEzODRzdW1cIixcbiAgICBcInNoYTUxMnN1bVwiLFxuICAgIFwic2h1ZlwiLFxuICAgIFwic29ydFwiLFxuICAgIFwic3BsaXRcIixcbiAgICBcInN1bVwiLFxuICAgIFwidGFjXCIsXG4gICAgXCJ0YWlsXCIsXG4gICAgXCJ0clwiLFxuICAgIFwidHNvcnRcIixcbiAgICBcInVuZXhwYW5kXCIsXG4gICAgXCJ1bmlxXCIsXG4gICAgXCJ3Y1wiLFxuICAgIFwiYXJjaFwiLFxuICAgIFwiYmFzZW5hbWVcIixcbiAgICBcImNocm9vdFwiLFxuICAgIFwiZGF0ZVwiLFxuICAgIFwiZGlybmFtZVwiLFxuICAgIFwiZHVcIixcbiAgICBcImVjaG9cIixcbiAgICBcImVudlwiLFxuICAgIFwiZXhwclwiLFxuICAgIFwiZmFjdG9yXCIsXG4gICAgLy8gXCJmYWxzZVwiLCAvLyBrZXl3b3JkIGxpdGVyYWwgYWxyZWFkeVxuICAgIFwiZ3JvdXBzXCIsXG4gICAgXCJob3N0aWRcIixcbiAgICBcImlkXCIsXG4gICAgXCJsaW5rXCIsXG4gICAgXCJsb2duYW1lXCIsXG4gICAgXCJuaWNlXCIsXG4gICAgXCJub2h1cFwiLFxuICAgIFwibnByb2NcIixcbiAgICBcInBhdGhjaGtcIixcbiAgICBcInBpbmt5XCIsXG4gICAgXCJwcmludGVudlwiLFxuICAgIFwicHJpbnRmXCIsXG4gICAgXCJwd2RcIixcbiAgICBcInJlYWRsaW5rXCIsXG4gICAgXCJydW5jb25cIixcbiAgICBcInNlcVwiLFxuICAgIFwic2xlZXBcIixcbiAgICBcInN0YXRcIixcbiAgICBcInN0ZGJ1ZlwiLFxuICAgIFwic3R0eVwiLFxuICAgIFwidGVlXCIsXG4gICAgXCJ0ZXN0XCIsXG4gICAgXCJ0aW1lb3V0XCIsXG4gICAgLy8gXCJ0cnVlXCIsIC8vIGtleXdvcmQgbGl0ZXJhbCBhbHJlYWR5XG4gICAgXCJ0dHlcIixcbiAgICBcInVuYW1lXCIsXG4gICAgXCJ1bmxpbmtcIixcbiAgICBcInVwdGltZVwiLFxuICAgIFwidXNlcnNcIixcbiAgICBcIndob1wiLFxuICAgIFwid2hvYW1pXCIsXG4gICAgXCJ5ZXNcIlxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0Jhc2gnLFxuICAgIGFsaWFzZXM6IFsgJ3NoJyBdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogL1xcYlthLXpdW2EtejAtOS5fLV0rXFxiLyxcbiAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLFxuICAgICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgICBidWlsdF9pbjogW1xuICAgICAgICAuLi5TSEVMTF9CVUlMVF9JTlMsXG4gICAgICAgIC4uLkJBU0hfQlVJTFRfSU5TLFxuICAgICAgICAvLyBTaGVsbCBtb2RpZmllcnNcbiAgICAgICAgXCJzZXRcIixcbiAgICAgICAgXCJzaG9wdFwiLFxuICAgICAgICAuLi5aU0hfQlVJTFRfSU5TLFxuICAgICAgICAuLi5HTlVfQ09SRV9VVElMU1xuICAgICAgXVxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEtOT1dOX1NIRUJBTkcsIC8vIHRvIGNhdGNoIGtub3duIHNoZWxscyBhbmQgYm9vc3QgcmVsZXZhbmN5XG4gICAgICBobGpzLlNIRUJBTkcoKSwgLy8gdG8gY2F0Y2ggdW5rbm93biBzaGVsbHMgYnV0IHN0aWxsIGhpZ2hsaWdodCB0aGUgc2hlYmFuZ1xuICAgICAgRlVOQ1RJT04sXG4gICAgICBBUklUSE1FVElDLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIEhFUkVfRE9DLFxuICAgICAgUEFUSF9NT0RFLFxuICAgICAgUVVPVEVfU1RSSU5HLFxuICAgICAgRVNDQVBFRF9RVU9URSxcbiAgICAgIEFQT1NfU1RSSU5HLFxuICAgICAgRVNDQVBFRF9BUE9TLFxuICAgICAgVkFSXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyBiYXNoIGFzIGRlZmF1bHQgfTtcbiIsICJjb25zdCBNT0RFUyA9IChobGpzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgSU1QT1JUQU5UOiB7XG4gICAgICBzY29wZTogJ21ldGEnLFxuICAgICAgYmVnaW46ICchaW1wb3J0YW50J1xuICAgIH0sXG4gICAgQkxPQ0tfQ09NTUVOVDogaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBIRVhDT0xPUjoge1xuICAgICAgc2NvcGU6ICdudW1iZXInLFxuICAgICAgYmVnaW46IC8jKChbMC05YS1mQS1GXXszLDR9KXwoKFswLTlhLWZBLUZdezJ9KXszLDR9KSlcXGIvXG4gICAgfSxcbiAgICBGVU5DVElPTl9ESVNQQVRDSDoge1xuICAgICAgY2xhc3NOYW1lOiBcImJ1aWx0X2luXCIsXG4gICAgICBiZWdpbjogL1tcXHctXSsoPz1cXCgpL1xuICAgIH0sXG4gICAgQVRUUklCVVRFX1NFTEVDVE9SX01PREU6IHtcbiAgICAgIHNjb3BlOiAnc2VsZWN0b3ItYXR0cicsXG4gICAgICBiZWdpbjogL1xcWy8sXG4gICAgICBlbmQ6IC9cXF0vLFxuICAgICAgaWxsZWdhbDogJyQnLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gICAgICBdXG4gICAgfSxcbiAgICBDU1NfTlVNQkVSX01PREU6IHtcbiAgICAgIHNjb3BlOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiBobGpzLk5VTUJFUl9SRSArICcoJyArXG4gICAgICAgICclfGVtfGV4fGNofHJlbScgK1xuICAgICAgICAnfHZ3fHZofHZtaW58dm1heCcgK1xuICAgICAgICAnfGNtfG1tfGlufHB0fHBjfHB4JyArXG4gICAgICAgICd8ZGVnfGdyYWR8cmFkfHR1cm4nICtcbiAgICAgICAgJ3xzfG1zJyArXG4gICAgICAgICd8SHp8a0h6JyArXG4gICAgICAgICd8ZHBpfGRwY218ZHBweCcgK1xuICAgICAgICAnKT8nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICBDU1NfVkFSSUFCTEU6IHtcbiAgICAgIGNsYXNzTmFtZTogXCJhdHRyXCIsXG4gICAgICBiZWdpbjogLy0tW0EtWmEtel9dW0EtWmEtejAtOV8tXSovXG4gICAgfVxuICB9O1xufTtcblxuY29uc3QgVEFHUyA9IFtcbiAgJ2EnLFxuICAnYWJicicsXG4gICdhZGRyZXNzJyxcbiAgJ2FydGljbGUnLFxuICAnYXNpZGUnLFxuICAnYXVkaW8nLFxuICAnYicsXG4gICdibG9ja3F1b3RlJyxcbiAgJ2JvZHknLFxuICAnYnV0dG9uJyxcbiAgJ2NhbnZhcycsXG4gICdjYXB0aW9uJyxcbiAgJ2NpdGUnLFxuICAnY29kZScsXG4gICdkZCcsXG4gICdkZWwnLFxuICAnZGV0YWlscycsXG4gICdkZm4nLFxuICAnZGl2JyxcbiAgJ2RsJyxcbiAgJ2R0JyxcbiAgJ2VtJyxcbiAgJ2ZpZWxkc2V0JyxcbiAgJ2ZpZ2NhcHRpb24nLFxuICAnZmlndXJlJyxcbiAgJ2Zvb3RlcicsXG4gICdmb3JtJyxcbiAgJ2gxJyxcbiAgJ2gyJyxcbiAgJ2gzJyxcbiAgJ2g0JyxcbiAgJ2g1JyxcbiAgJ2g2JyxcbiAgJ2hlYWRlcicsXG4gICdoZ3JvdXAnLFxuICAnaHRtbCcsXG4gICdpJyxcbiAgJ2lmcmFtZScsXG4gICdpbWcnLFxuICAnaW5wdXQnLFxuICAnaW5zJyxcbiAgJ2tiZCcsXG4gICdsYWJlbCcsXG4gICdsZWdlbmQnLFxuICAnbGknLFxuICAnbWFpbicsXG4gICdtYXJrJyxcbiAgJ21lbnUnLFxuICAnbmF2JyxcbiAgJ29iamVjdCcsXG4gICdvbCcsXG4gICdwJyxcbiAgJ3EnLFxuICAncXVvdGUnLFxuICAnc2FtcCcsXG4gICdzZWN0aW9uJyxcbiAgJ3NwYW4nLFxuICAnc3Ryb25nJyxcbiAgJ3N1bW1hcnknLFxuICAnc3VwJyxcbiAgJ3RhYmxlJyxcbiAgJ3Rib2R5JyxcbiAgJ3RkJyxcbiAgJ3RleHRhcmVhJyxcbiAgJ3Rmb290JyxcbiAgJ3RoJyxcbiAgJ3RoZWFkJyxcbiAgJ3RpbWUnLFxuICAndHInLFxuICAndWwnLFxuICAndmFyJyxcbiAgJ3ZpZGVvJ1xuXTtcblxuY29uc3QgTUVESUFfRkVBVFVSRVMgPSBbXG4gICdhbnktaG92ZXInLFxuICAnYW55LXBvaW50ZXInLFxuICAnYXNwZWN0LXJhdGlvJyxcbiAgJ2NvbG9yJyxcbiAgJ2NvbG9yLWdhbXV0JyxcbiAgJ2NvbG9yLWluZGV4JyxcbiAgJ2RldmljZS1hc3BlY3QtcmF0aW8nLFxuICAnZGV2aWNlLWhlaWdodCcsXG4gICdkZXZpY2Utd2lkdGgnLFxuICAnZGlzcGxheS1tb2RlJyxcbiAgJ2ZvcmNlZC1jb2xvcnMnLFxuICAnZ3JpZCcsXG4gICdoZWlnaHQnLFxuICAnaG92ZXInLFxuICAnaW52ZXJ0ZWQtY29sb3JzJyxcbiAgJ21vbm9jaHJvbWUnLFxuICAnb3JpZW50YXRpb24nLFxuICAnb3ZlcmZsb3ctYmxvY2snLFxuICAnb3ZlcmZsb3ctaW5saW5lJyxcbiAgJ3BvaW50ZXInLFxuICAncHJlZmVycy1jb2xvci1zY2hlbWUnLFxuICAncHJlZmVycy1jb250cmFzdCcsXG4gICdwcmVmZXJzLXJlZHVjZWQtbW90aW9uJyxcbiAgJ3ByZWZlcnMtcmVkdWNlZC10cmFuc3BhcmVuY3knLFxuICAncmVzb2x1dGlvbicsXG4gICdzY2FuJyxcbiAgJ3NjcmlwdGluZycsXG4gICd1cGRhdGUnLFxuICAnd2lkdGgnLFxuICAvLyBUT0RPOiBmaW5kIGEgYmV0dGVyIHNvbHV0aW9uP1xuICAnbWluLXdpZHRoJyxcbiAgJ21heC13aWR0aCcsXG4gICdtaW4taGVpZ2h0JyxcbiAgJ21heC1oZWlnaHQnXG5dO1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvUHNldWRvLWNsYXNzZXNcbmNvbnN0IFBTRVVET19DTEFTU0VTID0gW1xuICAnYWN0aXZlJyxcbiAgJ2FueS1saW5rJyxcbiAgJ2JsYW5rJyxcbiAgJ2NoZWNrZWQnLFxuICAnY3VycmVudCcsXG4gICdkZWZhdWx0JyxcbiAgJ2RlZmluZWQnLFxuICAnZGlyJywgLy8gZGlyKClcbiAgJ2Rpc2FibGVkJyxcbiAgJ2Ryb3AnLFxuICAnZW1wdHknLFxuICAnZW5hYmxlZCcsXG4gICdmaXJzdCcsXG4gICdmaXJzdC1jaGlsZCcsXG4gICdmaXJzdC1vZi10eXBlJyxcbiAgJ2Z1bGxzY3JlZW4nLFxuICAnZnV0dXJlJyxcbiAgJ2ZvY3VzJyxcbiAgJ2ZvY3VzLXZpc2libGUnLFxuICAnZm9jdXMtd2l0aGluJyxcbiAgJ2hhcycsIC8vIGhhcygpXG4gICdob3N0JywgLy8gaG9zdCBvciBob3N0KClcbiAgJ2hvc3QtY29udGV4dCcsIC8vIGhvc3QtY29udGV4dCgpXG4gICdob3ZlcicsXG4gICdpbmRldGVybWluYXRlJyxcbiAgJ2luLXJhbmdlJyxcbiAgJ2ludmFsaWQnLFxuICAnaXMnLCAvLyBpcygpXG4gICdsYW5nJywgLy8gbGFuZygpXG4gICdsYXN0LWNoaWxkJyxcbiAgJ2xhc3Qtb2YtdHlwZScsXG4gICdsZWZ0JyxcbiAgJ2xpbmsnLFxuICAnbG9jYWwtbGluaycsXG4gICdub3QnLCAvLyBub3QoKVxuICAnbnRoLWNoaWxkJywgLy8gbnRoLWNoaWxkKClcbiAgJ250aC1jb2wnLCAvLyBudGgtY29sKClcbiAgJ250aC1sYXN0LWNoaWxkJywgLy8gbnRoLWxhc3QtY2hpbGQoKVxuICAnbnRoLWxhc3QtY29sJywgLy8gbnRoLWxhc3QtY29sKClcbiAgJ250aC1sYXN0LW9mLXR5cGUnLCAvL250aC1sYXN0LW9mLXR5cGUoKVxuICAnbnRoLW9mLXR5cGUnLCAvL250aC1vZi10eXBlKClcbiAgJ29ubHktY2hpbGQnLFxuICAnb25seS1vZi10eXBlJyxcbiAgJ29wdGlvbmFsJyxcbiAgJ291dC1vZi1yYW5nZScsXG4gICdwYXN0JyxcbiAgJ3BsYWNlaG9sZGVyLXNob3duJyxcbiAgJ3JlYWQtb25seScsXG4gICdyZWFkLXdyaXRlJyxcbiAgJ3JlcXVpcmVkJyxcbiAgJ3JpZ2h0JyxcbiAgJ3Jvb3QnLFxuICAnc2NvcGUnLFxuICAndGFyZ2V0JyxcbiAgJ3RhcmdldC13aXRoaW4nLFxuICAndXNlci1pbnZhbGlkJyxcbiAgJ3ZhbGlkJyxcbiAgJ3Zpc2l0ZWQnLFxuICAnd2hlcmUnIC8vIHdoZXJlKClcbl07XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Qc2V1ZG8tZWxlbWVudHNcbmNvbnN0IFBTRVVET19FTEVNRU5UUyA9IFtcbiAgJ2FmdGVyJyxcbiAgJ2JhY2tkcm9wJyxcbiAgJ2JlZm9yZScsXG4gICdjdWUnLFxuICAnY3VlLXJlZ2lvbicsXG4gICdmaXJzdC1sZXR0ZXInLFxuICAnZmlyc3QtbGluZScsXG4gICdncmFtbWFyLWVycm9yJyxcbiAgJ21hcmtlcicsXG4gICdwYXJ0JyxcbiAgJ3BsYWNlaG9sZGVyJyxcbiAgJ3NlbGVjdGlvbicsXG4gICdzbG90dGVkJyxcbiAgJ3NwZWxsaW5nLWVycm9yJ1xuXTtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtcbiAgJ2FsaWduLWNvbnRlbnQnLFxuICAnYWxpZ24taXRlbXMnLFxuICAnYWxpZ24tc2VsZicsXG4gICdhbGwnLFxuICAnYW5pbWF0aW9uJyxcbiAgJ2FuaW1hdGlvbi1kZWxheScsXG4gICdhbmltYXRpb24tZGlyZWN0aW9uJyxcbiAgJ2FuaW1hdGlvbi1kdXJhdGlvbicsXG4gICdhbmltYXRpb24tZmlsbC1tb2RlJyxcbiAgJ2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQnLFxuICAnYW5pbWF0aW9uLW5hbWUnLFxuICAnYW5pbWF0aW9uLXBsYXktc3RhdGUnLFxuICAnYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbicsXG4gICdiYWNrZmFjZS12aXNpYmlsaXR5JyxcbiAgJ2JhY2tncm91bmQnLFxuICAnYmFja2dyb3VuZC1hdHRhY2htZW50JyxcbiAgJ2JhY2tncm91bmQtYmxlbmQtbW9kZScsXG4gICdiYWNrZ3JvdW5kLWNsaXAnLFxuICAnYmFja2dyb3VuZC1jb2xvcicsXG4gICdiYWNrZ3JvdW5kLWltYWdlJyxcbiAgJ2JhY2tncm91bmQtb3JpZ2luJyxcbiAgJ2JhY2tncm91bmQtcG9zaXRpb24nLFxuICAnYmFja2dyb3VuZC1yZXBlYXQnLFxuICAnYmFja2dyb3VuZC1zaXplJyxcbiAgJ2Jsb2NrLXNpemUnLFxuICAnYm9yZGVyJyxcbiAgJ2JvcmRlci1ibG9jaycsXG4gICdib3JkZXItYmxvY2stY29sb3InLFxuICAnYm9yZGVyLWJsb2NrLWVuZCcsXG4gICdib3JkZXItYmxvY2stZW5kLWNvbG9yJyxcbiAgJ2JvcmRlci1ibG9jay1lbmQtc3R5bGUnLFxuICAnYm9yZGVyLWJsb2NrLWVuZC13aWR0aCcsXG4gICdib3JkZXItYmxvY2stc3RhcnQnLFxuICAnYm9yZGVyLWJsb2NrLXN0YXJ0LWNvbG9yJyxcbiAgJ2JvcmRlci1ibG9jay1zdGFydC1zdHlsZScsXG4gICdib3JkZXItYmxvY2stc3RhcnQtd2lkdGgnLFxuICAnYm9yZGVyLWJsb2NrLXN0eWxlJyxcbiAgJ2JvcmRlci1ibG9jay13aWR0aCcsXG4gICdib3JkZXItYm90dG9tJyxcbiAgJ2JvcmRlci1ib3R0b20tY29sb3InLFxuICAnYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cycsXG4gICdib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cycsXG4gICdib3JkZXItYm90dG9tLXN0eWxlJyxcbiAgJ2JvcmRlci1ib3R0b20td2lkdGgnLFxuICAnYm9yZGVyLWNvbGxhcHNlJyxcbiAgJ2JvcmRlci1jb2xvcicsXG4gICdib3JkZXItaW1hZ2UnLFxuICAnYm9yZGVyLWltYWdlLW91dHNldCcsXG4gICdib3JkZXItaW1hZ2UtcmVwZWF0JyxcbiAgJ2JvcmRlci1pbWFnZS1zbGljZScsXG4gICdib3JkZXItaW1hZ2Utc291cmNlJyxcbiAgJ2JvcmRlci1pbWFnZS13aWR0aCcsXG4gICdib3JkZXItaW5saW5lJyxcbiAgJ2JvcmRlci1pbmxpbmUtY29sb3InLFxuICAnYm9yZGVyLWlubGluZS1lbmQnLFxuICAnYm9yZGVyLWlubGluZS1lbmQtY29sb3InLFxuICAnYm9yZGVyLWlubGluZS1lbmQtc3R5bGUnLFxuICAnYm9yZGVyLWlubGluZS1lbmQtd2lkdGgnLFxuICAnYm9yZGVyLWlubGluZS1zdGFydCcsXG4gICdib3JkZXItaW5saW5lLXN0YXJ0LWNvbG9yJyxcbiAgJ2JvcmRlci1pbmxpbmUtc3RhcnQtc3R5bGUnLFxuICAnYm9yZGVyLWlubGluZS1zdGFydC13aWR0aCcsXG4gICdib3JkZXItaW5saW5lLXN0eWxlJyxcbiAgJ2JvcmRlci1pbmxpbmUtd2lkdGgnLFxuICAnYm9yZGVyLWxlZnQnLFxuICAnYm9yZGVyLWxlZnQtY29sb3InLFxuICAnYm9yZGVyLWxlZnQtc3R5bGUnLFxuICAnYm9yZGVyLWxlZnQtd2lkdGgnLFxuICAnYm9yZGVyLXJhZGl1cycsXG4gICdib3JkZXItcmlnaHQnLFxuICAnYm9yZGVyLXJpZ2h0LWNvbG9yJyxcbiAgJ2JvcmRlci1yaWdodC1zdHlsZScsXG4gICdib3JkZXItcmlnaHQtd2lkdGgnLFxuICAnYm9yZGVyLXNwYWNpbmcnLFxuICAnYm9yZGVyLXN0eWxlJyxcbiAgJ2JvcmRlci10b3AnLFxuICAnYm9yZGVyLXRvcC1jb2xvcicsXG4gICdib3JkZXItdG9wLWxlZnQtcmFkaXVzJyxcbiAgJ2JvcmRlci10b3AtcmlnaHQtcmFkaXVzJyxcbiAgJ2JvcmRlci10b3Atc3R5bGUnLFxuICAnYm9yZGVyLXRvcC13aWR0aCcsXG4gICdib3JkZXItd2lkdGgnLFxuICAnYm90dG9tJyxcbiAgJ2JveC1kZWNvcmF0aW9uLWJyZWFrJyxcbiAgJ2JveC1zaGFkb3cnLFxuICAnYm94LXNpemluZycsXG4gICdicmVhay1hZnRlcicsXG4gICdicmVhay1iZWZvcmUnLFxuICAnYnJlYWstaW5zaWRlJyxcbiAgJ2NhcHRpb24tc2lkZScsXG4gICdjYXJldC1jb2xvcicsXG4gICdjbGVhcicsXG4gICdjbGlwJyxcbiAgJ2NsaXAtcGF0aCcsXG4gICdjbGlwLXJ1bGUnLFxuICAnY29sb3InLFxuICAnY29sdW1uLWNvdW50JyxcbiAgJ2NvbHVtbi1maWxsJyxcbiAgJ2NvbHVtbi1nYXAnLFxuICAnY29sdW1uLXJ1bGUnLFxuICAnY29sdW1uLXJ1bGUtY29sb3InLFxuICAnY29sdW1uLXJ1bGUtc3R5bGUnLFxuICAnY29sdW1uLXJ1bGUtd2lkdGgnLFxuICAnY29sdW1uLXNwYW4nLFxuICAnY29sdW1uLXdpZHRoJyxcbiAgJ2NvbHVtbnMnLFxuICAnY29udGFpbicsXG4gICdjb250ZW50JyxcbiAgJ2NvbnRlbnQtdmlzaWJpbGl0eScsXG4gICdjb3VudGVyLWluY3JlbWVudCcsXG4gICdjb3VudGVyLXJlc2V0JyxcbiAgJ2N1ZScsXG4gICdjdWUtYWZ0ZXInLFxuICAnY3VlLWJlZm9yZScsXG4gICdjdXJzb3InLFxuICAnZGlyZWN0aW9uJyxcbiAgJ2Rpc3BsYXknLFxuICAnZW1wdHktY2VsbHMnLFxuICAnZmlsdGVyJyxcbiAgJ2ZsZXgnLFxuICAnZmxleC1iYXNpcycsXG4gICdmbGV4LWRpcmVjdGlvbicsXG4gICdmbGV4LWZsb3cnLFxuICAnZmxleC1ncm93JyxcbiAgJ2ZsZXgtc2hyaW5rJyxcbiAgJ2ZsZXgtd3JhcCcsXG4gICdmbG9hdCcsXG4gICdmbG93JyxcbiAgJ2ZvbnQnLFxuICAnZm9udC1kaXNwbGF5JyxcbiAgJ2ZvbnQtZmFtaWx5JyxcbiAgJ2ZvbnQtZmVhdHVyZS1zZXR0aW5ncycsXG4gICdmb250LWtlcm5pbmcnLFxuICAnZm9udC1sYW5ndWFnZS1vdmVycmlkZScsXG4gICdmb250LXNpemUnLFxuICAnZm9udC1zaXplLWFkanVzdCcsXG4gICdmb250LXNtb290aGluZycsXG4gICdmb250LXN0cmV0Y2gnLFxuICAnZm9udC1zdHlsZScsXG4gICdmb250LXN5bnRoZXNpcycsXG4gICdmb250LXZhcmlhbnQnLFxuICAnZm9udC12YXJpYW50LWNhcHMnLFxuICAnZm9udC12YXJpYW50LWVhc3QtYXNpYW4nLFxuICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICdmb250LXZhcmlhbnQtbnVtZXJpYycsXG4gICdmb250LXZhcmlhbnQtcG9zaXRpb24nLFxuICAnZm9udC12YXJpYXRpb24tc2V0dGluZ3MnLFxuICAnZm9udC13ZWlnaHQnLFxuICAnZ2FwJyxcbiAgJ2dseXBoLW9yaWVudGF0aW9uLXZlcnRpY2FsJyxcbiAgJ2dyaWQnLFxuICAnZ3JpZC1hcmVhJyxcbiAgJ2dyaWQtYXV0by1jb2x1bW5zJyxcbiAgJ2dyaWQtYXV0by1mbG93JyxcbiAgJ2dyaWQtYXV0by1yb3dzJyxcbiAgJ2dyaWQtY29sdW1uJyxcbiAgJ2dyaWQtY29sdW1uLWVuZCcsXG4gICdncmlkLWNvbHVtbi1zdGFydCcsXG4gICdncmlkLWdhcCcsXG4gICdncmlkLXJvdycsXG4gICdncmlkLXJvdy1lbmQnLFxuICAnZ3JpZC1yb3ctc3RhcnQnLFxuICAnZ3JpZC10ZW1wbGF0ZScsXG4gICdncmlkLXRlbXBsYXRlLWFyZWFzJyxcbiAgJ2dyaWQtdGVtcGxhdGUtY29sdW1ucycsXG4gICdncmlkLXRlbXBsYXRlLXJvd3MnLFxuICAnaGFuZ2luZy1wdW5jdHVhdGlvbicsXG4gICdoZWlnaHQnLFxuICAnaHlwaGVucycsXG4gICdpY29uJyxcbiAgJ2ltYWdlLW9yaWVudGF0aW9uJyxcbiAgJ2ltYWdlLXJlbmRlcmluZycsXG4gICdpbWFnZS1yZXNvbHV0aW9uJyxcbiAgJ2ltZS1tb2RlJyxcbiAgJ2lubGluZS1zaXplJyxcbiAgJ2lzb2xhdGlvbicsXG4gICdqdXN0aWZ5LWNvbnRlbnQnLFxuICAnbGVmdCcsXG4gICdsZXR0ZXItc3BhY2luZycsXG4gICdsaW5lLWJyZWFrJyxcbiAgJ2xpbmUtaGVpZ2h0JyxcbiAgJ2xpc3Qtc3R5bGUnLFxuICAnbGlzdC1zdHlsZS1pbWFnZScsXG4gICdsaXN0LXN0eWxlLXBvc2l0aW9uJyxcbiAgJ2xpc3Qtc3R5bGUtdHlwZScsXG4gICdtYXJnaW4nLFxuICAnbWFyZ2luLWJsb2NrJyxcbiAgJ21hcmdpbi1ibG9jay1lbmQnLFxuICAnbWFyZ2luLWJsb2NrLXN0YXJ0JyxcbiAgJ21hcmdpbi1ib3R0b20nLFxuICAnbWFyZ2luLWlubGluZScsXG4gICdtYXJnaW4taW5saW5lLWVuZCcsXG4gICdtYXJnaW4taW5saW5lLXN0YXJ0JyxcbiAgJ21hcmdpbi1sZWZ0JyxcbiAgJ21hcmdpbi1yaWdodCcsXG4gICdtYXJnaW4tdG9wJyxcbiAgJ21hcmtzJyxcbiAgJ21hc2snLFxuICAnbWFzay1ib3JkZXInLFxuICAnbWFzay1ib3JkZXItbW9kZScsXG4gICdtYXNrLWJvcmRlci1vdXRzZXQnLFxuICAnbWFzay1ib3JkZXItcmVwZWF0JyxcbiAgJ21hc2stYm9yZGVyLXNsaWNlJyxcbiAgJ21hc2stYm9yZGVyLXNvdXJjZScsXG4gICdtYXNrLWJvcmRlci13aWR0aCcsXG4gICdtYXNrLWNsaXAnLFxuICAnbWFzay1jb21wb3NpdGUnLFxuICAnbWFzay1pbWFnZScsXG4gICdtYXNrLW1vZGUnLFxuICAnbWFzay1vcmlnaW4nLFxuICAnbWFzay1wb3NpdGlvbicsXG4gICdtYXNrLXJlcGVhdCcsXG4gICdtYXNrLXNpemUnLFxuICAnbWFzay10eXBlJyxcbiAgJ21heC1ibG9jay1zaXplJyxcbiAgJ21heC1oZWlnaHQnLFxuICAnbWF4LWlubGluZS1zaXplJyxcbiAgJ21heC13aWR0aCcsXG4gICdtaW4tYmxvY2stc2l6ZScsXG4gICdtaW4taGVpZ2h0JyxcbiAgJ21pbi1pbmxpbmUtc2l6ZScsXG4gICdtaW4td2lkdGgnLFxuICAnbWl4LWJsZW5kLW1vZGUnLFxuICAnbmF2LWRvd24nLFxuICAnbmF2LWluZGV4JyxcbiAgJ25hdi1sZWZ0JyxcbiAgJ25hdi1yaWdodCcsXG4gICduYXYtdXAnLFxuICAnbm9uZScsXG4gICdub3JtYWwnLFxuICAnb2JqZWN0LWZpdCcsXG4gICdvYmplY3QtcG9zaXRpb24nLFxuICAnb3BhY2l0eScsXG4gICdvcmRlcicsXG4gICdvcnBoYW5zJyxcbiAgJ291dGxpbmUnLFxuICAnb3V0bGluZS1jb2xvcicsXG4gICdvdXRsaW5lLW9mZnNldCcsXG4gICdvdXRsaW5lLXN0eWxlJyxcbiAgJ291dGxpbmUtd2lkdGgnLFxuICAnb3ZlcmZsb3cnLFxuICAnb3ZlcmZsb3ctd3JhcCcsXG4gICdvdmVyZmxvdy14JyxcbiAgJ292ZXJmbG93LXknLFxuICAncGFkZGluZycsXG4gICdwYWRkaW5nLWJsb2NrJyxcbiAgJ3BhZGRpbmctYmxvY2stZW5kJyxcbiAgJ3BhZGRpbmctYmxvY2stc3RhcnQnLFxuICAncGFkZGluZy1ib3R0b20nLFxuICAncGFkZGluZy1pbmxpbmUnLFxuICAncGFkZGluZy1pbmxpbmUtZW5kJyxcbiAgJ3BhZGRpbmctaW5saW5lLXN0YXJ0JyxcbiAgJ3BhZGRpbmctbGVmdCcsXG4gICdwYWRkaW5nLXJpZ2h0JyxcbiAgJ3BhZGRpbmctdG9wJyxcbiAgJ3BhZ2UtYnJlYWstYWZ0ZXInLFxuICAncGFnZS1icmVhay1iZWZvcmUnLFxuICAncGFnZS1icmVhay1pbnNpZGUnLFxuICAncGF1c2UnLFxuICAncGF1c2UtYWZ0ZXInLFxuICAncGF1c2UtYmVmb3JlJyxcbiAgJ3BlcnNwZWN0aXZlJyxcbiAgJ3BlcnNwZWN0aXZlLW9yaWdpbicsXG4gICdwb2ludGVyLWV2ZW50cycsXG4gICdwb3NpdGlvbicsXG4gICdxdW90ZXMnLFxuICAncmVzaXplJyxcbiAgJ3Jlc3QnLFxuICAncmVzdC1hZnRlcicsXG4gICdyZXN0LWJlZm9yZScsXG4gICdyaWdodCcsXG4gICdyb3ctZ2FwJyxcbiAgJ3Njcm9sbC1tYXJnaW4nLFxuICAnc2Nyb2xsLW1hcmdpbi1ibG9jaycsXG4gICdzY3JvbGwtbWFyZ2luLWJsb2NrLWVuZCcsXG4gICdzY3JvbGwtbWFyZ2luLWJsb2NrLXN0YXJ0JyxcbiAgJ3Njcm9sbC1tYXJnaW4tYm90dG9tJyxcbiAgJ3Njcm9sbC1tYXJnaW4taW5saW5lJyxcbiAgJ3Njcm9sbC1tYXJnaW4taW5saW5lLWVuZCcsXG4gICdzY3JvbGwtbWFyZ2luLWlubGluZS1zdGFydCcsXG4gICdzY3JvbGwtbWFyZ2luLWxlZnQnLFxuICAnc2Nyb2xsLW1hcmdpbi1yaWdodCcsXG4gICdzY3JvbGwtbWFyZ2luLXRvcCcsXG4gICdzY3JvbGwtcGFkZGluZycsXG4gICdzY3JvbGwtcGFkZGluZy1ibG9jaycsXG4gICdzY3JvbGwtcGFkZGluZy1ibG9jay1lbmQnLFxuICAnc2Nyb2xsLXBhZGRpbmctYmxvY2stc3RhcnQnLFxuICAnc2Nyb2xsLXBhZGRpbmctYm90dG9tJyxcbiAgJ3Njcm9sbC1wYWRkaW5nLWlubGluZScsXG4gICdzY3JvbGwtcGFkZGluZy1pbmxpbmUtZW5kJyxcbiAgJ3Njcm9sbC1wYWRkaW5nLWlubGluZS1zdGFydCcsXG4gICdzY3JvbGwtcGFkZGluZy1sZWZ0JyxcbiAgJ3Njcm9sbC1wYWRkaW5nLXJpZ2h0JyxcbiAgJ3Njcm9sbC1wYWRkaW5nLXRvcCcsXG4gICdzY3JvbGwtc25hcC1hbGlnbicsXG4gICdzY3JvbGwtc25hcC1zdG9wJyxcbiAgJ3Njcm9sbC1zbmFwLXR5cGUnLFxuICAnc2Nyb2xsYmFyLWNvbG9yJyxcbiAgJ3Njcm9sbGJhci1ndXR0ZXInLFxuICAnc2Nyb2xsYmFyLXdpZHRoJyxcbiAgJ3NoYXBlLWltYWdlLXRocmVzaG9sZCcsXG4gICdzaGFwZS1tYXJnaW4nLFxuICAnc2hhcGUtb3V0c2lkZScsXG4gICdzcGVhaycsXG4gICdzcGVhay1hcycsXG4gICdzcmMnLCAvLyBAZm9udC1mYWNlXG4gICd0YWItc2l6ZScsXG4gICd0YWJsZS1sYXlvdXQnLFxuICAndGV4dC1hbGlnbicsXG4gICd0ZXh0LWFsaWduLWFsbCcsXG4gICd0ZXh0LWFsaWduLWxhc3QnLFxuICAndGV4dC1jb21iaW5lLXVwcmlnaHQnLFxuICAndGV4dC1kZWNvcmF0aW9uJyxcbiAgJ3RleHQtZGVjb3JhdGlvbi1jb2xvcicsXG4gICd0ZXh0LWRlY29yYXRpb24tbGluZScsXG4gICd0ZXh0LWRlY29yYXRpb24tc3R5bGUnLFxuICAndGV4dC1lbXBoYXNpcycsXG4gICd0ZXh0LWVtcGhhc2lzLWNvbG9yJyxcbiAgJ3RleHQtZW1waGFzaXMtcG9zaXRpb24nLFxuICAndGV4dC1lbXBoYXNpcy1zdHlsZScsXG4gICd0ZXh0LWluZGVudCcsXG4gICd0ZXh0LWp1c3RpZnknLFxuICAndGV4dC1vcmllbnRhdGlvbicsXG4gICd0ZXh0LW92ZXJmbG93JyxcbiAgJ3RleHQtcmVuZGVyaW5nJyxcbiAgJ3RleHQtc2hhZG93JyxcbiAgJ3RleHQtdHJhbnNmb3JtJyxcbiAgJ3RleHQtdW5kZXJsaW5lLXBvc2l0aW9uJyxcbiAgJ3RvcCcsXG4gICd0cmFuc2Zvcm0nLFxuICAndHJhbnNmb3JtLWJveCcsXG4gICd0cmFuc2Zvcm0tb3JpZ2luJyxcbiAgJ3RyYW5zZm9ybS1zdHlsZScsXG4gICd0cmFuc2l0aW9uJyxcbiAgJ3RyYW5zaXRpb24tZGVsYXknLFxuICAndHJhbnNpdGlvbi1kdXJhdGlvbicsXG4gICd0cmFuc2l0aW9uLXByb3BlcnR5JyxcbiAgJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJyxcbiAgJ3VuaWNvZGUtYmlkaScsXG4gICd2ZXJ0aWNhbC1hbGlnbicsXG4gICd2aXNpYmlsaXR5JyxcbiAgJ3ZvaWNlLWJhbGFuY2UnLFxuICAndm9pY2UtZHVyYXRpb24nLFxuICAndm9pY2UtZmFtaWx5JyxcbiAgJ3ZvaWNlLXBpdGNoJyxcbiAgJ3ZvaWNlLXJhbmdlJyxcbiAgJ3ZvaWNlLXJhdGUnLFxuICAndm9pY2Utc3RyZXNzJyxcbiAgJ3ZvaWNlLXZvbHVtZScsXG4gICd3aGl0ZS1zcGFjZScsXG4gICd3aWRvd3MnLFxuICAnd2lkdGgnLFxuICAnd2lsbC1jaGFuZ2UnLFxuICAnd29yZC1icmVhaycsXG4gICd3b3JkLXNwYWNpbmcnLFxuICAnd29yZC13cmFwJyxcbiAgJ3dyaXRpbmctbW9kZScsXG4gICd6LWluZGV4J1xuICAvLyByZXZlcnNlIG1ha2VzIHN1cmUgbG9uZ2VyIGF0dHJpYnV0ZXMgYGZvbnQtd2VpZ2h0YCBhcmUgbWF0Y2hlZCBmdWxseVxuICAvLyBpbnN0ZWFkIG9mIGdldHRpbmcgZmFsc2UgcG9zaXRpdmVzIG9uIHNheSBgZm9udGBcbl0ucmV2ZXJzZSgpO1xuXG4vKlxuTGFuZ3VhZ2U6IENTU1xuQ2F0ZWdvcnk6IGNvbW1vbiwgY3NzLCB3ZWJcbldlYnNpdGU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTU1xuKi9cblxuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gY3NzKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICBjb25zdCBtb2RlcyA9IE1PREVTKGhsanMpO1xuICBjb25zdCBWRU5ET1JfUFJFRklYID0geyBiZWdpbjogLy0od2Via2l0fG1venxtc3xvKS0oPz1bYS16XSkvIH07XG4gIGNvbnN0IEFUX01PRElGSUVSUyA9IFwiYW5kIG9yIG5vdCBvbmx5XCI7XG4gIGNvbnN0IEFUX1BST1BFUlRZX1JFID0gL0AtP1xcd1tcXHddKigtXFx3KykqLzsgLy8gQC13ZWJraXQta2V5ZnJhbWVzXG4gIGNvbnN0IElERU5UX1JFID0gJ1thLXpBLVotXVthLXpBLVowLTlfLV0qJztcbiAgY29uc3QgU1RSSU5HUyA9IFtcbiAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0NTUycsXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAvWz18J1xcJF0vLFxuICAgIGtleXdvcmRzOiB7IGtleWZyYW1lUG9zaXRpb246IFwiZnJvbSB0b1wiIH0sXG4gICAgY2xhc3NOYW1lQWxpYXNlczoge1xuICAgICAgLy8gZm9yIHZpc3VhbCBjb250aW51aXR5IHdpdGggYHRhZyB7fWAgYW5kIGJlY2F1c2Ugd2VcbiAgICAgIC8vIGRvbid0IGhhdmUgYSBncmVhdCBjbGFzcyBmb3IgdGhpcz9cbiAgICAgIGtleWZyYW1lUG9zaXRpb246IFwic2VsZWN0b3ItdGFnXCIgfSxcbiAgICBjb250YWluczogW1xuICAgICAgbW9kZXMuQkxPQ0tfQ09NTUVOVCxcbiAgICAgIFZFTkRPUl9QUkVGSVgsXG4gICAgICAvLyB0byByZWNvZ25pemUga2V5ZnJhbWUgNDAlIGV0YyB3aGljaCBhcmUgb3V0c2lkZSB0aGUgc2NvcGUgb2Ygb3VyXG4gICAgICAvLyBhdHRyaWJ1dGUgdmFsdWUgbW9kZVxuICAgICAgbW9kZXMuQ1NTX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZWxlY3Rvci1pZCcsXG4gICAgICAgIGJlZ2luOiAvI1tBLVphLXowLTlfLV0rLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZWxlY3Rvci1jbGFzcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXC4nICsgSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIG1vZGVzLkFUVFJJQlVURV9TRUxFQ1RPUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZWxlY3Rvci1wc2V1ZG8nLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgYmVnaW46ICc6KCcgKyBQU0VVRE9fQ0xBU1NFUy5qb2luKCd8JykgKyAnKScgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnOig6KT8oJyArIFBTRVVET19FTEVNRU5UUy5qb2luKCd8JykgKyAnKScgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gd2UgbWF5IGFjdHVhbGx5IG5lZWQgdGhpcyAoMTIvMjAyMClcbiAgICAgIC8vIHsgLy8gcHNldWRvLXNlbGVjdG9yIHBhcmFtc1xuICAgICAgLy8gICBiZWdpbjogL1xcKC8sXG4gICAgICAvLyAgIGVuZDogL1xcKS8sXG4gICAgICAvLyAgIGNvbnRhaW5zOiBbIGhsanMuQ1NTX05VTUJFUl9NT0RFIF1cbiAgICAgIC8vIH0sXG4gICAgICBtb2Rlcy5DU1NfVkFSSUFCTEUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoJyArIEFUVFJJQlVURVMuam9pbignfCcpICsgJylcXFxcYidcbiAgICAgIH0sXG4gICAgICAvLyBhdHRyaWJ1dGUgdmFsdWVzXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvOi8sXG4gICAgICAgIGVuZDogL1s7fXtdLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBtb2Rlcy5CTE9DS19DT01NRU5ULFxuICAgICAgICAgIG1vZGVzLkhFWENPTE9SLFxuICAgICAgICAgIG1vZGVzLklNUE9SVEFOVCxcbiAgICAgICAgICBtb2Rlcy5DU1NfTlVNQkVSX01PREUsXG4gICAgICAgICAgLi4uU1RSSU5HUyxcbiAgICAgICAgICAvLyBuZWVkZWQgdG8gaGlnaGxpZ2h0IHRoZXNlIGFzIHN0cmluZ3MgYW5kIHRvIGF2b2lkIGlzc3VlcyB3aXRoXG4gICAgICAgICAgLy8gaWxsZWdhbCBjaGFyYWN0ZXJzIHRoYXQgbWlnaHQgYmUgaW5zaWRlIHVybHMgdGhhdCB3b3VsZCB0aWdnZXIgdGhlXG4gICAgICAgICAgLy8gbGFuZ3VhZ2VzIGlsbGVnYWwgc3RhY2tcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLyh1cmx8ZGF0YS11cmkpXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKS8sXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsIC8vIGZyb20ga2V5d29yZHNcbiAgICAgICAgICAgIGtleXdvcmRzOiB7IGJ1aWx0X2luOiBcInVybCBkYXRhLXVyaVwiIH0sXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAuLi5TVFJJTkdTLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIC8vIGFueSBjaGFyYWN0ZXIgb3RoZXIgdGhhbiBgKWAgYXMgaW4gYHVybCgpYCB3aWxsIGJlIHRoZSBzdGFydFxuICAgICAgICAgICAgICAgIC8vIG9mIGEgc3RyaW5nLCB3aGljaCBlbmRzIHdpdGggYClgIChmcm9tIHRoZSBwYXJlbnQgbW9kZSlcbiAgICAgICAgICAgICAgICBiZWdpbjogL1teKV0vLFxuICAgICAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kZXMuRlVOQ1RJT05fRElTUEFUQ0hcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IHJlZ2V4Lmxvb2thaGVhZCgvQC8pLFxuICAgICAgICBlbmQ6ICdbeztdJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBpbGxlZ2FsOiAvOi8sIC8vIGJyZWFrIG9uIExlc3MgdmFyaWFibGVzIEB2YXI6IC4uLlxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICAgICAgYmVnaW46IEFUX1BST1BFUlRZX1JFXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogL1xccy8sXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgICAgICAkcGF0dGVybjogL1thLXotXSsvLFxuICAgICAgICAgICAgICBrZXl3b3JkOiBBVF9NT0RJRklFUlMsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZTogTUVESUFfRkVBVFVSRVMuam9pbihcIiBcIilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46IC9bYS16LV0rKD89OikvLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJhdHRyaWJ1dGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAuLi5TVFJJTkdTLFxuICAgICAgICAgICAgICBtb2Rlcy5DU1NfTlVNQkVSX01PREVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NlbGVjdG9yLXRhZycsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoJyArIFRBR1Muam9pbignfCcpICsgJylcXFxcYidcbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IGNzcyBhcyBkZWZhdWx0IH07XG4iLCAiLypcbkxhbmd1YWdlOiBEb2NrZXJmaWxlXG5SZXF1aXJlczogYmFzaC5qc1xuQXV0aG9yOiBBbGV4aXMgSFx1MDBFOW5hdXQgPGFsZXhpc0BoZW5hdXQubmV0PlxuRGVzY3JpcHRpb246IGxhbmd1YWdlIGRlZmluaXRpb24gZm9yIERvY2tlcmZpbGUgZmlsZXNcbldlYnNpdGU6IGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci9cbkNhdGVnb3J5OiBjb25maWdcbiovXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBkb2NrZXJmaWxlKGhsanMpIHtcbiAgY29uc3QgS0VZV09SRFMgPSBbXG4gICAgXCJmcm9tXCIsXG4gICAgXCJtYWludGFpbmVyXCIsXG4gICAgXCJleHBvc2VcIixcbiAgICBcImVudlwiLFxuICAgIFwiYXJnXCIsXG4gICAgXCJ1c2VyXCIsXG4gICAgXCJvbmJ1aWxkXCIsXG4gICAgXCJzdG9wc2lnbmFsXCJcbiAgXTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnRG9ja2VyZmlsZScsXG4gICAgYWxpYXNlczogWyAnZG9ja2VyJyBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdydW4gY21kIGVudHJ5cG9pbnQgdm9sdW1lIGFkZCBjb3B5IHdvcmtkaXIgbGFiZWwgaGVhbHRoY2hlY2sgc2hlbGwnLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC9bXlxcXFxdJC8sXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdiYXNoJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnPC8nXG4gIH07XG59XG5cbmV4cG9ydCB7IGRvY2tlcmZpbGUgYXMgZGVmYXVsdCB9O1xuIiwgIi8qXG4gTGFuZ3VhZ2U6IEdyYXBoUUxcbiBBdXRob3I6IEpvaG4gRm9zdGVyIChHSCBqZjk5MCksIGFuZCBvdGhlcnNcbiBEZXNjcmlwdGlvbjogR3JhcGhRTCBpcyBhIHF1ZXJ5IGxhbmd1YWdlIGZvciBBUElzXG4gQ2F0ZWdvcnk6IHdlYiwgY29tbW9uXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gZ3JhcGhxbChobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgY29uc3QgR1FMX05BTUUgPSAvW19BLVphLXpdW18wLTlBLVphLXpdKi87XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJHcmFwaFFMXCIsXG4gICAgYWxpYXNlczogWyBcImdxbFwiIF0sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBkaXNhYmxlQXV0b2RldGVjdDogZmFsc2UsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IFtcbiAgICAgICAgXCJxdWVyeVwiLFxuICAgICAgICBcIm11dGF0aW9uXCIsXG4gICAgICAgIFwic3Vic2NyaXB0aW9uXCIsXG4gICAgICAgIFwidHlwZVwiLFxuICAgICAgICBcImlucHV0XCIsXG4gICAgICAgIFwic2NoZW1hXCIsXG4gICAgICAgIFwiZGlyZWN0aXZlXCIsXG4gICAgICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgICAgIFwidW5pb25cIixcbiAgICAgICAgXCJzY2FsYXJcIixcbiAgICAgICAgXCJmcmFnbWVudFwiLFxuICAgICAgICBcImVudW1cIixcbiAgICAgICAgXCJvblwiXG4gICAgICBdLFxuICAgICAgbGl0ZXJhbDogW1xuICAgICAgICBcInRydWVcIixcbiAgICAgICAgXCJmYWxzZVwiLFxuICAgICAgICBcIm51bGxcIlxuICAgICAgXVxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6IFwicHVuY3R1YXRpb25cIixcbiAgICAgICAgbWF0Y2g6IC9bLl17M30vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiBcInB1bmN0dWF0aW9uXCIsXG4gICAgICAgIGJlZ2luOiAvW1xcIVxcKFxcKVxcOlxcPVxcW1xcXVxce1xcfFxcfV17MX0vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiBcInZhcmlhYmxlXCIsXG4gICAgICAgIGJlZ2luOiAvXFwkLyxcbiAgICAgICAgZW5kOiAvXFxXLyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZTogXCJtZXRhXCIsXG4gICAgICAgIG1hdGNoOiAvQFxcdysvLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZTogXCJzeW1ib2xcIixcbiAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdChHUUxfTkFNRSwgcmVnZXgubG9va2FoZWFkKC9cXHMqOi8pKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiBbXG4gICAgICAvWzs8J10vLFxuICAgICAgL0JFR0lOL1xuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgZ3JhcGhxbCBhcyBkZWZhdWx0IH07XG4iLCAiY29uc3QgSURFTlRfUkUgPSAnW0EtWmEteiRfXVswLTlBLVphLXokX10qJztcbmNvbnN0IEtFWVdPUkRTID0gW1xuICBcImFzXCIsIC8vIGZvciBleHBvcnRzXG4gIFwiaW5cIixcbiAgXCJvZlwiLFxuICBcImlmXCIsXG4gIFwiZm9yXCIsXG4gIFwid2hpbGVcIixcbiAgXCJmaW5hbGx5XCIsXG4gIFwidmFyXCIsXG4gIFwibmV3XCIsXG4gIFwiZnVuY3Rpb25cIixcbiAgXCJkb1wiLFxuICBcInJldHVyblwiLFxuICBcInZvaWRcIixcbiAgXCJlbHNlXCIsXG4gIFwiYnJlYWtcIixcbiAgXCJjYXRjaFwiLFxuICBcImluc3RhbmNlb2ZcIixcbiAgXCJ3aXRoXCIsXG4gIFwidGhyb3dcIixcbiAgXCJjYXNlXCIsXG4gIFwiZGVmYXVsdFwiLFxuICBcInRyeVwiLFxuICBcInN3aXRjaFwiLFxuICBcImNvbnRpbnVlXCIsXG4gIFwidHlwZW9mXCIsXG4gIFwiZGVsZXRlXCIsXG4gIFwibGV0XCIsXG4gIFwieWllbGRcIixcbiAgXCJjb25zdFwiLFxuICBcImNsYXNzXCIsXG4gIC8vIEpTIGhhbmRsZXMgdGhlc2Ugd2l0aCBhIHNwZWNpYWwgcnVsZVxuICAvLyBcImdldFwiLFxuICAvLyBcInNldFwiLFxuICBcImRlYnVnZ2VyXCIsXG4gIFwiYXN5bmNcIixcbiAgXCJhd2FpdFwiLFxuICBcInN0YXRpY1wiLFxuICBcImltcG9ydFwiLFxuICBcImZyb21cIixcbiAgXCJleHBvcnRcIixcbiAgXCJleHRlbmRzXCJcbl07XG5jb25zdCBMSVRFUkFMUyA9IFtcbiAgXCJ0cnVlXCIsXG4gIFwiZmFsc2VcIixcbiAgXCJudWxsXCIsXG4gIFwidW5kZWZpbmVkXCIsXG4gIFwiTmFOXCIsXG4gIFwiSW5maW5pdHlcIlxuXTtcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHNcbmNvbnN0IFRZUEVTID0gW1xuICAvLyBGdW5kYW1lbnRhbCBvYmplY3RzXG4gIFwiT2JqZWN0XCIsXG4gIFwiRnVuY3Rpb25cIixcbiAgXCJCb29sZWFuXCIsXG4gIFwiU3ltYm9sXCIsXG4gIC8vIG51bWJlcnMgYW5kIGRhdGVzXG4gIFwiTWF0aFwiLFxuICBcIkRhdGVcIixcbiAgXCJOdW1iZXJcIixcbiAgXCJCaWdJbnRcIixcbiAgLy8gdGV4dFxuICBcIlN0cmluZ1wiLFxuICBcIlJlZ0V4cFwiLFxuICAvLyBJbmRleGVkIGNvbGxlY3Rpb25zXG4gIFwiQXJyYXlcIixcbiAgXCJGbG9hdDMyQXJyYXlcIixcbiAgXCJGbG9hdDY0QXJyYXlcIixcbiAgXCJJbnQ4QXJyYXlcIixcbiAgXCJVaW50OEFycmF5XCIsXG4gIFwiVWludDhDbGFtcGVkQXJyYXlcIixcbiAgXCJJbnQxNkFycmF5XCIsXG4gIFwiSW50MzJBcnJheVwiLFxuICBcIlVpbnQxNkFycmF5XCIsXG4gIFwiVWludDMyQXJyYXlcIixcbiAgXCJCaWdJbnQ2NEFycmF5XCIsXG4gIFwiQmlnVWludDY0QXJyYXlcIixcbiAgLy8gS2V5ZWQgY29sbGVjdGlvbnNcbiAgXCJTZXRcIixcbiAgXCJNYXBcIixcbiAgXCJXZWFrU2V0XCIsXG4gIFwiV2Vha01hcFwiLFxuICAvLyBTdHJ1Y3R1cmVkIGRhdGFcbiAgXCJBcnJheUJ1ZmZlclwiLFxuICBcIlNoYXJlZEFycmF5QnVmZmVyXCIsXG4gIFwiQXRvbWljc1wiLFxuICBcIkRhdGFWaWV3XCIsXG4gIFwiSlNPTlwiLFxuICAvLyBDb250cm9sIGFic3RyYWN0aW9uIG9iamVjdHNcbiAgXCJQcm9taXNlXCIsXG4gIFwiR2VuZXJhdG9yXCIsXG4gIFwiR2VuZXJhdG9yRnVuY3Rpb25cIixcbiAgXCJBc3luY0Z1bmN0aW9uXCIsXG4gIC8vIFJlZmxlY3Rpb25cbiAgXCJSZWZsZWN0XCIsXG4gIFwiUHJveHlcIixcbiAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cbiAgXCJJbnRsXCIsXG4gIC8vIFdlYkFzc2VtYmx5XG4gIFwiV2ViQXNzZW1ibHlcIlxuXTtcblxuY29uc3QgRVJST1JfVFlQRVMgPSBbXG4gIFwiRXJyb3JcIixcbiAgXCJFdmFsRXJyb3JcIixcbiAgXCJJbnRlcm5hbEVycm9yXCIsXG4gIFwiUmFuZ2VFcnJvclwiLFxuICBcIlJlZmVyZW5jZUVycm9yXCIsXG4gIFwiU3ludGF4RXJyb3JcIixcbiAgXCJUeXBlRXJyb3JcIixcbiAgXCJVUklFcnJvclwiXG5dO1xuXG5jb25zdCBCVUlMVF9JTl9HTE9CQUxTID0gW1xuICBcInNldEludGVydmFsXCIsXG4gIFwic2V0VGltZW91dFwiLFxuICBcImNsZWFySW50ZXJ2YWxcIixcbiAgXCJjbGVhclRpbWVvdXRcIixcblxuICBcInJlcXVpcmVcIixcbiAgXCJleHBvcnRzXCIsXG5cbiAgXCJldmFsXCIsXG4gIFwiaXNGaW5pdGVcIixcbiAgXCJpc05hTlwiLFxuICBcInBhcnNlRmxvYXRcIixcbiAgXCJwYXJzZUludFwiLFxuICBcImRlY29kZVVSSVwiLFxuICBcImRlY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVuY29kZVVSSVwiLFxuICBcImVuY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVzY2FwZVwiLFxuICBcInVuZXNjYXBlXCJcbl07XG5cbmNvbnN0IEJVSUxUX0lOX1ZBUklBQkxFUyA9IFtcbiAgXCJhcmd1bWVudHNcIixcbiAgXCJ0aGlzXCIsXG4gIFwic3VwZXJcIixcbiAgXCJjb25zb2xlXCIsXG4gIFwid2luZG93XCIsXG4gIFwiZG9jdW1lbnRcIixcbiAgXCJsb2NhbFN0b3JhZ2VcIixcbiAgXCJzZXNzaW9uU3RvcmFnZVwiLFxuICBcIm1vZHVsZVwiLFxuICBcImdsb2JhbFwiIC8vIE5vZGUuanNcbl07XG5cbmNvbnN0IEJVSUxUX0lOUyA9IFtdLmNvbmNhdChcbiAgQlVJTFRfSU5fR0xPQkFMUyxcbiAgVFlQRVMsXG4gIEVSUk9SX1RZUEVTXG4pO1xuXG4vKlxuTGFuZ3VhZ2U6IEphdmFTY3JpcHRcbkRlc2NyaXB0aW9uOiBKYXZhU2NyaXB0IChKUykgaXMgYSBsaWdodHdlaWdodCwgaW50ZXJwcmV0ZWQsIG9yIGp1c3QtaW4tdGltZSBjb21waWxlZCBwcm9ncmFtbWluZyBsYW5ndWFnZSB3aXRoIGZpcnN0LWNsYXNzIGZ1bmN0aW9ucy5cbkNhdGVnb3J5OiBjb21tb24sIHNjcmlwdGluZywgd2ViXG5XZWJzaXRlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0XG4qL1xuXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBqYXZhc2NyaXB0KGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICAvKipcbiAgICogVGFrZXMgYSBzdHJpbmcgbGlrZSBcIjxCb29nZXJcIiBhbmQgY2hlY2tzIHRvIHNlZVxuICAgKiBpZiB3ZSBjYW4gZmluZCBhIG1hdGNoaW5nIFwiPC9Cb29nZXJcIiBsYXRlciBpbiB0aGVcbiAgICogY29udGVudC5cbiAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaFxuICAgKiBAcGFyYW0ge3thZnRlcjpudW1iZXJ9fSBwYXJhbTFcbiAgICovXG4gIGNvbnN0IGhhc0Nsb3NpbmdUYWcgPSAobWF0Y2gsIHsgYWZ0ZXIgfSkgPT4ge1xuICAgIGNvbnN0IHRhZyA9IFwiPC9cIiArIG1hdGNoWzBdLnNsaWNlKDEpO1xuICAgIGNvbnN0IHBvcyA9IG1hdGNoLmlucHV0LmluZGV4T2YodGFnLCBhZnRlcik7XG4gICAgcmV0dXJuIHBvcyAhPT0gLTE7XG4gIH07XG5cbiAgY29uc3QgSURFTlRfUkUkMSA9IElERU5UX1JFO1xuICBjb25zdCBGUkFHTUVOVCA9IHtcbiAgICBiZWdpbjogJzw+JyxcbiAgICBlbmQ6ICc8Lz4nXG4gIH07XG4gIC8vIHRvIGF2b2lkIHNvbWUgc3BlY2lhbCBjYXNlcyBpbnNpZGUgaXNUcnVseU9wZW5pbmdUYWdcbiAgY29uc3QgWE1MX1NFTEZfQ0xPU0lORyA9IC88W0EtWmEtejAtOVxcXFwuXzotXStcXHMqXFwvPi87XG4gIGNvbnN0IFhNTF9UQUcgPSB7XG4gICAgYmVnaW46IC88W0EtWmEtejAtOVxcXFwuXzotXSsvLFxuICAgIGVuZDogL1xcL1tBLVphLXowLTlcXFxcLl86LV0rPnxcXC8+LyxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gICAgICogQHBhcmFtIHtDYWxsYmFja1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqL1xuICAgIGlzVHJ1bHlPcGVuaW5nVGFnOiAobWF0Y2gsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBhZnRlck1hdGNoSW5kZXggPSBtYXRjaFswXS5sZW5ndGggKyBtYXRjaC5pbmRleDtcbiAgICAgIGNvbnN0IG5leHRDaGFyID0gbWF0Y2guaW5wdXRbYWZ0ZXJNYXRjaEluZGV4XTtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gSFRNTCBzaG91bGQgbm90IGluY2x1ZGUgYW5vdGhlciByYXcgYDxgIGluc2lkZSBhIHRhZ1xuICAgICAgICAvLyBuZXN0ZWQgdHlwZT9cbiAgICAgICAgLy8gYDxBcnJheTxBcnJheTxudW1iZXI+PmAsIGV0Yy5cbiAgICAgICAgbmV4dENoYXIgPT09IFwiPFwiIHx8XG4gICAgICAgIC8vIHRoZSAsIGdpdmVzIGF3YXkgdGhhdCB0aGlzIGlzIG5vdCBIVE1MXG4gICAgICAgIC8vIGA8VCwgQSBleHRlbmRzIGtleW9mIFQsIFY+YFxuICAgICAgICBuZXh0Q2hhciA9PT0gXCIsXCJcbiAgICAgICAgKSB7XG4gICAgICAgIHJlc3BvbnNlLmlnbm9yZU1hdGNoKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYDxzb21ldGhpbmc+YFxuICAgICAgLy8gUXVpdGUgcG9zc2libHkgYSB0YWcsIGxldHMgbG9vayBmb3IgYSBtYXRjaGluZyBjbG9zaW5nIHRhZy4uLlxuICAgICAgaWYgKG5leHRDaGFyID09PSBcIj5cIikge1xuICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCBhIG1hdGNoaW5nIGNsb3NpbmcgdGFnLCB0aGVuIHdlXG4gICAgICAgIC8vIHdpbGwgaWdub3JlIGl0XG4gICAgICAgIGlmICghaGFzQ2xvc2luZ1RhZyhtYXRjaCwgeyBhZnRlcjogYWZ0ZXJNYXRjaEluZGV4IH0pKSB7XG4gICAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBgPGJsYWggLz5gIChzZWxmLWNsb3NpbmcpXG4gICAgICAvLyBoYW5kbGVkIGJ5IHNpbXBsZVNlbGZDbG9zaW5nIHJ1bGVcblxuICAgICAgbGV0IG07XG4gICAgICBjb25zdCBhZnRlck1hdGNoID0gbWF0Y2guaW5wdXQuc3Vic3RyaW5nKGFmdGVyTWF0Y2hJbmRleCk7XG5cbiAgICAgIC8vIHNvbWUgbW9yZSB0ZW1wbGF0ZSB0eXBpbmcgc3R1ZmZcbiAgICAgIC8vICA8VCA9IGFueT4oa2V5Pzogc3RyaW5nKSA9PiBNb2RpZnk8XG4gICAgICBpZiAoKG0gPSBhZnRlck1hdGNoLm1hdGNoKC9eXFxzKj0vKSkpIHtcbiAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBgPEZyb20gZXh0ZW5kcyBzdHJpbmc+YFxuICAgICAgLy8gdGVjaG5pY2FsbHkgdGhpcyBjb3VsZCBiZSBIVE1MLCBidXQgaXQgc21lbGxzIGxpa2UgYSB0eXBlXG4gICAgICAvLyBOT1RFOiBUaGlzIGlzIHVnaCwgYnV0IGFkZGVkIHNwZWNpZmljYWxseSBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMzI3NlxuICAgICAgaWYgKChtID0gYWZ0ZXJNYXRjaC5tYXRjaCgvXlxccytleHRlbmRzXFxzKy8pKSkge1xuICAgICAgICBpZiAobS5pbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmlnbm9yZU1hdGNoKCk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtcmV0dXJuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBLRVlXT1JEUyQxID0ge1xuICAgICRwYXR0ZXJuOiBJREVOVF9SRSxcbiAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICBidWlsdF9pbjogQlVJTFRfSU5TLFxuICAgIFwidmFyaWFibGUubGFuZ3VhZ2VcIjogQlVJTFRfSU5fVkFSSUFCTEVTXG4gIH07XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1saXRlcmFscy1udW1lcmljLWxpdGVyYWxzXG4gIGNvbnN0IGRlY2ltYWxEaWdpdHMgPSAnWzAtOV0oXz9bMC05XSkqJztcbiAgY29uc3QgZnJhYyA9IGBcXFxcLigke2RlY2ltYWxEaWdpdHN9KWA7XG4gIC8vIERlY2ltYWxJbnRlZ2VyTGl0ZXJhbCwgaW5jbHVkaW5nIEFubmV4IEIgTm9uT2N0YWxEZWNpbWFsSW50ZWdlckxpdGVyYWxcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hZGRpdGlvbmFsLXN5bnRheC1udW1lcmljLWxpdGVyYWxzXG4gIGNvbnN0IGRlY2ltYWxJbnRlZ2VyID0gYDB8WzEtOV0oXz9bMC05XSkqfDBbMC03XSpbODldWzAtOV0qYDtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIC8vIERlY2ltYWxMaXRlcmFsXG4gICAgICB7IGJlZ2luOiBgKFxcXFxiKCR7ZGVjaW1hbEludGVnZXJ9KSgoJHtmcmFjfSl8XFxcXC4pP3woJHtmcmFjfSkpYCArXG4gICAgICAgIGBbZUVdWystXT8oJHtkZWNpbWFsRGlnaXRzfSlcXFxcYmAgfSxcbiAgICAgIHsgYmVnaW46IGBcXFxcYigke2RlY2ltYWxJbnRlZ2VyfSlcXFxcYigoJHtmcmFjfSlcXFxcYnxcXFxcLik/fCgke2ZyYWN9KVxcXFxiYCB9LFxuXG4gICAgICAvLyBEZWNpbWFsQmlnSW50ZWdlckxpdGVyYWxcbiAgICAgIHsgYmVnaW46IGBcXFxcYigwfFsxLTldKF8/WzAtOV0pKiluXFxcXGJgIH0sXG5cbiAgICAgIC8vIE5vbkRlY2ltYWxJbnRlZ2VyTGl0ZXJhbFxuICAgICAgeyBiZWdpbjogXCJcXFxcYjBbeFhdWzAtOWEtZkEtRl0oXz9bMC05YS1mQS1GXSkqbj9cXFxcYlwiIH0sXG4gICAgICB7IGJlZ2luOiBcIlxcXFxiMFtiQl1bMC0xXShfP1swLTFdKSpuP1xcXFxiXCIgfSxcbiAgICAgIHsgYmVnaW46IFwiXFxcXGIwW29PXVswLTddKF8/WzAtN10pKm4/XFxcXGJcIiB9LFxuXG4gICAgICAvLyBMZWdhY3lPY3RhbEludGVnZXJMaXRlcmFsIChkb2VzIG5vdCBpbmNsdWRlIHVuZGVyc2NvcmUgc2VwYXJhdG9ycylcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYWRkaXRpb25hbC1zeW50YXgtbnVtZXJpYy1saXRlcmFsc1xuICAgICAgeyBiZWdpbjogXCJcXFxcYjBbMC03XStuP1xcXFxiXCIgfSxcbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJ1xcXFwkXFxcXHsnLFxuICAgIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMSxcbiAgICBjb250YWluczogW10gLy8gZGVmaW5lZCBsYXRlclxuICB9O1xuICBjb25zdCBIVE1MX1RFTVBMQVRFID0ge1xuICAgIGJlZ2luOiAnaHRtbGAnLFxuICAgIGVuZDogJycsXG4gICAgc3RhcnRzOiB7XG4gICAgICBlbmQ6ICdgJyxcbiAgICAgIHJldHVybkVuZDogZmFsc2UsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIFNVQlNUXG4gICAgICBdLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnXG4gICAgfVxuICB9O1xuICBjb25zdCBDU1NfVEVNUExBVEUgPSB7XG4gICAgYmVnaW46ICdjc3NgJyxcbiAgICBlbmQ6ICcnLFxuICAgIHN0YXJ0czoge1xuICAgICAgZW5kOiAnYCcsXG4gICAgICByZXR1cm5FbmQ6IGZhbHNlLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICBTVUJTVFxuICAgICAgXSxcbiAgICAgIHN1Ykxhbmd1YWdlOiAnY3NzJ1xuICAgIH1cbiAgfTtcbiAgY29uc3QgR1JBUEhRTF9URU1QTEFURSA9IHtcbiAgICBiZWdpbjogJ2dxbGAnLFxuICAgIGVuZDogJycsXG4gICAgc3RhcnRzOiB7XG4gICAgICBlbmQ6ICdgJyxcbiAgICAgIHJldHVybkVuZDogZmFsc2UsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIFNVQlNUXG4gICAgICBdLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICdncmFwaHFsJ1xuICAgIH1cbiAgfTtcbiAgY29uc3QgVEVNUExBVEVfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdgJyxcbiAgICBlbmQ6ICdgJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgU1VCU1RcbiAgICBdXG4gIH07XG4gIGNvbnN0IEpTRE9DX0NPTU1FTlQgPSBobGpzLkNPTU1FTlQoXG4gICAgL1xcL1xcKlxcKig/IVxcLykvLFxuICAgICdcXFxcKi8nLFxuICAgIHtcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogJyg/PUBbQS1aYS16XSspJyxcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgICAgICAgIGJlZ2luOiAnXFxcXHsnLFxuICAgICAgICAgICAgICBlbmQ6ICdcXFxcfScsXG4gICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgICAgICAgIGJlZ2luOiBJREVOVF9SRSQxICsgJyg/PVxcXFxzKigtKXwkKScsXG4gICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGVhdCBzcGFjZXMgKG5vdCBuZXdsaW5lcykgc28gd2UgY2FuIGZpbmRcbiAgICAgICAgICAgIC8vIHR5cGVzIG9yIHZhcmlhYmxlc1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBiZWdpbjogLyg/PVteXFxuXSlcXHMvLFxuICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gICk7XG4gIGNvbnN0IENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiBcImNvbW1lbnRcIixcbiAgICB2YXJpYW50czogW1xuICAgICAgSlNET0NfQ09NTUVOVCxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREVcbiAgICBdXG4gIH07XG4gIGNvbnN0IFNVQlNUX0lOVEVSTkFMUyA9IFtcbiAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBIVE1MX1RFTVBMQVRFLFxuICAgIENTU19URU1QTEFURSxcbiAgICBHUkFQSFFMX1RFTVBMQVRFLFxuICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICAvLyBTa2lwIG51bWJlcnMgd2hlbiB0aGV5IGFyZSBwYXJ0IG9mIGEgdmFyaWFibGUgbmFtZVxuICAgIHsgbWF0Y2g6IC9cXCRcXGQrLyB9LFxuICAgIE5VTUJFUixcbiAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsOlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8zMjg4XG4gICAgLy8gaGxqcy5SRUdFWFBfTU9ERVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IFNVQlNUX0lOVEVSTkFMU1xuICAgIC5jb25jYXQoe1xuICAgICAgLy8gd2UgbmVlZCB0byBwYWlyIHVwIHt9IGluc2lkZSBvdXIgc3Vic3QgdG8gcHJldmVudFxuICAgICAgLy8gaXQgZnJvbSBlbmRpbmcgdG9vIGVhcmx5IGJ5IG1hdGNoaW5nIGFub3RoZXIgfVxuICAgICAgYmVnaW46IC9cXHsvLFxuICAgICAgZW5kOiAvXFx9LyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgXCJzZWxmXCJcbiAgICAgIF0uY29uY2F0KFNVQlNUX0lOVEVSTkFMUylcbiAgICB9KTtcbiAgY29uc3QgU1VCU1RfQU5EX0NPTU1FTlRTID0gW10uY29uY2F0KENPTU1FTlQsIFNVQlNULmNvbnRhaW5zKTtcbiAgY29uc3QgUEFSQU1TX0NPTlRBSU5TID0gU1VCU1RfQU5EX0NPTU1FTlRTLmNvbmNhdChbXG4gICAgLy8gZWF0IHJlY3Vyc2l2ZSBwYXJlbnMgaW4gc3ViIGV4cHJlc3Npb25zXG4gICAge1xuICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgZW5kOiAvXFwpLyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcInNlbGZcIl0uY29uY2F0KFNVQlNUX0FORF9DT01NRU5UUylcbiAgICB9XG4gIF0pO1xuICBjb25zdCBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogL1xcKC8sXG4gICAgZW5kOiAvXFwpLyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMSxcbiAgICBjb250YWluczogUEFSQU1TX0NPTlRBSU5TXG4gIH07XG5cbiAgLy8gRVM2IGNsYXNzZXNcbiAgY29uc3QgQ0xBU1NfT1JfRVhURU5EUyA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gY2xhc3MgQ2FyIGV4dGVuZHMgdmVoaWNsZVxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC9leHRlbmRzLyxcbiAgICAgICAgICAvXFxzKy8sXG4gICAgICAgICAgcmVnZXguY29uY2F0KElERU5UX1JFJDEsIFwiKFwiLCByZWdleC5jb25jYXQoL1xcLi8sIElERU5UX1JFJDEpLCBcIikqXCIpXG4gICAgICAgIF0sXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ0aXRsZS5jbGFzc1wiLFxuICAgICAgICAgIDU6IFwia2V5d29yZFwiLFxuICAgICAgICAgIDc6IFwidGl0bGUuY2xhc3MuaW5oZXJpdGVkXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIGNsYXNzIENhclxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDFcbiAgICAgICAgXSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgIF1cbiAgfTtcblxuICBjb25zdCBDTEFTU19SRUZFUkVOQ0UgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIG1hdGNoOlxuICAgIHJlZ2V4LmVpdGhlcihcbiAgICAgIC8vIEhhcmQgY29kZWQgZXhjZXB0aW9uc1xuICAgICAgL1xcYkpTT04vLFxuICAgICAgLy8gRmxvYXQzMkFycmF5LCBPdXRUXG4gICAgICAvXFxiW0EtWl1bYS16XSsoW0EtWl1bYS16XSp8XFxkKSovLFxuICAgICAgLy8gQ1NTRmFjdG9yeSwgQ1NTRmFjdG9yeVRcbiAgICAgIC9cXGJbQS1aXXsyLH0oW0EtWl1bYS16XSt8XFxkKSsoW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBGUHMsIEZQc1RcbiAgICAgIC9cXGJbQS1aXXsyLH1bYS16XSsoW0EtWl1bYS16XSt8XFxkKSooW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBQXG4gICAgICAvLyBzaW5nbGUgbGV0dGVycyBhcmUgbm90IGhpZ2hsaWdodGVkXG4gICAgICAvLyBCTEFIXG4gICAgICAvLyB0aGlzIHdpbGwgYmUgZmxhZ2dlZCBhcyBhIFVQUEVSX0NBU0VfQ09OU1RBTlQgaW5zdGVhZFxuICAgICksXG4gICAgY2xhc3NOYW1lOiBcInRpdGxlLmNsYXNzXCIsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIF86IFtcbiAgICAgICAgLy8gc2Ugd2Ugc3RpbGwgZ2V0IHJlbGV2YW5jZSBjcmVkaXQgZm9yIEpTIGxpYnJhcnkgY2xhc3Nlc1xuICAgICAgICAuLi5UWVBFUyxcbiAgICAgICAgLi4uRVJST1JfVFlQRVNcbiAgICAgIF1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgVVNFX1NUUklDVCA9IHtcbiAgICBsYWJlbDogXCJ1c2Vfc3RyaWN0XCIsXG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgcmVsZXZhbmNlOiAxMCxcbiAgICBiZWdpbjogL15cXHMqWydcIl11c2UgKHN0cmljdHxhc20pWydcIl0vXG4gIH07XG5cbiAgY29uc3QgRlVOQ1RJT05fREVGSU5JVElPTiA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9mdW5jdGlvbi8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgLyg/PVxccypcXCgpL1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL2Z1bmN0aW9uLyxcbiAgICAgICAgICAvXFxzKig/PVxcKCkvXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlLmZ1bmN0aW9uXCJcbiAgICB9LFxuICAgIGxhYmVsOiBcImZ1bmMuZGVmXCIsXG4gICAgY29udGFpbnM6IFsgUEFSQU1TIF0sXG4gICAgaWxsZWdhbDogLyUvXG4gIH07XG5cbiAgY29uc3QgVVBQRVJfQ0FTRV9DT05TVEFOVCA9IHtcbiAgICByZWxldmFuY2U6IDAsXG4gICAgbWF0Y2g6IC9cXGJbQS1aXVtBLVpfMC05XStcXGIvLFxuICAgIGNsYXNzTmFtZTogXCJ2YXJpYWJsZS5jb25zdGFudFwiXG4gIH07XG5cbiAgZnVuY3Rpb24gbm9uZU9mKGxpc3QpIHtcbiAgICByZXR1cm4gcmVnZXguY29uY2F0KFwiKD8hXCIsIGxpc3Quam9pbihcInxcIiksIFwiKVwiKTtcbiAgfVxuXG4gIGNvbnN0IEZVTkNUSU9OX0NBTEwgPSB7XG4gICAgbWF0Y2g6IHJlZ2V4LmNvbmNhdChcbiAgICAgIC9cXGIvLFxuICAgICAgbm9uZU9mKFtcbiAgICAgICAgLi4uQlVJTFRfSU5fR0xPQkFMUyxcbiAgICAgICAgXCJzdXBlclwiLFxuICAgICAgICBcImltcG9ydFwiXG4gICAgICBdKSxcbiAgICAgIElERU5UX1JFJDEsIHJlZ2V4Lmxvb2thaGVhZCgvXFwoLykpLFxuICAgIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvblwiLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFBST1BFUlRZX0FDQ0VTUyA9IHtcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KC9cXC4vLCByZWdleC5sb29rYWhlYWQoXG4gICAgICByZWdleC5jb25jYXQoSURFTlRfUkUkMSwgLyg/IVswLTlBLVphLXokXyhdKS8pXG4gICAgKSksXG4gICAgZW5kOiBJREVOVF9SRSQxLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBrZXl3b3JkczogXCJwcm90b3R5cGVcIixcbiAgICBjbGFzc05hbWU6IFwicHJvcGVydHlcIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBHRVRURVJfT1JfU0VUVEVSID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvZ2V0fHNldC8sXG4gICAgICAvXFxzKy8sXG4gICAgICBJREVOVF9SRSQxLFxuICAgICAgLyg/PVxcKCkvXG4gICAgXSxcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgMzogXCJ0aXRsZS5mdW5jdGlvblwiXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBlYXQgdG8gYXZvaWQgZW1wdHkgcGFyYW1zXG4gICAgICAgIGJlZ2luOiAvXFwoXFwpL1xuICAgICAgfSxcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICBjb25zdCBGVU5DX0xFQURfSU5fUkUgPSAnKFxcXFwoJyArXG4gICAgJ1teKCldKihcXFxcKCcgK1xuICAgICdbXigpXSooXFxcXCgnICtcbiAgICAnW14oKV0qJyArXG4gICAgJ1xcXFwpW14oKV0qKSonICtcbiAgICAnXFxcXClbXigpXSopKicgK1xuICAgICdcXFxcKXwnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJylcXFxccyo9Pic7XG5cbiAgY29uc3QgRlVOQ1RJT05fVkFSSUFCTEUgPSB7XG4gICAgbWF0Y2g6IFtcbiAgICAgIC9jb25zdHx2YXJ8bGV0LywgL1xccysvLFxuICAgICAgSURFTlRfUkUkMSwgL1xccyovLFxuICAgICAgLz1cXHMqLyxcbiAgICAgIC8oYXN5bmNcXHMqKT8vLCAvLyBhc3luYyBpcyBvcHRpb25hbFxuICAgICAgcmVnZXgubG9va2FoZWFkKEZVTkNfTEVBRF9JTl9SRSlcbiAgICBdLFxuICAgIGtleXdvcmRzOiBcImFzeW5jXCIsXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdKYXZhU2NyaXB0JyxcbiAgICBhbGlhc2VzOiBbJ2pzJywgJ2pzeCcsICdtanMnLCAnY2pzJ10sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTJDEsXG4gICAgLy8gdGhpcyB3aWxsIGJlIGV4dGVuZGVkIGJ5IFR5cGVTY3JpcHRcbiAgICBleHBvcnRzOiB7IFBBUkFNU19DT05UQUlOUywgQ0xBU1NfUkVGRVJFTkNFIH0sXG4gICAgaWxsZWdhbDogLyMoPyFbJF9BLXpdKS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuU0hFQkFORyh7XG4gICAgICAgIGxhYmVsOiBcInNoZWJhbmdcIixcbiAgICAgICAgYmluYXJ5OiBcIm5vZGVcIixcbiAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICB9KSxcbiAgICAgIFVTRV9TVFJJQ1QsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgSFRNTF9URU1QTEFURSxcbiAgICAgIENTU19URU1QTEFURSxcbiAgICAgIEdSQVBIUUxfVEVNUExBVEUsXG4gICAgICBURU1QTEFURV9TVFJJTkcsXG4gICAgICBDT01NRU5ULFxuICAgICAgLy8gU2tpcCBudW1iZXJzIHdoZW4gdGhleSBhcmUgcGFydCBvZiBhIHZhcmlhYmxlIG5hbWVcbiAgICAgIHsgbWF0Y2g6IC9cXCRcXGQrLyB9LFxuICAgICAgTlVNQkVSLFxuICAgICAgQ0xBU1NfUkVGRVJFTkNFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyJyxcbiAgICAgICAgYmVnaW46IElERU5UX1JFJDEgKyByZWdleC5sb29rYWhlYWQoJzonKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fVkFSSUFCTEUsXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgQ09NTUVOVCxcbiAgICAgICAgICBobGpzLlJFR0VYUF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gY291bnQgdGhlIHBhcmVucyB0byBtYWtlIHN1cmUgd2UgYWN0dWFsbHkgaGF2ZSB0aGVcbiAgICAgICAgICAgIC8vIGNvcnJlY3QgYm91bmRpbmcgKCApIGJlZm9yZSB0aGUgPT4uICBUaGVyZSBjb3VsZCBiZSBhbnkgbnVtYmVyIG9mXG4gICAgICAgICAgICAvLyBzdWItZXhwcmVzc2lvbnMgaW5zaWRlIGFsc28gc3Vycm91bmRlZCBieSBwYXJlbnMuXG4gICAgICAgICAgICBiZWdpbjogRlVOQ19MRUFEX0lOX1JFLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICBlbmQ6ICdcXFxccyo9PicsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXChcXHMqXFwpLyxcbiAgICAgICAgICAgICAgICAgICAgc2tpcDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgICAgICAgICAgICAgICBjb250YWluczogUEFSQU1TX0NPTlRBSU5TXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IC8vIGNvdWxkIGJlIGEgY29tbWEgZGVsaW1pdGVkIGxpc3Qgb2YgcGFyYW1zIHRvIGEgZnVuY3Rpb24gY2FsbFxuICAgICAgICAgICAgYmVnaW46IC8sLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWF0Y2g6IC9cXHMrLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyAvLyBKU1hcbiAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgIHsgYmVnaW46IEZSQUdNRU5ULmJlZ2luLCBlbmQ6IEZSQUdNRU5ULmVuZCB9LFxuICAgICAgICAgICAgICB7IG1hdGNoOiBYTUxfU0VMRl9DTE9TSU5HIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogWE1MX1RBRy5iZWdpbixcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYXJlZnVsbHkgY2hlY2sgdGhlIG9wZW5pbmcgdGFnIHRvIHNlZSBpZiBpdCB0cnVseVxuICAgICAgICAgICAgICAgIC8vIGlzIGEgdGFnIGFuZCBub3QgYSBmYWxzZSBwb3NpdGl2ZVxuICAgICAgICAgICAgICAgICdvbjpiZWdpbic6IFhNTF9UQUcuaXNUcnVseU9wZW5pbmdUYWcsXG4gICAgICAgICAgICAgICAgZW5kOiBYTUxfVEFHLmVuZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZ2luOiBYTUxfVEFHLmJlZ2luLFxuICAgICAgICAgICAgICAgIGVuZDogWE1MX1RBRy5lbmQsXG4gICAgICAgICAgICAgICAgc2tpcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb250YWluczogWydzZWxmJ11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBGVU5DVElPTl9ERUZJTklUSU9OLFxuICAgICAge1xuICAgICAgICAvLyBwcmV2ZW50IHRoaXMgZnJvbSBnZXR0aW5nIHN3YWxsb3dlZCB1cCBieSBmdW5jdGlvblxuICAgICAgICAvLyBzaW5jZSB0aGV5IGFwcGVhciBcImZ1bmN0aW9uIGxpa2VcIlxuICAgICAgICBiZWdpbktleXdvcmRzOiBcIndoaWxlIGlmIHN3aXRjaCBjYXRjaCBmb3JcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBjb3VudCB0aGUgcGFyZW5zIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIHRoZSBjb3JyZWN0XG4gICAgICAgIC8vIGJvdW5kaW5nICggKS4gIFRoZXJlIGNvdWxkIGJlIGFueSBudW1iZXIgb2Ygc3ViLWV4cHJlc3Npb25zIGluc2lkZVxuICAgICAgICAvLyBhbHNvIHN1cnJvdW5kZWQgYnkgcGFyZW5zLlxuICAgICAgICBiZWdpbjogJ1xcXFxiKD8hZnVuY3Rpb24pJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSArXG4gICAgICAgICAgJ1xcXFwoJyArIC8vIGZpcnN0IHBhcmVuc1xuICAgICAgICAgICdbXigpXSooXFxcXCgnICtcbiAgICAgICAgICAgICdbXigpXSooXFxcXCgnICtcbiAgICAgICAgICAgICAgJ1teKCldKicgK1xuICAgICAgICAgICAgJ1xcXFwpW14oKV0qKSonICtcbiAgICAgICAgICAnXFxcXClbXigpXSopKicgK1xuICAgICAgICAgICdcXFxcKVxcXFxzKlxcXFx7JywgLy8gZW5kIHBhcmVuc1xuICAgICAgICByZXR1cm5CZWdpbjp0cnVlLFxuICAgICAgICBsYWJlbDogXCJmdW5jLmRlZlwiLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFBBUkFNUyxcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGJlZ2luOiBJREVOVF9SRSQxLCBjbGFzc05hbWU6IFwidGl0bGUuZnVuY3Rpb25cIiB9KVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gY2F0Y2ggLi4uIHNvIGl0IHdvbid0IHRyaWdnZXIgdGhlIHByb3BlcnR5IHJ1bGUgYmVsb3dcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IC9cXC5cXC5cXC4vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBQUk9QRVJUWV9BQ0NFU1MsXG4gICAgICAvLyBoYWNrOiBwcmV2ZW50cyBkZXRlY3Rpb24gb2Yga2V5d29yZHMgaW4gc29tZSBjaXJjdW1zdGFuY2VzXG4gICAgICAvLyAua2V5d29yZCgpXG4gICAgICAvLyAka2V5d29yZCA9IHhcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6ICdcXFxcJCcgKyBJREVOVF9SRSQxLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbIC9cXGJjb25zdHJ1Y3Rvcig/PVxccypcXCgpLyBdLFxuICAgICAgICBjbGFzc05hbWU6IHsgMTogXCJ0aXRsZS5mdW5jdGlvblwiIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbIFBBUkFNUyBdXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fQ0FMTCxcbiAgICAgIFVQUEVSX0NBU0VfQ09OU1RBTlQsXG4gICAgICBDTEFTU19PUl9FWFRFTkRTLFxuICAgICAgR0VUVEVSX09SX1NFVFRFUixcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IC9cXCRbKC5dLyAvLyByZWxldmFuY2UgYm9vc3RlciBmb3IgYSBwYXR0ZXJuIGNvbW1vbiB0byBKUyBsaWJzOiBgJChzb21ldGhpbmcpYCBhbmQgYCQuc29tZXRoaW5nYFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgamF2YXNjcmlwdCBhcyBkZWZhdWx0IH07XG4iLCAiLypcbkxhbmd1YWdlOiBKU09OXG5EZXNjcmlwdGlvbjogSlNPTiAoSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24pIGlzIGEgbGlnaHR3ZWlnaHQgZGF0YS1pbnRlcmNoYW5nZSBmb3JtYXQuXG5BdXRob3I6IEl2YW4gU2FnYWxhZXYgPG1hbmlhY0Bzb2Z0d2FyZW1hbmlhY3Mub3JnPlxuV2Vic2l0ZTogaHR0cDovL3d3dy5qc29uLm9yZ1xuQ2F0ZWdvcnk6IGNvbW1vbiwgcHJvdG9jb2xzLCB3ZWJcbiovXG5cbmZ1bmN0aW9uIGpzb24oaGxqcykge1xuICBjb25zdCBBVFRSSUJVVEUgPSB7XG4gICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgYmVnaW46IC9cIihcXFxcLnxbXlxcXFxcIlxcclxcbl0pKlwiKD89XFxzKjopLyxcbiAgICByZWxldmFuY2U6IDEuMDFcbiAgfTtcbiAgY29uc3QgUFVOQ1RVQVRJT04gPSB7XG4gICAgbWF0Y2g6IC9be31bXFxdLDpdLyxcbiAgICBjbGFzc05hbWU6IFwicHVuY3R1YXRpb25cIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgTElURVJBTFMgPSBbXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwibnVsbFwiXG4gIF07XG4gIC8vIE5PVEU6IG5vcm1hbGx5IHdlIHdvdWxkIHJlbHkgb24gYGtleXdvcmRzYCBmb3IgdGhpcyBidXQgdXNpbmcgYSBtb2RlIGhlcmUgYWxsb3dzIHVzXG4gIC8vIC0gdG8gdXNlIHRoZSB2ZXJ5IHRpZ2h0IGBpbGxlZ2FsOiBcXFNgIHJ1bGUgbGF0ZXIgdG8gZmxhZyBhbnkgb3RoZXIgY2hhcmFjdGVyXG4gIC8vIC0gYXMgaWxsZWdhbCBpbmRpY2F0aW5nIHRoYXQgZGVzcGl0ZSBsb29raW5nIGxpa2UgSlNPTiB3ZSBkbyBub3QgdHJ1bHkgaGF2ZVxuICAvLyAtIEpTT04gYW5kIHRodXMgaW1wcm92ZSBmYWxzZS1wb3NpdGl2ZWx5IGdyZWF0bHkgc2luY2UgSlNPTiB3aWxsIHRyeSBhbmQgY2xhaW1cbiAgLy8gLSBhbGwgc29ydHMgb2YgSlNPTiBsb29raW5nIHN0dWZmXG4gIGNvbnN0IExJVEVSQUxTX01PREUgPSB7XG4gICAgc2NvcGU6IFwibGl0ZXJhbFwiLFxuICAgIGJlZ2luS2V5d29yZHM6IExJVEVSQUxTLmpvaW4oXCIgXCIpLFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0pTT04nLFxuICAgIGtleXdvcmRzOntcbiAgICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEFUVFJJQlVURSxcbiAgICAgIFBVTkNUVUFUSU9OLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIExJVEVSQUxTX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG59XG5cbmV4cG9ydCB7IGpzb24gYXMgZGVmYXVsdCB9O1xuIiwgIi8qXG5MYW5ndWFnZTogTWFya2Rvd25cblJlcXVpcmVzOiB4bWwuanNcbkF1dGhvcjogSm9obiBDcmVwZXp6aSA8am9obi5jcmVwZXp6aUBnbWFpbC5jb20+XG5XZWJzaXRlOiBodHRwczovL2RhcmluZ2ZpcmViYWxsLm5ldC9wcm9qZWN0cy9tYXJrZG93bi9cbkNhdGVnb3J5OiBjb21tb24sIG1hcmt1cFxuKi9cblxuZnVuY3Rpb24gbWFya2Rvd24oaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIGNvbnN0IElOTElORV9IVE1MID0ge1xuICAgIGJlZ2luOiAvPFxcLz9bQS1aYS16X10vLFxuICAgIGVuZDogJz4nLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgSE9SSVpPTlRBTF9SVUxFID0ge1xuICAgIGJlZ2luOiAnXlstXFxcXCpdezMsfScsXG4gICAgZW5kOiAnJCdcbiAgfTtcbiAgY29uc3QgQ09ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gVE9ETzogZml4IHRvIGFsbG93IHRoZXNlIHRvIHdvcmsgd2l0aCBzdWJsYW5ndWFnZSBhbHNvXG4gICAgICB7IGJlZ2luOiAnKGB7Myx9KVteYF0oLnxcXFxcbikqP1xcXFwxYCpbIF0qJyB9LFxuICAgICAgeyBiZWdpbjogJyh+ezMsfSlbXn5dKC58XFxcXG4pKj9cXFxcMX4qWyBdKicgfSxcbiAgICAgIC8vIG5lZWRlZCB0byBhbGxvdyBtYXJrZG93biBhcyBhIHN1Ymxhbmd1YWdlIHRvIHdvcmtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdgYGAnLFxuICAgICAgICBlbmQ6ICdgYGArWyBdKiQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ35+ficsXG4gICAgICAgIGVuZDogJ35+fitbIF0qJCdcbiAgICAgIH0sXG4gICAgICB7IGJlZ2luOiAnYC4rP2AnIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKD89XiggezR9fFxcXFx0KSknLFxuICAgICAgICAvLyB1c2UgY29udGFpbnMgdG8gZ29iYmxlIHVwIG11bHRpcGxlIGxpbmVzIHRvIGFsbG93IHRoZSBibG9jayB0byBiZSB3aGF0ZXZlciBzaXplXG4gICAgICAgIC8vIGJ1dCBvbmx5IGhhdmUgYSBzaW5nbGUgb3Blbi9jbG9zZSB0YWcgdnMgb25lIHBlciBsaW5lXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdeKCB7NH18XFxcXHQpJyxcbiAgICAgICAgICAgIGVuZDogJyhcXFxcbikkJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBMSVNUID0ge1xuICAgIGNsYXNzTmFtZTogJ2J1bGxldCcsXG4gICAgYmVnaW46ICdeWyBcXHRdKihbKistXXwoXFxcXGQrXFxcXC4pKSg/PVxcXFxzKyknLFxuICAgIGVuZDogJ1xcXFxzKycsXG4gICAgZXhjbHVkZUVuZDogdHJ1ZVxuICB9O1xuICBjb25zdCBMSU5LX1JFRkVSRU5DRSA9IHtcbiAgICBiZWdpbjogL15cXFtbXlxcbl0rXFxdOi8sXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgYmVnaW46IC9cXFsvLFxuICAgICAgICBlbmQ6IC9cXF0vLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xpbmsnLFxuICAgICAgICBiZWdpbjogLzpcXHMqLyxcbiAgICAgICAgZW5kOiAvJC8sXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgY29uc3QgVVJMX1NDSEVNRSA9IC9bQS1aYS16XVtBLVphLXowLTkrLi1dKi87XG4gIGNvbnN0IExJTksgPSB7XG4gICAgdmFyaWFudHM6IFtcbiAgICAgIC8vIHRvbyBtdWNoIGxpa2UgbmVzdGVkIGFycmF5IGFjY2VzcyBpbiBzbyBtYW55IGxhbmd1YWdlc1xuICAgICAgLy8gdG8gaGF2ZSBhbnkgcmVhbCByZWxldmFuY2VcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFsuKz9cXF1cXFsuKj9cXF0vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBwb3B1bGFyIGludGVybmV0IFVSTHNcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFsuKz9cXF1cXCgoKGRhdGF8amF2YXNjcmlwdHxtYWlsdG8pOnwoPzpodHRwfGZ0cClzPzpcXC9cXC8pLio/XFwpLyxcbiAgICAgICAgcmVsZXZhbmNlOiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogcmVnZXguY29uY2F0KC9cXFsuKz9cXF1cXCgvLCBVUkxfU0NIRU1FLCAvOlxcL1xcLy4qP1xcKS8pLFxuICAgICAgICByZWxldmFuY2U6IDJcbiAgICAgIH0sXG4gICAgICAvLyByZWxhdGl2ZSB1cmxzXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxbLis/XFxdXFwoWy4vPyYjXS4qP1xcKS8sXG4gICAgICAgIHJlbGV2YW5jZTogMVxuICAgICAgfSxcbiAgICAgIC8vIHdoYXRldmVyIGVsc2UsIGxvd2VyIHJlbGV2YW5jZSAobWlnaHQgbm90IGJlIGEgbGluayBhdCBhbGwpXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxbLio/XFxdXFwoLio/XFwpLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXSxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICAvLyBlbXB0eSBzdHJpbmdzIGZvciBhbHQgb3IgbGluayB0ZXh0XG4gICAgICAgIG1hdGNoOiAvXFxbKD89XFxdKS8gfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJyxcbiAgICAgICAgZW5kOiAnXFxcXF0nLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIHJldHVybkVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbGluaycsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgYmVnaW46ICdcXFxcXVxcXFwoJyxcbiAgICAgICAgZW5kOiAnXFxcXCknLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgYmVnaW46ICdcXFxcXVxcXFxbJyxcbiAgICAgICAgZW5kOiAnXFxcXF0nLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IEJPTEQgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Ryb25nJyxcbiAgICBjb250YWluczogW10sIC8vIGRlZmluZWQgbGF0ZXJcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL197Mn0oPyFcXHMpLyxcbiAgICAgICAgZW5kOiAvX3syfS9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwqezJ9KD8hXFxzKS8sXG4gICAgICAgIGVuZDogL1xcKnsyfS9cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IElUQUxJQyA9IHtcbiAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgY29udGFpbnM6IFtdLCAvLyBkZWZpbmVkIGxhdGVyXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCooPyFbKlxcc10pLyxcbiAgICAgICAgZW5kOiAvXFwqL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9fKD8hW19cXHNdKS8sXG4gICAgICAgIGVuZDogL18vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgLy8gMyBsZXZlbCBkZWVwIG5lc3RpbmcgaXMgbm90IGFsbG93ZWQgYmVjYXVzZSBpdCB3b3VsZCBjcmVhdGUgY29uZnVzaW9uXG4gIC8vIGluIGNhc2VzIGxpa2UgYCoqKnRlc3RpbmcqKipgIGJlY2F1c2Ugd2hlcmUgd2UgZG9uJ3Qga25vdyBpZiB0aGUgbGFzdFxuICAvLyBgKioqYCBpcyBzdGFydGluZyBhIG5ldyBib2xkL2l0YWxpYyBvciBmaW5pc2hpbmcgdGhlIGxhc3Qgb25lXG4gIGNvbnN0IEJPTERfV0lUSE9VVF9JVEFMSUMgPSBobGpzLmluaGVyaXQoQk9MRCwgeyBjb250YWluczogW10gfSk7XG4gIGNvbnN0IElUQUxJQ19XSVRIT1VUX0JPTEQgPSBobGpzLmluaGVyaXQoSVRBTElDLCB7IGNvbnRhaW5zOiBbXSB9KTtcbiAgQk9MRC5jb250YWlucy5wdXNoKElUQUxJQ19XSVRIT1VUX0JPTEQpO1xuICBJVEFMSUMuY29udGFpbnMucHVzaChCT0xEX1dJVEhPVVRfSVRBTElDKTtcblxuICBsZXQgQ09OVEFJTkFCTEUgPSBbXG4gICAgSU5MSU5FX0hUTUwsXG4gICAgTElOS1xuICBdO1xuXG4gIFtcbiAgICBCT0xELFxuICAgIElUQUxJQyxcbiAgICBCT0xEX1dJVEhPVVRfSVRBTElDLFxuICAgIElUQUxJQ19XSVRIT1VUX0JPTERcbiAgXS5mb3JFYWNoKG0gPT4ge1xuICAgIG0uY29udGFpbnMgPSBtLmNvbnRhaW5zLmNvbmNhdChDT05UQUlOQUJMRSk7XG4gIH0pO1xuXG4gIENPTlRBSU5BQkxFID0gQ09OVEFJTkFCTEUuY29uY2F0KEJPTEQsIElUQUxJQyk7XG5cbiAgY29uc3QgSEVBREVSID0ge1xuICAgIGNsYXNzTmFtZTogJ3NlY3Rpb24nLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXiN7MSw2fScsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogQ09OVEFJTkFCTEVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnKD89Xi4rP1xcXFxuWz0tXXsyLH0kKScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ15bPS1dKiQnIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdeJyxcbiAgICAgICAgICAgIGVuZDogXCJcXFxcblwiLFxuICAgICAgICAgICAgY29udGFpbnM6IENPTlRBSU5BQkxFXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIGNvbnN0IEJMT0NLUVVPVEUgPSB7XG4gICAgY2xhc3NOYW1lOiAncXVvdGUnLFxuICAgIGJlZ2luOiAnXj5cXFxccysnLFxuICAgIGNvbnRhaW5zOiBDT05UQUlOQUJMRSxcbiAgICBlbmQ6ICckJ1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ01hcmtkb3duJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAnbWQnLFxuICAgICAgJ21rZG93bicsXG4gICAgICAnbWtkJ1xuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEhFQURFUixcbiAgICAgIElOTElORV9IVE1MLFxuICAgICAgTElTVCxcbiAgICAgIEJPTEQsXG4gICAgICBJVEFMSUMsXG4gICAgICBCTE9DS1FVT1RFLFxuICAgICAgQ09ERSxcbiAgICAgIEhPUklaT05UQUxfUlVMRSxcbiAgICAgIExJTkssXG4gICAgICBMSU5LX1JFRkVSRU5DRVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgbWFya2Rvd24gYXMgZGVmYXVsdCB9O1xuIiwgIi8qXG5MYW5ndWFnZTogUEhQXG5BdXRob3I6IFZpY3RvciBLYXJhbXppbiA8VmljdG9yLkthcmFtemluQGVudGVycmEtaW5jLmNvbT5cbkNvbnRyaWJ1dG9yczogRXZnZW55IFN0ZXBhbmlzY2hldiA8aW1ib2xrQGdtYWlsLmNvbT4sIEl2YW4gU2FnYWxhZXYgPG1hbmlhY0Bzb2Z0d2FyZW1hbmlhY3Mub3JnPlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cucGhwLm5ldFxuQ2F0ZWdvcnk6IGNvbW1vblxuKi9cblxuLyoqXG4gKiBAcGFyYW0ge0hMSlNBcGl9IGhsanNcbiAqIEByZXR1cm5zIHtMYW5ndWFnZURldGFpbH1cbiAqICovXG5mdW5jdGlvbiBwaHAoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8vIG5lZ2F0aXZlIGxvb2stYWhlYWQgdHJpZXMgdG8gYXZvaWQgbWF0Y2hpbmcgcGF0dGVybnMgdGhhdCBhcmUgbm90XG4gIC8vIFBlcmwgYXQgYWxsIGxpa2UgJGlkZW50JCwgQGlkZW50QCwgZXRjLlxuICBjb25zdCBOT1RfUEVSTF9FVEMgPSAvKD8hW0EtWmEtejAtOV0pKD8hWyRdKS87XG4gIGNvbnN0IElERU5UX1JFID0gcmVnZXguY29uY2F0KFxuICAgIC9bYS16QS1aX1xceDdmLVxceGZmXVthLXpBLVowLTlfXFx4N2YtXFx4ZmZdKi8sXG4gICAgTk9UX1BFUkxfRVRDKTtcbiAgLy8gV2lsbCBub3QgZGV0ZWN0IGNhbWVsQ2FzZSBjbGFzc2VzXG4gIGNvbnN0IFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkUgPSByZWdleC5jb25jYXQoXG4gICAgLyhcXFxcP1tBLVpdW2EtejAtOV9cXHg3Zi1cXHhmZl0rfFxcXFw/W0EtWl0rKD89W0EtWl1bYS16MC05X1xceDdmLVxceGZmXSkpezEsfS8sXG4gICAgTk9UX1BFUkxfRVRDKTtcbiAgY29uc3QgVkFSSUFCTEUgPSB7XG4gICAgc2NvcGU6ICd2YXJpYWJsZScsXG4gICAgbWF0Y2g6ICdcXFxcJCsnICsgSURFTlRfUkUsXG4gIH07XG4gIGNvbnN0IFBSRVBST0NFU1NPUiA9IHtcbiAgICBzY29wZTogJ21ldGEnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IGJlZ2luOiAvPFxcP3BocC8sIHJlbGV2YW5jZTogMTAgfSwgLy8gYm9vc3QgZm9yIG9idmlvdXMgUEhQXG4gICAgICB7IGJlZ2luOiAvPFxcPz0vIH0sXG4gICAgICAvLyBsZXNzIHJlbGV2YW50IHBlciBQU1ItMSB3aGljaCBzYXlzIG5vdCB0byB1c2Ugc2hvcnQtdGFnc1xuICAgICAgeyBiZWdpbjogLzxcXD8vLCByZWxldmFuY2U6IDAuMSB9LFxuICAgICAgeyBiZWdpbjogL1xcPz4vIH0gLy8gZW5kIHBocCB0YWdcbiAgICBdXG4gIH07XG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIHNjb3BlOiAnc3Vic3QnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IGJlZ2luOiAvXFwkXFx3Ky8gfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXHtcXCQvLFxuICAgICAgICBlbmQ6IC9cXH0vXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBTSU5HTEVfUVVPVEVEID0gaGxqcy5pbmhlcml0KGhsanMuQVBPU19TVFJJTkdfTU9ERSwgeyBpbGxlZ2FsOiBudWxsLCB9KTtcbiAgY29uc3QgRE9VQkxFX1FVT1RFRCA9IGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7XG4gICAgaWxsZWdhbDogbnVsbCxcbiAgICBjb250YWluczogaGxqcy5RVU9URV9TVFJJTkdfTU9ERS5jb250YWlucy5jb25jYXQoU1VCU1QpLFxuICB9KTtcblxuICBjb25zdCBIRVJFRE9DID0ge1xuICAgIGJlZ2luOiAvPDw8WyBcXHRdKig/OihcXHcrKXxcIihcXHcrKVwiKVxcbi8sXG4gICAgZW5kOiAvWyBcXHRdKihcXHcrKVxcYi8sXG4gICAgY29udGFpbnM6IGhsanMuUVVPVEVfU1RSSU5HX01PREUuY29udGFpbnMuY29uY2F0KFNVQlNUKSxcbiAgICAnb246YmVnaW4nOiAobSwgcmVzcCkgPT4geyByZXNwLmRhdGEuX2JlZ2luTWF0Y2ggPSBtWzFdIHx8IG1bMl07IH0sXG4gICAgJ29uOmVuZCc6IChtLCByZXNwKSA9PiB7IGlmIChyZXNwLmRhdGEuX2JlZ2luTWF0Y2ggIT09IG1bMV0pIHJlc3AuaWdub3JlTWF0Y2goKTsgfSxcbiAgfTtcblxuICBjb25zdCBOT1dET0MgPSBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICBiZWdpbjogLzw8PFsgXFx0XSonKFxcdyspJ1xcbi8sXG4gICAgZW5kOiAvWyBcXHRdKihcXHcrKVxcYi8sXG4gIH0pO1xuICAvLyBsaXN0IG9mIHZhbGlkIHdoaXRlc3BhY2VzIGJlY2F1c2Ugbm9uLWJyZWFraW5nIHNwYWNlIG1pZ2h0IGJlIHBhcnQgb2YgYSBJREVOVF9SRVxuICBjb25zdCBXSElURVNQQUNFID0gJ1sgXFx0XFxuXSc7XG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBzY29wZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIERPVUJMRV9RVU9URUQsXG4gICAgICBTSU5HTEVfUVVPVEVELFxuICAgICAgSEVSRURPQyxcbiAgICAgIE5PV0RPQ1xuICAgIF1cbiAgfTtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIHNjb3BlOiAnbnVtYmVyJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogYFxcXFxiMFtiQl1bMDFdKyg/Ol9bMDFdKykqXFxcXGJgIH0sIC8vIEJpbmFyeSB3LyB1bmRlcnNjb3JlIHN1cHBvcnRcbiAgICAgIHsgYmVnaW46IGBcXFxcYjBbb09dWzAtN10rKD86X1swLTddKykqXFxcXGJgIH0sIC8vIE9jdGFscyB3LyB1bmRlcnNjb3JlIHN1cHBvcnRcbiAgICAgIHsgYmVnaW46IGBcXFxcYjBbeFhdW1xcXFxkYS1mQS1GXSsoPzpfW1xcXFxkYS1mQS1GXSspKlxcXFxiYCB9LCAvLyBIZXggdy8gdW5kZXJzY29yZSBzdXBwb3J0XG4gICAgICAvLyBEZWNpbWFscyB3LyB1bmRlcnNjb3JlIHN1cHBvcnQsIHdpdGggb3B0aW9uYWwgZnJhZ21lbnRzIGFuZCBzY2llbnRpZmljIGV4cG9uZW50IChlKSBzdWZmaXguXG4gICAgICB7IGJlZ2luOiBgKD86XFxcXGJcXFxcZCsoPzpfXFxcXGQrKSooXFxcXC4oPzpcXFxcZCsoPzpfXFxcXGQrKSopKT98XFxcXEJcXFxcLlxcXFxkKykoPzpbZUVdWystXT9cXFxcZCspP2AgfVxuICAgIF0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgIFwiZmFsc2VcIixcbiAgICBcIm51bGxcIixcbiAgICBcInRydWVcIlxuICBdO1xuICBjb25zdCBLV1MgPSBbXG4gICAgLy8gTWFnaWMgY29uc3RhbnRzOlxuICAgIC8vIDxodHRwczovL3d3dy5waHAubmV0L21hbnVhbC9lbi9sYW5ndWFnZS5jb25zdGFudHMucHJlZGVmaW5lZC5waHA+XG4gICAgXCJfX0NMQVNTX19cIixcbiAgICBcIl9fRElSX19cIixcbiAgICBcIl9fRklMRV9fXCIsXG4gICAgXCJfX0ZVTkNUSU9OX19cIixcbiAgICBcIl9fQ09NUElMRVJfSEFMVF9PRkZTRVRfX1wiLFxuICAgIFwiX19MSU5FX19cIixcbiAgICBcIl9fTUVUSE9EX19cIixcbiAgICBcIl9fTkFNRVNQQUNFX19cIixcbiAgICBcIl9fVFJBSVRfX1wiLFxuICAgIC8vIEZ1bmN0aW9uIHRoYXQgbG9vayBsaWtlIGxhbmd1YWdlIGNvbnN0cnVjdCBvciBsYW5ndWFnZSBjb25zdHJ1Y3QgdGhhdCBsb29rIGxpa2UgZnVuY3Rpb246XG4gICAgLy8gTGlzdCBvZiBrZXl3b3JkcyB0aGF0IG1heSBub3QgcmVxdWlyZSBwYXJlbnRoZXNpc1xuICAgIFwiZGllXCIsXG4gICAgXCJlY2hvXCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJpbmNsdWRlXCIsXG4gICAgXCJpbmNsdWRlX29uY2VcIixcbiAgICBcInByaW50XCIsXG4gICAgXCJyZXF1aXJlXCIsXG4gICAgXCJyZXF1aXJlX29uY2VcIixcbiAgICAvLyBUaGVzZSBhcmUgbm90IGxhbmd1YWdlIGNvbnN0cnVjdCAoZnVuY3Rpb24pIGJ1dCBvcGVyYXRlIG9uIHRoZSBjdXJyZW50bHktZXhlY3V0aW5nIGZ1bmN0aW9uIGFuZCBjYW4gYWNjZXNzIHRoZSBjdXJyZW50IHN5bWJvbCB0YWJsZVxuICAgIC8vICdjb21wYWN0IGV4dHJhY3QgZnVuY19nZXRfYXJnIGZ1bmNfZ2V0X2FyZ3MgZnVuY19udW1fYXJncyBnZXRfY2FsbGVkX2NsYXNzIGdldF9wYXJlbnRfY2xhc3MgJyArXG4gICAgLy8gT3RoZXIga2V5d29yZHM6XG4gICAgLy8gPGh0dHBzOi8vd3d3LnBocC5uZXQvbWFudWFsL2VuL3Jlc2VydmVkLnBocD5cbiAgICAvLyA8aHR0cHM6Ly93d3cucGhwLm5ldC9tYW51YWwvZW4vbGFuZ3VhZ2UudHlwZXMudHlwZS1qdWdnbGluZy5waHA+XG4gICAgXCJhcnJheVwiLFxuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcImFuZFwiLFxuICAgIFwiYXNcIixcbiAgICBcImJpbmFyeVwiLFxuICAgIFwiYm9vbFwiLFxuICAgIFwiYm9vbGVhblwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNhbGxhYmxlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiY2xhc3NcIixcbiAgICBcImNsb25lXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImRlY2xhcmVcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRvXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImVsc2VcIixcbiAgICBcImVsc2VpZlwiLFxuICAgIFwiZW1wdHlcIixcbiAgICBcImVuZGRlY2xhcmVcIixcbiAgICBcImVuZGZvclwiLFxuICAgIFwiZW5kZm9yZWFjaFwiLFxuICAgIFwiZW5kaWZcIixcbiAgICBcImVuZHN3aXRjaFwiLFxuICAgIFwiZW5kd2hpbGVcIixcbiAgICBcImVudW1cIixcbiAgICBcImV2YWxcIixcbiAgICBcImV4dGVuZHNcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJmaW5hbGx5XCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmb3JlYWNoXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJnbG9iYWxcIixcbiAgICBcImdvdG9cIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBsZW1lbnRzXCIsXG4gICAgXCJpbnN0YW5jZW9mXCIsXG4gICAgXCJpbnN0ZWFkb2ZcIixcbiAgICBcImludFwiLFxuICAgIFwiaW50ZWdlclwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJpc3NldFwiLFxuICAgIFwiaXRlcmFibGVcIixcbiAgICBcImxpc3RcIixcbiAgICBcIm1hdGNofDBcIixcbiAgICBcIm1peGVkXCIsXG4gICAgXCJuZXdcIixcbiAgICBcIm5ldmVyXCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcIm9yXCIsXG4gICAgXCJwcml2YXRlXCIsXG4gICAgXCJwcm90ZWN0ZWRcIixcbiAgICBcInB1YmxpY1wiLFxuICAgIFwicmVhZG9ubHlcIixcbiAgICBcInJlYWxcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJ0cmFpdFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ1bnNldFwiLFxuICAgIFwidXNlXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcInZvaWRcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ4b3JcIixcbiAgICBcInlpZWxkXCJcbiAgXTtcblxuICBjb25zdCBCVUlMVF9JTlMgPSBbXG4gICAgLy8gU3RhbmRhcmQgUEhQIGxpYnJhcnk6XG4gICAgLy8gPGh0dHBzOi8vd3d3LnBocC5uZXQvbWFudWFsL2VuL2Jvb2suc3BsLnBocD5cbiAgICBcIkVycm9yfDBcIixcbiAgICBcIkFwcGVuZEl0ZXJhdG9yXCIsXG4gICAgXCJBcmd1bWVudENvdW50RXJyb3JcIixcbiAgICBcIkFyaXRobWV0aWNFcnJvclwiLFxuICAgIFwiQXJyYXlJdGVyYXRvclwiLFxuICAgIFwiQXJyYXlPYmplY3RcIixcbiAgICBcIkFzc2VydGlvbkVycm9yXCIsXG4gICAgXCJCYWRGdW5jdGlvbkNhbGxFeGNlcHRpb25cIixcbiAgICBcIkJhZE1ldGhvZENhbGxFeGNlcHRpb25cIixcbiAgICBcIkNhY2hpbmdJdGVyYXRvclwiLFxuICAgIFwiQ2FsbGJhY2tGaWx0ZXJJdGVyYXRvclwiLFxuICAgIFwiQ29tcGlsZUVycm9yXCIsXG4gICAgXCJDb3VudGFibGVcIixcbiAgICBcIkRpcmVjdG9yeUl0ZXJhdG9yXCIsXG4gICAgXCJEaXZpc2lvbkJ5WmVyb0Vycm9yXCIsXG4gICAgXCJEb21haW5FeGNlcHRpb25cIixcbiAgICBcIkVtcHR5SXRlcmF0b3JcIixcbiAgICBcIkVycm9yRXhjZXB0aW9uXCIsXG4gICAgXCJFeGNlcHRpb25cIixcbiAgICBcIkZpbGVzeXN0ZW1JdGVyYXRvclwiLFxuICAgIFwiRmlsdGVySXRlcmF0b3JcIixcbiAgICBcIkdsb2JJdGVyYXRvclwiLFxuICAgIFwiSW5maW5pdGVJdGVyYXRvclwiLFxuICAgIFwiSW52YWxpZEFyZ3VtZW50RXhjZXB0aW9uXCIsXG4gICAgXCJJdGVyYXRvckl0ZXJhdG9yXCIsXG4gICAgXCJMZW5ndGhFeGNlcHRpb25cIixcbiAgICBcIkxpbWl0SXRlcmF0b3JcIixcbiAgICBcIkxvZ2ljRXhjZXB0aW9uXCIsXG4gICAgXCJNdWx0aXBsZUl0ZXJhdG9yXCIsXG4gICAgXCJOb1Jld2luZEl0ZXJhdG9yXCIsXG4gICAgXCJPdXRPZkJvdW5kc0V4Y2VwdGlvblwiLFxuICAgIFwiT3V0T2ZSYW5nZUV4Y2VwdGlvblwiLFxuICAgIFwiT3V0ZXJJdGVyYXRvclwiLFxuICAgIFwiT3ZlcmZsb3dFeGNlcHRpb25cIixcbiAgICBcIlBhcmVudEl0ZXJhdG9yXCIsXG4gICAgXCJQYXJzZUVycm9yXCIsXG4gICAgXCJSYW5nZUV4Y2VwdGlvblwiLFxuICAgIFwiUmVjdXJzaXZlQXJyYXlJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlQ2FjaGluZ0l0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVDYWxsYmFja0ZpbHRlckl0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvclwiLFxuICAgIFwiUmVjdXJzaXZlRmlsdGVySXRlcmF0b3JcIixcbiAgICBcIlJlY3Vyc2l2ZUl0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVSZWdleEl0ZXJhdG9yXCIsXG4gICAgXCJSZWN1cnNpdmVUcmVlSXRlcmF0b3JcIixcbiAgICBcIlJlZ2V4SXRlcmF0b3JcIixcbiAgICBcIlJ1bnRpbWVFeGNlcHRpb25cIixcbiAgICBcIlNlZWthYmxlSXRlcmF0b3JcIixcbiAgICBcIlNwbERvdWJseUxpbmtlZExpc3RcIixcbiAgICBcIlNwbEZpbGVJbmZvXCIsXG4gICAgXCJTcGxGaWxlT2JqZWN0XCIsXG4gICAgXCJTcGxGaXhlZEFycmF5XCIsXG4gICAgXCJTcGxIZWFwXCIsXG4gICAgXCJTcGxNYXhIZWFwXCIsXG4gICAgXCJTcGxNaW5IZWFwXCIsXG4gICAgXCJTcGxPYmplY3RTdG9yYWdlXCIsXG4gICAgXCJTcGxPYnNlcnZlclwiLFxuICAgIFwiU3BsUHJpb3JpdHlRdWV1ZVwiLFxuICAgIFwiU3BsUXVldWVcIixcbiAgICBcIlNwbFN0YWNrXCIsXG4gICAgXCJTcGxTdWJqZWN0XCIsXG4gICAgXCJTcGxUZW1wRmlsZU9iamVjdFwiLFxuICAgIFwiVHlwZUVycm9yXCIsXG4gICAgXCJVbmRlcmZsb3dFeGNlcHRpb25cIixcbiAgICBcIlVuZXhwZWN0ZWRWYWx1ZUV4Y2VwdGlvblwiLFxuICAgIFwiVW5oYW5kbGVkTWF0Y2hFcnJvclwiLFxuICAgIC8vIFJlc2VydmVkIGludGVyZmFjZXM6XG4gICAgLy8gPGh0dHBzOi8vd3d3LnBocC5uZXQvbWFudWFsL2VuL3Jlc2VydmVkLmludGVyZmFjZXMucGhwPlxuICAgIFwiQXJyYXlBY2Nlc3NcIixcbiAgICBcIkJhY2tlZEVudW1cIixcbiAgICBcIkNsb3N1cmVcIixcbiAgICBcIkZpYmVyXCIsXG4gICAgXCJHZW5lcmF0b3JcIixcbiAgICBcIkl0ZXJhdG9yXCIsXG4gICAgXCJJdGVyYXRvckFnZ3JlZ2F0ZVwiLFxuICAgIFwiU2VyaWFsaXphYmxlXCIsXG4gICAgXCJTdHJpbmdhYmxlXCIsXG4gICAgXCJUaHJvd2FibGVcIixcbiAgICBcIlRyYXZlcnNhYmxlXCIsXG4gICAgXCJVbml0RW51bVwiLFxuICAgIFwiV2Vha1JlZmVyZW5jZVwiLFxuICAgIFwiV2Vha01hcFwiLFxuICAgIC8vIFJlc2VydmVkIGNsYXNzZXM6XG4gICAgLy8gPGh0dHBzOi8vd3d3LnBocC5uZXQvbWFudWFsL2VuL3Jlc2VydmVkLmNsYXNzZXMucGhwPlxuICAgIFwiRGlyZWN0b3J5XCIsXG4gICAgXCJfX1BIUF9JbmNvbXBsZXRlX0NsYXNzXCIsXG4gICAgXCJwYXJlbnRcIixcbiAgICBcInBocF91c2VyX2ZpbHRlclwiLFxuICAgIFwic2VsZlwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdGRDbGFzc1wiXG4gIF07XG5cbiAgLyoqIER1YWwtY2FzZSBrZXl3b3Jkc1xuICAgKlxuICAgKiBbXCJ0aGVuXCIsXCJGSUxFXCJdID0+XG4gICAqICAgICBbXCJ0aGVuXCIsIFwiVEhFTlwiLCBcIkZJTEVcIiwgXCJmaWxlXCJdXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGl0ZW1zICovXG4gIGNvbnN0IGR1YWxDYXNlID0gKGl0ZW1zKSA9PiB7XG4gICAgLyoqIEB0eXBlIHN0cmluZ1tdICovXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgaWYgKGl0ZW0udG9Mb3dlckNhc2UoKSA9PT0gaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goaXRlbS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6IEtXUyxcbiAgICBsaXRlcmFsOiBkdWFsQ2FzZShMSVRFUkFMUyksXG4gICAgYnVpbHRfaW46IEJVSUxUX0lOUyxcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaXRlbXMgKi9cbiAgY29uc3Qgbm9ybWFsaXplS2V5d29yZHMgPSAoaXRlbXMpID0+IHtcbiAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0ucmVwbGFjZSgvXFx8XFxkKyQvLCBcIlwiKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBDT05TVFJVQ1RPUl9DQUxMID0geyB2YXJpYW50czogW1xuICAgIHtcbiAgICAgIG1hdGNoOiBbXG4gICAgICAgIC9uZXcvLFxuICAgICAgICByZWdleC5jb25jYXQoV0hJVEVTUEFDRSwgXCIrXCIpLFxuICAgICAgICAvLyB0byBwcmV2ZW50IGJ1aWx0IGlucyBmcm9tIGJlaW5nIGNvbmZ1c2VkIGFzIHRoZSBjbGFzcyBjb25zdHJ1Y3RvciBjYWxsXG4gICAgICAgIHJlZ2V4LmNvbmNhdChcIig/IVwiLCBub3JtYWxpemVLZXl3b3JkcyhCVUlMVF9JTlMpLmpvaW4oXCJcXFxcYnxcIiksIFwiXFxcXGIpXCIpLFxuICAgICAgICBQQVNDQUxfQ0FTRV9DTEFTU19OQU1FX1JFLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgICA0OiBcInRpdGxlLmNsYXNzXCIsXG4gICAgICB9LFxuICAgIH1cbiAgXSB9O1xuXG4gIGNvbnN0IENPTlNUQU5UX1JFRkVSRU5DRSA9IHJlZ2V4LmNvbmNhdChJREVOVF9SRSwgXCJcXFxcYig/IVxcXFwoKVwiKTtcblxuICBjb25zdCBMRUZUX0FORF9SSUdIVF9TSURFX09GX0RPVUJMRV9DT0xPTiA9IHsgdmFyaWFudHM6IFtcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICByZWdleC5jb25jYXQoXG4gICAgICAgICAgLzo6LyxcbiAgICAgICAgICByZWdleC5sb29rYWhlYWQoLyg/IWNsYXNzXFxiKS8pXG4gICAgICAgICksXG4gICAgICAgIENPTlNUQU5UX1JFRkVSRU5DRSxcbiAgICAgIF0sXG4gICAgICBzY29wZTogeyAyOiBcInZhcmlhYmxlLmNvbnN0YW50XCIsIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBtYXRjaDogW1xuICAgICAgICAvOjovLFxuICAgICAgICAvY2xhc3MvLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiB7IDI6IFwidmFyaWFibGUubGFuZ3VhZ2VcIiwgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG1hdGNoOiBbXG4gICAgICAgIFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkUsXG4gICAgICAgIHJlZ2V4LmNvbmNhdChcbiAgICAgICAgICAvOjovLFxuICAgICAgICAgIHJlZ2V4Lmxvb2thaGVhZCgvKD8hY2xhc3NcXGIpLylcbiAgICAgICAgKSxcbiAgICAgICAgQ09OU1RBTlRfUkVGRVJFTkNFLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIDE6IFwidGl0bGUuY2xhc3NcIixcbiAgICAgICAgMzogXCJ2YXJpYWJsZS5jb25zdGFudFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG1hdGNoOiBbXG4gICAgICAgIFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkUsXG4gICAgICAgIHJlZ2V4LmNvbmNhdChcbiAgICAgICAgICBcIjo6XCIsXG4gICAgICAgICAgcmVnZXgubG9va2FoZWFkKC8oPyFjbGFzc1xcYikvKVxuICAgICAgICApLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiB7IDE6IFwidGl0bGUuY2xhc3NcIiwgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG1hdGNoOiBbXG4gICAgICAgIFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkUsXG4gICAgICAgIC86Oi8sXG4gICAgICAgIC9jbGFzcy8sXG4gICAgICBdLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgMTogXCJ0aXRsZS5jbGFzc1wiLFxuICAgICAgICAzOiBcInZhcmlhYmxlLmxhbmd1YWdlXCIsXG4gICAgICB9LFxuICAgIH1cbiAgXSB9O1xuXG4gIGNvbnN0IE5BTUVEX0FSR1VNRU5UID0ge1xuICAgIHNjb3BlOiAnYXR0cicsXG4gICAgbWF0Y2g6IHJlZ2V4LmNvbmNhdChJREVOVF9SRSwgcmVnZXgubG9va2FoZWFkKCc6JyksIHJlZ2V4Lmxvb2thaGVhZCgvKD8hOjopLykpLFxuICB9O1xuICBjb25zdCBQQVJBTVNfTU9ERSA9IHtcbiAgICByZWxldmFuY2U6IDAsXG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS8sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBOQU1FRF9BUkdVTUVOVCxcbiAgICAgIFZBUklBQkxFLFxuICAgICAgTEVGVF9BTkRfUklHSFRfU0lERV9PRl9ET1VCTEVfQ09MT04sXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgU1RSSU5HLFxuICAgICAgTlVNQkVSLFxuICAgICAgQ09OU1RSVUNUT1JfQ0FMTCxcbiAgICBdLFxuICB9O1xuICBjb25zdCBGVU5DVElPTl9JTlZPS0UgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIG1hdGNoOiBbXG4gICAgICAvXFxiLyxcbiAgICAgIC8vIHRvIHByZXZlbnQga2V5d29yZHMgZnJvbSBiZWluZyBjb25mdXNlZCBhcyB0aGUgZnVuY3Rpb24gdGl0bGVcbiAgICAgIHJlZ2V4LmNvbmNhdChcIig/IWZuXFxcXGJ8ZnVuY3Rpb25cXFxcYnxcIiwgbm9ybWFsaXplS2V5d29yZHMoS1dTKS5qb2luKFwiXFxcXGJ8XCIpLCBcInxcIiwgbm9ybWFsaXplS2V5d29yZHMoQlVJTFRfSU5TKS5qb2luKFwiXFxcXGJ8XCIpLCBcIlxcXFxiKVwiKSxcbiAgICAgIElERU5UX1JFLFxuICAgICAgcmVnZXguY29uY2F0KFdISVRFU1BBQ0UsIFwiKlwiKSxcbiAgICAgIHJlZ2V4Lmxvb2thaGVhZCgvKD89XFwoKS8pXG4gICAgXSxcbiAgICBzY29wZTogeyAzOiBcInRpdGxlLmZ1bmN0aW9uLmludm9rZVwiLCB9LFxuICAgIGNvbnRhaW5zOiBbIFBBUkFNU19NT0RFIF1cbiAgfTtcbiAgUEFSQU1TX01PREUuY29udGFpbnMucHVzaChGVU5DVElPTl9JTlZPS0UpO1xuXG4gIGNvbnN0IEFUVFJJQlVURV9DT05UQUlOUyA9IFtcbiAgICBOQU1FRF9BUkdVTUVOVCxcbiAgICBMRUZUX0FORF9SSUdIVF9TSURFX09GX0RPVUJMRV9DT0xPTixcbiAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgIFNUUklORyxcbiAgICBOVU1CRVIsXG4gICAgQ09OU1RSVUNUT1JfQ0FMTCxcbiAgXTtcblxuICBjb25zdCBBVFRSSUJVVEVTID0ge1xuICAgIGJlZ2luOiByZWdleC5jb25jYXQoLyNcXFtcXHMqLywgUEFTQ0FMX0NBU0VfQ0xBU1NfTkFNRV9SRSksXG4gICAgYmVnaW5TY29wZTogXCJtZXRhXCIsXG4gICAgZW5kOiAvXS8sXG4gICAgZW5kU2NvcGU6IFwibWV0YVwiLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICAgIGtleXdvcmQ6IFtcbiAgICAgICAgJ25ldycsXG4gICAgICAgICdhcnJheScsXG4gICAgICBdXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogL1xcWy8sXG4gICAgICAgIGVuZDogL10vLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgICAgICAgIGtleXdvcmQ6IFtcbiAgICAgICAgICAgICduZXcnLFxuICAgICAgICAgICAgJ2FycmF5JyxcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgIC4uLkFUVFJJQlVURV9DT05UQUlOUyxcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC4uLkFUVFJJQlVURV9DT05UQUlOUyxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6ICdtZXRhJyxcbiAgICAgICAgbWF0Y2g6IFBBU0NBTF9DQVNFX0NMQVNTX05BTUVfUkVcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiBmYWxzZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEFUVFJJQlVURVMsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DT01NRU5UKCcvLycsICckJyksXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgICcvXFxcXConLFxuICAgICAgICAnXFxcXCovJyxcbiAgICAgICAgeyBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiAnZG9jdGFnJyxcbiAgICAgICAgICAgIG1hdGNoOiAnQFtBLVphLXpdKydcbiAgICAgICAgICB9XG4gICAgICAgIF0gfVxuICAgICAgKSxcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IC9fX2hhbHRfY29tcGlsZXJcXChcXCk7LyxcbiAgICAgICAga2V5d29yZHM6ICdfX2hhbHRfY29tcGlsZXInLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBzY29wZTogXCJjb21tZW50XCIsXG4gICAgICAgICAgZW5kOiBobGpzLk1BVENIX05PVEhJTkdfUkUsXG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWF0Y2g6IC9cXD8+LyxcbiAgICAgICAgICAgICAgc2NvcGU6IFwibWV0YVwiLFxuICAgICAgICAgICAgICBlbmRzUGFyZW50OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgUFJFUFJPQ0VTU09SLFxuICAgICAge1xuICAgICAgICBzY29wZTogJ3ZhcmlhYmxlLmxhbmd1YWdlJyxcbiAgICAgICAgbWF0Y2g6IC9cXCR0aGlzXFxiL1xuICAgICAgfSxcbiAgICAgIFZBUklBQkxFLFxuICAgICAgRlVOQ1RJT05fSU5WT0tFLFxuICAgICAgTEVGVF9BTkRfUklHSFRfU0lERV9PRl9ET1VCTEVfQ09MT04sXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL2NvbnN0LyxcbiAgICAgICAgICAvXFxzLyxcbiAgICAgICAgICBJREVOVF9SRSxcbiAgICAgICAgXSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInZhcmlhYmxlLmNvbnN0YW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ09OU1RSVUNUT1JfQ0FMTCxcbiAgICAgIHtcbiAgICAgICAgc2NvcGU6ICdmdW5jdGlvbicsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2ZuIGZ1bmN0aW9uJyxcbiAgICAgICAgZW5kOiAvWzt7XS8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdbJCVcXFxcW10nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHsgYmVnaW5LZXl3b3JkczogJ3VzZScsIH0sXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICc9PicsIC8vIE5vIG1hcmt1cCwganVzdCBhIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICAgICAgICBlbmRzUGFyZW50OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29wZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJyxcbiAgICAgICAgICAgIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICAgIFZBUklBQkxFLFxuICAgICAgICAgICAgICBMRUZUX0FORF9SSUdIVF9TSURFX09GX0RPVUJMRV9DT0xPTixcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgU1RSSU5HLFxuICAgICAgICAgICAgICBOVU1CRVJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZTogJ2NsYXNzJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbktleXdvcmRzOiBcImVudW1cIixcbiAgICAgICAgICAgIGlsbGVnYWw6IC9bKCRcIl0vXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbktleXdvcmRzOiBcImNsYXNzIGludGVyZmFjZSB0cmFpdFwiLFxuICAgICAgICAgICAgaWxsZWdhbDogL1s6KCRcIl0vXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGVuZDogL1xcey8sXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgeyBiZWdpbktleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyB9LFxuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBib3RoIHVzZSBhbmQgbmFtZXNwYWNlIHN0aWxsIHVzZSBcIm9sZCBzdHlsZVwiIHJ1bGVzICh2cyBtdWx0aS1tYXRjaClcbiAgICAgIC8vIGJlY2F1c2UgdGhlIG5hbWVzcGFjZSBuYW1lIGNhbiBpbmNsdWRlIGBcXGAgYW5kIHdlIHN0aWxsIHdhbnQgZWFjaFxuICAgICAgLy8gZWxlbWVudCB0byBiZSB0cmVhdGVkIGFzIGl0cyBvd24gKmluZGl2aWR1YWwqIHRpdGxlXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICduYW1lc3BhY2UnLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGVuZDogJzsnLFxuICAgICAgICBpbGxlZ2FsOiAvWy4nXS8sXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuaW5oZXJpdChobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERSwgeyBzY29wZTogXCJ0aXRsZS5jbGFzc1wiIH0pIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICd1c2UnLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGVuZDogJzsnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIC8vIFRPRE86IHRpdGxlLmZ1bmN0aW9uIHZzIHRpdGxlLmNsYXNzXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWF0Y2g6IC9cXGIoYXN8Y29uc3R8ZnVuY3Rpb24pXFxiLyxcbiAgICAgICAgICAgIHNjb3BlOiBcImtleXdvcmRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gVE9ETzogY291bGQgYmUgdGl0bGUuY2xhc3Mgb3IgdGl0bGUuZnVuY3Rpb25cbiAgICAgICAgICBobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgU1RSSU5HLFxuICAgICAgTlVNQkVSLFxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgcGhwIGFzIGRlZmF1bHQgfTtcbiIsICJjb25zdCBNT0RFUyA9IChobGpzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgSU1QT1JUQU5UOiB7XG4gICAgICBzY29wZTogJ21ldGEnLFxuICAgICAgYmVnaW46ICchaW1wb3J0YW50J1xuICAgIH0sXG4gICAgQkxPQ0tfQ09NTUVOVDogaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICBIRVhDT0xPUjoge1xuICAgICAgc2NvcGU6ICdudW1iZXInLFxuICAgICAgYmVnaW46IC8jKChbMC05YS1mQS1GXXszLDR9KXwoKFswLTlhLWZBLUZdezJ9KXszLDR9KSlcXGIvXG4gICAgfSxcbiAgICBGVU5DVElPTl9ESVNQQVRDSDoge1xuICAgICAgY2xhc3NOYW1lOiBcImJ1aWx0X2luXCIsXG4gICAgICBiZWdpbjogL1tcXHctXSsoPz1cXCgpL1xuICAgIH0sXG4gICAgQVRUUklCVVRFX1NFTEVDVE9SX01PREU6IHtcbiAgICAgIHNjb3BlOiAnc2VsZWN0b3ItYXR0cicsXG4gICAgICBiZWdpbjogL1xcWy8sXG4gICAgICBlbmQ6IC9cXF0vLFxuICAgICAgaWxsZWdhbDogJyQnLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gICAgICBdXG4gICAgfSxcbiAgICBDU1NfTlVNQkVSX01PREU6IHtcbiAgICAgIHNjb3BlOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiBobGpzLk5VTUJFUl9SRSArICcoJyArXG4gICAgICAgICclfGVtfGV4fGNofHJlbScgK1xuICAgICAgICAnfHZ3fHZofHZtaW58dm1heCcgK1xuICAgICAgICAnfGNtfG1tfGlufHB0fHBjfHB4JyArXG4gICAgICAgICd8ZGVnfGdyYWR8cmFkfHR1cm4nICtcbiAgICAgICAgJ3xzfG1zJyArXG4gICAgICAgICd8SHp8a0h6JyArXG4gICAgICAgICd8ZHBpfGRwY218ZHBweCcgK1xuICAgICAgICAnKT8nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICBDU1NfVkFSSUFCTEU6IHtcbiAgICAgIGNsYXNzTmFtZTogXCJhdHRyXCIsXG4gICAgICBiZWdpbjogLy0tW0EtWmEtel9dW0EtWmEtejAtOV8tXSovXG4gICAgfVxuICB9O1xufTtcblxuY29uc3QgVEFHUyA9IFtcbiAgJ2EnLFxuICAnYWJicicsXG4gICdhZGRyZXNzJyxcbiAgJ2FydGljbGUnLFxuICAnYXNpZGUnLFxuICAnYXVkaW8nLFxuICAnYicsXG4gICdibG9ja3F1b3RlJyxcbiAgJ2JvZHknLFxuICAnYnV0dG9uJyxcbiAgJ2NhbnZhcycsXG4gICdjYXB0aW9uJyxcbiAgJ2NpdGUnLFxuICAnY29kZScsXG4gICdkZCcsXG4gICdkZWwnLFxuICAnZGV0YWlscycsXG4gICdkZm4nLFxuICAnZGl2JyxcbiAgJ2RsJyxcbiAgJ2R0JyxcbiAgJ2VtJyxcbiAgJ2ZpZWxkc2V0JyxcbiAgJ2ZpZ2NhcHRpb24nLFxuICAnZmlndXJlJyxcbiAgJ2Zvb3RlcicsXG4gICdmb3JtJyxcbiAgJ2gxJyxcbiAgJ2gyJyxcbiAgJ2gzJyxcbiAgJ2g0JyxcbiAgJ2g1JyxcbiAgJ2g2JyxcbiAgJ2hlYWRlcicsXG4gICdoZ3JvdXAnLFxuICAnaHRtbCcsXG4gICdpJyxcbiAgJ2lmcmFtZScsXG4gICdpbWcnLFxuICAnaW5wdXQnLFxuICAnaW5zJyxcbiAgJ2tiZCcsXG4gICdsYWJlbCcsXG4gICdsZWdlbmQnLFxuICAnbGknLFxuICAnbWFpbicsXG4gICdtYXJrJyxcbiAgJ21lbnUnLFxuICAnbmF2JyxcbiAgJ29iamVjdCcsXG4gICdvbCcsXG4gICdwJyxcbiAgJ3EnLFxuICAncXVvdGUnLFxuICAnc2FtcCcsXG4gICdzZWN0aW9uJyxcbiAgJ3NwYW4nLFxuICAnc3Ryb25nJyxcbiAgJ3N1bW1hcnknLFxuICAnc3VwJyxcbiAgJ3RhYmxlJyxcbiAgJ3Rib2R5JyxcbiAgJ3RkJyxcbiAgJ3RleHRhcmVhJyxcbiAgJ3Rmb290JyxcbiAgJ3RoJyxcbiAgJ3RoZWFkJyxcbiAgJ3RpbWUnLFxuICAndHInLFxuICAndWwnLFxuICAndmFyJyxcbiAgJ3ZpZGVvJ1xuXTtcblxuY29uc3QgTUVESUFfRkVBVFVSRVMgPSBbXG4gICdhbnktaG92ZXInLFxuICAnYW55LXBvaW50ZXInLFxuICAnYXNwZWN0LXJhdGlvJyxcbiAgJ2NvbG9yJyxcbiAgJ2NvbG9yLWdhbXV0JyxcbiAgJ2NvbG9yLWluZGV4JyxcbiAgJ2RldmljZS1hc3BlY3QtcmF0aW8nLFxuICAnZGV2aWNlLWhlaWdodCcsXG4gICdkZXZpY2Utd2lkdGgnLFxuICAnZGlzcGxheS1tb2RlJyxcbiAgJ2ZvcmNlZC1jb2xvcnMnLFxuICAnZ3JpZCcsXG4gICdoZWlnaHQnLFxuICAnaG92ZXInLFxuICAnaW52ZXJ0ZWQtY29sb3JzJyxcbiAgJ21vbm9jaHJvbWUnLFxuICAnb3JpZW50YXRpb24nLFxuICAnb3ZlcmZsb3ctYmxvY2snLFxuICAnb3ZlcmZsb3ctaW5saW5lJyxcbiAgJ3BvaW50ZXInLFxuICAncHJlZmVycy1jb2xvci1zY2hlbWUnLFxuICAncHJlZmVycy1jb250cmFzdCcsXG4gICdwcmVmZXJzLXJlZHVjZWQtbW90aW9uJyxcbiAgJ3ByZWZlcnMtcmVkdWNlZC10cmFuc3BhcmVuY3knLFxuICAncmVzb2x1dGlvbicsXG4gICdzY2FuJyxcbiAgJ3NjcmlwdGluZycsXG4gICd1cGRhdGUnLFxuICAnd2lkdGgnLFxuICAvLyBUT0RPOiBmaW5kIGEgYmV0dGVyIHNvbHV0aW9uP1xuICAnbWluLXdpZHRoJyxcbiAgJ21heC13aWR0aCcsXG4gICdtaW4taGVpZ2h0JyxcbiAgJ21heC1oZWlnaHQnXG5dO1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvUHNldWRvLWNsYXNzZXNcbmNvbnN0IFBTRVVET19DTEFTU0VTID0gW1xuICAnYWN0aXZlJyxcbiAgJ2FueS1saW5rJyxcbiAgJ2JsYW5rJyxcbiAgJ2NoZWNrZWQnLFxuICAnY3VycmVudCcsXG4gICdkZWZhdWx0JyxcbiAgJ2RlZmluZWQnLFxuICAnZGlyJywgLy8gZGlyKClcbiAgJ2Rpc2FibGVkJyxcbiAgJ2Ryb3AnLFxuICAnZW1wdHknLFxuICAnZW5hYmxlZCcsXG4gICdmaXJzdCcsXG4gICdmaXJzdC1jaGlsZCcsXG4gICdmaXJzdC1vZi10eXBlJyxcbiAgJ2Z1bGxzY3JlZW4nLFxuICAnZnV0dXJlJyxcbiAgJ2ZvY3VzJyxcbiAgJ2ZvY3VzLXZpc2libGUnLFxuICAnZm9jdXMtd2l0aGluJyxcbiAgJ2hhcycsIC8vIGhhcygpXG4gICdob3N0JywgLy8gaG9zdCBvciBob3N0KClcbiAgJ2hvc3QtY29udGV4dCcsIC8vIGhvc3QtY29udGV4dCgpXG4gICdob3ZlcicsXG4gICdpbmRldGVybWluYXRlJyxcbiAgJ2luLXJhbmdlJyxcbiAgJ2ludmFsaWQnLFxuICAnaXMnLCAvLyBpcygpXG4gICdsYW5nJywgLy8gbGFuZygpXG4gICdsYXN0LWNoaWxkJyxcbiAgJ2xhc3Qtb2YtdHlwZScsXG4gICdsZWZ0JyxcbiAgJ2xpbmsnLFxuICAnbG9jYWwtbGluaycsXG4gICdub3QnLCAvLyBub3QoKVxuICAnbnRoLWNoaWxkJywgLy8gbnRoLWNoaWxkKClcbiAgJ250aC1jb2wnLCAvLyBudGgtY29sKClcbiAgJ250aC1sYXN0LWNoaWxkJywgLy8gbnRoLWxhc3QtY2hpbGQoKVxuICAnbnRoLWxhc3QtY29sJywgLy8gbnRoLWxhc3QtY29sKClcbiAgJ250aC1sYXN0LW9mLXR5cGUnLCAvL250aC1sYXN0LW9mLXR5cGUoKVxuICAnbnRoLW9mLXR5cGUnLCAvL250aC1vZi10eXBlKClcbiAgJ29ubHktY2hpbGQnLFxuICAnb25seS1vZi10eXBlJyxcbiAgJ29wdGlvbmFsJyxcbiAgJ291dC1vZi1yYW5nZScsXG4gICdwYXN0JyxcbiAgJ3BsYWNlaG9sZGVyLXNob3duJyxcbiAgJ3JlYWQtb25seScsXG4gICdyZWFkLXdyaXRlJyxcbiAgJ3JlcXVpcmVkJyxcbiAgJ3JpZ2h0JyxcbiAgJ3Jvb3QnLFxuICAnc2NvcGUnLFxuICAndGFyZ2V0JyxcbiAgJ3RhcmdldC13aXRoaW4nLFxuICAndXNlci1pbnZhbGlkJyxcbiAgJ3ZhbGlkJyxcbiAgJ3Zpc2l0ZWQnLFxuICAnd2hlcmUnIC8vIHdoZXJlKClcbl07XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Qc2V1ZG8tZWxlbWVudHNcbmNvbnN0IFBTRVVET19FTEVNRU5UUyA9IFtcbiAgJ2FmdGVyJyxcbiAgJ2JhY2tkcm9wJyxcbiAgJ2JlZm9yZScsXG4gICdjdWUnLFxuICAnY3VlLXJlZ2lvbicsXG4gICdmaXJzdC1sZXR0ZXInLFxuICAnZmlyc3QtbGluZScsXG4gICdncmFtbWFyLWVycm9yJyxcbiAgJ21hcmtlcicsXG4gICdwYXJ0JyxcbiAgJ3BsYWNlaG9sZGVyJyxcbiAgJ3NlbGVjdGlvbicsXG4gICdzbG90dGVkJyxcbiAgJ3NwZWxsaW5nLWVycm9yJ1xuXTtcblxuY29uc3QgQVRUUklCVVRFUyA9IFtcbiAgJ2FsaWduLWNvbnRlbnQnLFxuICAnYWxpZ24taXRlbXMnLFxuICAnYWxpZ24tc2VsZicsXG4gICdhbGwnLFxuICAnYW5pbWF0aW9uJyxcbiAgJ2FuaW1hdGlvbi1kZWxheScsXG4gICdhbmltYXRpb24tZGlyZWN0aW9uJyxcbiAgJ2FuaW1hdGlvbi1kdXJhdGlvbicsXG4gICdhbmltYXRpb24tZmlsbC1tb2RlJyxcbiAgJ2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQnLFxuICAnYW5pbWF0aW9uLW5hbWUnLFxuICAnYW5pbWF0aW9uLXBsYXktc3RhdGUnLFxuICAnYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbicsXG4gICdiYWNrZmFjZS12aXNpYmlsaXR5JyxcbiAgJ2JhY2tncm91bmQnLFxuICAnYmFja2dyb3VuZC1hdHRhY2htZW50JyxcbiAgJ2JhY2tncm91bmQtYmxlbmQtbW9kZScsXG4gICdiYWNrZ3JvdW5kLWNsaXAnLFxuICAnYmFja2dyb3VuZC1jb2xvcicsXG4gICdiYWNrZ3JvdW5kLWltYWdlJyxcbiAgJ2JhY2tncm91bmQtb3JpZ2luJyxcbiAgJ2JhY2tncm91bmQtcG9zaXRpb24nLFxuICAnYmFja2dyb3VuZC1yZXBlYXQnLFxuICAnYmFja2dyb3VuZC1zaXplJyxcbiAgJ2Jsb2NrLXNpemUnLFxuICAnYm9yZGVyJyxcbiAgJ2JvcmRlci1ibG9jaycsXG4gICdib3JkZXItYmxvY2stY29sb3InLFxuICAnYm9yZGVyLWJsb2NrLWVuZCcsXG4gICdib3JkZXItYmxvY2stZW5kLWNvbG9yJyxcbiAgJ2JvcmRlci1ibG9jay1lbmQtc3R5bGUnLFxuICAnYm9yZGVyLWJsb2NrLWVuZC13aWR0aCcsXG4gICdib3JkZXItYmxvY2stc3RhcnQnLFxuICAnYm9yZGVyLWJsb2NrLXN0YXJ0LWNvbG9yJyxcbiAgJ2JvcmRlci1ibG9jay1zdGFydC1zdHlsZScsXG4gICdib3JkZXItYmxvY2stc3RhcnQtd2lkdGgnLFxuICAnYm9yZGVyLWJsb2NrLXN0eWxlJyxcbiAgJ2JvcmRlci1ibG9jay13aWR0aCcsXG4gICdib3JkZXItYm90dG9tJyxcbiAgJ2JvcmRlci1ib3R0b20tY29sb3InLFxuICAnYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cycsXG4gICdib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cycsXG4gICdib3JkZXItYm90dG9tLXN0eWxlJyxcbiAgJ2JvcmRlci1ib3R0b20td2lkdGgnLFxuICAnYm9yZGVyLWNvbGxhcHNlJyxcbiAgJ2JvcmRlci1jb2xvcicsXG4gICdib3JkZXItaW1hZ2UnLFxuICAnYm9yZGVyLWltYWdlLW91dHNldCcsXG4gICdib3JkZXItaW1hZ2UtcmVwZWF0JyxcbiAgJ2JvcmRlci1pbWFnZS1zbGljZScsXG4gICdib3JkZXItaW1hZ2Utc291cmNlJyxcbiAgJ2JvcmRlci1pbWFnZS13aWR0aCcsXG4gICdib3JkZXItaW5saW5lJyxcbiAgJ2JvcmRlci1pbmxpbmUtY29sb3InLFxuICAnYm9yZGVyLWlubGluZS1lbmQnLFxuICAnYm9yZGVyLWlubGluZS1lbmQtY29sb3InLFxuICAnYm9yZGVyLWlubGluZS1lbmQtc3R5bGUnLFxuICAnYm9yZGVyLWlubGluZS1lbmQtd2lkdGgnLFxuICAnYm9yZGVyLWlubGluZS1zdGFydCcsXG4gICdib3JkZXItaW5saW5lLXN0YXJ0LWNvbG9yJyxcbiAgJ2JvcmRlci1pbmxpbmUtc3RhcnQtc3R5bGUnLFxuICAnYm9yZGVyLWlubGluZS1zdGFydC13aWR0aCcsXG4gICdib3JkZXItaW5saW5lLXN0eWxlJyxcbiAgJ2JvcmRlci1pbmxpbmUtd2lkdGgnLFxuICAnYm9yZGVyLWxlZnQnLFxuICAnYm9yZGVyLWxlZnQtY29sb3InLFxuICAnYm9yZGVyLWxlZnQtc3R5bGUnLFxuICAnYm9yZGVyLWxlZnQtd2lkdGgnLFxuICAnYm9yZGVyLXJhZGl1cycsXG4gICdib3JkZXItcmlnaHQnLFxuICAnYm9yZGVyLXJpZ2h0LWNvbG9yJyxcbiAgJ2JvcmRlci1yaWdodC1zdHlsZScsXG4gICdib3JkZXItcmlnaHQtd2lkdGgnLFxuICAnYm9yZGVyLXNwYWNpbmcnLFxuICAnYm9yZGVyLXN0eWxlJyxcbiAgJ2JvcmRlci10b3AnLFxuICAnYm9yZGVyLXRvcC1jb2xvcicsXG4gICdib3JkZXItdG9wLWxlZnQtcmFkaXVzJyxcbiAgJ2JvcmRlci10b3AtcmlnaHQtcmFkaXVzJyxcbiAgJ2JvcmRlci10b3Atc3R5bGUnLFxuICAnYm9yZGVyLXRvcC13aWR0aCcsXG4gICdib3JkZXItd2lkdGgnLFxuICAnYm90dG9tJyxcbiAgJ2JveC1kZWNvcmF0aW9uLWJyZWFrJyxcbiAgJ2JveC1zaGFkb3cnLFxuICAnYm94LXNpemluZycsXG4gICdicmVhay1hZnRlcicsXG4gICdicmVhay1iZWZvcmUnLFxuICAnYnJlYWstaW5zaWRlJyxcbiAgJ2NhcHRpb24tc2lkZScsXG4gICdjYXJldC1jb2xvcicsXG4gICdjbGVhcicsXG4gICdjbGlwJyxcbiAgJ2NsaXAtcGF0aCcsXG4gICdjbGlwLXJ1bGUnLFxuICAnY29sb3InLFxuICAnY29sdW1uLWNvdW50JyxcbiAgJ2NvbHVtbi1maWxsJyxcbiAgJ2NvbHVtbi1nYXAnLFxuICAnY29sdW1uLXJ1bGUnLFxuICAnY29sdW1uLXJ1bGUtY29sb3InLFxuICAnY29sdW1uLXJ1bGUtc3R5bGUnLFxuICAnY29sdW1uLXJ1bGUtd2lkdGgnLFxuICAnY29sdW1uLXNwYW4nLFxuICAnY29sdW1uLXdpZHRoJyxcbiAgJ2NvbHVtbnMnLFxuICAnY29udGFpbicsXG4gICdjb250ZW50JyxcbiAgJ2NvbnRlbnQtdmlzaWJpbGl0eScsXG4gICdjb3VudGVyLWluY3JlbWVudCcsXG4gICdjb3VudGVyLXJlc2V0JyxcbiAgJ2N1ZScsXG4gICdjdWUtYWZ0ZXInLFxuICAnY3VlLWJlZm9yZScsXG4gICdjdXJzb3InLFxuICAnZGlyZWN0aW9uJyxcbiAgJ2Rpc3BsYXknLFxuICAnZW1wdHktY2VsbHMnLFxuICAnZmlsdGVyJyxcbiAgJ2ZsZXgnLFxuICAnZmxleC1iYXNpcycsXG4gICdmbGV4LWRpcmVjdGlvbicsXG4gICdmbGV4LWZsb3cnLFxuICAnZmxleC1ncm93JyxcbiAgJ2ZsZXgtc2hyaW5rJyxcbiAgJ2ZsZXgtd3JhcCcsXG4gICdmbG9hdCcsXG4gICdmbG93JyxcbiAgJ2ZvbnQnLFxuICAnZm9udC1kaXNwbGF5JyxcbiAgJ2ZvbnQtZmFtaWx5JyxcbiAgJ2ZvbnQtZmVhdHVyZS1zZXR0aW5ncycsXG4gICdmb250LWtlcm5pbmcnLFxuICAnZm9udC1sYW5ndWFnZS1vdmVycmlkZScsXG4gICdmb250LXNpemUnLFxuICAnZm9udC1zaXplLWFkanVzdCcsXG4gICdmb250LXNtb290aGluZycsXG4gICdmb250LXN0cmV0Y2gnLFxuICAnZm9udC1zdHlsZScsXG4gICdmb250LXN5bnRoZXNpcycsXG4gICdmb250LXZhcmlhbnQnLFxuICAnZm9udC12YXJpYW50LWNhcHMnLFxuICAnZm9udC12YXJpYW50LWVhc3QtYXNpYW4nLFxuICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICdmb250LXZhcmlhbnQtbnVtZXJpYycsXG4gICdmb250LXZhcmlhbnQtcG9zaXRpb24nLFxuICAnZm9udC12YXJpYXRpb24tc2V0dGluZ3MnLFxuICAnZm9udC13ZWlnaHQnLFxuICAnZ2FwJyxcbiAgJ2dseXBoLW9yaWVudGF0aW9uLXZlcnRpY2FsJyxcbiAgJ2dyaWQnLFxuICAnZ3JpZC1hcmVhJyxcbiAgJ2dyaWQtYXV0by1jb2x1bW5zJyxcbiAgJ2dyaWQtYXV0by1mbG93JyxcbiAgJ2dyaWQtYXV0by1yb3dzJyxcbiAgJ2dyaWQtY29sdW1uJyxcbiAgJ2dyaWQtY29sdW1uLWVuZCcsXG4gICdncmlkLWNvbHVtbi1zdGFydCcsXG4gICdncmlkLWdhcCcsXG4gICdncmlkLXJvdycsXG4gICdncmlkLXJvdy1lbmQnLFxuICAnZ3JpZC1yb3ctc3RhcnQnLFxuICAnZ3JpZC10ZW1wbGF0ZScsXG4gICdncmlkLXRlbXBsYXRlLWFyZWFzJyxcbiAgJ2dyaWQtdGVtcGxhdGUtY29sdW1ucycsXG4gICdncmlkLXRlbXBsYXRlLXJvd3MnLFxuICAnaGFuZ2luZy1wdW5jdHVhdGlvbicsXG4gICdoZWlnaHQnLFxuICAnaHlwaGVucycsXG4gICdpY29uJyxcbiAgJ2ltYWdlLW9yaWVudGF0aW9uJyxcbiAgJ2ltYWdlLXJlbmRlcmluZycsXG4gICdpbWFnZS1yZXNvbHV0aW9uJyxcbiAgJ2ltZS1tb2RlJyxcbiAgJ2lubGluZS1zaXplJyxcbiAgJ2lzb2xhdGlvbicsXG4gICdqdXN0aWZ5LWNvbnRlbnQnLFxuICAnbGVmdCcsXG4gICdsZXR0ZXItc3BhY2luZycsXG4gICdsaW5lLWJyZWFrJyxcbiAgJ2xpbmUtaGVpZ2h0JyxcbiAgJ2xpc3Qtc3R5bGUnLFxuICAnbGlzdC1zdHlsZS1pbWFnZScsXG4gICdsaXN0LXN0eWxlLXBvc2l0aW9uJyxcbiAgJ2xpc3Qtc3R5bGUtdHlwZScsXG4gICdtYXJnaW4nLFxuICAnbWFyZ2luLWJsb2NrJyxcbiAgJ21hcmdpbi1ibG9jay1lbmQnLFxuICAnbWFyZ2luLWJsb2NrLXN0YXJ0JyxcbiAgJ21hcmdpbi1ib3R0b20nLFxuICAnbWFyZ2luLWlubGluZScsXG4gICdtYXJnaW4taW5saW5lLWVuZCcsXG4gICdtYXJnaW4taW5saW5lLXN0YXJ0JyxcbiAgJ21hcmdpbi1sZWZ0JyxcbiAgJ21hcmdpbi1yaWdodCcsXG4gICdtYXJnaW4tdG9wJyxcbiAgJ21hcmtzJyxcbiAgJ21hc2snLFxuICAnbWFzay1ib3JkZXInLFxuICAnbWFzay1ib3JkZXItbW9kZScsXG4gICdtYXNrLWJvcmRlci1vdXRzZXQnLFxuICAnbWFzay1ib3JkZXItcmVwZWF0JyxcbiAgJ21hc2stYm9yZGVyLXNsaWNlJyxcbiAgJ21hc2stYm9yZGVyLXNvdXJjZScsXG4gICdtYXNrLWJvcmRlci13aWR0aCcsXG4gICdtYXNrLWNsaXAnLFxuICAnbWFzay1jb21wb3NpdGUnLFxuICAnbWFzay1pbWFnZScsXG4gICdtYXNrLW1vZGUnLFxuICAnbWFzay1vcmlnaW4nLFxuICAnbWFzay1wb3NpdGlvbicsXG4gICdtYXNrLXJlcGVhdCcsXG4gICdtYXNrLXNpemUnLFxuICAnbWFzay10eXBlJyxcbiAgJ21heC1ibG9jay1zaXplJyxcbiAgJ21heC1oZWlnaHQnLFxuICAnbWF4LWlubGluZS1zaXplJyxcbiAgJ21heC13aWR0aCcsXG4gICdtaW4tYmxvY2stc2l6ZScsXG4gICdtaW4taGVpZ2h0JyxcbiAgJ21pbi1pbmxpbmUtc2l6ZScsXG4gICdtaW4td2lkdGgnLFxuICAnbWl4LWJsZW5kLW1vZGUnLFxuICAnbmF2LWRvd24nLFxuICAnbmF2LWluZGV4JyxcbiAgJ25hdi1sZWZ0JyxcbiAgJ25hdi1yaWdodCcsXG4gICduYXYtdXAnLFxuICAnbm9uZScsXG4gICdub3JtYWwnLFxuICAnb2JqZWN0LWZpdCcsXG4gICdvYmplY3QtcG9zaXRpb24nLFxuICAnb3BhY2l0eScsXG4gICdvcmRlcicsXG4gICdvcnBoYW5zJyxcbiAgJ291dGxpbmUnLFxuICAnb3V0bGluZS1jb2xvcicsXG4gICdvdXRsaW5lLW9mZnNldCcsXG4gICdvdXRsaW5lLXN0eWxlJyxcbiAgJ291dGxpbmUtd2lkdGgnLFxuICAnb3ZlcmZsb3cnLFxuICAnb3ZlcmZsb3ctd3JhcCcsXG4gICdvdmVyZmxvdy14JyxcbiAgJ292ZXJmbG93LXknLFxuICAncGFkZGluZycsXG4gICdwYWRkaW5nLWJsb2NrJyxcbiAgJ3BhZGRpbmctYmxvY2stZW5kJyxcbiAgJ3BhZGRpbmctYmxvY2stc3RhcnQnLFxuICAncGFkZGluZy1ib3R0b20nLFxuICAncGFkZGluZy1pbmxpbmUnLFxuICAncGFkZGluZy1pbmxpbmUtZW5kJyxcbiAgJ3BhZGRpbmctaW5saW5lLXN0YXJ0JyxcbiAgJ3BhZGRpbmctbGVmdCcsXG4gICdwYWRkaW5nLXJpZ2h0JyxcbiAgJ3BhZGRpbmctdG9wJyxcbiAgJ3BhZ2UtYnJlYWstYWZ0ZXInLFxuICAncGFnZS1icmVhay1iZWZvcmUnLFxuICAncGFnZS1icmVhay1pbnNpZGUnLFxuICAncGF1c2UnLFxuICAncGF1c2UtYWZ0ZXInLFxuICAncGF1c2UtYmVmb3JlJyxcbiAgJ3BlcnNwZWN0aXZlJyxcbiAgJ3BlcnNwZWN0aXZlLW9yaWdpbicsXG4gICdwb2ludGVyLWV2ZW50cycsXG4gICdwb3NpdGlvbicsXG4gICdxdW90ZXMnLFxuICAncmVzaXplJyxcbiAgJ3Jlc3QnLFxuICAncmVzdC1hZnRlcicsXG4gICdyZXN0LWJlZm9yZScsXG4gICdyaWdodCcsXG4gICdyb3ctZ2FwJyxcbiAgJ3Njcm9sbC1tYXJnaW4nLFxuICAnc2Nyb2xsLW1hcmdpbi1ibG9jaycsXG4gICdzY3JvbGwtbWFyZ2luLWJsb2NrLWVuZCcsXG4gICdzY3JvbGwtbWFyZ2luLWJsb2NrLXN0YXJ0JyxcbiAgJ3Njcm9sbC1tYXJnaW4tYm90dG9tJyxcbiAgJ3Njcm9sbC1tYXJnaW4taW5saW5lJyxcbiAgJ3Njcm9sbC1tYXJnaW4taW5saW5lLWVuZCcsXG4gICdzY3JvbGwtbWFyZ2luLWlubGluZS1zdGFydCcsXG4gICdzY3JvbGwtbWFyZ2luLWxlZnQnLFxuICAnc2Nyb2xsLW1hcmdpbi1yaWdodCcsXG4gICdzY3JvbGwtbWFyZ2luLXRvcCcsXG4gICdzY3JvbGwtcGFkZGluZycsXG4gICdzY3JvbGwtcGFkZGluZy1ibG9jaycsXG4gICdzY3JvbGwtcGFkZGluZy1ibG9jay1lbmQnLFxuICAnc2Nyb2xsLXBhZGRpbmctYmxvY2stc3RhcnQnLFxuICAnc2Nyb2xsLXBhZGRpbmctYm90dG9tJyxcbiAgJ3Njcm9sbC1wYWRkaW5nLWlubGluZScsXG4gICdzY3JvbGwtcGFkZGluZy1pbmxpbmUtZW5kJyxcbiAgJ3Njcm9sbC1wYWRkaW5nLWlubGluZS1zdGFydCcsXG4gICdzY3JvbGwtcGFkZGluZy1sZWZ0JyxcbiAgJ3Njcm9sbC1wYWRkaW5nLXJpZ2h0JyxcbiAgJ3Njcm9sbC1wYWRkaW5nLXRvcCcsXG4gICdzY3JvbGwtc25hcC1hbGlnbicsXG4gICdzY3JvbGwtc25hcC1zdG9wJyxcbiAgJ3Njcm9sbC1zbmFwLXR5cGUnLFxuICAnc2Nyb2xsYmFyLWNvbG9yJyxcbiAgJ3Njcm9sbGJhci1ndXR0ZXInLFxuICAnc2Nyb2xsYmFyLXdpZHRoJyxcbiAgJ3NoYXBlLWltYWdlLXRocmVzaG9sZCcsXG4gICdzaGFwZS1tYXJnaW4nLFxuICAnc2hhcGUtb3V0c2lkZScsXG4gICdzcGVhaycsXG4gICdzcGVhay1hcycsXG4gICdzcmMnLCAvLyBAZm9udC1mYWNlXG4gICd0YWItc2l6ZScsXG4gICd0YWJsZS1sYXlvdXQnLFxuICAndGV4dC1hbGlnbicsXG4gICd0ZXh0LWFsaWduLWFsbCcsXG4gICd0ZXh0LWFsaWduLWxhc3QnLFxuICAndGV4dC1jb21iaW5lLXVwcmlnaHQnLFxuICAndGV4dC1kZWNvcmF0aW9uJyxcbiAgJ3RleHQtZGVjb3JhdGlvbi1jb2xvcicsXG4gICd0ZXh0LWRlY29yYXRpb24tbGluZScsXG4gICd0ZXh0LWRlY29yYXRpb24tc3R5bGUnLFxuICAndGV4dC1lbXBoYXNpcycsXG4gICd0ZXh0LWVtcGhhc2lzLWNvbG9yJyxcbiAgJ3RleHQtZW1waGFzaXMtcG9zaXRpb24nLFxuICAndGV4dC1lbXBoYXNpcy1zdHlsZScsXG4gICd0ZXh0LWluZGVudCcsXG4gICd0ZXh0LWp1c3RpZnknLFxuICAndGV4dC1vcmllbnRhdGlvbicsXG4gICd0ZXh0LW92ZXJmbG93JyxcbiAgJ3RleHQtcmVuZGVyaW5nJyxcbiAgJ3RleHQtc2hhZG93JyxcbiAgJ3RleHQtdHJhbnNmb3JtJyxcbiAgJ3RleHQtdW5kZXJsaW5lLXBvc2l0aW9uJyxcbiAgJ3RvcCcsXG4gICd0cmFuc2Zvcm0nLFxuICAndHJhbnNmb3JtLWJveCcsXG4gICd0cmFuc2Zvcm0tb3JpZ2luJyxcbiAgJ3RyYW5zZm9ybS1zdHlsZScsXG4gICd0cmFuc2l0aW9uJyxcbiAgJ3RyYW5zaXRpb24tZGVsYXknLFxuICAndHJhbnNpdGlvbi1kdXJhdGlvbicsXG4gICd0cmFuc2l0aW9uLXByb3BlcnR5JyxcbiAgJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJyxcbiAgJ3VuaWNvZGUtYmlkaScsXG4gICd2ZXJ0aWNhbC1hbGlnbicsXG4gICd2aXNpYmlsaXR5JyxcbiAgJ3ZvaWNlLWJhbGFuY2UnLFxuICAndm9pY2UtZHVyYXRpb24nLFxuICAndm9pY2UtZmFtaWx5JyxcbiAgJ3ZvaWNlLXBpdGNoJyxcbiAgJ3ZvaWNlLXJhbmdlJyxcbiAgJ3ZvaWNlLXJhdGUnLFxuICAndm9pY2Utc3RyZXNzJyxcbiAgJ3ZvaWNlLXZvbHVtZScsXG4gICd3aGl0ZS1zcGFjZScsXG4gICd3aWRvd3MnLFxuICAnd2lkdGgnLFxuICAnd2lsbC1jaGFuZ2UnLFxuICAnd29yZC1icmVhaycsXG4gICd3b3JkLXNwYWNpbmcnLFxuICAnd29yZC13cmFwJyxcbiAgJ3dyaXRpbmctbW9kZScsXG4gICd6LWluZGV4J1xuICAvLyByZXZlcnNlIG1ha2VzIHN1cmUgbG9uZ2VyIGF0dHJpYnV0ZXMgYGZvbnQtd2VpZ2h0YCBhcmUgbWF0Y2hlZCBmdWxseVxuICAvLyBpbnN0ZWFkIG9mIGdldHRpbmcgZmFsc2UgcG9zaXRpdmVzIG9uIHNheSBgZm9udGBcbl0ucmV2ZXJzZSgpO1xuXG4vKlxuTGFuZ3VhZ2U6IFNDU1NcbkRlc2NyaXB0aW9uOiBTY3NzIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgc3ludGF4IG9mIENTUy5cbkF1dGhvcjogS3VydCBFbWNoIDxrdXJ0QGt1cnRlbWNoLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vc2Fzcy1sYW5nLmNvbVxuQ2F0ZWdvcnk6IGNvbW1vbiwgY3NzLCB3ZWJcbiovXG5cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHNjc3MoaGxqcykge1xuICBjb25zdCBtb2RlcyA9IE1PREVTKGhsanMpO1xuICBjb25zdCBQU0VVRE9fRUxFTUVOVFMkMSA9IFBTRVVET19FTEVNRU5UUztcbiAgY29uc3QgUFNFVURPX0NMQVNTRVMkMSA9IFBTRVVET19DTEFTU0VTO1xuXG4gIGNvbnN0IEFUX0lERU5USUZJRVIgPSAnQFthLXotXSsnOyAvLyBAZm9udC1mYWNlXG4gIGNvbnN0IEFUX01PRElGSUVSUyA9IFwiYW5kIG9yIG5vdCBvbmx5XCI7XG4gIGNvbnN0IElERU5UX1JFID0gJ1thLXpBLVotXVthLXpBLVowLTlfLV0qJztcbiAgY29uc3QgVkFSSUFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnKFxcXFwkJyArIElERU5UX1JFICsgJylcXFxcYicsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU0NTUycsXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAnWz0vfFxcJ10nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgLy8gdG8gcmVjb2duaXplIGtleWZyYW1lIDQwJSBldGMgd2hpY2ggYXJlIG91dHNpZGUgdGhlIHNjb3BlIG9mIG91clxuICAgICAgLy8gYXR0cmlidXRlIHZhbHVlIG1vZGVcbiAgICAgIG1vZGVzLkNTU19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VsZWN0b3ItaWQnLFxuICAgICAgICBiZWdpbjogJyNbQS1aYS16MC05Xy1dKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VsZWN0b3ItY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ1xcXFwuW0EtWmEtejAtOV8tXSsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBtb2Rlcy5BVFRSSUJVVEVfU0VMRUNUT1JfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VsZWN0b3ItdGFnJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYignICsgVEFHUy5qb2luKCd8JykgKyAnKVxcXFxiJyxcbiAgICAgICAgLy8gd2FzIHRoZXJlLCBiZWZvcmUsIGJ1dCB3aHk/XG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VsZWN0b3ItcHNldWRvJyxcbiAgICAgICAgYmVnaW46ICc6KCcgKyBQU0VVRE9fQ0xBU1NFUyQxLmpvaW4oJ3wnKSArICcpJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2VsZWN0b3ItcHNldWRvJyxcbiAgICAgICAgYmVnaW46ICc6KDopPygnICsgUFNFVURPX0VMRU1FTlRTJDEuam9pbignfCcpICsgJyknXG4gICAgICB9LFxuICAgICAgVkFSSUFCTEUsXG4gICAgICB7IC8vIHBzZXVkby1zZWxlY3RvciBwYXJhbXNcbiAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICBjb250YWluczogWyBtb2Rlcy5DU1NfTlVNQkVSX01PREUgXVxuICAgICAgfSxcbiAgICAgIG1vZGVzLkNTU19WQVJJQUJMRSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYignICsgQVRUUklCVVRFUy5qb2luKCd8JykgKyAnKVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHsgYmVnaW46ICdcXFxcYih3aGl0ZXNwYWNlfHdhaXR8dy1yZXNpemV8dmlzaWJsZXx2ZXJ0aWNhbC10ZXh0fHZlcnRpY2FsLWlkZW9ncmFwaGljfHVwcGVyY2FzZXx1cHBlci1yb21hbnx1cHBlci1hbHBoYXx1bmRlcmxpbmV8dHJhbnNwYXJlbnR8dG9wfHRoaW58dGhpY2t8dGV4dHx0ZXh0LXRvcHx0ZXh0LWJvdHRvbXx0Yi1ybHx0YWJsZS1oZWFkZXItZ3JvdXB8dGFibGUtZm9vdGVyLWdyb3VwfHN3LXJlc2l6ZXxzdXBlcnxzdHJpY3R8c3RhdGljfHNxdWFyZXxzb2xpZHxzbWFsbC1jYXBzfHNlcGFyYXRlfHNlLXJlc2l6ZXxzY3JvbGx8cy1yZXNpemV8cnRsfHJvdy1yZXNpemV8cmlkZ2V8cmlnaHR8cmVwZWF0fHJlcGVhdC15fHJlcGVhdC14fHJlbGF0aXZlfHByb2dyZXNzfHBvaW50ZXJ8b3ZlcmxpbmV8b3V0c2lkZXxvdXRzZXR8b2JsaXF1ZXxub3dyYXB8bm90LWFsbG93ZWR8bm9ybWFsfG5vbmV8bnctcmVzaXplfG5vLXJlcGVhdHxuby1kcm9wfG5ld3NwYXBlcnxuZS1yZXNpemV8bi1yZXNpemV8bW92ZXxtaWRkbGV8bWVkaXVtfGx0cnxsci10Ynxsb3dlcmNhc2V8bG93ZXItcm9tYW58bG93ZXItYWxwaGF8bG9vc2V8bGlzdC1pdGVtfGxpbmV8bGluZS10aHJvdWdofGxpbmUtZWRnZXxsaWdodGVyfGxlZnR8a2VlcC1hbGx8anVzdGlmeXxpdGFsaWN8aW50ZXItd29yZHxpbnRlci1pZGVvZ3JhcGh8aW5zaWRlfGluc2V0fGlubGluZXxpbmxpbmUtYmxvY2t8aW5oZXJpdHxpbmFjdGl2ZXxpZGVvZ3JhcGgtc3BhY2V8aWRlb2dyYXBoLXBhcmVudGhlc2lzfGlkZW9ncmFwaC1udW1lcmljfGlkZW9ncmFwaC1hbHBoYXxob3Jpem9udGFsfGhpZGRlbnxoZWxwfGhhbmR8Z3Jvb3ZlfGZpeGVkfGVsbGlwc2lzfGUtcmVzaXplfGRvdWJsZXxkb3R0ZWR8ZGlzdHJpYnV0ZXxkaXN0cmlidXRlLXNwYWNlfGRpc3RyaWJ1dGUtbGV0dGVyfGRpc3RyaWJ1dGUtYWxsLWxpbmVzfGRpc2N8ZGlzYWJsZWR8ZGVmYXVsdHxkZWNpbWFsfGRhc2hlZHxjcm9zc2hhaXJ8Y29sbGFwc2V8Y29sLXJlc2l6ZXxjaXJjbGV8Y2hhcnxjZW50ZXJ8Y2FwaXRhbGl6ZXxicmVhay13b3JkfGJyZWFrLWFsbHxib3R0b218Ym90aHxib2xkZXJ8Ym9sZHxibG9ja3xiaWRpLW92ZXJyaWRlfGJlbG93fGJhc2VsaW5lfGF1dG98YWx3YXlzfGFsbC1zY3JvbGx8YWJzb2x1dGV8dGFibGV8dGFibGUtY2VsbClcXFxcYicgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC86LyxcbiAgICAgICAgZW5kOiAvWzt9e10vLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgbW9kZXMuQkxPQ0tfQ09NTUVOVCxcbiAgICAgICAgICBWQVJJQUJMRSxcbiAgICAgICAgICBtb2Rlcy5IRVhDT0xPUixcbiAgICAgICAgICBtb2Rlcy5DU1NfTlVNQkVSX01PREUsXG4gICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgbW9kZXMuSU1QT1JUQU5ULFxuICAgICAgICAgIG1vZGVzLkZVTkNUSU9OX0RJU1BBVENIXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBtYXRjaGluZyB0aGVzZSBoZXJlIGFsbG93cyB1cyB0byB0cmVhdCB0aGVtIG1vcmUgbGlrZSByZWd1bGFyIENTU1xuICAgICAgLy8gcnVsZXMgc28gZXZlcnl0aGluZyBiZXR3ZWVuIHRoZSB7fSBnZXRzIHJlZ3VsYXIgcnVsZSBoaWdobGlnaHRpbmcsXG4gICAgICAvLyB3aGljaCBpcyB3aGF0IHdlIHdhbnQgZm9yIHBhZ2UgYW5kIGZvbnQtZmFjZVxuICAgICAge1xuICAgICAgICBiZWdpbjogJ0AocGFnZXxmb250LWZhY2UpJyxcbiAgICAgICAga2V5d29yZHM6IHtcbiAgICAgICAgICAkcGF0dGVybjogQVRfSURFTlRJRklFUixcbiAgICAgICAgICBrZXl3b3JkOiAnQHBhZ2UgQGZvbnQtZmFjZSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdAJyxcbiAgICAgICAgZW5kOiAnW3s7XScsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgICRwYXR0ZXJuOiAvW2Etei1dKy8sXG4gICAgICAgICAga2V5d29yZDogQVRfTU9ESUZJRVJTLFxuICAgICAgICAgIGF0dHJpYnV0ZTogTUVESUFfRkVBVFVSRVMuam9pbihcIiBcIilcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogQVRfSURFTlRJRklFUixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJrZXl3b3JkXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvW2Etei1dKyg/PTopLyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJhdHRyaWJ1dGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgVkFSSUFCTEUsXG4gICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgbW9kZXMuSEVYQ09MT1IsXG4gICAgICAgICAgbW9kZXMuQ1NTX05VTUJFUl9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBtb2Rlcy5GVU5DVElPTl9ESVNQQVRDSFxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgc2NzcyBhcyBkZWZhdWx0IH07XG4iLCAiLypcbkxhbmd1YWdlOiBTaGVsbCBTZXNzaW9uXG5SZXF1aXJlczogYmFzaC5qc1xuQXV0aG9yOiBUU1VZVVNBVE8gS2l0c3VuZSA8bWFrZS5qdXN0Lm9uQGdtYWlsLmNvbT5cbkNhdGVnb3J5OiBjb21tb25cbkF1ZGl0OiAyMDIwXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gc2hlbGwoaGxqcykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdTaGVsbCBTZXNzaW9uJyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAnY29uc29sZScsXG4gICAgICAnc2hlbGxzZXNzaW9uJ1xuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YS5wcm9tcHQnLFxuICAgICAgICAvLyBXZSBjYW5ub3QgYWRkIFxccyAoc3BhY2VzKSBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIG90aGVyd2lzZSBpdCB3aWxsIGJlIHRvbyBicm9hZCBhbmQgcHJvZHVjZSB1bmV4cGVjdGVkIHJlc3VsdC5cbiAgICAgICAgLy8gRm9yIGluc3RhbmNlLCBpbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUsIGl0IHdvdWxkIG1hdGNoIFwiZWNobyAvcGF0aC90by9ob21lID5cIiBhcyBhIHByb21wdDpcbiAgICAgICAgLy8gZWNobyAvcGF0aC90by9ob21lID4gdC5leGVcbiAgICAgICAgYmVnaW46IC9eXFxzezAsM31bL35cXHdcXGRbXFxdKClALV0qWz4lJCNdWyBdPy8sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogL1teXFxcXF0oPz1cXHMqJCkvLFxuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnYmFzaCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgc2hlbGwgYXMgZGVmYXVsdCB9O1xuIiwgIi8qXG4gTGFuZ3VhZ2U6IFNRTFxuIFdlYnNpdGU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NRTFxuIENhdGVnb3J5OiBjb21tb24sIGRhdGFiYXNlXG4gKi9cblxuLypcblxuR29hbHM6XG5cblNRTCBpcyBpbnRlbmRlZCB0byBoaWdobGlnaHQgYmFzaWMvY29tbW9uIFNRTCBrZXl3b3JkcyBhbmQgZXhwcmVzc2lvbnNcblxuLSBJZiBwcmV0dHkgbXVjaCBldmVyeSBzaW5nbGUgU1FMIHNlcnZlciBpbmNsdWRlcyBzdXBwb3J0cywgdGhlbiBpdCdzIGEgY2FuaWRhdGUuXG4tIEl0IGlzIE5PVCBpbnRlbmRlZCB0byBpbmNsdWRlIHRvbnMgb2YgdmVuZG9yIHNwZWNpZmljIGtleXdvcmRzIChPcmFjbGUsIE15U1FMLFxuICBQb3N0Z3JlU1FMKSBhbHRob3VnaCB0aGUgbGlzdCBvZiBkYXRhIHR5cGVzIGlzIHB1cnBvc2VseSBhIGJpdCBtb3JlIGV4cGFuc2l2ZS5cbi0gRm9yIG1vcmUgc3BlY2lmaWMgU1FMIGdyYW1tYXJzIHBsZWFzZSBzZWU6XG4gIC0gUG9zdGdyZVNRTCBhbmQgUEwvcGdTUUwgLSBjb3JlXG4gIC0gVC1TUUwgLSBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0anMtdHNxbFxuICAtIHNxbF9tb3JlIChjb3JlKVxuXG4gKi9cblxuZnVuY3Rpb24gc3FsKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICBjb25zdCBDT01NRU5UX01PREUgPSBobGpzLkNPTU1FTlQoJy0tJywgJyQnKTtcbiAgY29uc3QgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC8nLyxcbiAgICAgICAgZW5kOiAvJy8sXG4gICAgICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46IC8nJy8gfSBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBRVU9URURfSURFTlRJRklFUiA9IHtcbiAgICBiZWdpbjogL1wiLyxcbiAgICBlbmQ6IC9cIi8sXG4gICAgY29udGFpbnM6IFsgeyBiZWdpbjogL1wiXCIvIH0gXVxuICB9O1xuXG4gIGNvbnN0IExJVEVSQUxTID0gW1xuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIixcbiAgICAvLyBOb3Qgc3VyZSBpdCdzIGNvcnJlY3QgdG8gY2FsbCBOVUxMIGxpdGVyYWwsIGFuZCBjbGF1c2VzIGxpa2UgSVMgW05PVF0gTlVMTCBsb29rIHN0cmFuZ2UgdGhhdCB3YXkuXG4gICAgLy8gXCJudWxsXCIsXG4gICAgXCJ1bmtub3duXCJcbiAgXTtcblxuICBjb25zdCBNVUxUSV9XT1JEX1RZUEVTID0gW1xuICAgIFwiZG91YmxlIHByZWNpc2lvblwiLFxuICAgIFwibGFyZ2Ugb2JqZWN0XCIsXG4gICAgXCJ3aXRoIHRpbWV6b25lXCIsXG4gICAgXCJ3aXRob3V0IHRpbWV6b25lXCJcbiAgXTtcblxuICBjb25zdCBUWVBFUyA9IFtcbiAgICAnYmlnaW50JyxcbiAgICAnYmluYXJ5JyxcbiAgICAnYmxvYicsXG4gICAgJ2Jvb2xlYW4nLFxuICAgICdjaGFyJyxcbiAgICAnY2hhcmFjdGVyJyxcbiAgICAnY2xvYicsXG4gICAgJ2RhdGUnLFxuICAgICdkZWMnLFxuICAgICdkZWNmbG9hdCcsXG4gICAgJ2RlY2ltYWwnLFxuICAgICdmbG9hdCcsXG4gICAgJ2ludCcsXG4gICAgJ2ludGVnZXInLFxuICAgICdpbnRlcnZhbCcsXG4gICAgJ25jaGFyJyxcbiAgICAnbmNsb2InLFxuICAgICduYXRpb25hbCcsXG4gICAgJ251bWVyaWMnLFxuICAgICdyZWFsJyxcbiAgICAncm93JyxcbiAgICAnc21hbGxpbnQnLFxuICAgICd0aW1lJyxcbiAgICAndGltZXN0YW1wJyxcbiAgICAndmFyY2hhcicsXG4gICAgJ3ZhcnlpbmcnLCAvLyBtb2RpZmllciAoY2hhcmFjdGVyIHZhcnlpbmcpXG4gICAgJ3ZhcmJpbmFyeSdcbiAgXTtcblxuICBjb25zdCBOT05fUkVTRVJWRURfV09SRFMgPSBbXG4gICAgXCJhZGRcIixcbiAgICBcImFzY1wiLFxuICAgIFwiY29sbGF0aW9uXCIsXG4gICAgXCJkZXNjXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwiZmlyc3RcIixcbiAgICBcImxhc3RcIixcbiAgICBcInZpZXdcIlxuICBdO1xuXG4gIC8vIGh0dHBzOi8vamFrZXdoZWF0LmdpdGh1Yi5pby9zcWwtb3ZlcnZpZXcvc3FsLTIwMTYtZm91bmRhdGlvbi1ncmFtbWFyLmh0bWwjcmVzZXJ2ZWQtd29yZFxuICBjb25zdCBSRVNFUlZFRF9XT1JEUyA9IFtcbiAgICBcImFic1wiLFxuICAgIFwiYWNvc1wiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJhbGxvY2F0ZVwiLFxuICAgIFwiYWx0ZXJcIixcbiAgICBcImFuZFwiLFxuICAgIFwiYW55XCIsXG4gICAgXCJhcmVcIixcbiAgICBcImFycmF5XCIsXG4gICAgXCJhcnJheV9hZ2dcIixcbiAgICBcImFycmF5X21heF9jYXJkaW5hbGl0eVwiLFxuICAgIFwiYXNcIixcbiAgICBcImFzZW5zaXRpdmVcIixcbiAgICBcImFzaW5cIixcbiAgICBcImFzeW1tZXRyaWNcIixcbiAgICBcImF0XCIsXG4gICAgXCJhdGFuXCIsXG4gICAgXCJhdG9taWNcIixcbiAgICBcImF1dGhvcml6YXRpb25cIixcbiAgICBcImF2Z1wiLFxuICAgIFwiYmVnaW5cIixcbiAgICBcImJlZ2luX2ZyYW1lXCIsXG4gICAgXCJiZWdpbl9wYXJ0aXRpb25cIixcbiAgICBcImJldHdlZW5cIixcbiAgICBcImJpZ2ludFwiLFxuICAgIFwiYmluYXJ5XCIsXG4gICAgXCJibG9iXCIsXG4gICAgXCJib29sZWFuXCIsXG4gICAgXCJib3RoXCIsXG4gICAgXCJieVwiLFxuICAgIFwiY2FsbFwiLFxuICAgIFwiY2FsbGVkXCIsXG4gICAgXCJjYXJkaW5hbGl0eVwiLFxuICAgIFwiY2FzY2FkZWRcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNhc3RcIixcbiAgICBcImNlaWxcIixcbiAgICBcImNlaWxpbmdcIixcbiAgICBcImNoYXJcIixcbiAgICBcImNoYXJfbGVuZ3RoXCIsXG4gICAgXCJjaGFyYWN0ZXJcIixcbiAgICBcImNoYXJhY3Rlcl9sZW5ndGhcIixcbiAgICBcImNoZWNrXCIsXG4gICAgXCJjbGFzc2lmaWVyXCIsXG4gICAgXCJjbG9iXCIsXG4gICAgXCJjbG9zZVwiLFxuICAgIFwiY29hbGVzY2VcIixcbiAgICBcImNvbGxhdGVcIixcbiAgICBcImNvbGxlY3RcIixcbiAgICBcImNvbHVtblwiLFxuICAgIFwiY29tbWl0XCIsXG4gICAgXCJjb25kaXRpb25cIixcbiAgICBcImNvbm5lY3RcIixcbiAgICBcImNvbnN0cmFpbnRcIixcbiAgICBcImNvbnRhaW5zXCIsXG4gICAgXCJjb252ZXJ0XCIsXG4gICAgXCJjb3B5XCIsXG4gICAgXCJjb3JyXCIsXG4gICAgXCJjb3JyZXNwb25kaW5nXCIsXG4gICAgXCJjb3NcIixcbiAgICBcImNvc2hcIixcbiAgICBcImNvdW50XCIsXG4gICAgXCJjb3Zhcl9wb3BcIixcbiAgICBcImNvdmFyX3NhbXBcIixcbiAgICBcImNyZWF0ZVwiLFxuICAgIFwiY3Jvc3NcIixcbiAgICBcImN1YmVcIixcbiAgICBcImN1bWVfZGlzdFwiLFxuICAgIFwiY3VycmVudFwiLFxuICAgIFwiY3VycmVudF9jYXRhbG9nXCIsXG4gICAgXCJjdXJyZW50X2RhdGVcIixcbiAgICBcImN1cnJlbnRfZGVmYXVsdF90cmFuc2Zvcm1fZ3JvdXBcIixcbiAgICBcImN1cnJlbnRfcGF0aFwiLFxuICAgIFwiY3VycmVudF9yb2xlXCIsXG4gICAgXCJjdXJyZW50X3Jvd1wiLFxuICAgIFwiY3VycmVudF9zY2hlbWFcIixcbiAgICBcImN1cnJlbnRfdGltZVwiLFxuICAgIFwiY3VycmVudF90aW1lc3RhbXBcIixcbiAgICBcImN1cnJlbnRfcGF0aFwiLFxuICAgIFwiY3VycmVudF9yb2xlXCIsXG4gICAgXCJjdXJyZW50X3RyYW5zZm9ybV9ncm91cF9mb3JfdHlwZVwiLFxuICAgIFwiY3VycmVudF91c2VyXCIsXG4gICAgXCJjdXJzb3JcIixcbiAgICBcImN5Y2xlXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJkYXlcIixcbiAgICBcImRlYWxsb2NhdGVcIixcbiAgICBcImRlY1wiLFxuICAgIFwiZGVjaW1hbFwiLFxuICAgIFwiZGVjZmxvYXRcIixcbiAgICBcImRlY2xhcmVcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRlZmluZVwiLFxuICAgIFwiZGVsZXRlXCIsXG4gICAgXCJkZW5zZV9yYW5rXCIsXG4gICAgXCJkZXJlZlwiLFxuICAgIFwiZGVzY3JpYmVcIixcbiAgICBcImRldGVybWluaXN0aWNcIixcbiAgICBcImRpc2Nvbm5lY3RcIixcbiAgICBcImRpc3RpbmN0XCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImRyb3BcIixcbiAgICBcImR5bmFtaWNcIixcbiAgICBcImVhY2hcIixcbiAgICBcImVsZW1lbnRcIixcbiAgICBcImVsc2VcIixcbiAgICBcImVtcHR5XCIsXG4gICAgXCJlbmRcIixcbiAgICBcImVuZF9mcmFtZVwiLFxuICAgIFwiZW5kX3BhcnRpdGlvblwiLFxuICAgIFwiZW5kLWV4ZWNcIixcbiAgICBcImVxdWFsc1wiLFxuICAgIFwiZXNjYXBlXCIsXG4gICAgXCJldmVyeVwiLFxuICAgIFwiZXhjZXB0XCIsXG4gICAgXCJleGVjXCIsXG4gICAgXCJleGVjdXRlXCIsXG4gICAgXCJleGlzdHNcIixcbiAgICBcImV4cFwiLFxuICAgIFwiZXh0ZXJuYWxcIixcbiAgICBcImV4dHJhY3RcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJmZXRjaFwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJmaXJzdF92YWx1ZVwiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcImZsb29yXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZvcmVpZ25cIixcbiAgICBcImZyYW1lX3Jvd1wiLFxuICAgIFwiZnJlZVwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiZnVsbFwiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcImZ1c2lvblwiLFxuICAgIFwiZ2V0XCIsXG4gICAgXCJnbG9iYWxcIixcbiAgICBcImdyYW50XCIsXG4gICAgXCJncm91cFwiLFxuICAgIFwiZ3JvdXBpbmdcIixcbiAgICBcImdyb3Vwc1wiLFxuICAgIFwiaGF2aW5nXCIsXG4gICAgXCJob2xkXCIsXG4gICAgXCJob3VyXCIsXG4gICAgXCJpZGVudGl0eVwiLFxuICAgIFwiaW5cIixcbiAgICBcImluZGljYXRvclwiLFxuICAgIFwiaW5pdGlhbFwiLFxuICAgIFwiaW5uZXJcIixcbiAgICBcImlub3V0XCIsXG4gICAgXCJpbnNlbnNpdGl2ZVwiLFxuICAgIFwiaW5zZXJ0XCIsXG4gICAgXCJpbnRcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcImludGVyc2VjdFwiLFxuICAgIFwiaW50ZXJzZWN0aW9uXCIsXG4gICAgXCJpbnRlcnZhbFwiLFxuICAgIFwiaW50b1wiLFxuICAgIFwiaXNcIixcbiAgICBcImpvaW5cIixcbiAgICBcImpzb25fYXJyYXlcIixcbiAgICBcImpzb25fYXJyYXlhZ2dcIixcbiAgICBcImpzb25fZXhpc3RzXCIsXG4gICAgXCJqc29uX29iamVjdFwiLFxuICAgIFwianNvbl9vYmplY3RhZ2dcIixcbiAgICBcImpzb25fcXVlcnlcIixcbiAgICBcImpzb25fdGFibGVcIixcbiAgICBcImpzb25fdGFibGVfcHJpbWl0aXZlXCIsXG4gICAgXCJqc29uX3ZhbHVlXCIsXG4gICAgXCJsYWdcIixcbiAgICBcImxhbmd1YWdlXCIsXG4gICAgXCJsYXJnZVwiLFxuICAgIFwibGFzdF92YWx1ZVwiLFxuICAgIFwibGF0ZXJhbFwiLFxuICAgIFwibGVhZFwiLFxuICAgIFwibGVhZGluZ1wiLFxuICAgIFwibGVmdFwiLFxuICAgIFwibGlrZVwiLFxuICAgIFwibGlrZV9yZWdleFwiLFxuICAgIFwibGlzdGFnZ1wiLFxuICAgIFwibG5cIixcbiAgICBcImxvY2FsXCIsXG4gICAgXCJsb2NhbHRpbWVcIixcbiAgICBcImxvY2FsdGltZXN0YW1wXCIsXG4gICAgXCJsb2dcIixcbiAgICBcImxvZzEwXCIsXG4gICAgXCJsb3dlclwiLFxuICAgIFwibWF0Y2hcIixcbiAgICBcIm1hdGNoX251bWJlclwiLFxuICAgIFwibWF0Y2hfcmVjb2duaXplXCIsXG4gICAgXCJtYXRjaGVzXCIsXG4gICAgXCJtYXhcIixcbiAgICBcIm1lbWJlclwiLFxuICAgIFwibWVyZ2VcIixcbiAgICBcIm1ldGhvZFwiLFxuICAgIFwibWluXCIsXG4gICAgXCJtaW51dGVcIixcbiAgICBcIm1vZFwiLFxuICAgIFwibW9kaWZpZXNcIixcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwibW9udGhcIixcbiAgICBcIm11bHRpc2V0XCIsXG4gICAgXCJuYXRpb25hbFwiLFxuICAgIFwibmF0dXJhbFwiLFxuICAgIFwibmNoYXJcIixcbiAgICBcIm5jbG9iXCIsXG4gICAgXCJuZXdcIixcbiAgICBcIm5vXCIsXG4gICAgXCJub25lXCIsXG4gICAgXCJub3JtYWxpemVcIixcbiAgICBcIm5vdFwiLFxuICAgIFwibnRoX3ZhbHVlXCIsXG4gICAgXCJudGlsZVwiLFxuICAgIFwibnVsbFwiLFxuICAgIFwibnVsbGlmXCIsXG4gICAgXCJudW1lcmljXCIsXG4gICAgXCJvY3RldF9sZW5ndGhcIixcbiAgICBcIm9jY3VycmVuY2VzX3JlZ2V4XCIsXG4gICAgXCJvZlwiLFxuICAgIFwib2Zmc2V0XCIsXG4gICAgXCJvbGRcIixcbiAgICBcIm9taXRcIixcbiAgICBcIm9uXCIsXG4gICAgXCJvbmVcIixcbiAgICBcIm9ubHlcIixcbiAgICBcIm9wZW5cIixcbiAgICBcIm9yXCIsXG4gICAgXCJvcmRlclwiLFxuICAgIFwib3V0XCIsXG4gICAgXCJvdXRlclwiLFxuICAgIFwib3ZlclwiLFxuICAgIFwib3ZlcmxhcHNcIixcbiAgICBcIm92ZXJsYXlcIixcbiAgICBcInBhcmFtZXRlclwiLFxuICAgIFwicGFydGl0aW9uXCIsXG4gICAgXCJwYXR0ZXJuXCIsXG4gICAgXCJwZXJcIixcbiAgICBcInBlcmNlbnRcIixcbiAgICBcInBlcmNlbnRfcmFua1wiLFxuICAgIFwicGVyY2VudGlsZV9jb250XCIsXG4gICAgXCJwZXJjZW50aWxlX2Rpc2NcIixcbiAgICBcInBlcmlvZFwiLFxuICAgIFwicG9ydGlvblwiLFxuICAgIFwicG9zaXRpb25cIixcbiAgICBcInBvc2l0aW9uX3JlZ2V4XCIsXG4gICAgXCJwb3dlclwiLFxuICAgIFwicHJlY2VkZXNcIixcbiAgICBcInByZWNpc2lvblwiLFxuICAgIFwicHJlcGFyZVwiLFxuICAgIFwicHJpbWFyeVwiLFxuICAgIFwicHJvY2VkdXJlXCIsXG4gICAgXCJwdGZcIixcbiAgICBcInJhbmdlXCIsXG4gICAgXCJyYW5rXCIsXG4gICAgXCJyZWFkc1wiLFxuICAgIFwicmVhbFwiLFxuICAgIFwicmVjdXJzaXZlXCIsXG4gICAgXCJyZWZcIixcbiAgICBcInJlZmVyZW5jZXNcIixcbiAgICBcInJlZmVyZW5jaW5nXCIsXG4gICAgXCJyZWdyX2F2Z3hcIixcbiAgICBcInJlZ3JfYXZneVwiLFxuICAgIFwicmVncl9jb3VudFwiLFxuICAgIFwicmVncl9pbnRlcmNlcHRcIixcbiAgICBcInJlZ3JfcjJcIixcbiAgICBcInJlZ3Jfc2xvcGVcIixcbiAgICBcInJlZ3Jfc3h4XCIsXG4gICAgXCJyZWdyX3N4eVwiLFxuICAgIFwicmVncl9zeXlcIixcbiAgICBcInJlbGVhc2VcIixcbiAgICBcInJlc3VsdFwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJyZXR1cm5zXCIsXG4gICAgXCJyZXZva2VcIixcbiAgICBcInJpZ2h0XCIsXG4gICAgXCJyb2xsYmFja1wiLFxuICAgIFwicm9sbHVwXCIsXG4gICAgXCJyb3dcIixcbiAgICBcInJvd19udW1iZXJcIixcbiAgICBcInJvd3NcIixcbiAgICBcInJ1bm5pbmdcIixcbiAgICBcInNhdmVwb2ludFwiLFxuICAgIFwic2NvcGVcIixcbiAgICBcInNjcm9sbFwiLFxuICAgIFwic2VhcmNoXCIsXG4gICAgXCJzZWNvbmRcIixcbiAgICBcInNlZWtcIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwic2Vuc2l0aXZlXCIsXG4gICAgXCJzZXNzaW9uX3VzZXJcIixcbiAgICBcInNldFwiLFxuICAgIFwic2hvd1wiLFxuICAgIFwic2ltaWxhclwiLFxuICAgIFwic2luXCIsXG4gICAgXCJzaW5oXCIsXG4gICAgXCJza2lwXCIsXG4gICAgXCJzbWFsbGludFwiLFxuICAgIFwic29tZVwiLFxuICAgIFwic3BlY2lmaWNcIixcbiAgICBcInNwZWNpZmljdHlwZVwiLFxuICAgIFwic3FsXCIsXG4gICAgXCJzcWxleGNlcHRpb25cIixcbiAgICBcInNxbHN0YXRlXCIsXG4gICAgXCJzcWx3YXJuaW5nXCIsXG4gICAgXCJzcXJ0XCIsXG4gICAgXCJzdGFydFwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdGRkZXZfcG9wXCIsXG4gICAgXCJzdGRkZXZfc2FtcFwiLFxuICAgIFwic3VibXVsdGlzZXRcIixcbiAgICBcInN1YnNldFwiLFxuICAgIFwic3Vic3RyaW5nXCIsXG4gICAgXCJzdWJzdHJpbmdfcmVnZXhcIixcbiAgICBcInN1Y2NlZWRzXCIsXG4gICAgXCJzdW1cIixcbiAgICBcInN5bW1ldHJpY1wiLFxuICAgIFwic3lzdGVtXCIsXG4gICAgXCJzeXN0ZW1fdGltZVwiLFxuICAgIFwic3lzdGVtX3VzZXJcIixcbiAgICBcInRhYmxlXCIsXG4gICAgXCJ0YWJsZXNhbXBsZVwiLFxuICAgIFwidGFuXCIsXG4gICAgXCJ0YW5oXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJ0aW1lXCIsXG4gICAgXCJ0aW1lc3RhbXBcIixcbiAgICBcInRpbWV6b25lX2hvdXJcIixcbiAgICBcInRpbWV6b25lX21pbnV0ZVwiLFxuICAgIFwidG9cIixcbiAgICBcInRyYWlsaW5nXCIsXG4gICAgXCJ0cmFuc2xhdGVcIixcbiAgICBcInRyYW5zbGF0ZV9yZWdleFwiLFxuICAgIFwidHJhbnNsYXRpb25cIixcbiAgICBcInRyZWF0XCIsXG4gICAgXCJ0cmlnZ2VyXCIsXG4gICAgXCJ0cmltXCIsXG4gICAgXCJ0cmltX2FycmF5XCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ0cnVuY2F0ZVwiLFxuICAgIFwidWVzY2FwZVwiLFxuICAgIFwidW5pb25cIixcbiAgICBcInVuaXF1ZVwiLFxuICAgIFwidW5rbm93blwiLFxuICAgIFwidW5uZXN0XCIsXG4gICAgXCJ1cGRhdGVcIixcbiAgICBcInVwcGVyXCIsXG4gICAgXCJ1c2VyXCIsXG4gICAgXCJ1c2luZ1wiLFxuICAgIFwidmFsdWVcIixcbiAgICBcInZhbHVlc1wiLFxuICAgIFwidmFsdWVfb2ZcIixcbiAgICBcInZhcl9wb3BcIixcbiAgICBcInZhcl9zYW1wXCIsXG4gICAgXCJ2YXJiaW5hcnlcIixcbiAgICBcInZhcmNoYXJcIixcbiAgICBcInZhcnlpbmdcIixcbiAgICBcInZlcnNpb25pbmdcIixcbiAgICBcIndoZW5cIixcbiAgICBcIndoZW5ldmVyXCIsXG4gICAgXCJ3aGVyZVwiLFxuICAgIFwid2lkdGhfYnVja2V0XCIsXG4gICAgXCJ3aW5kb3dcIixcbiAgICBcIndpdGhcIixcbiAgICBcIndpdGhpblwiLFxuICAgIFwid2l0aG91dFwiLFxuICAgIFwieWVhclwiLFxuICBdO1xuXG4gIC8vIHRoZXNlIGFyZSByZXNlcnZlZCB3b3JkcyB3ZSBoYXZlIGlkZW50aWZpZWQgdG8gYmUgZnVuY3Rpb25zXG4gIC8vIGFuZCBzaG91bGQgb25seSBiZSBoaWdobGlnaHRlZCBpbiBhIGRpc3BhdGNoLWxpa2UgY29udGV4dFxuICAvLyBpZSwgYXJyYXlfYWdnKC4uLiksIGV0Yy5cbiAgY29uc3QgUkVTRVJWRURfRlVOQ1RJT05TID0gW1xuICAgIFwiYWJzXCIsXG4gICAgXCJhY29zXCIsXG4gICAgXCJhcnJheV9hZ2dcIixcbiAgICBcImFzaW5cIixcbiAgICBcImF0YW5cIixcbiAgICBcImF2Z1wiLFxuICAgIFwiY2FzdFwiLFxuICAgIFwiY2VpbFwiLFxuICAgIFwiY2VpbGluZ1wiLFxuICAgIFwiY29hbGVzY2VcIixcbiAgICBcImNvcnJcIixcbiAgICBcImNvc1wiLFxuICAgIFwiY29zaFwiLFxuICAgIFwiY291bnRcIixcbiAgICBcImNvdmFyX3BvcFwiLFxuICAgIFwiY292YXJfc2FtcFwiLFxuICAgIFwiY3VtZV9kaXN0XCIsXG4gICAgXCJkZW5zZV9yYW5rXCIsXG4gICAgXCJkZXJlZlwiLFxuICAgIFwiZWxlbWVudFwiLFxuICAgIFwiZXhwXCIsXG4gICAgXCJleHRyYWN0XCIsXG4gICAgXCJmaXJzdF92YWx1ZVwiLFxuICAgIFwiZmxvb3JcIixcbiAgICBcImpzb25fYXJyYXlcIixcbiAgICBcImpzb25fYXJyYXlhZ2dcIixcbiAgICBcImpzb25fZXhpc3RzXCIsXG4gICAgXCJqc29uX29iamVjdFwiLFxuICAgIFwianNvbl9vYmplY3RhZ2dcIixcbiAgICBcImpzb25fcXVlcnlcIixcbiAgICBcImpzb25fdGFibGVcIixcbiAgICBcImpzb25fdGFibGVfcHJpbWl0aXZlXCIsXG4gICAgXCJqc29uX3ZhbHVlXCIsXG4gICAgXCJsYWdcIixcbiAgICBcImxhc3RfdmFsdWVcIixcbiAgICBcImxlYWRcIixcbiAgICBcImxpc3RhZ2dcIixcbiAgICBcImxuXCIsXG4gICAgXCJsb2dcIixcbiAgICBcImxvZzEwXCIsXG4gICAgXCJsb3dlclwiLFxuICAgIFwibWF4XCIsXG4gICAgXCJtaW5cIixcbiAgICBcIm1vZFwiLFxuICAgIFwibnRoX3ZhbHVlXCIsXG4gICAgXCJudGlsZVwiLFxuICAgIFwibnVsbGlmXCIsXG4gICAgXCJwZXJjZW50X3JhbmtcIixcbiAgICBcInBlcmNlbnRpbGVfY29udFwiLFxuICAgIFwicGVyY2VudGlsZV9kaXNjXCIsXG4gICAgXCJwb3NpdGlvblwiLFxuICAgIFwicG9zaXRpb25fcmVnZXhcIixcbiAgICBcInBvd2VyXCIsXG4gICAgXCJyYW5rXCIsXG4gICAgXCJyZWdyX2F2Z3hcIixcbiAgICBcInJlZ3JfYXZneVwiLFxuICAgIFwicmVncl9jb3VudFwiLFxuICAgIFwicmVncl9pbnRlcmNlcHRcIixcbiAgICBcInJlZ3JfcjJcIixcbiAgICBcInJlZ3Jfc2xvcGVcIixcbiAgICBcInJlZ3Jfc3h4XCIsXG4gICAgXCJyZWdyX3N4eVwiLFxuICAgIFwicmVncl9zeXlcIixcbiAgICBcInJvd19udW1iZXJcIixcbiAgICBcInNpblwiLFxuICAgIFwic2luaFwiLFxuICAgIFwic3FydFwiLFxuICAgIFwic3RkZGV2X3BvcFwiLFxuICAgIFwic3RkZGV2X3NhbXBcIixcbiAgICBcInN1YnN0cmluZ1wiLFxuICAgIFwic3Vic3RyaW5nX3JlZ2V4XCIsXG4gICAgXCJzdW1cIixcbiAgICBcInRhblwiLFxuICAgIFwidGFuaFwiLFxuICAgIFwidHJhbnNsYXRlXCIsXG4gICAgXCJ0cmFuc2xhdGVfcmVnZXhcIixcbiAgICBcInRyZWF0XCIsXG4gICAgXCJ0cmltXCIsXG4gICAgXCJ0cmltX2FycmF5XCIsXG4gICAgXCJ1bm5lc3RcIixcbiAgICBcInVwcGVyXCIsXG4gICAgXCJ2YWx1ZV9vZlwiLFxuICAgIFwidmFyX3BvcFwiLFxuICAgIFwidmFyX3NhbXBcIixcbiAgICBcIndpZHRoX2J1Y2tldFwiLFxuICBdO1xuXG4gIC8vIHRoZXNlIGZ1bmN0aW9ucyBjYW5cbiAgY29uc3QgUE9TU0lCTEVfV0lUSE9VVF9QQVJFTlMgPSBbXG4gICAgXCJjdXJyZW50X2NhdGFsb2dcIixcbiAgICBcImN1cnJlbnRfZGF0ZVwiLFxuICAgIFwiY3VycmVudF9kZWZhdWx0X3RyYW5zZm9ybV9ncm91cFwiLFxuICAgIFwiY3VycmVudF9wYXRoXCIsXG4gICAgXCJjdXJyZW50X3JvbGVcIixcbiAgICBcImN1cnJlbnRfc2NoZW1hXCIsXG4gICAgXCJjdXJyZW50X3RyYW5zZm9ybV9ncm91cF9mb3JfdHlwZVwiLFxuICAgIFwiY3VycmVudF91c2VyXCIsXG4gICAgXCJzZXNzaW9uX3VzZXJcIixcbiAgICBcInN5c3RlbV90aW1lXCIsXG4gICAgXCJzeXN0ZW1fdXNlclwiLFxuICAgIFwiY3VycmVudF90aW1lXCIsXG4gICAgXCJsb2NhbHRpbWVcIixcbiAgICBcImN1cnJlbnRfdGltZXN0YW1wXCIsXG4gICAgXCJsb2NhbHRpbWVzdGFtcFwiXG4gIF07XG5cbiAgLy8gdGhvc2UgZXhpc3QgdG8gYm9vc3QgcmVsZXZhbmNlIG1ha2luZyB0aGVzZSB2ZXJ5XG4gIC8vIFwiU1FMIGxpa2VcIiBrZXl3b3JkIGNvbWJvcyB3b3J0aCArMSBleHRyYSByZWxldmFuY2VcbiAgY29uc3QgQ09NQk9TID0gW1xuICAgIFwiY3JlYXRlIHRhYmxlXCIsXG4gICAgXCJpbnNlcnQgaW50b1wiLFxuICAgIFwicHJpbWFyeSBrZXlcIixcbiAgICBcImZvcmVpZ24ga2V5XCIsXG4gICAgXCJub3QgbnVsbFwiLFxuICAgIFwiYWx0ZXIgdGFibGVcIixcbiAgICBcImFkZCBjb25zdHJhaW50XCIsXG4gICAgXCJncm91cGluZyBzZXRzXCIsXG4gICAgXCJvbiBvdmVyZmxvd1wiLFxuICAgIFwiY2hhcmFjdGVyIHNldFwiLFxuICAgIFwicmVzcGVjdCBudWxsc1wiLFxuICAgIFwiaWdub3JlIG51bGxzXCIsXG4gICAgXCJudWxscyBmaXJzdFwiLFxuICAgIFwibnVsbHMgbGFzdFwiLFxuICAgIFwiZGVwdGggZmlyc3RcIixcbiAgICBcImJyZWFkdGggZmlyc3RcIlxuICBdO1xuXG4gIGNvbnN0IEZVTkNUSU9OUyA9IFJFU0VSVkVEX0ZVTkNUSU9OUztcblxuICBjb25zdCBLRVlXT1JEUyA9IFtcbiAgICAuLi5SRVNFUlZFRF9XT1JEUyxcbiAgICAuLi5OT05fUkVTRVJWRURfV09SRFNcbiAgXS5maWx0ZXIoKGtleXdvcmQpID0+IHtcbiAgICByZXR1cm4gIVJFU0VSVkVEX0ZVTkNUSU9OUy5pbmNsdWRlcyhrZXl3b3JkKTtcbiAgfSk7XG5cbiAgY29uc3QgVkFSSUFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiBcInZhcmlhYmxlXCIsXG4gICAgYmVnaW46IC9AW2EtejAtOV1bYS16MC05X10qLyxcbiAgfTtcblxuICBjb25zdCBPUEVSQVRPUiA9IHtcbiAgICBjbGFzc05hbWU6IFwib3BlcmF0b3JcIixcbiAgICBiZWdpbjogL1stKyovPSVefl18JiY/fFxcfFxcfD98IT0/fDwoPzo9Pj98PHw+KT98Pls+PV0/LyxcbiAgICByZWxldmFuY2U6IDAsXG4gIH07XG5cbiAgY29uc3QgRlVOQ1RJT05fQ0FMTCA9IHtcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KC9cXGIvLCByZWdleC5laXRoZXIoLi4uRlVOQ1RJT05TKSwgL1xccypcXCgvKSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAga2V5d29yZHM6IHsgYnVpbHRfaW46IEZVTkNUSU9OUyB9XG4gIH07XG5cbiAgLy8ga2V5d29yZHMgd2l0aCBsZXNzIHRoYW4gMyBsZXR0ZXJzIGFyZSByZWR1Y2VkIGluIHJlbGV2YW5jeVxuICBmdW5jdGlvbiByZWR1Y2VSZWxldmFuY3kobGlzdCwge1xuICAgIGV4Y2VwdGlvbnMsIHdoZW5cbiAgfSA9IHt9KSB7XG4gICAgY29uc3QgcXVhbGlmeUZuID0gd2hlbjtcbiAgICBleGNlcHRpb25zID0gZXhjZXB0aW9ucyB8fCBbXTtcbiAgICByZXR1cm4gbGlzdC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLm1hdGNoKC9cXHxcXGQrJC8pIHx8IGV4Y2VwdGlvbnMuaW5jbHVkZXMoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2UgaWYgKHF1YWxpZnlGbihpdGVtKSkge1xuICAgICAgICByZXR1cm4gYCR7aXRlbX18MGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1NRTCcsXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIHt9IG9yIEhUTUwgdGFncyBgPC9gXG4gICAgaWxsZWdhbDogL1t7fV18PFxcLy8sXG4gICAga2V5d29yZHM6IHtcbiAgICAgICRwYXR0ZXJuOiAvXFxiW1xcd1xcLl0rLyxcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIHJlZHVjZVJlbGV2YW5jeShLRVlXT1JEUywgeyB3aGVuOiAoeCkgPT4geC5sZW5ndGggPCAzIH0pLFxuICAgICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgICB0eXBlOiBUWVBFUyxcbiAgICAgIGJ1aWx0X2luOiBQT1NTSUJMRV9XSVRIT1VUX1BBUkVOU1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IHJlZ2V4LmVpdGhlciguLi5DT01CT1MpLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGtleXdvcmRzOiB7XG4gICAgICAgICAgJHBhdHRlcm46IC9bXFx3XFwuXSsvLFxuICAgICAgICAgIGtleXdvcmQ6IEtFWVdPUkRTLmNvbmNhdChDT01CT1MpLFxuICAgICAgICAgIGxpdGVyYWw6IExJVEVSQUxTLFxuICAgICAgICAgIHR5cGU6IFRZUEVTXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6IFwidHlwZVwiLFxuICAgICAgICBiZWdpbjogcmVnZXguZWl0aGVyKC4uLk1VTFRJX1dPUkRfVFlQRVMpXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fQ0FMTCxcbiAgICAgIFZBUklBQkxFLFxuICAgICAgU1RSSU5HLFxuICAgICAgUVVPVEVEX0lERU5USUZJRVIsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgQ09NTUVOVF9NT0RFLFxuICAgICAgT1BFUkFUT1JcbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHNxbCBhcyBkZWZhdWx0IH07XG4iLCAiY29uc3QgSURFTlRfUkUgPSAnW0EtWmEteiRfXVswLTlBLVphLXokX10qJztcbmNvbnN0IEtFWVdPUkRTID0gW1xuICBcImFzXCIsIC8vIGZvciBleHBvcnRzXG4gIFwiaW5cIixcbiAgXCJvZlwiLFxuICBcImlmXCIsXG4gIFwiZm9yXCIsXG4gIFwid2hpbGVcIixcbiAgXCJmaW5hbGx5XCIsXG4gIFwidmFyXCIsXG4gIFwibmV3XCIsXG4gIFwiZnVuY3Rpb25cIixcbiAgXCJkb1wiLFxuICBcInJldHVyblwiLFxuICBcInZvaWRcIixcbiAgXCJlbHNlXCIsXG4gIFwiYnJlYWtcIixcbiAgXCJjYXRjaFwiLFxuICBcImluc3RhbmNlb2ZcIixcbiAgXCJ3aXRoXCIsXG4gIFwidGhyb3dcIixcbiAgXCJjYXNlXCIsXG4gIFwiZGVmYXVsdFwiLFxuICBcInRyeVwiLFxuICBcInN3aXRjaFwiLFxuICBcImNvbnRpbnVlXCIsXG4gIFwidHlwZW9mXCIsXG4gIFwiZGVsZXRlXCIsXG4gIFwibGV0XCIsXG4gIFwieWllbGRcIixcbiAgXCJjb25zdFwiLFxuICBcImNsYXNzXCIsXG4gIC8vIEpTIGhhbmRsZXMgdGhlc2Ugd2l0aCBhIHNwZWNpYWwgcnVsZVxuICAvLyBcImdldFwiLFxuICAvLyBcInNldFwiLFxuICBcImRlYnVnZ2VyXCIsXG4gIFwiYXN5bmNcIixcbiAgXCJhd2FpdFwiLFxuICBcInN0YXRpY1wiLFxuICBcImltcG9ydFwiLFxuICBcImZyb21cIixcbiAgXCJleHBvcnRcIixcbiAgXCJleHRlbmRzXCJcbl07XG5jb25zdCBMSVRFUkFMUyA9IFtcbiAgXCJ0cnVlXCIsXG4gIFwiZmFsc2VcIixcbiAgXCJudWxsXCIsXG4gIFwidW5kZWZpbmVkXCIsXG4gIFwiTmFOXCIsXG4gIFwiSW5maW5pdHlcIlxuXTtcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHNcbmNvbnN0IFRZUEVTID0gW1xuICAvLyBGdW5kYW1lbnRhbCBvYmplY3RzXG4gIFwiT2JqZWN0XCIsXG4gIFwiRnVuY3Rpb25cIixcbiAgXCJCb29sZWFuXCIsXG4gIFwiU3ltYm9sXCIsXG4gIC8vIG51bWJlcnMgYW5kIGRhdGVzXG4gIFwiTWF0aFwiLFxuICBcIkRhdGVcIixcbiAgXCJOdW1iZXJcIixcbiAgXCJCaWdJbnRcIixcbiAgLy8gdGV4dFxuICBcIlN0cmluZ1wiLFxuICBcIlJlZ0V4cFwiLFxuICAvLyBJbmRleGVkIGNvbGxlY3Rpb25zXG4gIFwiQXJyYXlcIixcbiAgXCJGbG9hdDMyQXJyYXlcIixcbiAgXCJGbG9hdDY0QXJyYXlcIixcbiAgXCJJbnQ4QXJyYXlcIixcbiAgXCJVaW50OEFycmF5XCIsXG4gIFwiVWludDhDbGFtcGVkQXJyYXlcIixcbiAgXCJJbnQxNkFycmF5XCIsXG4gIFwiSW50MzJBcnJheVwiLFxuICBcIlVpbnQxNkFycmF5XCIsXG4gIFwiVWludDMyQXJyYXlcIixcbiAgXCJCaWdJbnQ2NEFycmF5XCIsXG4gIFwiQmlnVWludDY0QXJyYXlcIixcbiAgLy8gS2V5ZWQgY29sbGVjdGlvbnNcbiAgXCJTZXRcIixcbiAgXCJNYXBcIixcbiAgXCJXZWFrU2V0XCIsXG4gIFwiV2Vha01hcFwiLFxuICAvLyBTdHJ1Y3R1cmVkIGRhdGFcbiAgXCJBcnJheUJ1ZmZlclwiLFxuICBcIlNoYXJlZEFycmF5QnVmZmVyXCIsXG4gIFwiQXRvbWljc1wiLFxuICBcIkRhdGFWaWV3XCIsXG4gIFwiSlNPTlwiLFxuICAvLyBDb250cm9sIGFic3RyYWN0aW9uIG9iamVjdHNcbiAgXCJQcm9taXNlXCIsXG4gIFwiR2VuZXJhdG9yXCIsXG4gIFwiR2VuZXJhdG9yRnVuY3Rpb25cIixcbiAgXCJBc3luY0Z1bmN0aW9uXCIsXG4gIC8vIFJlZmxlY3Rpb25cbiAgXCJSZWZsZWN0XCIsXG4gIFwiUHJveHlcIixcbiAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cbiAgXCJJbnRsXCIsXG4gIC8vIFdlYkFzc2VtYmx5XG4gIFwiV2ViQXNzZW1ibHlcIlxuXTtcblxuY29uc3QgRVJST1JfVFlQRVMgPSBbXG4gIFwiRXJyb3JcIixcbiAgXCJFdmFsRXJyb3JcIixcbiAgXCJJbnRlcm5hbEVycm9yXCIsXG4gIFwiUmFuZ2VFcnJvclwiLFxuICBcIlJlZmVyZW5jZUVycm9yXCIsXG4gIFwiU3ludGF4RXJyb3JcIixcbiAgXCJUeXBlRXJyb3JcIixcbiAgXCJVUklFcnJvclwiXG5dO1xuXG5jb25zdCBCVUlMVF9JTl9HTE9CQUxTID0gW1xuICBcInNldEludGVydmFsXCIsXG4gIFwic2V0VGltZW91dFwiLFxuICBcImNsZWFySW50ZXJ2YWxcIixcbiAgXCJjbGVhclRpbWVvdXRcIixcblxuICBcInJlcXVpcmVcIixcbiAgXCJleHBvcnRzXCIsXG5cbiAgXCJldmFsXCIsXG4gIFwiaXNGaW5pdGVcIixcbiAgXCJpc05hTlwiLFxuICBcInBhcnNlRmxvYXRcIixcbiAgXCJwYXJzZUludFwiLFxuICBcImRlY29kZVVSSVwiLFxuICBcImRlY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVuY29kZVVSSVwiLFxuICBcImVuY29kZVVSSUNvbXBvbmVudFwiLFxuICBcImVzY2FwZVwiLFxuICBcInVuZXNjYXBlXCJcbl07XG5cbmNvbnN0IEJVSUxUX0lOX1ZBUklBQkxFUyA9IFtcbiAgXCJhcmd1bWVudHNcIixcbiAgXCJ0aGlzXCIsXG4gIFwic3VwZXJcIixcbiAgXCJjb25zb2xlXCIsXG4gIFwid2luZG93XCIsXG4gIFwiZG9jdW1lbnRcIixcbiAgXCJsb2NhbFN0b3JhZ2VcIixcbiAgXCJzZXNzaW9uU3RvcmFnZVwiLFxuICBcIm1vZHVsZVwiLFxuICBcImdsb2JhbFwiIC8vIE5vZGUuanNcbl07XG5cbmNvbnN0IEJVSUxUX0lOUyA9IFtdLmNvbmNhdChcbiAgQlVJTFRfSU5fR0xPQkFMUyxcbiAgVFlQRVMsXG4gIEVSUk9SX1RZUEVTXG4pO1xuXG4vKlxuTGFuZ3VhZ2U6IEphdmFTY3JpcHRcbkRlc2NyaXB0aW9uOiBKYXZhU2NyaXB0IChKUykgaXMgYSBsaWdodHdlaWdodCwgaW50ZXJwcmV0ZWQsIG9yIGp1c3QtaW4tdGltZSBjb21waWxlZCBwcm9ncmFtbWluZyBsYW5ndWFnZSB3aXRoIGZpcnN0LWNsYXNzIGZ1bmN0aW9ucy5cbkNhdGVnb3J5OiBjb21tb24sIHNjcmlwdGluZywgd2ViXG5XZWJzaXRlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0XG4qL1xuXG5cbi8qKiBAdHlwZSBMYW5ndWFnZUZuICovXG5mdW5jdGlvbiBqYXZhc2NyaXB0KGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICAvKipcbiAgICogVGFrZXMgYSBzdHJpbmcgbGlrZSBcIjxCb29nZXJcIiBhbmQgY2hlY2tzIHRvIHNlZVxuICAgKiBpZiB3ZSBjYW4gZmluZCBhIG1hdGNoaW5nIFwiPC9Cb29nZXJcIiBsYXRlciBpbiB0aGVcbiAgICogY29udGVudC5cbiAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaFxuICAgKiBAcGFyYW0ge3thZnRlcjpudW1iZXJ9fSBwYXJhbTFcbiAgICovXG4gIGNvbnN0IGhhc0Nsb3NpbmdUYWcgPSAobWF0Y2gsIHsgYWZ0ZXIgfSkgPT4ge1xuICAgIGNvbnN0IHRhZyA9IFwiPC9cIiArIG1hdGNoWzBdLnNsaWNlKDEpO1xuICAgIGNvbnN0IHBvcyA9IG1hdGNoLmlucHV0LmluZGV4T2YodGFnLCBhZnRlcik7XG4gICAgcmV0dXJuIHBvcyAhPT0gLTE7XG4gIH07XG5cbiAgY29uc3QgSURFTlRfUkUkMSA9IElERU5UX1JFO1xuICBjb25zdCBGUkFHTUVOVCA9IHtcbiAgICBiZWdpbjogJzw+JyxcbiAgICBlbmQ6ICc8Lz4nXG4gIH07XG4gIC8vIHRvIGF2b2lkIHNvbWUgc3BlY2lhbCBjYXNlcyBpbnNpZGUgaXNUcnVseU9wZW5pbmdUYWdcbiAgY29uc3QgWE1MX1NFTEZfQ0xPU0lORyA9IC88W0EtWmEtejAtOVxcXFwuXzotXStcXHMqXFwvPi87XG4gIGNvbnN0IFhNTF9UQUcgPSB7XG4gICAgYmVnaW46IC88W0EtWmEtejAtOVxcXFwuXzotXSsvLFxuICAgIGVuZDogL1xcL1tBLVphLXowLTlcXFxcLl86LV0rPnxcXC8+LyxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gICAgICogQHBhcmFtIHtDYWxsYmFja1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqL1xuICAgIGlzVHJ1bHlPcGVuaW5nVGFnOiAobWF0Y2gsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBhZnRlck1hdGNoSW5kZXggPSBtYXRjaFswXS5sZW5ndGggKyBtYXRjaC5pbmRleDtcbiAgICAgIGNvbnN0IG5leHRDaGFyID0gbWF0Y2guaW5wdXRbYWZ0ZXJNYXRjaEluZGV4XTtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gSFRNTCBzaG91bGQgbm90IGluY2x1ZGUgYW5vdGhlciByYXcgYDxgIGluc2lkZSBhIHRhZ1xuICAgICAgICAvLyBuZXN0ZWQgdHlwZT9cbiAgICAgICAgLy8gYDxBcnJheTxBcnJheTxudW1iZXI+PmAsIGV0Yy5cbiAgICAgICAgbmV4dENoYXIgPT09IFwiPFwiIHx8XG4gICAgICAgIC8vIHRoZSAsIGdpdmVzIGF3YXkgdGhhdCB0aGlzIGlzIG5vdCBIVE1MXG4gICAgICAgIC8vIGA8VCwgQSBleHRlbmRzIGtleW9mIFQsIFY+YFxuICAgICAgICBuZXh0Q2hhciA9PT0gXCIsXCJcbiAgICAgICAgKSB7XG4gICAgICAgIHJlc3BvbnNlLmlnbm9yZU1hdGNoKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYDxzb21ldGhpbmc+YFxuICAgICAgLy8gUXVpdGUgcG9zc2libHkgYSB0YWcsIGxldHMgbG9vayBmb3IgYSBtYXRjaGluZyBjbG9zaW5nIHRhZy4uLlxuICAgICAgaWYgKG5leHRDaGFyID09PSBcIj5cIikge1xuICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCBhIG1hdGNoaW5nIGNsb3NpbmcgdGFnLCB0aGVuIHdlXG4gICAgICAgIC8vIHdpbGwgaWdub3JlIGl0XG4gICAgICAgIGlmICghaGFzQ2xvc2luZ1RhZyhtYXRjaCwgeyBhZnRlcjogYWZ0ZXJNYXRjaEluZGV4IH0pKSB7XG4gICAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBgPGJsYWggLz5gIChzZWxmLWNsb3NpbmcpXG4gICAgICAvLyBoYW5kbGVkIGJ5IHNpbXBsZVNlbGZDbG9zaW5nIHJ1bGVcblxuICAgICAgbGV0IG07XG4gICAgICBjb25zdCBhZnRlck1hdGNoID0gbWF0Y2guaW5wdXQuc3Vic3RyaW5nKGFmdGVyTWF0Y2hJbmRleCk7XG5cbiAgICAgIC8vIHNvbWUgbW9yZSB0ZW1wbGF0ZSB0eXBpbmcgc3R1ZmZcbiAgICAgIC8vICA8VCA9IGFueT4oa2V5Pzogc3RyaW5nKSA9PiBNb2RpZnk8XG4gICAgICBpZiAoKG0gPSBhZnRlck1hdGNoLm1hdGNoKC9eXFxzKj0vKSkpIHtcbiAgICAgICAgcmVzcG9uc2UuaWdub3JlTWF0Y2goKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBgPEZyb20gZXh0ZW5kcyBzdHJpbmc+YFxuICAgICAgLy8gdGVjaG5pY2FsbHkgdGhpcyBjb3VsZCBiZSBIVE1MLCBidXQgaXQgc21lbGxzIGxpa2UgYSB0eXBlXG4gICAgICAvLyBOT1RFOiBUaGlzIGlzIHVnaCwgYnV0IGFkZGVkIHNwZWNpZmljYWxseSBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMzI3NlxuICAgICAgaWYgKChtID0gYWZ0ZXJNYXRjaC5tYXRjaCgvXlxccytleHRlbmRzXFxzKy8pKSkge1xuICAgICAgICBpZiAobS5pbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmlnbm9yZU1hdGNoKCk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtcmV0dXJuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBLRVlXT1JEUyQxID0ge1xuICAgICRwYXR0ZXJuOiBJREVOVF9SRSxcbiAgICBrZXl3b3JkOiBLRVlXT1JEUyxcbiAgICBsaXRlcmFsOiBMSVRFUkFMUyxcbiAgICBidWlsdF9pbjogQlVJTFRfSU5TLFxuICAgIFwidmFyaWFibGUubGFuZ3VhZ2VcIjogQlVJTFRfSU5fVkFSSUFCTEVTXG4gIH07XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1saXRlcmFscy1udW1lcmljLWxpdGVyYWxzXG4gIGNvbnN0IGRlY2ltYWxEaWdpdHMgPSAnWzAtOV0oXz9bMC05XSkqJztcbiAgY29uc3QgZnJhYyA9IGBcXFxcLigke2RlY2ltYWxEaWdpdHN9KWA7XG4gIC8vIERlY2ltYWxJbnRlZ2VyTGl0ZXJhbCwgaW5jbHVkaW5nIEFubmV4IEIgTm9uT2N0YWxEZWNpbWFsSW50ZWdlckxpdGVyYWxcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hZGRpdGlvbmFsLXN5bnRheC1udW1lcmljLWxpdGVyYWxzXG4gIGNvbnN0IGRlY2ltYWxJbnRlZ2VyID0gYDB8WzEtOV0oXz9bMC05XSkqfDBbMC03XSpbODldWzAtOV0qYDtcbiAgY29uc3QgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIC8vIERlY2ltYWxMaXRlcmFsXG4gICAgICB7IGJlZ2luOiBgKFxcXFxiKCR7ZGVjaW1hbEludGVnZXJ9KSgoJHtmcmFjfSl8XFxcXC4pP3woJHtmcmFjfSkpYCArXG4gICAgICAgIGBbZUVdWystXT8oJHtkZWNpbWFsRGlnaXRzfSlcXFxcYmAgfSxcbiAgICAgIHsgYmVnaW46IGBcXFxcYigke2RlY2ltYWxJbnRlZ2VyfSlcXFxcYigoJHtmcmFjfSlcXFxcYnxcXFxcLik/fCgke2ZyYWN9KVxcXFxiYCB9LFxuXG4gICAgICAvLyBEZWNpbWFsQmlnSW50ZWdlckxpdGVyYWxcbiAgICAgIHsgYmVnaW46IGBcXFxcYigwfFsxLTldKF8/WzAtOV0pKiluXFxcXGJgIH0sXG5cbiAgICAgIC8vIE5vbkRlY2ltYWxJbnRlZ2VyTGl0ZXJhbFxuICAgICAgeyBiZWdpbjogXCJcXFxcYjBbeFhdWzAtOWEtZkEtRl0oXz9bMC05YS1mQS1GXSkqbj9cXFxcYlwiIH0sXG4gICAgICB7IGJlZ2luOiBcIlxcXFxiMFtiQl1bMC0xXShfP1swLTFdKSpuP1xcXFxiXCIgfSxcbiAgICAgIHsgYmVnaW46IFwiXFxcXGIwW29PXVswLTddKF8/WzAtN10pKm4/XFxcXGJcIiB9LFxuXG4gICAgICAvLyBMZWdhY3lPY3RhbEludGVnZXJMaXRlcmFsIChkb2VzIG5vdCBpbmNsdWRlIHVuZGVyc2NvcmUgc2VwYXJhdG9ycylcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYWRkaXRpb25hbC1zeW50YXgtbnVtZXJpYy1saXRlcmFsc1xuICAgICAgeyBiZWdpbjogXCJcXFxcYjBbMC03XStuP1xcXFxiXCIgfSxcbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJ1xcXFwkXFxcXHsnLFxuICAgIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMSxcbiAgICBjb250YWluczogW10gLy8gZGVmaW5lZCBsYXRlclxuICB9O1xuICBjb25zdCBIVE1MX1RFTVBMQVRFID0ge1xuICAgIGJlZ2luOiAnaHRtbGAnLFxuICAgIGVuZDogJycsXG4gICAgc3RhcnRzOiB7XG4gICAgICBlbmQ6ICdgJyxcbiAgICAgIHJldHVybkVuZDogZmFsc2UsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIFNVQlNUXG4gICAgICBdLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnXG4gICAgfVxuICB9O1xuICBjb25zdCBDU1NfVEVNUExBVEUgPSB7XG4gICAgYmVnaW46ICdjc3NgJyxcbiAgICBlbmQ6ICcnLFxuICAgIHN0YXJ0czoge1xuICAgICAgZW5kOiAnYCcsXG4gICAgICByZXR1cm5FbmQ6IGZhbHNlLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgICBTVUJTVFxuICAgICAgXSxcbiAgICAgIHN1Ykxhbmd1YWdlOiAnY3NzJ1xuICAgIH1cbiAgfTtcbiAgY29uc3QgR1JBUEhRTF9URU1QTEFURSA9IHtcbiAgICBiZWdpbjogJ2dxbGAnLFxuICAgIGVuZDogJycsXG4gICAgc3RhcnRzOiB7XG4gICAgICBlbmQ6ICdgJyxcbiAgICAgIHJldHVybkVuZDogZmFsc2UsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgIFNVQlNUXG4gICAgICBdLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICdncmFwaHFsJ1xuICAgIH1cbiAgfTtcbiAgY29uc3QgVEVNUExBVEVfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdgJyxcbiAgICBlbmQ6ICdgJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgU1VCU1RcbiAgICBdXG4gIH07XG4gIGNvbnN0IEpTRE9DX0NPTU1FTlQgPSBobGpzLkNPTU1FTlQoXG4gICAgL1xcL1xcKlxcKig/IVxcLykvLFxuICAgICdcXFxcKi8nLFxuICAgIHtcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBiZWdpbjogJyg/PUBbQS1aYS16XSspJyxcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgICAgICAgIGJlZ2luOiAnXFxcXHsnLFxuICAgICAgICAgICAgICBlbmQ6ICdcXFxcfScsXG4gICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgICAgICAgIGJlZ2luOiBJREVOVF9SRSQxICsgJyg/PVxcXFxzKigtKXwkKScsXG4gICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGVhdCBzcGFjZXMgKG5vdCBuZXdsaW5lcykgc28gd2UgY2FuIGZpbmRcbiAgICAgICAgICAgIC8vIHR5cGVzIG9yIHZhcmlhYmxlc1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBiZWdpbjogLyg/PVteXFxuXSlcXHMvLFxuICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gICk7XG4gIGNvbnN0IENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiBcImNvbW1lbnRcIixcbiAgICB2YXJpYW50czogW1xuICAgICAgSlNET0NfQ09NTUVOVCxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREVcbiAgICBdXG4gIH07XG4gIGNvbnN0IFNVQlNUX0lOVEVSTkFMUyA9IFtcbiAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBIVE1MX1RFTVBMQVRFLFxuICAgIENTU19URU1QTEFURSxcbiAgICBHUkFQSFFMX1RFTVBMQVRFLFxuICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICAvLyBTa2lwIG51bWJlcnMgd2hlbiB0aGV5IGFyZSBwYXJ0IG9mIGEgdmFyaWFibGUgbmFtZVxuICAgIHsgbWF0Y2g6IC9cXCRcXGQrLyB9LFxuICAgIE5VTUJFUixcbiAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsOlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8zMjg4XG4gICAgLy8gaGxqcy5SRUdFWFBfTU9ERVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IFNVQlNUX0lOVEVSTkFMU1xuICAgIC5jb25jYXQoe1xuICAgICAgLy8gd2UgbmVlZCB0byBwYWlyIHVwIHt9IGluc2lkZSBvdXIgc3Vic3QgdG8gcHJldmVudFxuICAgICAgLy8gaXQgZnJvbSBlbmRpbmcgdG9vIGVhcmx5IGJ5IG1hdGNoaW5nIGFub3RoZXIgfVxuICAgICAgYmVnaW46IC9cXHsvLFxuICAgICAgZW5kOiAvXFx9LyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgXCJzZWxmXCJcbiAgICAgIF0uY29uY2F0KFNVQlNUX0lOVEVSTkFMUylcbiAgICB9KTtcbiAgY29uc3QgU1VCU1RfQU5EX0NPTU1FTlRTID0gW10uY29uY2F0KENPTU1FTlQsIFNVQlNULmNvbnRhaW5zKTtcbiAgY29uc3QgUEFSQU1TX0NPTlRBSU5TID0gU1VCU1RfQU5EX0NPTU1FTlRTLmNvbmNhdChbXG4gICAgLy8gZWF0IHJlY3Vyc2l2ZSBwYXJlbnMgaW4gc3ViIGV4cHJlc3Npb25zXG4gICAge1xuICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgZW5kOiAvXFwpLyxcbiAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgY29udGFpbnM6IFtcInNlbGZcIl0uY29uY2F0KFNVQlNUX0FORF9DT01NRU5UUylcbiAgICB9XG4gIF0pO1xuICBjb25zdCBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogL1xcKC8sXG4gICAgZW5kOiAvXFwpLyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMkMSxcbiAgICBjb250YWluczogUEFSQU1TX0NPTlRBSU5TXG4gIH07XG5cbiAgLy8gRVM2IGNsYXNzZXNcbiAgY29uc3QgQ0xBU1NfT1JfRVhURU5EUyA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAgLy8gY2xhc3MgQ2FyIGV4dGVuZHMgdmVoaWNsZVxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC9leHRlbmRzLyxcbiAgICAgICAgICAvXFxzKy8sXG4gICAgICAgICAgcmVnZXguY29uY2F0KElERU5UX1JFJDEsIFwiKFwiLCByZWdleC5jb25jYXQoL1xcLi8sIElERU5UX1JFJDEpLCBcIikqXCIpXG4gICAgICAgIF0sXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgMzogXCJ0aXRsZS5jbGFzc1wiLFxuICAgICAgICAgIDU6IFwia2V5d29yZFwiLFxuICAgICAgICAgIDc6IFwidGl0bGUuY2xhc3MuaW5oZXJpdGVkXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIGNsYXNzIENhclxuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9jbGFzcy8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDFcbiAgICAgICAgXSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgICAgICAzOiBcInRpdGxlLmNsYXNzXCJcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgIF1cbiAgfTtcblxuICBjb25zdCBDTEFTU19SRUZFUkVOQ0UgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIG1hdGNoOlxuICAgIHJlZ2V4LmVpdGhlcihcbiAgICAgIC8vIEhhcmQgY29kZWQgZXhjZXB0aW9uc1xuICAgICAgL1xcYkpTT04vLFxuICAgICAgLy8gRmxvYXQzMkFycmF5LCBPdXRUXG4gICAgICAvXFxiW0EtWl1bYS16XSsoW0EtWl1bYS16XSp8XFxkKSovLFxuICAgICAgLy8gQ1NTRmFjdG9yeSwgQ1NTRmFjdG9yeVRcbiAgICAgIC9cXGJbQS1aXXsyLH0oW0EtWl1bYS16XSt8XFxkKSsoW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBGUHMsIEZQc1RcbiAgICAgIC9cXGJbQS1aXXsyLH1bYS16XSsoW0EtWl1bYS16XSt8XFxkKSooW0EtWl1bYS16XSopKi8sXG4gICAgICAvLyBQXG4gICAgICAvLyBzaW5nbGUgbGV0dGVycyBhcmUgbm90IGhpZ2hsaWdodGVkXG4gICAgICAvLyBCTEFIXG4gICAgICAvLyB0aGlzIHdpbGwgYmUgZmxhZ2dlZCBhcyBhIFVQUEVSX0NBU0VfQ09OU1RBTlQgaW5zdGVhZFxuICAgICksXG4gICAgY2xhc3NOYW1lOiBcInRpdGxlLmNsYXNzXCIsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIF86IFtcbiAgICAgICAgLy8gc2Ugd2Ugc3RpbGwgZ2V0IHJlbGV2YW5jZSBjcmVkaXQgZm9yIEpTIGxpYnJhcnkgY2xhc3Nlc1xuICAgICAgICAuLi5UWVBFUyxcbiAgICAgICAgLi4uRVJST1JfVFlQRVNcbiAgICAgIF1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgVVNFX1NUUklDVCA9IHtcbiAgICBsYWJlbDogXCJ1c2Vfc3RyaWN0XCIsXG4gICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgcmVsZXZhbmNlOiAxMCxcbiAgICBiZWdpbjogL15cXHMqWydcIl11c2UgKHN0cmljdHxhc20pWydcIl0vXG4gIH07XG5cbiAgY29uc3QgRlVOQ1RJT05fREVGSU5JVElPTiA9IHtcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIC9mdW5jdGlvbi8sXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIElERU5UX1JFJDEsXG4gICAgICAgICAgLyg/PVxccypcXCgpL1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgL2Z1bmN0aW9uLyxcbiAgICAgICAgICAvXFxzKig/PVxcKCkvXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgMTogXCJrZXl3b3JkXCIsXG4gICAgICAzOiBcInRpdGxlLmZ1bmN0aW9uXCJcbiAgICB9LFxuICAgIGxhYmVsOiBcImZ1bmMuZGVmXCIsXG4gICAgY29udGFpbnM6IFsgUEFSQU1TIF0sXG4gICAgaWxsZWdhbDogLyUvXG4gIH07XG5cbiAgY29uc3QgVVBQRVJfQ0FTRV9DT05TVEFOVCA9IHtcbiAgICByZWxldmFuY2U6IDAsXG4gICAgbWF0Y2g6IC9cXGJbQS1aXVtBLVpfMC05XStcXGIvLFxuICAgIGNsYXNzTmFtZTogXCJ2YXJpYWJsZS5jb25zdGFudFwiXG4gIH07XG5cbiAgZnVuY3Rpb24gbm9uZU9mKGxpc3QpIHtcbiAgICByZXR1cm4gcmVnZXguY29uY2F0KFwiKD8hXCIsIGxpc3Quam9pbihcInxcIiksIFwiKVwiKTtcbiAgfVxuXG4gIGNvbnN0IEZVTkNUSU9OX0NBTEwgPSB7XG4gICAgbWF0Y2g6IHJlZ2V4LmNvbmNhdChcbiAgICAgIC9cXGIvLFxuICAgICAgbm9uZU9mKFtcbiAgICAgICAgLi4uQlVJTFRfSU5fR0xPQkFMUyxcbiAgICAgICAgXCJzdXBlclwiLFxuICAgICAgICBcImltcG9ydFwiXG4gICAgICBdKSxcbiAgICAgIElERU5UX1JFJDEsIHJlZ2V4Lmxvb2thaGVhZCgvXFwoLykpLFxuICAgIGNsYXNzTmFtZTogXCJ0aXRsZS5mdW5jdGlvblwiLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IFBST1BFUlRZX0FDQ0VTUyA9IHtcbiAgICBiZWdpbjogcmVnZXguY29uY2F0KC9cXC4vLCByZWdleC5sb29rYWhlYWQoXG4gICAgICByZWdleC5jb25jYXQoSURFTlRfUkUkMSwgLyg/IVswLTlBLVphLXokXyhdKS8pXG4gICAgKSksXG4gICAgZW5kOiBJREVOVF9SRSQxLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICBrZXl3b3JkczogXCJwcm90b3R5cGVcIixcbiAgICBjbGFzc05hbWU6IFwicHJvcGVydHlcIixcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICBjb25zdCBHRVRURVJfT1JfU0VUVEVSID0ge1xuICAgIG1hdGNoOiBbXG4gICAgICAvZ2V0fHNldC8sXG4gICAgICAvXFxzKy8sXG4gICAgICBJREVOVF9SRSQxLFxuICAgICAgLyg/PVxcKCkvXG4gICAgXSxcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIDE6IFwia2V5d29yZFwiLFxuICAgICAgMzogXCJ0aXRsZS5mdW5jdGlvblwiXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBlYXQgdG8gYXZvaWQgZW1wdHkgcGFyYW1zXG4gICAgICAgIGJlZ2luOiAvXFwoXFwpL1xuICAgICAgfSxcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICBjb25zdCBGVU5DX0xFQURfSU5fUkUgPSAnKFxcXFwoJyArXG4gICAgJ1teKCldKihcXFxcKCcgK1xuICAgICdbXigpXSooXFxcXCgnICtcbiAgICAnW14oKV0qJyArXG4gICAgJ1xcXFwpW14oKV0qKSonICtcbiAgICAnXFxcXClbXigpXSopKicgK1xuICAgICdcXFxcKXwnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJylcXFxccyo9Pic7XG5cbiAgY29uc3QgRlVOQ1RJT05fVkFSSUFCTEUgPSB7XG4gICAgbWF0Y2g6IFtcbiAgICAgIC9jb25zdHx2YXJ8bGV0LywgL1xccysvLFxuICAgICAgSURFTlRfUkUkMSwgL1xccyovLFxuICAgICAgLz1cXHMqLyxcbiAgICAgIC8oYXN5bmNcXHMqKT8vLCAvLyBhc3luYyBpcyBvcHRpb25hbFxuICAgICAgcmVnZXgubG9va2FoZWFkKEZVTkNfTEVBRF9JTl9SRSlcbiAgICBdLFxuICAgIGtleXdvcmRzOiBcImFzeW5jXCIsXG4gICAgY2xhc3NOYW1lOiB7XG4gICAgICAxOiBcImtleXdvcmRcIixcbiAgICAgIDM6IFwidGl0bGUuZnVuY3Rpb25cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdKYXZhU2NyaXB0JyxcbiAgICBhbGlhc2VzOiBbJ2pzJywgJ2pzeCcsICdtanMnLCAnY2pzJ10sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTJDEsXG4gICAgLy8gdGhpcyB3aWxsIGJlIGV4dGVuZGVkIGJ5IFR5cGVTY3JpcHRcbiAgICBleHBvcnRzOiB7IFBBUkFNU19DT05UQUlOUywgQ0xBU1NfUkVGRVJFTkNFIH0sXG4gICAgaWxsZWdhbDogLyMoPyFbJF9BLXpdKS8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuU0hFQkFORyh7XG4gICAgICAgIGxhYmVsOiBcInNoZWJhbmdcIixcbiAgICAgICAgYmluYXJ5OiBcIm5vZGVcIixcbiAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICB9KSxcbiAgICAgIFVTRV9TVFJJQ1QsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgSFRNTF9URU1QTEFURSxcbiAgICAgIENTU19URU1QTEFURSxcbiAgICAgIEdSQVBIUUxfVEVNUExBVEUsXG4gICAgICBURU1QTEFURV9TVFJJTkcsXG4gICAgICBDT01NRU5ULFxuICAgICAgLy8gU2tpcCBudW1iZXJzIHdoZW4gdGhleSBhcmUgcGFydCBvZiBhIHZhcmlhYmxlIG5hbWVcbiAgICAgIHsgbWF0Y2g6IC9cXCRcXGQrLyB9LFxuICAgICAgTlVNQkVSLFxuICAgICAgQ0xBU1NfUkVGRVJFTkNFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyJyxcbiAgICAgICAgYmVnaW46IElERU5UX1JFJDEgKyByZWdleC5sb29rYWhlYWQoJzonKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fVkFSSUFCTEUsXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgQ09NTUVOVCxcbiAgICAgICAgICBobGpzLlJFR0VYUF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gY291bnQgdGhlIHBhcmVucyB0byBtYWtlIHN1cmUgd2UgYWN0dWFsbHkgaGF2ZSB0aGVcbiAgICAgICAgICAgIC8vIGNvcnJlY3QgYm91bmRpbmcgKCApIGJlZm9yZSB0aGUgPT4uICBUaGVyZSBjb3VsZCBiZSBhbnkgbnVtYmVyIG9mXG4gICAgICAgICAgICAvLyBzdWItZXhwcmVzc2lvbnMgaW5zaWRlIGFsc28gc3Vycm91bmRlZCBieSBwYXJlbnMuXG4gICAgICAgICAgICBiZWdpbjogRlVOQ19MRUFEX0lOX1JFLFxuICAgICAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICBlbmQ6ICdcXFxccyo9PicsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXChcXHMqXFwpLyxcbiAgICAgICAgICAgICAgICAgICAgc2tpcDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXCgvLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyQxLFxuICAgICAgICAgICAgICAgICAgICBjb250YWluczogUEFSQU1TX0NPTlRBSU5TXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IC8vIGNvdWxkIGJlIGEgY29tbWEgZGVsaW1pdGVkIGxpc3Qgb2YgcGFyYW1zIHRvIGEgZnVuY3Rpb24gY2FsbFxuICAgICAgICAgICAgYmVnaW46IC8sLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWF0Y2g6IC9cXHMrLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyAvLyBKU1hcbiAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgIHsgYmVnaW46IEZSQUdNRU5ULmJlZ2luLCBlbmQ6IEZSQUdNRU5ULmVuZCB9LFxuICAgICAgICAgICAgICB7IG1hdGNoOiBYTUxfU0VMRl9DTE9TSU5HIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWdpbjogWE1MX1RBRy5iZWdpbixcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYXJlZnVsbHkgY2hlY2sgdGhlIG9wZW5pbmcgdGFnIHRvIHNlZSBpZiBpdCB0cnVseVxuICAgICAgICAgICAgICAgIC8vIGlzIGEgdGFnIGFuZCBub3QgYSBmYWxzZSBwb3NpdGl2ZVxuICAgICAgICAgICAgICAgICdvbjpiZWdpbic6IFhNTF9UQUcuaXNUcnVseU9wZW5pbmdUYWcsXG4gICAgICAgICAgICAgICAgZW5kOiBYTUxfVEFHLmVuZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZ2luOiBYTUxfVEFHLmJlZ2luLFxuICAgICAgICAgICAgICAgIGVuZDogWE1MX1RBRy5lbmQsXG4gICAgICAgICAgICAgICAgc2tpcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb250YWluczogWydzZWxmJ11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBGVU5DVElPTl9ERUZJTklUSU9OLFxuICAgICAge1xuICAgICAgICAvLyBwcmV2ZW50IHRoaXMgZnJvbSBnZXR0aW5nIHN3YWxsb3dlZCB1cCBieSBmdW5jdGlvblxuICAgICAgICAvLyBzaW5jZSB0aGV5IGFwcGVhciBcImZ1bmN0aW9uIGxpa2VcIlxuICAgICAgICBiZWdpbktleXdvcmRzOiBcIndoaWxlIGlmIHN3aXRjaCBjYXRjaCBmb3JcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBjb3VudCB0aGUgcGFyZW5zIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIHRoZSBjb3JyZWN0XG4gICAgICAgIC8vIGJvdW5kaW5nICggKS4gIFRoZXJlIGNvdWxkIGJlIGFueSBudW1iZXIgb2Ygc3ViLWV4cHJlc3Npb25zIGluc2lkZVxuICAgICAgICAvLyBhbHNvIHN1cnJvdW5kZWQgYnkgcGFyZW5zLlxuICAgICAgICBiZWdpbjogJ1xcXFxiKD8hZnVuY3Rpb24pJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSArXG4gICAgICAgICAgJ1xcXFwoJyArIC8vIGZpcnN0IHBhcmVuc1xuICAgICAgICAgICdbXigpXSooXFxcXCgnICtcbiAgICAgICAgICAgICdbXigpXSooXFxcXCgnICtcbiAgICAgICAgICAgICAgJ1teKCldKicgK1xuICAgICAgICAgICAgJ1xcXFwpW14oKV0qKSonICtcbiAgICAgICAgICAnXFxcXClbXigpXSopKicgK1xuICAgICAgICAgICdcXFxcKVxcXFxzKlxcXFx7JywgLy8gZW5kIHBhcmVuc1xuICAgICAgICByZXR1cm5CZWdpbjp0cnVlLFxuICAgICAgICBsYWJlbDogXCJmdW5jLmRlZlwiLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFBBUkFNUyxcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7IGJlZ2luOiBJREVOVF9SRSQxLCBjbGFzc05hbWU6IFwidGl0bGUuZnVuY3Rpb25cIiB9KVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gY2F0Y2ggLi4uIHNvIGl0IHdvbid0IHRyaWdnZXIgdGhlIHByb3BlcnR5IHJ1bGUgYmVsb3dcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IC9cXC5cXC5cXC4vLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBQUk9QRVJUWV9BQ0NFU1MsXG4gICAgICAvLyBoYWNrOiBwcmV2ZW50cyBkZXRlY3Rpb24gb2Yga2V5d29yZHMgaW4gc29tZSBjaXJjdW1zdGFuY2VzXG4gICAgICAvLyAua2V5d29yZCgpXG4gICAgICAvLyAka2V5d29yZCA9IHhcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6ICdcXFxcJCcgKyBJREVOVF9SRSQxLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG1hdGNoOiBbIC9cXGJjb25zdHJ1Y3Rvcig/PVxccypcXCgpLyBdLFxuICAgICAgICBjbGFzc05hbWU6IHsgMTogXCJ0aXRsZS5mdW5jdGlvblwiIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbIFBBUkFNUyBdXG4gICAgICB9LFxuICAgICAgRlVOQ1RJT05fQ0FMTCxcbiAgICAgIFVQUEVSX0NBU0VfQ09OU1RBTlQsXG4gICAgICBDTEFTU19PUl9FWFRFTkRTLFxuICAgICAgR0VUVEVSX09SX1NFVFRFUixcbiAgICAgIHtcbiAgICAgICAgbWF0Y2g6IC9cXCRbKC5dLyAvLyByZWxldmFuY2UgYm9vc3RlciBmb3IgYSBwYXR0ZXJuIGNvbW1vbiB0byBKUyBsaWJzOiBgJChzb21ldGhpbmcpYCBhbmQgYCQuc29tZXRoaW5nYFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuLypcbkxhbmd1YWdlOiBUeXBlU2NyaXB0XG5BdXRob3I6IFBhbnUgSG9yc21hbGFodGkgPHBhbnUuaG9yc21hbGFodGlAaWtpLmZpPlxuQ29udHJpYnV0b3JzOiBJa2UgS3UgPGRlbXBmaUB5YWhvby5jb20+XG5EZXNjcmlwdGlvbjogVHlwZVNjcmlwdCBpcyBhIHN0cmljdCBzdXBlcnNldCBvZiBKYXZhU2NyaXB0XG5XZWJzaXRlOiBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmdcbkNhdGVnb3J5OiBjb21tb24sIHNjcmlwdGluZ1xuKi9cblxuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gdHlwZXNjcmlwdChobGpzKSB7XG4gIGNvbnN0IHRzTGFuZ3VhZ2UgPSBqYXZhc2NyaXB0KGhsanMpO1xuXG4gIGNvbnN0IElERU5UX1JFJDEgPSBJREVOVF9SRTtcbiAgY29uc3QgVFlQRVMgPSBbXG4gICAgXCJhbnlcIixcbiAgICBcInZvaWRcIixcbiAgICBcIm51bWJlclwiLFxuICAgIFwiYm9vbGVhblwiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcIm5ldmVyXCIsXG4gICAgXCJzeW1ib2xcIixcbiAgICBcImJpZ2ludFwiLFxuICAgIFwidW5rbm93blwiXG4gIF07XG4gIGNvbnN0IE5BTUVTUEFDRSA9IHtcbiAgICBiZWdpbktleXdvcmRzOiAnbmFtZXNwYWNlJyxcbiAgICBlbmQ6IC9cXHsvLFxuICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgY29udGFpbnM6IFsgdHNMYW5ndWFnZS5leHBvcnRzLkNMQVNTX1JFRkVSRU5DRSBdXG4gIH07XG4gIGNvbnN0IElOVEVSRkFDRSA9IHtcbiAgICBiZWdpbktleXdvcmRzOiAnaW50ZXJmYWNlJyxcbiAgICBlbmQ6IC9cXHsvLFxuICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6ICdpbnRlcmZhY2UgZXh0ZW5kcycsXG4gICAgICBidWlsdF9pbjogVFlQRVNcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbIHRzTGFuZ3VhZ2UuZXhwb3J0cy5DTEFTU19SRUZFUkVOQ0UgXVxuICB9O1xuICBjb25zdCBVU0VfU1RSSUNUID0ge1xuICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgIHJlbGV2YW5jZTogMTAsXG4gICAgYmVnaW46IC9eXFxzKlsnXCJddXNlIHN0cmljdFsnXCJdL1xuICB9O1xuICBjb25zdCBUU19TUEVDSUZJQ19LRVlXT1JEUyA9IFtcbiAgICBcInR5cGVcIixcbiAgICBcIm5hbWVzcGFjZVwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwiaW1wbGVtZW50c1wiLFxuICAgIFwiZGVjbGFyZVwiLFxuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcInJlYWRvbmx5XCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJvdmVycmlkZVwiXG4gIF07XG4gIGNvbnN0IEtFWVdPUkRTJDEgPSB7XG4gICAgJHBhdHRlcm46IElERU5UX1JFLFxuICAgIGtleXdvcmQ6IEtFWVdPUkRTLmNvbmNhdChUU19TUEVDSUZJQ19LRVlXT1JEUyksXG4gICAgbGl0ZXJhbDogTElURVJBTFMsXG4gICAgYnVpbHRfaW46IEJVSUxUX0lOUy5jb25jYXQoVFlQRVMpLFxuICAgIFwidmFyaWFibGUubGFuZ3VhZ2VcIjogQlVJTFRfSU5fVkFSSUFCTEVTXG4gIH07XG4gIGNvbnN0IERFQ09SQVRPUiA9IHtcbiAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICBiZWdpbjogJ0AnICsgSURFTlRfUkUkMSxcbiAgfTtcblxuICBjb25zdCBzd2FwTW9kZSA9IChtb2RlLCBsYWJlbCwgcmVwbGFjZW1lbnQpID0+IHtcbiAgICBjb25zdCBpbmR4ID0gbW9kZS5jb250YWlucy5maW5kSW5kZXgobSA9PiBtLmxhYmVsID09PSBsYWJlbCk7XG4gICAgaWYgKGluZHggPT09IC0xKSB7IHRocm93IG5ldyBFcnJvcihcImNhbiBub3QgZmluZCBtb2RlIHRvIHJlcGxhY2VcIik7IH1cblxuICAgIG1vZGUuY29udGFpbnMuc3BsaWNlKGluZHgsIDEsIHJlcGxhY2VtZW50KTtcbiAgfTtcblxuXG4gIC8vIHRoaXMgc2hvdWxkIHVwZGF0ZSBhbnl3aGVyZSBrZXl3b3JkcyBpcyB1c2VkIHNpbmNlXG4gIC8vIGl0IHdpbGwgYmUgdGhlIHNhbWUgYWN0dWFsIEpTIG9iamVjdFxuICBPYmplY3QuYXNzaWduKHRzTGFuZ3VhZ2Uua2V5d29yZHMsIEtFWVdPUkRTJDEpO1xuXG4gIHRzTGFuZ3VhZ2UuZXhwb3J0cy5QQVJBTVNfQ09OVEFJTlMucHVzaChERUNPUkFUT1IpO1xuICB0c0xhbmd1YWdlLmNvbnRhaW5zID0gdHNMYW5ndWFnZS5jb250YWlucy5jb25jYXQoW1xuICAgIERFQ09SQVRPUixcbiAgICBOQU1FU1BBQ0UsXG4gICAgSU5URVJGQUNFLFxuICBdKTtcblxuICAvLyBUUyBnZXRzIGEgc2ltcGxlciBzaGViYW5nIHJ1bGUgdGhhbiBKU1xuICBzd2FwTW9kZSh0c0xhbmd1YWdlLCBcInNoZWJhbmdcIiwgaGxqcy5TSEVCQU5HKCkpO1xuICAvLyBKUyB1c2Ugc3RyaWN0IHJ1bGUgcHVycG9zZWx5IGV4Y2x1ZGVzIGBhc21gIHdoaWNoIG1ha2VzIG5vIHNlbnNlXG4gIHN3YXBNb2RlKHRzTGFuZ3VhZ2UsIFwidXNlX3N0cmljdFwiLCBVU0VfU1RSSUNUKTtcblxuICBjb25zdCBmdW5jdGlvbkRlY2xhcmF0aW9uID0gdHNMYW5ndWFnZS5jb250YWlucy5maW5kKG0gPT4gbS5sYWJlbCA9PT0gXCJmdW5jLmRlZlwiKTtcbiAgZnVuY3Rpb25EZWNsYXJhdGlvbi5yZWxldmFuY2UgPSAwOyAvLyAoKSA9PiB7fSBpcyBtb3JlIHR5cGljYWwgaW4gVHlwZVNjcmlwdFxuXG4gIE9iamVjdC5hc3NpZ24odHNMYW5ndWFnZSwge1xuICAgIG5hbWU6ICdUeXBlU2NyaXB0JyxcbiAgICBhbGlhc2VzOiBbXG4gICAgICAndHMnLFxuICAgICAgJ3RzeCcsXG4gICAgICAnbXRzJyxcbiAgICAgICdjdHMnXG4gICAgXVxuICB9KTtcblxuICByZXR1cm4gdHNMYW5ndWFnZTtcbn1cblxuZXhwb3J0IHsgdHlwZXNjcmlwdCBhcyBkZWZhdWx0IH07XG4iLCAiLypcbkxhbmd1YWdlOiBIVE1MLCBYTUxcbldlYnNpdGU6IGh0dHBzOi8vd3d3LnczLm9yZy9YTUwvXG5DYXRlZ29yeTogY29tbW9uLCB3ZWJcbkF1ZGl0OiAyMDIwXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24geG1sKGhsanMpIHtcbiAgY29uc3QgcmVnZXggPSBobGpzLnJlZ2V4O1xuICAvLyBYTUwgbmFtZXMgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBhZGRpdGlvbmFsIGxldHRlcnM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi94bWwvI05ULU5hbWVDaGFyXG4gIC8vIE9USEVSX05BTUVfQ0hBUlMgPSAvWzpcXC0uMC05XFx1MDBCN1xcdTAzMDAtXFx1MDM2RlxcdTIwM0YtXFx1MjA0MF0vO1xuICAvLyBFbGVtZW50IG5hbWVzIHN0YXJ0IHdpdGggTkFNRV9TVEFSVF9DSEFSIGZvbGxvd2VkIGJ5IG9wdGlvbmFsIG90aGVyIFVuaWNvZGUgbGV0dGVycywgQVNDSUkgZGlnaXRzLCBoeXBoZW5zLCB1bmRlcnNjb3JlcywgYW5kIHBlcmlvZHNcbiAgLy8gY29uc3QgVEFHX05BTUVfUkUgPSByZWdleC5jb25jYXQoL1tBLVpfYS16XFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXS8sIHJlZ2V4Lm9wdGlvbmFsKC9bQS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcLS4wLTlcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwXSo6LyksIC9bQS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcLS4wLTlcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwXSovKTs7XG4gIC8vIGNvbnN0IFhNTF9JREVOVF9SRSA9IC9bQS1aX2EtejpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRcXC0uMC05XFx1MDBCN1xcdTAzMDAtXFx1MDM2RlxcdTIwM0YtXFx1MjA0MF0rLztcbiAgLy8gY29uc3QgVEFHX05BTUVfUkUgPSByZWdleC5jb25jYXQoL1tBLVpfYS16XFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXS8sIHJlZ2V4Lm9wdGlvbmFsKC9bQS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcLS4wLTlcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwXSo6LyksIC9bQS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcLS4wLTlcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwXSovKTtcbiAgLy8gaG93ZXZlciwgdG8gY2F0ZXIgZm9yIHBlcmZvcm1hbmNlIGFuZCBtb3JlIFVuaWNvZGUgc3VwcG9ydCByZWx5IHNpbXBseSBvbiB0aGUgVW5pY29kZSBsZXR0ZXIgY2xhc3NcbiAgY29uc3QgVEFHX05BTUVfUkUgPSByZWdleC5jb25jYXQoL1tcXHB7TH1fXS91LCByZWdleC5vcHRpb25hbCgvW1xccHtMfTAtOV8uLV0qOi91KSwgL1tcXHB7TH0wLTlfLi1dKi91KTtcbiAgY29uc3QgWE1MX0lERU5UX1JFID0gL1tcXHB7TH0wLTkuXzotXSsvdTtcbiAgY29uc3QgWE1MX0VOVElUSUVTID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46IC8mW2Etel0rO3wmI1swLTldKzt8JiN4W2EtZjAtOV0rOy9cbiAgfTtcbiAgY29uc3QgWE1MX01FVEFfS0VZV09SRFMgPSB7XG4gICAgYmVnaW46IC9cXHMvLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogLyM/W2Etel9dW2EtejEtOV8tXSsvLFxuICAgICAgICBpbGxlZ2FsOiAvXFxuL1xuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgY29uc3QgWE1MX01FVEFfUEFSX0tFWVdPUkRTID0gaGxqcy5pbmhlcml0KFhNTF9NRVRBX0tFWVdPUkRTLCB7XG4gICAgYmVnaW46IC9cXCgvLFxuICAgIGVuZDogL1xcKS9cbiAgfSk7XG4gIGNvbnN0IEFQT1NfTUVUQV9TVFJJTkdfTU9ERSA9IGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHsgY2xhc3NOYW1lOiAnc3RyaW5nJyB9KTtcbiAgY29uc3QgUVVPVEVfTUVUQV9TVFJJTkdfTU9ERSA9IGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7IGNsYXNzTmFtZTogJ3N0cmluZycgfSk7XG4gIGNvbnN0IFRBR19JTlRFUk5BTFMgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgaWxsZWdhbDogLzwvLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyJyxcbiAgICAgICAgYmVnaW46IFhNTF9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogLz1cXHMqLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBlbmRzUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZ2luOiAvXCIvLFxuICAgICAgICAgICAgICAgIGVuZDogL1wiLyxcbiAgICAgICAgICAgICAgICBjb250YWluczogWyBYTUxfRU5USVRJRVMgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46IC8nLyxcbiAgICAgICAgICAgICAgICBlbmQ6IC8nLyxcbiAgICAgICAgICAgICAgICBjb250YWluczogWyBYTUxfRU5USVRJRVMgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7IGJlZ2luOiAvW15cXHNcIic9PD5gXSsvIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0hUTUwsIFhNTCcsXG4gICAgYWxpYXNlczogW1xuICAgICAgJ2h0bWwnLFxuICAgICAgJ3hodG1sJyxcbiAgICAgICdyc3MnLFxuICAgICAgJ2F0b20nLFxuICAgICAgJ3hqYicsXG4gICAgICAneHNkJyxcbiAgICAgICd4c2wnLFxuICAgICAgJ3BsaXN0JyxcbiAgICAgICd3c2YnLFxuICAgICAgJ3N2ZydcbiAgICBdLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgdW5pY29kZVJlZ2V4OiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogLzwhW2Etel0vLFxuICAgICAgICBlbmQ6IC8+LyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBYTUxfTUVUQV9LRVlXT1JEUyxcbiAgICAgICAgICBRVU9URV9NRVRBX1NUUklOR19NT0RFLFxuICAgICAgICAgIEFQT1NfTUVUQV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBYTUxfTUVUQV9QQVJfS0VZV09SRFMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IC9cXFsvLFxuICAgICAgICAgICAgZW5kOiAvXFxdLyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogLzwhW2Etel0vLFxuICAgICAgICAgICAgICAgIGVuZDogLz4vLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgICBYTUxfTUVUQV9LRVlXT1JEUyxcbiAgICAgICAgICAgICAgICAgIFhNTF9NRVRBX1BBUl9LRVlXT1JEUyxcbiAgICAgICAgICAgICAgICAgIFFVT1RFX01FVEFfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgICAgICBBUE9TX01FVEFfU1RSSU5HX01PREVcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNPTU1FTlQoXG4gICAgICAgIC88IS0tLyxcbiAgICAgICAgLy0tPi8sXG4gICAgICAgIHsgcmVsZXZhbmNlOiAxMCB9XG4gICAgICApLFxuICAgICAge1xuICAgICAgICBiZWdpbjogLzwhXFxbQ0RBVEFcXFsvLFxuICAgICAgICBlbmQ6IC9cXF1cXF0+LyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIFhNTF9FTlRJVElFUyxcbiAgICAgIC8vIHhtbCBwcm9jZXNzaW5nIGluc3RydWN0aW9uc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgICAgZW5kOiAvXFw/Pi8sXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IC88XFw/eG1sLyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBRVU9URV9NRVRBX1NUUklOR19NT0RFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogLzxcXD9bYS16XVthLXowLTldKy8sXG4gICAgICAgICAgfVxuICAgICAgICBdXG5cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8qXG4gICAgICAgIFRoZSBsb29rYWhlYWQgcGF0dGVybiAoPz0uLi4pIGVuc3VyZXMgdGhhdCAnYmVnaW4nIG9ubHkgbWF0Y2hlc1xuICAgICAgICAnPHN0eWxlJyBhcyBhIHNpbmdsZSB3b3JkLCBmb2xsb3dlZCBieSBhIHdoaXRlc3BhY2Ugb3IgYW5cbiAgICAgICAgZW5kaW5nIGJyYWNrZXQuXG4gICAgICAgICovXG4gICAgICAgIGJlZ2luOiAvPHN0eWxlKD89XFxzfD4pLyxcbiAgICAgICAgZW5kOiAvPi8sXG4gICAgICAgIGtleXdvcmRzOiB7IG5hbWU6ICdzdHlsZScgfSxcbiAgICAgICAgY29udGFpbnM6IFsgVEFHX0lOVEVSTkFMUyBdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6IC88XFwvc3R5bGU+LyxcbiAgICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6IFtcbiAgICAgICAgICAgICdjc3MnLFxuICAgICAgICAgICAgJ3htbCdcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8vIFNlZSB0aGUgY29tbWVudCBpbiB0aGUgPHN0eWxlIHRhZyBhYm91dCB0aGUgbG9va2FoZWFkIHBhdHRlcm5cbiAgICAgICAgYmVnaW46IC88c2NyaXB0KD89XFxzfD4pLyxcbiAgICAgICAgZW5kOiAvPi8sXG4gICAgICAgIGtleXdvcmRzOiB7IG5hbWU6ICdzY3JpcHQnIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbIFRBR19JTlRFUk5BTFMgXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAvPFxcL3NjcmlwdD4vLFxuICAgICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogW1xuICAgICAgICAgICAgJ2phdmFzY3JpcHQnLFxuICAgICAgICAgICAgJ2hhbmRsZWJhcnMnLFxuICAgICAgICAgICAgJ3htbCdcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyB3ZSBuZWVkIHRoaXMgZm9yIG5vdyBmb3IgalNYXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIGJlZ2luOiAvPD58PFxcLz4vXG4gICAgICB9LFxuICAgICAgLy8gb3BlbiB0YWdcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgYmVnaW46IHJlZ2V4LmNvbmNhdChcbiAgICAgICAgICAvPC8sXG4gICAgICAgICAgcmVnZXgubG9va2FoZWFkKHJlZ2V4LmNvbmNhdChcbiAgICAgICAgICAgIFRBR19OQU1FX1JFLFxuICAgICAgICAgICAgLy8gPHRhZy8+XG4gICAgICAgICAgICAvLyA8dGFnPlxuICAgICAgICAgICAgLy8gPHRhZyAuLi5cbiAgICAgICAgICAgIHJlZ2V4LmVpdGhlcigvXFwvPi8sIC8+LywgL1xccy8pXG4gICAgICAgICAgKSlcbiAgICAgICAgKSxcbiAgICAgICAgZW5kOiAvXFwvPz4vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25hbWUnLFxuICAgICAgICAgICAgYmVnaW46IFRBR19OQU1FX1JFLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgICAgc3RhcnRzOiBUQUdfSU5URVJOQUxTXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gY2xvc2UgdGFnXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIGJlZ2luOiByZWdleC5jb25jYXQoXG4gICAgICAgICAgLzxcXC8vLFxuICAgICAgICAgIHJlZ2V4Lmxvb2thaGVhZChyZWdleC5jb25jYXQoXG4gICAgICAgICAgICBUQUdfTkFNRV9SRSwgLz4vXG4gICAgICAgICAgKSlcbiAgICAgICAgKSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICduYW1lJyxcbiAgICAgICAgICAgIGJlZ2luOiBUQUdfTkFNRV9SRSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IC8+LyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmV4cG9ydCB7IHhtbCBhcyBkZWZhdWx0IH07XG4iLCAiLypcbkxhbmd1YWdlOiBZQU1MXG5EZXNjcmlwdGlvbjogWWV0IEFub3RoZXIgTWFya2Rvd24gTGFuZ3VhZ2VcbkF1dGhvcjogU3RlZmFuIFdpZW5lcnQgPHN0d2llbmVydEBnbWFpbC5jb20+XG5Db250cmlidXRvcnM6IENhcmwgQmF4dGVyIDxjYXJsQGNiYXgudGVjaD5cblJlcXVpcmVzOiBydWJ5LmpzXG5XZWJzaXRlOiBodHRwczovL3lhbWwub3JnXG5DYXRlZ29yeTogY29tbW9uLCBjb25maWdcbiovXG5mdW5jdGlvbiB5YW1sKGhsanMpIHtcbiAgY29uc3QgTElURVJBTFMgPSAndHJ1ZSBmYWxzZSB5ZXMgbm8gbnVsbCc7XG5cbiAgLy8gWUFNTCBzcGVjIGFsbG93cyBub24tcmVzZXJ2ZWQgVVJJIGNoYXJhY3RlcnMgaW4gdGFncy5cbiAgY29uc3QgVVJJX0NIQVJBQ1RFUlMgPSAnW1xcXFx3IzsvPzpAJj0rJCwufipcXCcoKVtcXFxcXV0rJztcblxuICAvLyBEZWZpbmUga2V5cyBhcyBzdGFydGluZyB3aXRoIGEgd29yZCBjaGFyYWN0ZXJcbiAgLy8gLi4uY29udGFpbmluZyB3b3JkIGNoYXJzLCBzcGFjZXMsIGNvbG9ucywgZm9yd2FyZC1zbGFzaGVzLCBoeXBoZW5zIGFuZCBwZXJpb2RzXG4gIC8vIC4uLmFuZCBlbmRpbmcgd2l0aCBhIGNvbG9uIGZvbGxvd2VkIGltbWVkaWF0ZWx5IGJ5IGEgc3BhY2UsIHRhYiBvciBuZXdsaW5lLlxuICAvLyBUaGUgWUFNTCBzcGVjIGFsbG93cyBmb3IgbXVjaCBtb3JlIHRoYW4gdGhpcywgYnV0IHRoaXMgY292ZXJzIG1vc3QgdXNlLWNhc2VzLlxuICBjb25zdCBLRVkgPSB7XG4gICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46ICdcXFxcd1tcXFxcdyA6XFxcXC8uLV0qOig/PVsgXFx0XXwkKScgfSxcbiAgICAgIHsgLy8gZG91YmxlIHF1b3RlZCBrZXlzXG4gICAgICAgIGJlZ2luOiAnXCJcXFxcd1tcXFxcdyA6XFxcXC8uLV0qXCI6KD89WyBcXHRdfCQpJyB9LFxuICAgICAgeyAvLyBzaW5nbGUgcXVvdGVkIGtleXNcbiAgICAgICAgYmVnaW46ICdcXCdcXFxcd1tcXFxcdyA6XFxcXC8uLV0qXFwnOig/PVsgXFx0XXwkKScgfVxuICAgIF1cbiAgfTtcblxuICBjb25zdCBURU1QTEFURV9WQVJJQUJMRVMgPSB7XG4gICAgY2xhc3NOYW1lOiAndGVtcGxhdGUtdmFyaWFibGUnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7IC8vIGppbmphIHRlbXBsYXRlcyBBbnNpYmxlXG4gICAgICAgIGJlZ2luOiAvXFx7XFx7LyxcbiAgICAgICAgZW5kOiAvXFx9XFx9L1xuICAgICAgfSxcbiAgICAgIHsgLy8gUnVieSBpMThuXG4gICAgICAgIGJlZ2luOiAvJVxcey8sXG4gICAgICAgIGVuZDogL1xcfS9cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGNvbnN0IFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICB2YXJpYW50czogW1xuICAgICAge1xuICAgICAgICBiZWdpbjogLycvLFxuICAgICAgICBlbmQ6IC8nL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cIi8sXG4gICAgICAgIGVuZDogL1wiL1xuICAgICAgfSxcbiAgICAgIHsgYmVnaW46IC9cXFMrLyB9XG4gICAgXSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgVEVNUExBVEVfVkFSSUFCTEVTXG4gICAgXVxuICB9O1xuXG4gIC8vIFN0cmluZ3MgaW5zaWRlIG9mIHZhbHVlIGNvbnRhaW5lcnMgKG9iamVjdHMpIGNhbid0IGNvbnRhaW4gYnJhY2VzLFxuICAvLyBicmFja2V0cywgb3IgY29tbWFzXG4gIGNvbnN0IENPTlRBSU5FUl9TVFJJTkcgPSBobGpzLmluaGVyaXQoU1RSSU5HLCB7IHZhcmlhbnRzOiBbXG4gICAge1xuICAgICAgYmVnaW46IC8nLyxcbiAgICAgIGVuZDogLycvXG4gICAgfSxcbiAgICB7XG4gICAgICBiZWdpbjogL1wiLyxcbiAgICAgIGVuZDogL1wiL1xuICAgIH0sXG4gICAgeyBiZWdpbjogL1teXFxzLHt9W1xcXV0rLyB9XG4gIF0gfSk7XG5cbiAgY29uc3QgREFURV9SRSA9ICdbMC05XXs0fSgtWzAtOV1bMC05XSl7MCwyfSc7XG4gIGNvbnN0IFRJTUVfUkUgPSAnKFtUdCBcXFxcdF1bMC05XVswLTldPyg6WzAtOV1bMC05XSl7Mn0pPyc7XG4gIGNvbnN0IEZSQUNUSU9OX1JFID0gJyhcXFxcLlswLTldKik/JztcbiAgY29uc3QgWk9ORV9SRSA9ICcoWyBcXFxcdF0pKihafFstK11bMC05XVswLTldPyg6WzAtOV1bMC05XSk/KT8nO1xuICBjb25zdCBUSU1FU1RBTVAgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogJ1xcXFxiJyArIERBVEVfUkUgKyBUSU1FX1JFICsgRlJBQ1RJT05fUkUgKyBaT05FX1JFICsgJ1xcXFxiJ1xuICB9O1xuXG4gIGNvbnN0IFZBTFVFX0NPTlRBSU5FUiA9IHtcbiAgICBlbmQ6ICcsJyxcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGtleXdvcmRzOiBMSVRFUkFMUyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgY29uc3QgT0JKRUNUID0ge1xuICAgIGJlZ2luOiAvXFx7LyxcbiAgICBlbmQ6IC9cXH0vLFxuICAgIGNvbnRhaW5zOiBbIFZBTFVFX0NPTlRBSU5FUiBdLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGNvbnN0IEFSUkFZID0ge1xuICAgIGJlZ2luOiAnXFxcXFsnLFxuICAgIGVuZDogJ1xcXFxdJyxcbiAgICBjb250YWluczogWyBWQUxVRV9DT05UQUlORVIgXSxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIGNvbnN0IE1PREVTID0gW1xuICAgIEtFWSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgIGJlZ2luOiAnXi0tLVxcXFxzKiQnLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAgeyAvLyBtdWx0aSBsaW5lIHN0cmluZ1xuICAgICAgLy8gQmxvY2tzIHN0YXJ0IHdpdGggYSB8IG9yID4gZm9sbG93ZWQgYnkgYSBuZXdsaW5lXG4gICAgICAvL1xuICAgICAgLy8gSW5kZW50YXRpb24gb2Ygc3Vic2VxdWVudCBsaW5lcyBtdXN0IGJlIHRoZSBzYW1lIHRvXG4gICAgICAvLyBiZSBjb25zaWRlcmVkIHBhcnQgb2YgdGhlIGJsb2NrXG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdbXFxcXHw+XShbMS05XT9bKy1dKT9bIF0qXFxcXG4oICspW14gXVteXFxcXG5dKlxcXFxuKFxcXFwyW15cXFxcbl0rXFxcXG4/KSonXG4gICAgfSxcbiAgICB7IC8vIFJ1YnkvUmFpbHMgZXJiXG4gICAgICBiZWdpbjogJzwlWyU9LV0/JyxcbiAgICAgIGVuZDogJ1slLV0/JT4nLFxuICAgICAgc3ViTGFuZ3VhZ2U6ICdydWJ5JyxcbiAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHsgLy8gbmFtZWQgdGFnc1xuICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICBiZWdpbjogJyFcXFxcdyshJyArIFVSSV9DSEFSQUNURVJTXG4gICAgfSxcbiAgICAvLyBodHRwczovL3lhbWwub3JnL3NwZWMvMS4yL3NwZWMuaHRtbCNpZDI3ODQwNjRcbiAgICB7IC8vIHZlcmJhdGltIHRhZ3NcbiAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgYmVnaW46ICchPCcgKyBVUklfQ0hBUkFDVEVSUyArIFwiPlwiXG4gICAgfSxcbiAgICB7IC8vIHByaW1hcnkgdGFnc1xuICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICBiZWdpbjogJyEnICsgVVJJX0NIQVJBQ1RFUlNcbiAgICB9LFxuICAgIHsgLy8gc2Vjb25kYXJ5IHRhZ3NcbiAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgYmVnaW46ICchIScgKyBVUklfQ0hBUkFDVEVSU1xuICAgIH0sXG4gICAgeyAvLyBmcmFnbWVudCBpZCAmcmVmXG4gICAgICBjbGFzc05hbWU6ICdtZXRhJyxcbiAgICAgIGJlZ2luOiAnJicgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnJCdcbiAgICB9LFxuICAgIHsgLy8gZnJhZ21lbnQgcmVmZXJlbmNlICpyZWZcbiAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgYmVnaW46ICdcXFxcKicgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnJCdcbiAgICB9LFxuICAgIHsgLy8gYXJyYXkgbGlzdGluZ1xuICAgICAgY2xhc3NOYW1lOiAnYnVsbGV0JyxcbiAgICAgIC8vIFRPRE86IHJlbW92ZSB8JCBoYWNrIHdoZW4gd2UgaGF2ZSBwcm9wZXIgbG9vay1haGVhZCBzdXBwb3J0XG4gICAgICBiZWdpbjogJy0oPz1bIF18JCknLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgIHtcbiAgICAgIGJlZ2luS2V5d29yZHM6IExJVEVSQUxTLFxuICAgICAga2V5d29yZHM6IHsgbGl0ZXJhbDogTElURVJBTFMgfVxuICAgIH0sXG4gICAgVElNRVNUQU1QLFxuICAgIC8vIG51bWJlcnMgYXJlIGFueSB2YWxpZCBDLXN0eWxlIG51bWJlciB0aGF0XG4gICAgLy8gc2l0IGlzb2xhdGVkIGZyb20gb3RoZXIgd29yZHNcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgKyAnXFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICBPQkpFQ1QsXG4gICAgQVJSQVksXG4gICAgU1RSSU5HXG4gIF07XG5cbiAgY29uc3QgVkFMVUVfTU9ERVMgPSBbIC4uLk1PREVTIF07XG4gIFZBTFVFX01PREVTLnBvcCgpO1xuICBWQUxVRV9NT0RFUy5wdXNoKENPTlRBSU5FUl9TVFJJTkcpO1xuICBWQUxVRV9DT05UQUlORVIuY29udGFpbnMgPSBWQUxVRV9NT0RFUztcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdZQU1MJyxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGFsaWFzZXM6IFsgJ3ltbCcgXSxcbiAgICBjb250YWluczogTU9ERVNcbiAgfTtcbn1cblxuZXhwb3J0IHsgeWFtbCBhcyBkZWZhdWx0IH07XG4iLCAiaW1wb3J0IGhsanMgZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9jb3JlJztcbmltcG9ydCBiYXNoIGZyb20gJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2Jhc2gnO1xuaW1wb3J0IGNzcyBmcm9tICdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9jc3MnO1xuaW1wb3J0IGRvY2tlcmZpbGUgZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvZG9ja2VyZmlsZSc7XG5pbXBvcnQgZ3JhcGhxbCBmcm9tICdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9ncmFwaHFsJztcbmltcG9ydCBqYXZhc2NyaXB0IGZyb20gJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHQnO1xuaW1wb3J0IGpzb24gZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvanNvbic7XG5pbXBvcnQgbWFya2Rvd24gZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvbWFya2Rvd24nO1xuaW1wb3J0IHBocCBmcm9tICdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9waHAnO1xuaW1wb3J0IHNjc3MgZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvc2Nzcyc7XG5pbXBvcnQgc2hlbGwgZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvc2hlbGwnO1xuaW1wb3J0IHNxbCBmcm9tICdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9zcWwnO1xuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSAnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvdHlwZXNjcmlwdCc7XG5pbXBvcnQgeG1sIGZyb20gJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3htbCc7XG5pbXBvcnQgeWFtbCBmcm9tICdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy95YW1sJztcblxuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdiYXNoJywgYmFzaCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2NzcycsIGNzcyk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2RvY2tlcmZpbGUnLCBkb2NrZXJmaWxlKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnZ3JhcGhxbCcsIGdyYXBocWwpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdqYXZhc2NyaXB0JywgamF2YXNjcmlwdCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2pzb24nLCBqc29uKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnbWFya2Rvd24nLCBtYXJrZG93bik7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ3BocCcsIHBocCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ3Njc3MnLCBzY3NzKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnc2hlbGwnLCBzaGVsbCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ3NxbCcsIHNxbCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ3R5cGVzY3JpcHQnLCB0eXBlc2NyaXB0KTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgneG1sJywgeG1sKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgneWFtbCcsIHlhbWwpO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsYW1lbnQtc3ludGF4LWVudHJ5IHByZSBjb2RlJykuZm9yRWFjaChlbCA9PiB7XG4gIGhsanMuaGlnaGxpZ2h0RWxlbWVudChlbCk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFFQSxhQUFTLFdBQVcsS0FBSztBQUN2QixVQUFJLGVBQWUsS0FBSztBQUN0QixZQUFJLFFBQ0YsSUFBSSxTQUNKLElBQUksTUFDRixXQUFZO0FBQ1YsZ0JBQU0sSUFBSSxNQUFNLGtCQUFrQjtBQUFBLFFBQ3BDO0FBQUEsTUFDTixXQUFXLGVBQWUsS0FBSztBQUM3QixZQUFJLE1BQ0YsSUFBSSxRQUNKLElBQUksU0FDRixXQUFZO0FBQ1YsZ0JBQU0sSUFBSSxNQUFNLGtCQUFrQjtBQUFBLFFBQ3BDO0FBQUEsTUFDTjtBQUdBLGFBQU8sT0FBTyxHQUFHO0FBRWpCLGFBQU8sb0JBQW9CLEdBQUcsRUFBRSxRQUFRLENBQUMsU0FBUztBQUNoRCxjQUFNLE9BQU8sSUFBSSxJQUFJO0FBQ3JCLGNBQU0sT0FBTyxPQUFPO0FBR3BCLGFBQUssU0FBUyxZQUFZLFNBQVMsZUFBZSxDQUFDLE9BQU8sU0FBUyxJQUFJLEdBQUc7QUFDeEUscUJBQVcsSUFBSTtBQUFBLFFBQ2pCO0FBQUEsTUFDRixDQUFDO0FBRUQsYUFBTztBQUFBLElBQ1Q7QUFNQSxRQUFNLFdBQU4sTUFBZTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSWIsWUFBWSxNQUFNO0FBRWhCLFlBQUksS0FBSyxTQUFTO0FBQVcsZUFBSyxPQUFPLENBQUM7QUFFMUMsYUFBSyxPQUFPLEtBQUs7QUFDakIsYUFBSyxpQkFBaUI7QUFBQSxNQUN4QjtBQUFBLE1BRUEsY0FBYztBQUNaLGFBQUssaUJBQWlCO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBTUEsYUFBUyxXQUFXLE9BQU87QUFDekIsYUFBTyxNQUNKLFFBQVEsTUFBTSxPQUFPLEVBQ3JCLFFBQVEsTUFBTSxNQUFNLEVBQ3BCLFFBQVEsTUFBTSxNQUFNLEVBQ3BCLFFBQVEsTUFBTSxRQUFRLEVBQ3RCLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDM0I7QUFVQSxhQUFTLFVBQVUsYUFBYSxTQUFTO0FBRXZDLFlBQU0sU0FBUyx1QkFBTyxPQUFPLElBQUk7QUFFakMsaUJBQVcsT0FBTyxVQUFVO0FBQzFCLGVBQU8sR0FBRyxJQUFJLFNBQVMsR0FBRztBQUFBLE1BQzVCO0FBQ0EsY0FBUSxRQUFRLFNBQVMsS0FBSztBQUM1QixtQkFBVyxPQUFPLEtBQUs7QUFDckIsaUJBQU8sR0FBRyxJQUFJLElBQUksR0FBRztBQUFBLFFBQ3ZCO0FBQUEsTUFDRixDQUFDO0FBQ0Q7QUFBQTtBQUFBLFFBQXlCO0FBQUE7QUFBQSxJQUMzQjtBQWNBLFFBQU0sYUFBYTtBQU1uQixRQUFNLG9CQUFvQixDQUFDLFNBQVM7QUFHbEMsYUFBTyxDQUFDLENBQUMsS0FBSztBQUFBLElBQ2hCO0FBT0EsUUFBTSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxNQUFNO0FBRTVDLFVBQUksS0FBSyxXQUFXLFdBQVcsR0FBRztBQUNoQyxlQUFPLEtBQUssUUFBUSxhQUFhLFdBQVc7QUFBQSxNQUM5QztBQUVBLFVBQUksS0FBSyxTQUFTLEdBQUcsR0FBRztBQUN0QixjQUFNLFNBQVMsS0FBSyxNQUFNLEdBQUc7QUFDN0IsZUFBTztBQUFBLFVBQ0wsR0FBRyxNQUFNLEdBQUcsT0FBTyxNQUFNLENBQUM7QUFBQSxVQUMxQixHQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRTtBQUFBLFFBQ3JELEVBQUUsS0FBSyxHQUFHO0FBQUEsTUFDWjtBQUVBLGFBQU8sR0FBRyxNQUFNLEdBQUcsSUFBSTtBQUFBLElBQ3pCO0FBR0EsUUFBTSxlQUFOLE1BQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPakIsWUFBWSxXQUFXLFNBQVM7QUFDOUIsYUFBSyxTQUFTO0FBQ2QsYUFBSyxjQUFjLFFBQVE7QUFDM0Isa0JBQVUsS0FBSyxJQUFJO0FBQUEsTUFDckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTUEsUUFBUSxNQUFNO0FBQ1osYUFBSyxVQUFVLFdBQVcsSUFBSTtBQUFBLE1BQ2hDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BLFNBQVMsTUFBTTtBQUNiLFlBQUksQ0FBQyxrQkFBa0IsSUFBSTtBQUFHO0FBRTlCLGNBQU0sWUFBWTtBQUFBLFVBQWdCLEtBQUs7QUFBQSxVQUNyQyxFQUFFLFFBQVEsS0FBSyxZQUFZO0FBQUEsUUFBQztBQUM5QixhQUFLLEtBQUssU0FBUztBQUFBLE1BQ3JCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BLFVBQVUsTUFBTTtBQUNkLFlBQUksQ0FBQyxrQkFBa0IsSUFBSTtBQUFHO0FBRTlCLGFBQUssVUFBVTtBQUFBLE1BQ2pCO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQSxRQUFRO0FBQ04sZUFBTyxLQUFLO0FBQUEsTUFDZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVFBLEtBQUssV0FBVztBQUNkLGFBQUssVUFBVSxnQkFBZ0IsU0FBUztBQUFBLE1BQzFDO0FBQUEsSUFDRjtBQVFBLFFBQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNO0FBRTdCLFlBQU0sU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQzlCLGFBQU8sT0FBTyxRQUFRLElBQUk7QUFDMUIsYUFBTztBQUFBLElBQ1Q7QUFFQSxRQUFNLFlBQU4sTUFBTSxXQUFVO0FBQUEsTUFDZCxjQUFjO0FBRVosYUFBSyxXQUFXLFFBQVE7QUFDeEIsYUFBSyxRQUFRLENBQUMsS0FBSyxRQUFRO0FBQUEsTUFDN0I7QUFBQSxNQUVBLElBQUksTUFBTTtBQUNSLGVBQU8sS0FBSyxNQUFNLEtBQUssTUFBTSxTQUFTLENBQUM7QUFBQSxNQUN6QztBQUFBLE1BRUEsSUFBSSxPQUFPO0FBQUUsZUFBTyxLQUFLO0FBQUEsTUFBVTtBQUFBO0FBQUEsTUFHbkMsSUFBSSxNQUFNO0FBQ1IsYUFBSyxJQUFJLFNBQVMsS0FBSyxJQUFJO0FBQUEsTUFDN0I7QUFBQTtBQUFBLE1BR0EsU0FBUyxPQUFPO0FBRWQsY0FBTSxPQUFPLFFBQVEsRUFBRSxNQUFNLENBQUM7QUFDOUIsYUFBSyxJQUFJLElBQUk7QUFDYixhQUFLLE1BQU0sS0FBSyxJQUFJO0FBQUEsTUFDdEI7QUFBQSxNQUVBLFlBQVk7QUFDVixZQUFJLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDekIsaUJBQU8sS0FBSyxNQUFNLElBQUk7QUFBQSxRQUN4QjtBQUVBLGVBQU87QUFBQSxNQUNUO0FBQUEsTUFFQSxnQkFBZ0I7QUFDZCxlQUFPLEtBQUssVUFBVTtBQUFFO0FBQUEsTUFDMUI7QUFBQSxNQUVBLFNBQVM7QUFDUCxlQUFPLEtBQUssVUFBVSxLQUFLLFVBQVUsTUFBTSxDQUFDO0FBQUEsTUFDOUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTUEsS0FBSyxTQUFTO0FBRVosZUFBTyxLQUFLLFlBQVksTUFBTSxTQUFTLEtBQUssUUFBUTtBQUFBLE1BR3REO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BLE9BQU8sTUFBTSxTQUFTLE1BQU07QUFDMUIsWUFBSSxPQUFPLFNBQVMsVUFBVTtBQUM1QixrQkFBUSxRQUFRLElBQUk7QUFBQSxRQUN0QixXQUFXLEtBQUssVUFBVTtBQUN4QixrQkFBUSxTQUFTLElBQUk7QUFDckIsZUFBSyxTQUFTLFFBQVEsQ0FBQyxVQUFVLEtBQUssTUFBTSxTQUFTLEtBQUssQ0FBQztBQUMzRCxrQkFBUSxVQUFVLElBQUk7QUFBQSxRQUN4QjtBQUNBLGVBQU87QUFBQSxNQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQSxPQUFPLFVBQVUsTUFBTTtBQUNyQixZQUFJLE9BQU8sU0FBUztBQUFVO0FBQzlCLFlBQUksQ0FBQyxLQUFLO0FBQVU7QUFFcEIsWUFBSSxLQUFLLFNBQVMsTUFBTSxRQUFNLE9BQU8sT0FBTyxRQUFRLEdBQUc7QUFHckQsZUFBSyxXQUFXLENBQUMsS0FBSyxTQUFTLEtBQUssRUFBRSxDQUFDO0FBQUEsUUFDekMsT0FBTztBQUNMLGVBQUssU0FBUyxRQUFRLENBQUMsVUFBVTtBQUMvQix1QkFBVSxVQUFVLEtBQUs7QUFBQSxVQUMzQixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBb0JBLFFBQU0sbUJBQU4sY0FBK0IsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSXZDLFlBQVksU0FBUztBQUNuQixjQUFNO0FBQ04sYUFBSyxVQUFVO0FBQUEsTUFDakI7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtBLFFBQVEsTUFBTTtBQUNaLFlBQUksU0FBUyxJQUFJO0FBQUU7QUFBQSxRQUFRO0FBRTNCLGFBQUssSUFBSSxJQUFJO0FBQUEsTUFDZjtBQUFBO0FBQUEsTUFHQSxXQUFXLE9BQU87QUFDaEIsYUFBSyxTQUFTLEtBQUs7QUFBQSxNQUNyQjtBQUFBLE1BRUEsV0FBVztBQUNULGFBQUssVUFBVTtBQUFBLE1BQ2pCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BLGlCQUFpQixTQUFTLE1BQU07QUFFOUIsY0FBTSxPQUFPLFFBQVE7QUFDckIsWUFBSTtBQUFNLGVBQUssUUFBUSxZQUFZLElBQUk7QUFFdkMsYUFBSyxJQUFJLElBQUk7QUFBQSxNQUNmO0FBQUEsTUFFQSxTQUFTO0FBQ1AsY0FBTSxXQUFXLElBQUksYUFBYSxNQUFNLEtBQUssT0FBTztBQUNwRCxlQUFPLFNBQVMsTUFBTTtBQUFBLE1BQ3hCO0FBQUEsTUFFQSxXQUFXO0FBQ1QsYUFBSyxjQUFjO0FBQ25CLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQVdBLGFBQVMsT0FBTyxJQUFJO0FBQ2xCLFVBQUksQ0FBQztBQUFJLGVBQU87QUFDaEIsVUFBSSxPQUFPLE9BQU87QUFBVSxlQUFPO0FBRW5DLGFBQU8sR0FBRztBQUFBLElBQ1o7QUFNQSxhQUFTLFVBQVUsSUFBSTtBQUNyQixhQUFPLE9BQU8sT0FBTyxJQUFJLEdBQUc7QUFBQSxJQUM5QjtBQU1BLGFBQVMsaUJBQWlCLElBQUk7QUFDNUIsYUFBTyxPQUFPLE9BQU8sSUFBSSxJQUFJO0FBQUEsSUFDL0I7QUFNQSxhQUFTLFNBQVMsSUFBSTtBQUNwQixhQUFPLE9BQU8sT0FBTyxJQUFJLElBQUk7QUFBQSxJQUMvQjtBQU1BLGFBQVMsVUFBVSxNQUFNO0FBQ3ZCLFlBQU0sU0FBUyxLQUFLLElBQUksQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2pELGFBQU87QUFBQSxJQUNUO0FBTUEsYUFBUyxxQkFBcUIsTUFBTTtBQUNsQyxZQUFNLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQztBQUVqQyxVQUFJLE9BQU8sU0FBUyxZQUFZLEtBQUssZ0JBQWdCLFFBQVE7QUFDM0QsYUFBSyxPQUFPLEtBQUssU0FBUyxHQUFHLENBQUM7QUFDOUIsZUFBTztBQUFBLE1BQ1QsT0FBTztBQUNMLGVBQU8sQ0FBQztBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBV0EsYUFBUyxVQUFVLE1BQU07QUFFdkIsWUFBTSxPQUFPLHFCQUFxQixJQUFJO0FBQ3RDLFlBQU0sU0FBUyxPQUNWLEtBQUssVUFBVSxLQUFLLFFBQ3JCLEtBQUssSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSTtBQUMzQyxhQUFPO0FBQUEsSUFDVDtBQU1BLGFBQVMsaUJBQWlCLElBQUk7QUFDNUIsYUFBUSxJQUFJLE9BQU8sR0FBRyxTQUFTLElBQUksR0FBRyxFQUFHLEtBQUssRUFBRSxFQUFFLFNBQVM7QUFBQSxJQUM3RDtBQU9BLGFBQVMsV0FBVyxJQUFJLFFBQVE7QUFDOUIsWUFBTSxRQUFRLE1BQU0sR0FBRyxLQUFLLE1BQU07QUFDbEMsYUFBTyxTQUFTLE1BQU0sVUFBVTtBQUFBLElBQ2xDO0FBU0EsUUFBTSxhQUFhO0FBYW5CLGFBQVMsdUJBQXVCLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFDckQsVUFBSSxjQUFjO0FBRWxCLGFBQU8sUUFBUSxJQUFJLENBQUMsVUFBVTtBQUM1Qix1QkFBZTtBQUNmLGNBQU0sU0FBUztBQUNmLFlBQUksS0FBSyxPQUFPLEtBQUs7QUFDckIsWUFBSSxNQUFNO0FBRVYsZUFBTyxHQUFHLFNBQVMsR0FBRztBQUNwQixnQkFBTSxRQUFRLFdBQVcsS0FBSyxFQUFFO0FBQ2hDLGNBQUksQ0FBQyxPQUFPO0FBQ1YsbUJBQU87QUFDUDtBQUFBLFVBQ0Y7QUFDQSxpQkFBTyxHQUFHLFVBQVUsR0FBRyxNQUFNLEtBQUs7QUFDbEMsZUFBSyxHQUFHLFVBQVUsTUFBTSxRQUFRLE1BQU0sQ0FBQyxFQUFFLE1BQU07QUFDL0MsY0FBSSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sUUFBUSxNQUFNLENBQUMsR0FBRztBQUVwQyxtQkFBTyxPQUFPLE9BQU8sT0FBTyxNQUFNLENBQUMsQ0FBQyxJQUFJLE1BQU07QUFBQSxVQUNoRCxPQUFPO0FBQ0wsbUJBQU8sTUFBTSxDQUFDO0FBQ2QsZ0JBQUksTUFBTSxDQUFDLE1BQU0sS0FBSztBQUNwQjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUNBLGVBQU87QUFBQSxNQUNULENBQUMsRUFBRSxJQUFJLFFBQU0sSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLFFBQVE7QUFBQSxJQUN2QztBQU1BLFFBQU0sbUJBQW1CO0FBQ3pCLFFBQU1BLFlBQVc7QUFDakIsUUFBTSxzQkFBc0I7QUFDNUIsUUFBTSxZQUFZO0FBQ2xCLFFBQU0sY0FBYztBQUNwQixRQUFNLG1CQUFtQjtBQUN6QixRQUFNLGlCQUFpQjtBQUt2QixRQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTTtBQUM3QixZQUFNLGVBQWU7QUFDckIsVUFBSSxLQUFLLFFBQVE7QUFDZixhQUFLLFFBQVE7QUFBQSxVQUNYO0FBQUEsVUFDQTtBQUFBLFVBQ0EsS0FBSztBQUFBLFVBQ0w7QUFBQSxRQUFNO0FBQUEsTUFDVjtBQUNBLGFBQU8sVUFBVTtBQUFBLFFBQ2YsT0FBTztBQUFBLFFBQ1AsT0FBTztBQUFBLFFBQ1AsS0FBSztBQUFBLFFBQ0wsV0FBVztBQUFBO0FBQUEsUUFFWCxZQUFZLENBQUMsR0FBRyxTQUFTO0FBQ3ZCLGNBQUksRUFBRSxVQUFVO0FBQUcsaUJBQUssWUFBWTtBQUFBLFFBQ3RDO0FBQUEsTUFDRixHQUFHLElBQUk7QUFBQSxJQUNUO0FBR0EsUUFBTSxtQkFBbUI7QUFBQSxNQUN2QixPQUFPO0FBQUEsTUFBZ0IsV0FBVztBQUFBLElBQ3BDO0FBQ0EsUUFBTSxtQkFBbUI7QUFBQSxNQUN2QixPQUFPO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxLQUFLO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxVQUFVLENBQUMsZ0JBQWdCO0FBQUEsSUFDN0I7QUFDQSxRQUFNLG9CQUFvQjtBQUFBLE1BQ3hCLE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFVBQVUsQ0FBQyxnQkFBZ0I7QUFBQSxJQUM3QjtBQUNBLFFBQU0scUJBQXFCO0FBQUEsTUFDekIsT0FBTztBQUFBLElBQ1Q7QUFTQSxRQUFNLFVBQVUsU0FBUyxPQUFPLEtBQUssY0FBYyxDQUFDLEdBQUc7QUFDckQsWUFBTSxPQUFPO0FBQUEsUUFDWDtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsVUFDQSxVQUFVLENBQUM7QUFBQSxRQUNiO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFNBQVMsS0FBSztBQUFBLFFBQ2pCLE9BQU87QUFBQTtBQUFBO0FBQUEsUUFHUCxPQUFPO0FBQUEsUUFDUCxLQUFLO0FBQUEsUUFDTCxjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsTUFDYixDQUFDO0FBQ0QsWUFBTSxlQUFlO0FBQUE7QUFBQSxRQUVuQjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBRUE7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLE1BQ0Y7QUFFQSxXQUFLLFNBQVM7QUFBQSxRQUNaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQWdCRSxPQUFPO0FBQUEsWUFDTDtBQUFBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQU07QUFBQTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFNLHNCQUFzQixRQUFRLE1BQU0sR0FBRztBQUM3QyxRQUFNLHVCQUF1QixRQUFRLFFBQVEsTUFBTTtBQUNuRCxRQUFNLG9CQUFvQixRQUFRLEtBQUssR0FBRztBQUMxQyxRQUFNLGNBQWM7QUFBQSxNQUNsQixPQUFPO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxXQUFXO0FBQUEsSUFDYjtBQUNBLFFBQU0sZ0JBQWdCO0FBQUEsTUFDcEIsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsV0FBVztBQUFBLElBQ2I7QUFDQSxRQUFNLHFCQUFxQjtBQUFBLE1BQ3pCLE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQSxJQUNiO0FBQ0EsUUFBTSxjQUFjO0FBQUEsTUFDbEIsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsS0FBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxLQUFLO0FBQUEsVUFDTCxXQUFXO0FBQUEsVUFDWCxVQUFVLENBQUMsZ0JBQWdCO0FBQUEsUUFDN0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLFFBQU0sYUFBYTtBQUFBLE1BQ2pCLE9BQU87QUFBQSxNQUNQLE9BQU9BO0FBQUEsTUFDUCxXQUFXO0FBQUEsSUFDYjtBQUNBLFFBQU0sd0JBQXdCO0FBQUEsTUFDNUIsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsV0FBVztBQUFBLElBQ2I7QUFDQSxRQUFNLGVBQWU7QUFBQTtBQUFBLE1BRW5CLE9BQU8sWUFBWTtBQUFBLE1BQ25CLFdBQVc7QUFBQSxJQUNiO0FBU0EsUUFBTSxvQkFBb0IsU0FBUyxNQUFNO0FBQ3ZDLGFBQU8sT0FBTztBQUFBLFFBQU87QUFBQSxRQUNuQjtBQUFBO0FBQUEsVUFFRSxZQUFZLENBQUMsR0FBRyxTQUFTO0FBQUUsaUJBQUssS0FBSyxjQUFjLEVBQUUsQ0FBQztBQUFBLFVBQUc7QUFBQTtBQUFBLFVBRXpELFVBQVUsQ0FBQyxHQUFHLFNBQVM7QUFBRSxnQkFBSSxLQUFLLEtBQUssZ0JBQWdCLEVBQUUsQ0FBQztBQUFHLG1CQUFLLFlBQVk7QUFBQSxVQUFHO0FBQUEsUUFDbkY7QUFBQSxNQUFDO0FBQUEsSUFDTDtBQUVBLFFBQUlDLFNBQXFCLHVCQUFPLE9BQU87QUFBQSxNQUNyQyxXQUFXO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVVEO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBK0JELGFBQVMsc0JBQXNCLE9BQU8sVUFBVTtBQUM5QyxZQUFNLFNBQVMsTUFBTSxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzFDLFVBQUksV0FBVyxLQUFLO0FBQ2xCLGlCQUFTLFlBQVk7QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFNQSxhQUFTLGVBQWUsTUFBTSxTQUFTO0FBRXJDLFVBQUksS0FBSyxjQUFjLFFBQVc7QUFDaEMsYUFBSyxRQUFRLEtBQUs7QUFDbEIsZUFBTyxLQUFLO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFNQSxhQUFTLGNBQWMsTUFBTSxRQUFRO0FBQ25DLFVBQUksQ0FBQztBQUFRO0FBQ2IsVUFBSSxDQUFDLEtBQUs7QUFBZTtBQU96QixXQUFLLFFBQVEsU0FBUyxLQUFLLGNBQWMsTUFBTSxHQUFHLEVBQUUsS0FBSyxHQUFHLElBQUk7QUFDaEUsV0FBSyxnQkFBZ0I7QUFDckIsV0FBSyxXQUFXLEtBQUssWUFBWSxLQUFLO0FBQ3RDLGFBQU8sS0FBSztBQUtaLFVBQUksS0FBSyxjQUFjO0FBQVcsYUFBSyxZQUFZO0FBQUEsSUFDckQ7QUFNQSxhQUFTLGVBQWUsTUFBTSxTQUFTO0FBQ3JDLFVBQUksQ0FBQyxNQUFNLFFBQVEsS0FBSyxPQUFPO0FBQUc7QUFFbEMsV0FBSyxVQUFVLE9BQU8sR0FBRyxLQUFLLE9BQU87QUFBQSxJQUN2QztBQU1BLGFBQVMsYUFBYSxNQUFNLFNBQVM7QUFDbkMsVUFBSSxDQUFDLEtBQUs7QUFBTztBQUNqQixVQUFJLEtBQUssU0FBUyxLQUFLO0FBQUssY0FBTSxJQUFJLE1BQU0sMENBQTBDO0FBRXRGLFdBQUssUUFBUSxLQUFLO0FBQ2xCLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFNQSxhQUFTLGlCQUFpQixNQUFNLFNBQVM7QUFFdkMsVUFBSSxLQUFLLGNBQWM7QUFBVyxhQUFLLFlBQVk7QUFBQSxJQUNyRDtBQUlBLFFBQU0saUJBQWlCLENBQUMsTUFBTSxXQUFXO0FBQ3ZDLFVBQUksQ0FBQyxLQUFLO0FBQWE7QUFHdkIsVUFBSSxLQUFLO0FBQVEsY0FBTSxJQUFJLE1BQU0sd0NBQXdDO0FBRXpFLFlBQU0sZUFBZSxPQUFPLE9BQU8sQ0FBQyxHQUFHLElBQUk7QUFDM0MsYUFBTyxLQUFLLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUTtBQUFFLGVBQU8sS0FBSyxHQUFHO0FBQUEsTUFBRyxDQUFDO0FBRXhELFdBQUssV0FBVyxhQUFhO0FBQzdCLFdBQUssUUFBUSxPQUFPLGFBQWEsYUFBYSxVQUFVLGFBQWEsS0FBSyxDQUFDO0FBQzNFLFdBQUssU0FBUztBQUFBLFFBQ1osV0FBVztBQUFBLFFBQ1gsVUFBVTtBQUFBLFVBQ1IsT0FBTyxPQUFPLGNBQWMsRUFBRSxZQUFZLEtBQUssQ0FBQztBQUFBLFFBQ2xEO0FBQUEsTUFDRjtBQUNBLFdBQUssWUFBWTtBQUVqQixhQUFPLGFBQWE7QUFBQSxJQUN0QjtBQUdBLFFBQU0sa0JBQWtCO0FBQUEsTUFDdEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBO0FBQUEsTUFDQTtBQUFBO0FBQUEsTUFDQTtBQUFBO0FBQUEsSUFDRjtBQUVBLFFBQU0sd0JBQXdCO0FBUTlCLGFBQVMsZ0JBQWdCLGFBQWEsaUJBQWlCLFlBQVksdUJBQXVCO0FBRXhGLFlBQU0sbUJBQW1CLHVCQUFPLE9BQU8sSUFBSTtBQUkzQyxVQUFJLE9BQU8sZ0JBQWdCLFVBQVU7QUFDbkMsb0JBQVksV0FBVyxZQUFZLE1BQU0sR0FBRyxDQUFDO0FBQUEsTUFDL0MsV0FBVyxNQUFNLFFBQVEsV0FBVyxHQUFHO0FBQ3JDLG9CQUFZLFdBQVcsV0FBVztBQUFBLE1BQ3BDLE9BQU87QUFDTCxlQUFPLEtBQUssV0FBVyxFQUFFLFFBQVEsU0FBU0UsWUFBVztBQUVuRCxpQkFBTztBQUFBLFlBQ0w7QUFBQSxZQUNBLGdCQUFnQixZQUFZQSxVQUFTLEdBQUcsaUJBQWlCQSxVQUFTO0FBQUEsVUFDcEU7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQ0EsYUFBTztBQVlQLGVBQVMsWUFBWUEsWUFBVyxhQUFhO0FBQzNDLFlBQUksaUJBQWlCO0FBQ25CLHdCQUFjLFlBQVksSUFBSSxPQUFLLEVBQUUsWUFBWSxDQUFDO0FBQUEsUUFDcEQ7QUFDQSxvQkFBWSxRQUFRLFNBQVMsU0FBUztBQUNwQyxnQkFBTSxPQUFPLFFBQVEsTUFBTSxHQUFHO0FBQzlCLDJCQUFpQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUNBLFlBQVcsZ0JBQWdCLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFBQSxRQUMzRSxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFVQSxhQUFTLGdCQUFnQixTQUFTLGVBQWU7QUFHL0MsVUFBSSxlQUFlO0FBQ2pCLGVBQU8sT0FBTyxhQUFhO0FBQUEsTUFDN0I7QUFFQSxhQUFPLGNBQWMsT0FBTyxJQUFJLElBQUk7QUFBQSxJQUN0QztBQU1BLGFBQVMsY0FBYyxTQUFTO0FBQzlCLGFBQU8sZ0JBQWdCLFNBQVMsUUFBUSxZQUFZLENBQUM7QUFBQSxJQUN2RDtBQVlBLFFBQU0sbUJBQW1CLENBQUM7QUFLMUIsUUFBTSxRQUFRLENBQUMsWUFBWTtBQUN6QixjQUFRLE1BQU0sT0FBTztBQUFBLElBQ3ZCO0FBTUEsUUFBTSxPQUFPLENBQUMsWUFBWSxTQUFTO0FBQ2pDLGNBQVEsSUFBSSxTQUFTLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxJQUN6QztBQU1BLFFBQU0sYUFBYSxDQUFDQyxVQUFTLFlBQVk7QUFDdkMsVUFBSSxpQkFBaUIsR0FBR0EsUUFBTyxJQUFJLE9BQU8sRUFBRTtBQUFHO0FBRS9DLGNBQVEsSUFBSSxvQkFBb0JBLFFBQU8sS0FBSyxPQUFPLEVBQUU7QUFDckQsdUJBQWlCLEdBQUdBLFFBQU8sSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUFBLElBQzlDO0FBUUEsUUFBTSxrQkFBa0IsSUFBSSxNQUFNO0FBOEJsQyxhQUFTLGdCQUFnQixNQUFNLFNBQVMsRUFBRSxJQUFJLEdBQUc7QUFDL0MsVUFBSSxTQUFTO0FBQ2IsWUFBTSxhQUFhLEtBQUssR0FBRztBQUUzQixZQUFNLE9BQU8sQ0FBQztBQUVkLFlBQU0sWUFBWSxDQUFDO0FBRW5CLGVBQVMsSUFBSSxHQUFHLEtBQUssUUFBUSxRQUFRLEtBQUs7QUFDeEMsa0JBQVUsSUFBSSxNQUFNLElBQUksV0FBVyxDQUFDO0FBQ3BDLGFBQUssSUFBSSxNQUFNLElBQUk7QUFDbkIsa0JBQVUsaUJBQWlCLFFBQVEsSUFBSSxDQUFDLENBQUM7QUFBQSxNQUMzQztBQUdBLFdBQUssR0FBRyxJQUFJO0FBQ1osV0FBSyxHQUFHLEVBQUUsUUFBUTtBQUNsQixXQUFLLEdBQUcsRUFBRSxTQUFTO0FBQUEsSUFDckI7QUFLQSxhQUFTLGdCQUFnQixNQUFNO0FBQzdCLFVBQUksQ0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFLO0FBQUc7QUFFaEMsVUFBSSxLQUFLLFFBQVEsS0FBSyxnQkFBZ0IsS0FBSyxhQUFhO0FBQ3RELGNBQU0sb0VBQW9FO0FBQzFFLGNBQU07QUFBQSxNQUNSO0FBRUEsVUFBSSxPQUFPLEtBQUssZUFBZSxZQUFZLEtBQUssZUFBZSxNQUFNO0FBQ25FLGNBQU0sMkJBQTJCO0FBQ2pDLGNBQU07QUFBQSxNQUNSO0FBRUEsc0JBQWdCLE1BQU0sS0FBSyxPQUFPLEVBQUUsS0FBSyxhQUFhLENBQUM7QUFDdkQsV0FBSyxRQUFRLHVCQUF1QixLQUFLLE9BQU8sRUFBRSxVQUFVLEdBQUcsQ0FBQztBQUFBLElBQ2xFO0FBS0EsYUFBUyxjQUFjLE1BQU07QUFDM0IsVUFBSSxDQUFDLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFBRztBQUU5QixVQUFJLEtBQUssUUFBUSxLQUFLLGNBQWMsS0FBSyxXQUFXO0FBQ2xELGNBQU0sOERBQThEO0FBQ3BFLGNBQU07QUFBQSxNQUNSO0FBRUEsVUFBSSxPQUFPLEtBQUssYUFBYSxZQUFZLEtBQUssYUFBYSxNQUFNO0FBQy9ELGNBQU0seUJBQXlCO0FBQy9CLGNBQU07QUFBQSxNQUNSO0FBRUEsc0JBQWdCLE1BQU0sS0FBSyxLQUFLLEVBQUUsS0FBSyxXQUFXLENBQUM7QUFDbkQsV0FBSyxNQUFNLHVCQUF1QixLQUFLLEtBQUssRUFBRSxVQUFVLEdBQUcsQ0FBQztBQUFBLElBQzlEO0FBYUEsYUFBUyxXQUFXLE1BQU07QUFDeEIsVUFBSSxLQUFLLFNBQVMsT0FBTyxLQUFLLFVBQVUsWUFBWSxLQUFLLFVBQVUsTUFBTTtBQUN2RSxhQUFLLGFBQWEsS0FBSztBQUN2QixlQUFPLEtBQUs7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUtBLGFBQVMsV0FBVyxNQUFNO0FBQ3hCLGlCQUFXLElBQUk7QUFFZixVQUFJLE9BQU8sS0FBSyxlQUFlLFVBQVU7QUFDdkMsYUFBSyxhQUFhLEVBQUUsT0FBTyxLQUFLLFdBQVc7QUFBQSxNQUM3QztBQUNBLFVBQUksT0FBTyxLQUFLLGFBQWEsVUFBVTtBQUNyQyxhQUFLLFdBQVcsRUFBRSxPQUFPLEtBQUssU0FBUztBQUFBLE1BQ3pDO0FBRUEsc0JBQWdCLElBQUk7QUFDcEIsb0JBQWMsSUFBSTtBQUFBLElBQ3BCO0FBb0JBLGFBQVMsZ0JBQWdCLFVBQVU7QUFPakMsZUFBUyxPQUFPLE9BQU8sUUFBUTtBQUM3QixlQUFPLElBQUk7QUFBQSxVQUNULE9BQU8sS0FBSztBQUFBLFVBQ1osT0FDRyxTQUFTLG1CQUFtQixNQUFNLE9BQ2xDLFNBQVMsZUFBZSxNQUFNLE9BQzlCLFNBQVMsTUFBTTtBQUFBLFFBQ3BCO0FBQUEsTUFDRjtBQUFBLE1BZUEsTUFBTSxXQUFXO0FBQUEsUUFDZixjQUFjO0FBQ1osZUFBSyxlQUFlLENBQUM7QUFFckIsZUFBSyxVQUFVLENBQUM7QUFDaEIsZUFBSyxVQUFVO0FBQ2YsZUFBSyxXQUFXO0FBQUEsUUFDbEI7QUFBQTtBQUFBLFFBR0EsUUFBUSxJQUFJLE1BQU07QUFDaEIsZUFBSyxXQUFXLEtBQUs7QUFFckIsZUFBSyxhQUFhLEtBQUssT0FBTyxJQUFJO0FBQ2xDLGVBQUssUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDNUIsZUFBSyxXQUFXLGlCQUFpQixFQUFFLElBQUk7QUFBQSxRQUN6QztBQUFBLFFBRUEsVUFBVTtBQUNSLGNBQUksS0FBSyxRQUFRLFdBQVcsR0FBRztBQUc3QixpQkFBSyxPQUFPLE1BQU07QUFBQSxVQUNwQjtBQUNBLGdCQUFNLGNBQWMsS0FBSyxRQUFRLElBQUksUUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoRCxlQUFLLFlBQVksT0FBTyx1QkFBdUIsYUFBYSxFQUFFLFVBQVUsSUFBSSxDQUFDLEdBQUcsSUFBSTtBQUNwRixlQUFLLFlBQVk7QUFBQSxRQUNuQjtBQUFBO0FBQUEsUUFHQSxLQUFLLEdBQUc7QUFDTixlQUFLLFVBQVUsWUFBWSxLQUFLO0FBQ2hDLGdCQUFNLFFBQVEsS0FBSyxVQUFVLEtBQUssQ0FBQztBQUNuQyxjQUFJLENBQUMsT0FBTztBQUFFLG1CQUFPO0FBQUEsVUFBTTtBQUczQixnQkFBTSxJQUFJLE1BQU0sVUFBVSxDQUFDLElBQUlDLE9BQU1BLEtBQUksS0FBSyxPQUFPLE1BQVM7QUFFOUQsZ0JBQU0sWUFBWSxLQUFLLGFBQWEsQ0FBQztBQUdyQyxnQkFBTSxPQUFPLEdBQUcsQ0FBQztBQUVqQixpQkFBTyxPQUFPLE9BQU8sT0FBTyxTQUFTO0FBQUEsUUFDdkM7QUFBQSxNQUNGO0FBQUEsTUFpQ0EsTUFBTSxvQkFBb0I7QUFBQSxRQUN4QixjQUFjO0FBRVosZUFBSyxRQUFRLENBQUM7QUFFZCxlQUFLLGVBQWUsQ0FBQztBQUNyQixlQUFLLFFBQVE7QUFFYixlQUFLLFlBQVk7QUFDakIsZUFBSyxhQUFhO0FBQUEsUUFDcEI7QUFBQTtBQUFBLFFBR0EsV0FBVyxPQUFPO0FBQ2hCLGNBQUksS0FBSyxhQUFhLEtBQUs7QUFBRyxtQkFBTyxLQUFLLGFBQWEsS0FBSztBQUU1RCxnQkFBTSxVQUFVLElBQUksV0FBVztBQUMvQixlQUFLLE1BQU0sTUFBTSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sUUFBUSxRQUFRLElBQUksSUFBSSxDQUFDO0FBQ3pFLGtCQUFRLFFBQVE7QUFDaEIsZUFBSyxhQUFhLEtBQUssSUFBSTtBQUMzQixpQkFBTztBQUFBLFFBQ1Q7QUFBQSxRQUVBLDZCQUE2QjtBQUMzQixpQkFBTyxLQUFLLGVBQWU7QUFBQSxRQUM3QjtBQUFBLFFBRUEsY0FBYztBQUNaLGVBQUssYUFBYTtBQUFBLFFBQ3BCO0FBQUE7QUFBQSxRQUdBLFFBQVEsSUFBSSxNQUFNO0FBQ2hCLGVBQUssTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDMUIsY0FBSSxLQUFLLFNBQVM7QUFBUyxpQkFBSztBQUFBLFFBQ2xDO0FBQUE7QUFBQSxRQUdBLEtBQUssR0FBRztBQUNOLGdCQUFNLElBQUksS0FBSyxXQUFXLEtBQUssVUFBVTtBQUN6QyxZQUFFLFlBQVksS0FBSztBQUNuQixjQUFJLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFpQ3JCLGNBQUksS0FBSywyQkFBMkIsR0FBRztBQUNyQyxnQkFBSSxVQUFVLE9BQU8sVUFBVSxLQUFLO0FBQVc7QUFBQSxpQkFBTztBQUNwRCxvQkFBTSxLQUFLLEtBQUssV0FBVyxDQUFDO0FBQzVCLGlCQUFHLFlBQVksS0FBSyxZQUFZO0FBQ2hDLHVCQUFTLEdBQUcsS0FBSyxDQUFDO0FBQUEsWUFDcEI7QUFBQSxVQUNGO0FBRUEsY0FBSSxRQUFRO0FBQ1YsaUJBQUssY0FBYyxPQUFPLFdBQVc7QUFDckMsZ0JBQUksS0FBSyxlQUFlLEtBQUssT0FBTztBQUVsQyxtQkFBSyxZQUFZO0FBQUEsWUFDbkI7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQVNBLGVBQVMsZUFBZSxNQUFNO0FBQzVCLGNBQU0sS0FBSyxJQUFJLG9CQUFvQjtBQUVuQyxhQUFLLFNBQVMsUUFBUSxVQUFRLEdBQUcsUUFBUSxLQUFLLE9BQU8sRUFBRSxNQUFNLE1BQU0sTUFBTSxRQUFRLENBQUMsQ0FBQztBQUVuRixZQUFJLEtBQUssZUFBZTtBQUN0QixhQUFHLFFBQVEsS0FBSyxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFBQSxRQUNoRDtBQUNBLFlBQUksS0FBSyxTQUFTO0FBQ2hCLGFBQUcsUUFBUSxLQUFLLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUFBLFFBQzlDO0FBRUEsZUFBTztBQUFBLE1BQ1Q7QUF5Q0EsZUFBUyxZQUFZLE1BQU0sUUFBUTtBQUNqQyxjQUFNO0FBQUE7QUFBQSxVQUFtQztBQUFBO0FBQ3pDLFlBQUksS0FBSztBQUFZLGlCQUFPO0FBRTVCO0FBQUEsVUFDRTtBQUFBO0FBQUE7QUFBQSxVQUdBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGLEVBQUUsUUFBUSxTQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFFbEMsaUJBQVMsbUJBQW1CLFFBQVEsU0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRzVELGFBQUssZ0JBQWdCO0FBRXJCO0FBQUEsVUFDRTtBQUFBO0FBQUE7QUFBQSxVQUdBO0FBQUE7QUFBQSxVQUVBO0FBQUEsUUFDRixFQUFFLFFBQVEsU0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRWxDLGFBQUssYUFBYTtBQUVsQixZQUFJLGlCQUFpQjtBQUNyQixZQUFJLE9BQU8sS0FBSyxhQUFhLFlBQVksS0FBSyxTQUFTLFVBQVU7QUFJL0QsZUFBSyxXQUFXLE9BQU8sT0FBTyxDQUFDLEdBQUcsS0FBSyxRQUFRO0FBQy9DLDJCQUFpQixLQUFLLFNBQVM7QUFDL0IsaUJBQU8sS0FBSyxTQUFTO0FBQUEsUUFDdkI7QUFDQSx5QkFBaUIsa0JBQWtCO0FBRW5DLFlBQUksS0FBSyxVQUFVO0FBQ2pCLGVBQUssV0FBVyxnQkFBZ0IsS0FBSyxVQUFVLFNBQVMsZ0JBQWdCO0FBQUEsUUFDMUU7QUFFQSxjQUFNLG1CQUFtQixPQUFPLGdCQUFnQixJQUFJO0FBRXBELFlBQUksUUFBUTtBQUNWLGNBQUksQ0FBQyxLQUFLO0FBQU8saUJBQUssUUFBUTtBQUM5QixnQkFBTSxVQUFVLE9BQU8sTUFBTSxLQUFLO0FBQ2xDLGNBQUksQ0FBQyxLQUFLLE9BQU8sQ0FBQyxLQUFLO0FBQWdCLGlCQUFLLE1BQU07QUFDbEQsY0FBSSxLQUFLO0FBQUssa0JBQU0sUUFBUSxPQUFPLE1BQU0sR0FBRztBQUM1QyxnQkFBTSxnQkFBZ0IsT0FBTyxNQUFNLEdBQUcsS0FBSztBQUMzQyxjQUFJLEtBQUssa0JBQWtCLE9BQU8sZUFBZTtBQUMvQyxrQkFBTSxrQkFBa0IsS0FBSyxNQUFNLE1BQU0sTUFBTSxPQUFPO0FBQUEsVUFDeEQ7QUFBQSxRQUNGO0FBQ0EsWUFBSSxLQUFLO0FBQVMsZ0JBQU0sWUFBWTtBQUFBO0FBQUEsWUFBdUMsS0FBSztBQUFBLFVBQVE7QUFDeEYsWUFBSSxDQUFDLEtBQUs7QUFBVSxlQUFLLFdBQVcsQ0FBQztBQUVyQyxhQUFLLFdBQVcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxLQUFLLFNBQVMsSUFBSSxTQUFTLEdBQUc7QUFDekQsaUJBQU8sa0JBQWtCLE1BQU0sU0FBUyxPQUFPLENBQUM7QUFBQSxRQUNsRCxDQUFDLENBQUM7QUFDRixhQUFLLFNBQVMsUUFBUSxTQUFTLEdBQUc7QUFBRTtBQUFBO0FBQUEsWUFBK0I7QUFBQSxZQUFJO0FBQUEsVUFBSztBQUFBLFFBQUcsQ0FBQztBQUVoRixZQUFJLEtBQUssUUFBUTtBQUNmLHNCQUFZLEtBQUssUUFBUSxNQUFNO0FBQUEsUUFDakM7QUFFQSxjQUFNLFVBQVUsZUFBZSxLQUFLO0FBQ3BDLGVBQU87QUFBQSxNQUNUO0FBRUEsVUFBSSxDQUFDLFNBQVM7QUFBb0IsaUJBQVMscUJBQXFCLENBQUM7QUFHakUsVUFBSSxTQUFTLFlBQVksU0FBUyxTQUFTLFNBQVMsTUFBTSxHQUFHO0FBQzNELGNBQU0sSUFBSSxNQUFNLDJGQUEyRjtBQUFBLE1BQzdHO0FBR0EsZUFBUyxtQkFBbUIsVUFBVSxTQUFTLG9CQUFvQixDQUFDLENBQUM7QUFFckUsYUFBTztBQUFBO0FBQUEsUUFBK0I7QUFBQSxNQUFTO0FBQUEsSUFDakQ7QUFhQSxhQUFTLG1CQUFtQixNQUFNO0FBQ2hDLFVBQUksQ0FBQztBQUFNLGVBQU87QUFFbEIsYUFBTyxLQUFLLGtCQUFrQixtQkFBbUIsS0FBSyxNQUFNO0FBQUEsSUFDOUQ7QUFZQSxhQUFTLGtCQUFrQixNQUFNO0FBQy9CLFVBQUksS0FBSyxZQUFZLENBQUMsS0FBSyxnQkFBZ0I7QUFDekMsYUFBSyxpQkFBaUIsS0FBSyxTQUFTLElBQUksU0FBUyxTQUFTO0FBQ3hELGlCQUFPLFVBQVUsTUFBTSxFQUFFLFVBQVUsS0FBSyxHQUFHLE9BQU87QUFBQSxRQUNwRCxDQUFDO0FBQUEsTUFDSDtBQUtBLFVBQUksS0FBSyxnQkFBZ0I7QUFDdkIsZUFBTyxLQUFLO0FBQUEsTUFDZDtBQU1BLFVBQUksbUJBQW1CLElBQUksR0FBRztBQUM1QixlQUFPLFVBQVUsTUFBTSxFQUFFLFFBQVEsS0FBSyxTQUFTLFVBQVUsS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDO0FBQUEsTUFDaEY7QUFFQSxVQUFJLE9BQU8sU0FBUyxJQUFJLEdBQUc7QUFDekIsZUFBTyxVQUFVLElBQUk7QUFBQSxNQUN2QjtBQUdBLGFBQU87QUFBQSxJQUNUO0FBRUEsUUFBSSxVQUFVO0FBRWQsUUFBTSxxQkFBTixjQUFpQyxNQUFNO0FBQUEsTUFDckMsWUFBWSxRQUFRLE1BQU07QUFDeEIsY0FBTSxNQUFNO0FBQ1osYUFBSyxPQUFPO0FBQ1osYUFBSyxPQUFPO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUErQkEsUUFBTSxTQUFTO0FBQ2YsUUFBTSxVQUFVO0FBQ2hCLFFBQU0sV0FBVyxPQUFPLFNBQVM7QUFDakMsUUFBTSxtQkFBbUI7QUFNekIsUUFBTSxPQUFPLFNBQVMsTUFBTTtBQUcxQixZQUFNLFlBQVksdUJBQU8sT0FBTyxJQUFJO0FBRXBDLFlBQU0sVUFBVSx1QkFBTyxPQUFPLElBQUk7QUFFbEMsWUFBTSxVQUFVLENBQUM7QUFJakIsVUFBSSxZQUFZO0FBQ2hCLFlBQU0scUJBQXFCO0FBRTNCLFlBQU0scUJBQXFCLEVBQUUsbUJBQW1CLE1BQU0sTUFBTSxjQUFjLFVBQVUsQ0FBQyxFQUFFO0FBS3ZGLFVBQUksVUFBVTtBQUFBLFFBQ1oscUJBQXFCO0FBQUEsUUFDckIsb0JBQW9CO0FBQUEsUUFDcEIsZUFBZTtBQUFBLFFBQ2Ysa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsV0FBVztBQUFBO0FBQUE7QUFBQSxRQUdYLFdBQVc7QUFBQSxNQUNiO0FBUUEsZUFBUyxtQkFBbUIsY0FBYztBQUN4QyxlQUFPLFFBQVEsY0FBYyxLQUFLLFlBQVk7QUFBQSxNQUNoRDtBQUtBLGVBQVMsY0FBYyxPQUFPO0FBQzVCLFlBQUksVUFBVSxNQUFNLFlBQVk7QUFFaEMsbUJBQVcsTUFBTSxhQUFhLE1BQU0sV0FBVyxZQUFZO0FBRzNELGNBQU0sUUFBUSxRQUFRLGlCQUFpQixLQUFLLE9BQU87QUFDbkQsWUFBSSxPQUFPO0FBQ1QsZ0JBQU0sV0FBVyxZQUFZLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLGNBQUksQ0FBQyxVQUFVO0FBQ2IsaUJBQUssbUJBQW1CLFFBQVEsTUFBTSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGlCQUFLLHFEQUFxRCxLQUFLO0FBQUEsVUFDakU7QUFDQSxpQkFBTyxXQUFXLE1BQU0sQ0FBQyxJQUFJO0FBQUEsUUFDL0I7QUFFQSxlQUFPLFFBQ0osTUFBTSxLQUFLLEVBQ1gsS0FBSyxDQUFDLFdBQVcsbUJBQW1CLE1BQU0sS0FBSyxZQUFZLE1BQU0sQ0FBQztBQUFBLE1BQ3ZFO0FBdUJBLGVBQVNDLFdBQVUsb0JBQW9CLGVBQWUsZ0JBQWdCO0FBQ3BFLFlBQUksT0FBTztBQUNYLFlBQUksZUFBZTtBQUNuQixZQUFJLE9BQU8sa0JBQWtCLFVBQVU7QUFDckMsaUJBQU87QUFDUCwyQkFBaUIsY0FBYztBQUMvQix5QkFBZSxjQUFjO0FBQUEsUUFDL0IsT0FBTztBQUVMLHFCQUFXLFVBQVUscURBQXFEO0FBQzFFLHFCQUFXLFVBQVUsdUdBQXVHO0FBQzVILHlCQUFlO0FBQ2YsaUJBQU87QUFBQSxRQUNUO0FBSUEsWUFBSSxtQkFBbUIsUUFBVztBQUFFLDJCQUFpQjtBQUFBLFFBQU07QUFHM0QsY0FBTSxVQUFVO0FBQUEsVUFDZDtBQUFBLFVBQ0EsVUFBVTtBQUFBLFFBQ1o7QUFHQSxhQUFLLG9CQUFvQixPQUFPO0FBSWhDLGNBQU0sU0FBUyxRQUFRLFNBQ25CLFFBQVEsU0FDUixXQUFXLFFBQVEsVUFBVSxRQUFRLE1BQU0sY0FBYztBQUU3RCxlQUFPLE9BQU8sUUFBUTtBQUV0QixhQUFLLG1CQUFtQixNQUFNO0FBRTlCLGVBQU87QUFBQSxNQUNUO0FBV0EsZUFBUyxXQUFXLGNBQWMsaUJBQWlCLGdCQUFnQixjQUFjO0FBQy9FLGNBQU0sY0FBYyx1QkFBTyxPQUFPLElBQUk7QUFRdEMsaUJBQVMsWUFBWSxNQUFNLFdBQVc7QUFDcEMsaUJBQU8sS0FBSyxTQUFTLFNBQVM7QUFBQSxRQUNoQztBQUVBLGlCQUFTLGtCQUFrQjtBQUN6QixjQUFJLENBQUMsSUFBSSxVQUFVO0FBQ2pCLG9CQUFRLFFBQVEsVUFBVTtBQUMxQjtBQUFBLFVBQ0Y7QUFFQSxjQUFJLFlBQVk7QUFDaEIsY0FBSSxpQkFBaUIsWUFBWTtBQUNqQyxjQUFJLFFBQVEsSUFBSSxpQkFBaUIsS0FBSyxVQUFVO0FBQ2hELGNBQUksTUFBTTtBQUVWLGlCQUFPLE9BQU87QUFDWixtQkFBTyxXQUFXLFVBQVUsV0FBVyxNQUFNLEtBQUs7QUFDbEQsa0JBQU0sT0FBTyxTQUFTLG1CQUFtQixNQUFNLENBQUMsRUFBRSxZQUFZLElBQUksTUFBTSxDQUFDO0FBQ3pFLGtCQUFNLE9BQU8sWUFBWSxLQUFLLElBQUk7QUFDbEMsZ0JBQUksTUFBTTtBQUNSLG9CQUFNLENBQUMsTUFBTSxnQkFBZ0IsSUFBSTtBQUNqQyxzQkFBUSxRQUFRLEdBQUc7QUFDbkIsb0JBQU07QUFFTiwwQkFBWSxJQUFJLEtBQUssWUFBWSxJQUFJLEtBQUssS0FBSztBQUMvQyxrQkFBSSxZQUFZLElBQUksS0FBSztBQUFrQiw2QkFBYTtBQUN4RCxrQkFBSSxLQUFLLFdBQVcsR0FBRyxHQUFHO0FBR3hCLHVCQUFPLE1BQU0sQ0FBQztBQUFBLGNBQ2hCLE9BQU87QUFDTCxzQkFBTSxXQUFXLFNBQVMsaUJBQWlCLElBQUksS0FBSztBQUNwRCw0QkFBWSxNQUFNLENBQUMsR0FBRyxRQUFRO0FBQUEsY0FDaEM7QUFBQSxZQUNGLE9BQU87QUFDTCxxQkFBTyxNQUFNLENBQUM7QUFBQSxZQUNoQjtBQUNBLHdCQUFZLElBQUksaUJBQWlCO0FBQ2pDLG9CQUFRLElBQUksaUJBQWlCLEtBQUssVUFBVTtBQUFBLFVBQzlDO0FBQ0EsaUJBQU8sV0FBVyxVQUFVLFNBQVM7QUFDckMsa0JBQVEsUUFBUSxHQUFHO0FBQUEsUUFDckI7QUFFQSxpQkFBUyxxQkFBcUI7QUFDNUIsY0FBSSxlQUFlO0FBQUk7QUFFdkIsY0FBSUMsVUFBUztBQUViLGNBQUksT0FBTyxJQUFJLGdCQUFnQixVQUFVO0FBQ3ZDLGdCQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsR0FBRztBQUMvQixzQkFBUSxRQUFRLFVBQVU7QUFDMUI7QUFBQSxZQUNGO0FBQ0EsWUFBQUEsVUFBUyxXQUFXLElBQUksYUFBYSxZQUFZLE1BQU0sY0FBYyxJQUFJLFdBQVcsQ0FBQztBQUNyRiwwQkFBYyxJQUFJLFdBQVc7QUFBQSxZQUFpQ0EsUUFBTztBQUFBLFVBQ3ZFLE9BQU87QUFDTCxZQUFBQSxVQUFTLGNBQWMsWUFBWSxJQUFJLFlBQVksU0FBUyxJQUFJLGNBQWMsSUFBSTtBQUFBLFVBQ3BGO0FBTUEsY0FBSSxJQUFJLFlBQVksR0FBRztBQUNyQix5QkFBYUEsUUFBTztBQUFBLFVBQ3RCO0FBQ0Esa0JBQVEsaUJBQWlCQSxRQUFPLFVBQVVBLFFBQU8sUUFBUTtBQUFBLFFBQzNEO0FBRUEsaUJBQVMsZ0JBQWdCO0FBQ3ZCLGNBQUksSUFBSSxlQUFlLE1BQU07QUFDM0IsK0JBQW1CO0FBQUEsVUFDckIsT0FBTztBQUNMLDRCQUFnQjtBQUFBLFVBQ2xCO0FBQ0EsdUJBQWE7QUFBQSxRQUNmO0FBTUEsaUJBQVMsWUFBWSxTQUFTLE9BQU87QUFDbkMsY0FBSSxZQUFZO0FBQUk7QUFFcEIsa0JBQVEsV0FBVyxLQUFLO0FBQ3hCLGtCQUFRLFFBQVEsT0FBTztBQUN2QixrQkFBUSxTQUFTO0FBQUEsUUFDbkI7QUFNQSxpQkFBUyxlQUFlLE9BQU8sT0FBTztBQUNwQyxjQUFJLElBQUk7QUFDUixnQkFBTSxNQUFNLE1BQU0sU0FBUztBQUMzQixpQkFBTyxLQUFLLEtBQUs7QUFDZixnQkFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLEdBQUc7QUFBRTtBQUFLO0FBQUEsWUFBVTtBQUN0QyxrQkFBTSxRQUFRLFNBQVMsaUJBQWlCLE1BQU0sQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQzVELGtCQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLGdCQUFJLE9BQU87QUFDVCwwQkFBWSxNQUFNLEtBQUs7QUFBQSxZQUN6QixPQUFPO0FBQ0wsMkJBQWE7QUFDYiw4QkFBZ0I7QUFDaEIsMkJBQWE7QUFBQSxZQUNmO0FBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQU1BLGlCQUFTLGFBQWEsTUFBTSxPQUFPO0FBQ2pDLGNBQUksS0FBSyxTQUFTLE9BQU8sS0FBSyxVQUFVLFVBQVU7QUFDaEQsb0JBQVEsU0FBUyxTQUFTLGlCQUFpQixLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFBQSxVQUN0RTtBQUNBLGNBQUksS0FBSyxZQUFZO0FBRW5CLGdCQUFJLEtBQUssV0FBVyxPQUFPO0FBQ3pCLDBCQUFZLFlBQVksU0FBUyxpQkFBaUIsS0FBSyxXQUFXLEtBQUssS0FBSyxLQUFLLFdBQVcsS0FBSztBQUNqRywyQkFBYTtBQUFBLFlBQ2YsV0FBVyxLQUFLLFdBQVcsUUFBUTtBQUVqQyw2QkFBZSxLQUFLLFlBQVksS0FBSztBQUNyQywyQkFBYTtBQUFBLFlBQ2Y7QUFBQSxVQUNGO0FBRUEsZ0JBQU0sT0FBTyxPQUFPLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNwRCxpQkFBTztBQUFBLFFBQ1Q7QUFRQSxpQkFBUyxVQUFVLE1BQU0sT0FBTyxvQkFBb0I7QUFDbEQsY0FBSSxVQUFVLFdBQVcsS0FBSyxPQUFPLGtCQUFrQjtBQUV2RCxjQUFJLFNBQVM7QUFDWCxnQkFBSSxLQUFLLFFBQVEsR0FBRztBQUNsQixvQkFBTSxPQUFPLElBQUksU0FBUyxJQUFJO0FBQzlCLG1CQUFLLFFBQVEsRUFBRSxPQUFPLElBQUk7QUFDMUIsa0JBQUksS0FBSztBQUFnQiwwQkFBVTtBQUFBLFlBQ3JDO0FBRUEsZ0JBQUksU0FBUztBQUNYLHFCQUFPLEtBQUssY0FBYyxLQUFLLFFBQVE7QUFDckMsdUJBQU8sS0FBSztBQUFBLGNBQ2Q7QUFDQSxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBR0EsY0FBSSxLQUFLLGdCQUFnQjtBQUN2QixtQkFBTyxVQUFVLEtBQUssUUFBUSxPQUFPLGtCQUFrQjtBQUFBLFVBQ3pEO0FBQUEsUUFDRjtBQU9BLGlCQUFTLFNBQVMsUUFBUTtBQUN4QixjQUFJLElBQUksUUFBUSxlQUFlLEdBQUc7QUFHaEMsMEJBQWMsT0FBTyxDQUFDO0FBQ3RCLG1CQUFPO0FBQUEsVUFDVCxPQUFPO0FBR0wsdUNBQTJCO0FBQzNCLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFRQSxpQkFBUyxhQUFhLE9BQU87QUFDM0IsZ0JBQU0sU0FBUyxNQUFNLENBQUM7QUFDdEIsZ0JBQU0sVUFBVSxNQUFNO0FBRXRCLGdCQUFNLE9BQU8sSUFBSSxTQUFTLE9BQU87QUFFakMsZ0JBQU0sa0JBQWtCLENBQUMsUUFBUSxlQUFlLFFBQVEsVUFBVSxDQUFDO0FBQ25FLHFCQUFXLE1BQU0saUJBQWlCO0FBQ2hDLGdCQUFJLENBQUM7QUFBSTtBQUNULGVBQUcsT0FBTyxJQUFJO0FBQ2QsZ0JBQUksS0FBSztBQUFnQixxQkFBTyxTQUFTLE1BQU07QUFBQSxVQUNqRDtBQUVBLGNBQUksUUFBUSxNQUFNO0FBQ2hCLDBCQUFjO0FBQUEsVUFDaEIsT0FBTztBQUNMLGdCQUFJLFFBQVEsY0FBYztBQUN4Qiw0QkFBYztBQUFBLFlBQ2hCO0FBQ0EsMEJBQWM7QUFDZCxnQkFBSSxDQUFDLFFBQVEsZUFBZSxDQUFDLFFBQVEsY0FBYztBQUNqRCwyQkFBYTtBQUFBLFlBQ2Y7QUFBQSxVQUNGO0FBQ0EsdUJBQWEsU0FBUyxLQUFLO0FBQzNCLGlCQUFPLFFBQVEsY0FBYyxJQUFJLE9BQU87QUFBQSxRQUMxQztBQU9BLGlCQUFTLFdBQVcsT0FBTztBQUN6QixnQkFBTSxTQUFTLE1BQU0sQ0FBQztBQUN0QixnQkFBTSxxQkFBcUIsZ0JBQWdCLFVBQVUsTUFBTSxLQUFLO0FBRWhFLGdCQUFNLFVBQVUsVUFBVSxLQUFLLE9BQU8sa0JBQWtCO0FBQ3hELGNBQUksQ0FBQyxTQUFTO0FBQUUsbUJBQU87QUFBQSxVQUFVO0FBRWpDLGdCQUFNLFNBQVM7QUFDZixjQUFJLElBQUksWUFBWSxJQUFJLFNBQVMsT0FBTztBQUN0QywwQkFBYztBQUNkLHdCQUFZLFFBQVEsSUFBSSxTQUFTLEtBQUs7QUFBQSxVQUN4QyxXQUFXLElBQUksWUFBWSxJQUFJLFNBQVMsUUFBUTtBQUM5QywwQkFBYztBQUNkLDJCQUFlLElBQUksVUFBVSxLQUFLO0FBQUEsVUFDcEMsV0FBVyxPQUFPLE1BQU07QUFDdEIsMEJBQWM7QUFBQSxVQUNoQixPQUFPO0FBQ0wsZ0JBQUksRUFBRSxPQUFPLGFBQWEsT0FBTyxhQUFhO0FBQzVDLDRCQUFjO0FBQUEsWUFDaEI7QUFDQSwwQkFBYztBQUNkLGdCQUFJLE9BQU8sWUFBWTtBQUNyQiwyQkFBYTtBQUFBLFlBQ2Y7QUFBQSxVQUNGO0FBQ0EsYUFBRztBQUNELGdCQUFJLElBQUksT0FBTztBQUNiLHNCQUFRLFVBQVU7QUFBQSxZQUNwQjtBQUNBLGdCQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxhQUFhO0FBQ2pDLDJCQUFhLElBQUk7QUFBQSxZQUNuQjtBQUNBLGtCQUFNLElBQUk7QUFBQSxVQUNaLFNBQVMsUUFBUSxRQUFRO0FBQ3pCLGNBQUksUUFBUSxRQUFRO0FBQ2xCLHlCQUFhLFFBQVEsUUFBUSxLQUFLO0FBQUEsVUFDcEM7QUFDQSxpQkFBTyxPQUFPLFlBQVksSUFBSSxPQUFPO0FBQUEsUUFDdkM7QUFFQSxpQkFBUyx1QkFBdUI7QUFDOUIsZ0JBQU0sT0FBTyxDQUFDO0FBQ2QsbUJBQVMsVUFBVSxLQUFLLFlBQVksVUFBVSxVQUFVLFFBQVEsUUFBUTtBQUN0RSxnQkFBSSxRQUFRLE9BQU87QUFDakIsbUJBQUssUUFBUSxRQUFRLEtBQUs7QUFBQSxZQUM1QjtBQUFBLFVBQ0Y7QUFDQSxlQUFLLFFBQVEsVUFBUSxRQUFRLFNBQVMsSUFBSSxDQUFDO0FBQUEsUUFDN0M7QUFHQSxZQUFJLFlBQVksQ0FBQztBQVFqQixpQkFBUyxjQUFjLGlCQUFpQixPQUFPO0FBQzdDLGdCQUFNLFNBQVMsU0FBUyxNQUFNLENBQUM7QUFHL0Isd0JBQWM7QUFFZCxjQUFJLFVBQVUsTUFBTTtBQUNsQiwwQkFBYztBQUNkLG1CQUFPO0FBQUEsVUFDVDtBQU1BLGNBQUksVUFBVSxTQUFTLFdBQVcsTUFBTSxTQUFTLFNBQVMsVUFBVSxVQUFVLE1BQU0sU0FBUyxXQUFXLElBQUk7QUFFMUcsMEJBQWMsZ0JBQWdCLE1BQU0sTUFBTSxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2hFLGdCQUFJLENBQUMsV0FBVztBQUVkLG9CQUFNLE1BQU0sSUFBSSxNQUFNLHdCQUF3QixZQUFZLEdBQUc7QUFDN0Qsa0JBQUksZUFBZTtBQUNuQixrQkFBSSxVQUFVLFVBQVU7QUFDeEIsb0JBQU07QUFBQSxZQUNSO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBQ0Esc0JBQVk7QUFFWixjQUFJLE1BQU0sU0FBUyxTQUFTO0FBQzFCLG1CQUFPLGFBQWEsS0FBSztBQUFBLFVBQzNCLFdBQVcsTUFBTSxTQUFTLGFBQWEsQ0FBQyxnQkFBZ0I7QUFHdEQsa0JBQU0sTUFBTSxJQUFJLE1BQU0scUJBQXFCLFNBQVMsa0JBQWtCLElBQUksU0FBUyxlQUFlLEdBQUc7QUFDckcsZ0JBQUksT0FBTztBQUNYLGtCQUFNO0FBQUEsVUFDUixXQUFXLE1BQU0sU0FBUyxPQUFPO0FBQy9CLGtCQUFNLFlBQVksV0FBVyxLQUFLO0FBQ2xDLGdCQUFJLGNBQWMsVUFBVTtBQUMxQixxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBS0EsY0FBSSxNQUFNLFNBQVMsYUFBYSxXQUFXLElBQUk7QUFFN0MsbUJBQU87QUFBQSxVQUNUO0FBTUEsY0FBSSxhQUFhLE9BQVUsYUFBYSxNQUFNLFFBQVEsR0FBRztBQUN2RCxrQkFBTSxNQUFNLElBQUksTUFBTSwyREFBMkQ7QUFDakYsa0JBQU07QUFBQSxVQUNSO0FBVUEsd0JBQWM7QUFDZCxpQkFBTyxPQUFPO0FBQUEsUUFDaEI7QUFFQSxjQUFNLFdBQVcsWUFBWSxZQUFZO0FBQ3pDLFlBQUksQ0FBQyxVQUFVO0FBQ2IsZ0JBQU0sbUJBQW1CLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFDcEQsZ0JBQU0sSUFBSSxNQUFNLHdCQUF3QixlQUFlLEdBQUc7QUFBQSxRQUM1RDtBQUVBLGNBQU0sS0FBSyxnQkFBZ0IsUUFBUTtBQUNuQyxZQUFJLFNBQVM7QUFFYixZQUFJLE1BQU0sZ0JBQWdCO0FBRTFCLGNBQU0sZ0JBQWdCLENBQUM7QUFDdkIsY0FBTSxVQUFVLElBQUksUUFBUSxVQUFVLE9BQU87QUFDN0MsNkJBQXFCO0FBQ3JCLFlBQUksYUFBYTtBQUNqQixZQUFJLFlBQVk7QUFDaEIsWUFBSSxRQUFRO0FBQ1osWUFBSSxhQUFhO0FBQ2pCLFlBQUksMkJBQTJCO0FBRS9CLFlBQUk7QUFDRixjQUFJLENBQUMsU0FBUyxjQUFjO0FBQzFCLGdCQUFJLFFBQVEsWUFBWTtBQUV4Qix1QkFBUztBQUNQO0FBQ0Esa0JBQUksMEJBQTBCO0FBRzVCLDJDQUEyQjtBQUFBLGNBQzdCLE9BQU87QUFDTCxvQkFBSSxRQUFRLFlBQVk7QUFBQSxjQUMxQjtBQUNBLGtCQUFJLFFBQVEsWUFBWTtBQUV4QixvQkFBTSxRQUFRLElBQUksUUFBUSxLQUFLLGVBQWU7QUFHOUMsa0JBQUksQ0FBQztBQUFPO0FBRVosb0JBQU0sY0FBYyxnQkFBZ0IsVUFBVSxPQUFPLE1BQU0sS0FBSztBQUNoRSxvQkFBTSxpQkFBaUIsY0FBYyxhQUFhLEtBQUs7QUFDdkQsc0JBQVEsTUFBTSxRQUFRO0FBQUEsWUFDeEI7QUFDQSwwQkFBYyxnQkFBZ0IsVUFBVSxLQUFLLENBQUM7QUFBQSxVQUNoRCxPQUFPO0FBQ0wscUJBQVMsYUFBYSxpQkFBaUIsT0FBTztBQUFBLFVBQ2hEO0FBRUEsa0JBQVEsU0FBUztBQUNqQixtQkFBUyxRQUFRLE9BQU87QUFFeEIsaUJBQU87QUFBQSxZQUNMLFVBQVU7QUFBQSxZQUNWLE9BQU87QUFBQSxZQUNQO0FBQUEsWUFDQSxTQUFTO0FBQUEsWUFDVCxVQUFVO0FBQUEsWUFDVixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0YsU0FBUyxLQUFLO0FBQ1osY0FBSSxJQUFJLFdBQVcsSUFBSSxRQUFRLFNBQVMsU0FBUyxHQUFHO0FBQ2xELG1CQUFPO0FBQUEsY0FDTCxVQUFVO0FBQUEsY0FDVixPQUFPLE9BQU8sZUFBZTtBQUFBLGNBQzdCLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixTQUFTLElBQUk7QUFBQSxnQkFDYjtBQUFBLGdCQUNBLFNBQVMsZ0JBQWdCLE1BQU0sUUFBUSxLQUFLLFFBQVEsR0FBRztBQUFBLGdCQUN2RCxNQUFNLElBQUk7QUFBQSxnQkFDVixhQUFhO0FBQUEsY0FDZjtBQUFBLGNBQ0EsVUFBVTtBQUFBLFlBQ1o7QUFBQSxVQUNGLFdBQVcsV0FBVztBQUNwQixtQkFBTztBQUFBLGNBQ0wsVUFBVTtBQUFBLGNBQ1YsT0FBTyxPQUFPLGVBQWU7QUFBQSxjQUM3QixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsY0FDWCxhQUFhO0FBQUEsY0FDYixVQUFVO0FBQUEsY0FDVixNQUFNO0FBQUEsWUFDUjtBQUFBLFVBQ0YsT0FBTztBQUNMLGtCQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBU0EsZUFBUyx3QkFBd0IsTUFBTTtBQUNyQyxjQUFNLFNBQVM7QUFBQSxVQUNiLE9BQU8sT0FBTyxJQUFJO0FBQUEsVUFDbEIsU0FBUztBQUFBLFVBQ1QsV0FBVztBQUFBLFVBQ1gsTUFBTTtBQUFBLFVBQ04sVUFBVSxJQUFJLFFBQVEsVUFBVSxPQUFPO0FBQUEsUUFDekM7QUFDQSxlQUFPLFNBQVMsUUFBUSxJQUFJO0FBQzVCLGVBQU87QUFBQSxNQUNUO0FBZ0JBLGVBQVMsY0FBYyxNQUFNLGdCQUFnQjtBQUMzQyx5QkFBaUIsa0JBQWtCLFFBQVEsYUFBYSxPQUFPLEtBQUssU0FBUztBQUM3RSxjQUFNLFlBQVksd0JBQXdCLElBQUk7QUFFOUMsY0FBTSxVQUFVLGVBQWUsT0FBTyxXQUFXLEVBQUUsT0FBTyxhQUFhLEVBQUU7QUFBQSxVQUFJLFVBQzNFLFdBQVcsTUFBTSxNQUFNLEtBQUs7QUFBQSxRQUM5QjtBQUNBLGdCQUFRLFFBQVEsU0FBUztBQUV6QixjQUFNLFNBQVMsUUFBUSxLQUFLLENBQUMsR0FBRyxNQUFNO0FBRXBDLGNBQUksRUFBRSxjQUFjLEVBQUU7QUFBVyxtQkFBTyxFQUFFLFlBQVksRUFBRTtBQUl4RCxjQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVU7QUFDNUIsZ0JBQUksWUFBWSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsVUFBVTtBQUNyRCxxQkFBTztBQUFBLFlBQ1QsV0FBVyxZQUFZLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxVQUFVO0FBQzVELHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFNQSxpQkFBTztBQUFBLFFBQ1QsQ0FBQztBQUVELGNBQU0sQ0FBQyxNQUFNLFVBQVUsSUFBSTtBQUczQixjQUFNLFNBQVM7QUFDZixlQUFPLGFBQWE7QUFFcEIsZUFBTztBQUFBLE1BQ1Q7QUFTQSxlQUFTLGdCQUFnQixTQUFTLGFBQWEsWUFBWTtBQUN6RCxjQUFNLFdBQVksZUFBZSxRQUFRLFdBQVcsS0FBTTtBQUUxRCxnQkFBUSxVQUFVLElBQUksTUFBTTtBQUM1QixnQkFBUSxVQUFVLElBQUksWUFBWSxRQUFRLEVBQUU7QUFBQSxNQUM5QztBQU9BLGVBQVMsaUJBQWlCLFNBQVM7QUFFakMsWUFBSSxPQUFPO0FBQ1gsY0FBTSxXQUFXLGNBQWMsT0FBTztBQUV0QyxZQUFJLG1CQUFtQixRQUFRO0FBQUc7QUFFbEM7QUFBQSxVQUFLO0FBQUEsVUFDSCxFQUFFLElBQUksU0FBUyxTQUFTO0FBQUEsUUFBQztBQUUzQixZQUFJLFFBQVEsUUFBUSxhQUFhO0FBQy9CLGtCQUFRLElBQUksMEZBQTBGLE9BQU87QUFDN0c7QUFBQSxRQUNGO0FBT0EsWUFBSSxRQUFRLFNBQVMsU0FBUyxHQUFHO0FBQy9CLGNBQUksQ0FBQyxRQUFRLHFCQUFxQjtBQUNoQyxvQkFBUSxLQUFLLCtGQUErRjtBQUM1RyxvQkFBUSxLQUFLLDJEQUEyRDtBQUN4RSxvQkFBUSxLQUFLLGtDQUFrQztBQUMvQyxvQkFBUSxLQUFLLE9BQU87QUFBQSxVQUN0QjtBQUNBLGNBQUksUUFBUSxvQkFBb0I7QUFDOUIsa0JBQU0sTUFBTSxJQUFJO0FBQUEsY0FDZDtBQUFBLGNBQ0EsUUFBUTtBQUFBLFlBQ1Y7QUFDQSxrQkFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBRUEsZUFBTztBQUNQLGNBQU0sT0FBTyxLQUFLO0FBQ2xCLGNBQU0sU0FBUyxXQUFXRCxXQUFVLE1BQU0sRUFBRSxVQUFVLGdCQUFnQixLQUFLLENBQUMsSUFBSSxjQUFjLElBQUk7QUFFbEcsZ0JBQVEsWUFBWSxPQUFPO0FBQzNCLGdCQUFRLFFBQVEsY0FBYztBQUM5Qix3QkFBZ0IsU0FBUyxVQUFVLE9BQU8sUUFBUTtBQUNsRCxnQkFBUSxTQUFTO0FBQUEsVUFDZixVQUFVLE9BQU87QUFBQTtBQUFBLFVBRWpCLElBQUksT0FBTztBQUFBLFVBQ1gsV0FBVyxPQUFPO0FBQUEsUUFDcEI7QUFDQSxZQUFJLE9BQU8sWUFBWTtBQUNyQixrQkFBUSxhQUFhO0FBQUEsWUFDbkIsVUFBVSxPQUFPLFdBQVc7QUFBQSxZQUM1QixXQUFXLE9BQU8sV0FBVztBQUFBLFVBQy9CO0FBQUEsUUFDRjtBQUVBLGFBQUssMEJBQTBCLEVBQUUsSUFBSSxTQUFTLFFBQVEsS0FBSyxDQUFDO0FBQUEsTUFDOUQ7QUFPQSxlQUFTLFVBQVUsYUFBYTtBQUM5QixrQkFBVSxRQUFRLFNBQVMsV0FBVztBQUFBLE1BQ3hDO0FBR0EsWUFBTSxtQkFBbUIsTUFBTTtBQUM3QixxQkFBYTtBQUNiLG1CQUFXLFVBQVUseURBQXlEO0FBQUEsTUFDaEY7QUFHQSxlQUFTLHlCQUF5QjtBQUNoQyxxQkFBYTtBQUNiLG1CQUFXLFVBQVUsK0RBQStEO0FBQUEsTUFDdEY7QUFFQSxVQUFJLGlCQUFpQjtBQUtyQixlQUFTLGVBQWU7QUFFdEIsWUFBSSxTQUFTLGVBQWUsV0FBVztBQUNyQywyQkFBaUI7QUFDakI7QUFBQSxRQUNGO0FBRUEsY0FBTSxTQUFTLFNBQVMsaUJBQWlCLFFBQVEsV0FBVztBQUM1RCxlQUFPLFFBQVEsZ0JBQWdCO0FBQUEsTUFDakM7QUFFQSxlQUFTLE9BQU87QUFFZCxZQUFJO0FBQWdCLHVCQUFhO0FBQUEsTUFDbkM7QUFHQSxVQUFJLE9BQU8sV0FBVyxlQUFlLE9BQU8sa0JBQWtCO0FBQzVELGVBQU8saUJBQWlCLG9CQUFvQixNQUFNLEtBQUs7QUFBQSxNQUN6RDtBQVFBLGVBQVMsaUJBQWlCLGNBQWMsb0JBQW9CO0FBQzFELFlBQUksT0FBTztBQUNYLFlBQUk7QUFDRixpQkFBTyxtQkFBbUIsSUFBSTtBQUFBLFFBQ2hDLFNBQVMsU0FBUztBQUNoQixnQkFBTSx3REFBd0QsUUFBUSxNQUFNLFlBQVksQ0FBQztBQUV6RixjQUFJLENBQUMsV0FBVztBQUFFLGtCQUFNO0FBQUEsVUFBUyxPQUFPO0FBQUUsa0JBQU0sT0FBTztBQUFBLFVBQUc7QUFLMUQsaUJBQU87QUFBQSxRQUNUO0FBRUEsWUFBSSxDQUFDLEtBQUs7QUFBTSxlQUFLLE9BQU87QUFDNUIsa0JBQVUsWUFBWSxJQUFJO0FBQzFCLGFBQUssZ0JBQWdCLG1CQUFtQixLQUFLLE1BQU0sSUFBSTtBQUV2RCxZQUFJLEtBQUssU0FBUztBQUNoQiwwQkFBZ0IsS0FBSyxTQUFTLEVBQUUsYUFBYSxDQUFDO0FBQUEsUUFDaEQ7QUFBQSxNQUNGO0FBT0EsZUFBUyxtQkFBbUIsY0FBYztBQUN4QyxlQUFPLFVBQVUsWUFBWTtBQUM3QixtQkFBVyxTQUFTLE9BQU8sS0FBSyxPQUFPLEdBQUc7QUFDeEMsY0FBSSxRQUFRLEtBQUssTUFBTSxjQUFjO0FBQ25DLG1CQUFPLFFBQVEsS0FBSztBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFLQSxlQUFTLGdCQUFnQjtBQUN2QixlQUFPLE9BQU8sS0FBSyxTQUFTO0FBQUEsTUFDOUI7QUFNQSxlQUFTLFlBQVksTUFBTTtBQUN6QixnQkFBUSxRQUFRLElBQUksWUFBWTtBQUNoQyxlQUFPLFVBQVUsSUFBSSxLQUFLLFVBQVUsUUFBUSxJQUFJLENBQUM7QUFBQSxNQUNuRDtBQU9BLGVBQVMsZ0JBQWdCLFdBQVcsRUFBRSxhQUFhLEdBQUc7QUFDcEQsWUFBSSxPQUFPLGNBQWMsVUFBVTtBQUNqQyxzQkFBWSxDQUFDLFNBQVM7QUFBQSxRQUN4QjtBQUNBLGtCQUFVLFFBQVEsV0FBUztBQUFFLGtCQUFRLE1BQU0sWUFBWSxDQUFDLElBQUk7QUFBQSxRQUFjLENBQUM7QUFBQSxNQUM3RTtBQU1BLGVBQVMsY0FBYyxNQUFNO0FBQzNCLGNBQU0sT0FBTyxZQUFZLElBQUk7QUFDN0IsZUFBTyxRQUFRLENBQUMsS0FBSztBQUFBLE1BQ3ZCO0FBT0EsZUFBUyxpQkFBaUIsUUFBUTtBQUVoQyxZQUFJLE9BQU8sdUJBQXVCLEtBQUssQ0FBQyxPQUFPLHlCQUF5QixHQUFHO0FBQ3pFLGlCQUFPLHlCQUF5QixJQUFJLENBQUMsU0FBUztBQUM1QyxtQkFBTyx1QkFBdUI7QUFBQSxjQUM1QixPQUFPLE9BQU8sRUFBRSxPQUFPLEtBQUssR0FBRyxHQUFHLElBQUk7QUFBQSxZQUN4QztBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQ0EsWUFBSSxPQUFPLHNCQUFzQixLQUFLLENBQUMsT0FBTyx3QkFBd0IsR0FBRztBQUN2RSxpQkFBTyx3QkFBd0IsSUFBSSxDQUFDLFNBQVM7QUFDM0MsbUJBQU8sc0JBQXNCO0FBQUEsY0FDM0IsT0FBTyxPQUFPLEVBQUUsT0FBTyxLQUFLLEdBQUcsR0FBRyxJQUFJO0FBQUEsWUFDeEM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFLQSxlQUFTLFVBQVUsUUFBUTtBQUN6Qix5QkFBaUIsTUFBTTtBQUN2QixnQkFBUSxLQUFLLE1BQU07QUFBQSxNQUNyQjtBQUtBLGVBQVMsYUFBYSxRQUFRO0FBQzVCLGNBQU0sUUFBUSxRQUFRLFFBQVEsTUFBTTtBQUNwQyxZQUFJLFVBQVUsSUFBSTtBQUNoQixrQkFBUSxPQUFPLE9BQU8sQ0FBQztBQUFBLFFBQ3pCO0FBQUEsTUFDRjtBQU9BLGVBQVMsS0FBSyxPQUFPLE1BQU07QUFDekIsY0FBTSxLQUFLO0FBQ1gsZ0JBQVEsUUFBUSxTQUFTLFFBQVE7QUFDL0IsY0FBSSxPQUFPLEVBQUUsR0FBRztBQUNkLG1CQUFPLEVBQUUsRUFBRSxJQUFJO0FBQUEsVUFDakI7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBTUEsZUFBUyx3QkFBd0IsSUFBSTtBQUNuQyxtQkFBVyxVQUFVLGtEQUFrRDtBQUN2RSxtQkFBVyxVQUFVLGtDQUFrQztBQUV2RCxlQUFPLGlCQUFpQixFQUFFO0FBQUEsTUFDNUI7QUFHQSxhQUFPLE9BQU8sTUFBTTtBQUFBLFFBQ2xCLFdBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUVBLGdCQUFnQjtBQUFBLFFBQ2hCO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGLENBQUM7QUFFRCxXQUFLLFlBQVksV0FBVztBQUFFLG9CQUFZO0FBQUEsTUFBTztBQUNqRCxXQUFLLFdBQVcsV0FBVztBQUFFLG9CQUFZO0FBQUEsTUFBTTtBQUMvQyxXQUFLLGdCQUFnQjtBQUVyQixXQUFLLFFBQVE7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFFQSxpQkFBVyxPQUFPSixRQUFPO0FBRXZCLFlBQUksT0FBT0EsT0FBTSxHQUFHLE1BQU0sVUFBVTtBQUVsQyxxQkFBV0EsT0FBTSxHQUFHLENBQUM7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFHQSxhQUFPLE9BQU8sTUFBTUEsTUFBSztBQUV6QixhQUFPO0FBQUEsSUFDVDtBQUdBLFFBQU0sWUFBWSxLQUFLLENBQUMsQ0FBQztBQUl6QixjQUFVLGNBQWMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUVyQyxXQUFPLFVBQVU7QUFDakIsY0FBVSxjQUFjO0FBQ3hCLGNBQVUsVUFBVTtBQUFBO0FBQUE7OztBQ25pRnBCLGtCQUF3QjtBQUV4QixJQUFPLGVBQVEsWUFBQU07OztBQ01mLFNBQVMsS0FBSyxNQUFNO0FBQ2xCLFFBQU0sUUFBUSxLQUFLO0FBQ25CLFFBQU0sTUFBTSxDQUFDO0FBQ2IsUUFBTSxhQUFhO0FBQUEsSUFDakIsT0FBTztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsVUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxVQUFVLENBQUUsR0FBSTtBQUFBLE1BQ2xCO0FBQUE7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNBLFNBQU8sT0FBTyxLQUFLO0FBQUEsSUFDakIsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLE1BQ1IsRUFBRSxPQUFPLE1BQU07QUFBQSxRQUFPO0FBQUE7QUFBQTtBQUFBLFFBR3BCO0FBQUEsTUFBcUIsRUFBRTtBQUFBLE1BQ3pCO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUVELFFBQU0sUUFBUTtBQUFBLElBQ1osV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsVUFBVSxDQUFFLEtBQUssZ0JBQWlCO0FBQUEsRUFDcEM7QUFDQSxRQUFNLFdBQVc7QUFBQSxJQUNmLE9BQU87QUFBQSxJQUNQLFFBQVEsRUFBRSxVQUFVO0FBQUEsTUFDbEIsS0FBSyxrQkFBa0I7QUFBQSxRQUNyQixPQUFPO0FBQUEsUUFDUCxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsTUFDYixDQUFDO0FBQUEsSUFDSCxFQUFFO0FBQUEsRUFDSjtBQUNBLFFBQU0sZUFBZTtBQUFBLElBQ25CLFdBQVc7QUFBQSxJQUNYLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLEtBQUs7QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsUUFBTSxTQUFTLEtBQUssWUFBWTtBQUNoQyxRQUFNLGdCQUFnQjtBQUFBLElBQ3BCLE9BQU87QUFBQSxFQUNUO0FBQ0EsUUFBTSxjQUFjO0FBQUEsSUFDbEIsV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLElBQ1AsS0FBSztBQUFBLEVBQ1A7QUFDQSxRQUFNLGVBQWU7QUFBQSxJQUNuQixPQUFPO0FBQUEsRUFDVDtBQUNBLFFBQU0sYUFBYTtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0w7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNBLFFBQU0saUJBQWlCO0FBQUEsSUFDckI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDQSxRQUFNLGdCQUFnQixLQUFLLFFBQVE7QUFBQSxJQUNqQyxRQUFRLElBQUksZUFBZSxLQUFLLEdBQUcsQ0FBQztBQUFBLElBQ3BDLFdBQVc7QUFBQSxFQUNiLENBQUM7QUFDRCxRQUFNLFdBQVc7QUFBQSxJQUNmLFdBQVc7QUFBQSxJQUNYLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxJQUNiLFVBQVUsQ0FBRSxLQUFLLFFBQVEsS0FBSyxZQUFZLEVBQUUsT0FBTyxhQUFhLENBQUMsQ0FBRTtBQUFBLElBQ25FLFdBQVc7QUFBQSxFQUNiO0FBRUEsUUFBTUMsWUFBVztBQUFBLElBQ2Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxRQUFNQyxZQUFXO0FBQUEsSUFDZjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBR0EsUUFBTSxZQUFZLEVBQUUsT0FBTyxpQkFBaUI7QUFHNUMsUUFBTSxrQkFBa0I7QUFBQSxJQUN0QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUVBLFFBQU0saUJBQWlCO0FBQUEsSUFDckI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxRQUFNLGdCQUFnQjtBQUFBLElBQ3BCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxRQUFNLGlCQUFpQjtBQUFBLElBQ3JCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEs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QTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxJQUFNLGlCQUFpQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBR0EsSUFBTSxpQkFBaUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQ0Y7QUFHQSxJQUFNLGtCQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTSxhQUFhO0FBQUEsRUFDakI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUE7QUFHRixFQUFFLFFBQVE7QUFVVixTQUFTLElBQUksTUFBTTtBQUNqQixRQUFNLFFBQVEsS0FBSztBQUNuQixRQUFNLFFBQVEsTUFBTSxJQUFJO0FBQ3hCLFFBQU0sZ0JBQWdCLEVBQUUsT0FBTywrQkFBK0I7QUFDOUQsUUFBTSxlQUFlO0FBQ3JCLFFBQU0saUJBQWlCO0FBQ3ZCLFFBQU1DLFlBQVc7QUFDakIsUUFBTSxVQUFVO0FBQUEsSUFDZCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDUDtBQUVBLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGtCQUFrQjtBQUFBLElBQ2xCLFNBQVM7QUFBQSxJQUNULFVBQVUsRUFBRSxrQkFBa0IsVUFBVTtBQUFBLElBQ3hDLGtCQUFrQjtBQUFBO0FBQUE7QUFBQSxNQUdoQixrQkFBa0I7QUFBQSxJQUFlO0FBQUEsSUFDbkMsVUFBVTtBQUFBLE1BQ1IsTUFBTTtBQUFBLE1BQ047QUFBQTtBQUFBO0FBQUEsTUFHQSxNQUFNO0FBQUEsTUFDTjtBQUFBLFFBQ0UsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFFBQ1AsV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsUUFDRSxXQUFXO0FBQUEsUUFDWCxPQUFPLFFBQVFBO0FBQUEsUUFDZixXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsTUFBTTtBQUFBLE1BQ047QUFBQSxRQUNFLFdBQVc7QUFBQSxRQUNYLFVBQVU7QUFBQSxVQUNSLEVBQUUsT0FBTyxPQUFPLGVBQWUsS0FBSyxHQUFHLElBQUksSUFBSTtBQUFBLFVBQy9DLEVBQUUsT0FBTyxXQUFXLGdCQUFnQixLQUFLLEdBQUcsSUFBSSxJQUFJO0FBQUEsUUFDdEQ7QUFBQSxNQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPQSxNQUFNO0FBQUEsTUFDTjtBQUFBLFFBQ0UsV0FBVztBQUFBLFFBQ1gsT0FBTyxTQUFTLFdBQVcsS0FBSyxHQUFHLElBQUk7QUFBQSxNQUN6QztBQUFBO0FBQUEsTUFFQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsS0FBSztBQUFBLFFBQ0wsVUFBVTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sR0FBRztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBSUg7QUFBQSxZQUNFLE9BQU87QUFBQSxZQUNQLEtBQUs7QUFBQSxZQUNMLFdBQVc7QUFBQTtBQUFBLFlBQ1gsVUFBVSxFQUFFLFVBQVUsZUFBZTtBQUFBLFlBQ3JDLFVBQVU7QUFBQSxjQUNSLEdBQUc7QUFBQSxjQUNIO0FBQUEsZ0JBQ0UsV0FBVztBQUFBO0FBQUE7QUFBQSxnQkFHWCxPQUFPO0FBQUEsZ0JBQ1AsZ0JBQWdCO0FBQUEsZ0JBQ2hCLFlBQVk7QUFBQSxjQUNkO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE9BQU8sTUFBTSxVQUFVLEdBQUc7QUFBQSxRQUMxQixLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUE7QUFBQSxRQUNULFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxXQUFXO0FBQUEsWUFDWCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLE9BQU87QUFBQSxZQUNQLGdCQUFnQjtBQUFBLFlBQ2hCLFlBQVk7QUFBQSxZQUNaLFdBQVc7QUFBQSxZQUNYLFVBQVU7QUFBQSxjQUNSLFVBQVU7QUFBQSxjQUNWLFNBQVM7QUFBQSxjQUNULFdBQVcsZUFBZSxLQUFLLEdBQUc7QUFBQSxZQUNwQztBQUFBLFlBQ0EsVUFBVTtBQUFBLGNBQ1I7QUFBQSxnQkFDRSxPQUFPO0FBQUEsZ0JBQ1AsV0FBVztBQUFBLGNBQ2I7QUFBQSxjQUNBLEdBQUc7QUFBQSxjQUNILE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsV0FBVztBQUFBLFFBQ1gsT0FBTyxTQUFTLEtBQUssS0FBSyxHQUFHLElBQUk7QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ3J0QkEsU0FBUyxXQUFXLE1BQU07QUFDeEIsUUFBTUMsWUFBVztBQUFBLElBQ2Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBRSxRQUFTO0FBQUEsSUFDcEIsa0JBQWtCO0FBQUEsSUFDbEIsVUFBVUE7QUFBQSxJQUNWLFVBQVU7QUFBQSxNQUNSLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMO0FBQUEsUUFDRSxlQUFlO0FBQUEsUUFDZixRQUFRO0FBQUEsVUFDTixLQUFLO0FBQUEsVUFDTCxhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsRUFDWDtBQUNGOzs7QUNqQ0EsU0FBUyxRQUFRLE1BQU07QUFDckIsUUFBTSxRQUFRLEtBQUs7QUFDbkIsUUFBTSxXQUFXO0FBQ2pCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBRSxLQUFNO0FBQUEsSUFDakIsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsSUFDbkIsVUFBVTtBQUFBLE1BQ1IsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxNQUNiO0FBQUEsTUFDQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsT0FBTztBQUFBLFFBQ1AsS0FBSztBQUFBLFFBQ0wsWUFBWTtBQUFBLFFBQ1osV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxPQUFPO0FBQUEsUUFDUCxZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLE9BQU8sTUFBTSxPQUFPLFVBQVUsTUFBTSxVQUFVLE1BQU0sQ0FBQztBQUFBLFFBQ3JELFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FDM0VBLElBQU0sV0FBVztBQUNqQixJQUFNLFdBQVc7QUFBQSxFQUNmO0FBQUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFDQSxJQUFNLFdBQVc7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUdBLElBQU0sUUFBUTtBQUFBO0FBQUEsRUFFWjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtB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QSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQTtBQUFBO0FBQUEsSUFHQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxRQUFNQyxhQUFZO0FBQUE7QUFBQTtBQUFBLElBR2hCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUE7QUFBQTtBQUFBLElBR0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUE7QUFBQTtBQUFBLElBR0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtB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QUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxJQUFNQyxrQkFBaUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUdBLElBQU1DLGtCQUFpQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFDRjtBQUdBLElBQU1DLG1CQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTUMsY0FBYTtBQUFBLEVBQ2pCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFB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O0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUtBLFFBQU0scUJBQXFCO0FBQUEsSUFDekI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBR0EsUUFBTSwwQkFBMEI7QUFBQSxJQUM5QjtBQUFBLElBQ0E7QUFB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QTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUNBLElBQU1DLFlBQVc7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUdBLElBQU1DLFNBQVE7QUFBQTtBQUFBLEVBRVo7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBO0FBQUEsRUFFQTtBQUFBO0FBQUEsRUFFQTtBQUNGO0FBRUEsSUFBTUMsZUFBYztBQUFBLEVBQ2xCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNB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QUFLLGlCQUFpQixjQUFjLFVBQVU7QUFDOUMsYUFBSyxpQkFBaUIsUUFBUSxJQUFJO0FBQ2xDLGFBQUssaUJBQWlCLFlBQVksUUFBUTtBQUMxQyxhQUFLLGlCQUFpQixPQUFPLEdBQUc7QUFDaEMsYUFBSyxpQkFBaUIsUUFBUSxJQUFJO0FBQ2xDLGFBQUssaUJBQWlCLFNBQVMsS0FBSztBQUNwQyxhQUFLLGlCQUFpQixPQUFPLEdBQUc7QUFDaEMsYUFBSyxpQkFBaUIsY0FBYyxVQUFVO0FBQzlDLGFBQUssaUJBQWlCLE9BQU8sR0FBRztBQUNoQyxhQUFLLGlCQUFpQixRQUFRLElBQUk7QUFFbEMsU0FBUyxpQkFBaUIsaUNBQWlDLEVBQUUsUUFBUSxRQUFNO0FBQ3pFLGVBQUssaUJBQWlCLEVBQUU7QUFDMUIsQ0FBQzsiLAogICJuYW1lcyI6IFsiSURFTlRfUkUiLCAiTU9ERVMiLCAic2NvcGVOYW1lIiwgInZlcnNpb24iLCAiaSIsICJoaWdobGlnaHQiLCAicmVzdWx0IiwgIkhpZ2hsaWdodEpTIiwgIktFWVdPUkRTIiwgIkxJVEVSQUxTIiwgIklERU5UX1JFIiwgIktFWVdPUkRTIiwgIkxJVEVSQUxTIiwgIklERU5UX1JFIiwgIkxJVEVSQUxTIiwgIkJVSUxUX0lOUyIsICJLRVlXT1JEUyIsICJBVFRSSUJVVEVTIiwgIk1PREVTIiwgIlRBR1MiLCAiTUVESUFfRkVBVFVSRVMiLCAiUFNFVURPX0NMQVNTRVMiLCAiUFNFVURPX0VMRU1FTlRTIiwgIkFUVFJJQlVURVMiLCAiSURFTlRfUkUiLCAiTElURVJBTFMiLCAiVFlQRVMiLCAiS0VZV09SRFMiLCAiSURFTlRfUkUiLCAiS0VZV09SRFMiLCAiTElURVJBTFMiLCAiVFlQRVMiLCAiRVJST1JfVFlQRVMiLCAiQlVJTFRfSU5fR0xPQkFMUyIsICJCVUlMVF9JTl9WQVJJQUJMRVMiLCAiQlVJTFRfSU5TIiwgImphdmFzY3JpcHQiLCAiTElURVJBTFMiLCAiTU9ERVMiXQp9Cg==
