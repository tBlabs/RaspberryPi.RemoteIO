"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpBuilder = void 0;
var HelpBuilder = /** @class */ (function () {
    function HelpBuilder(appName, description) {
        if (description === void 0) { description = ""; }
        this.appName = appName;
        this.description = description;
        this.warnings = [];
        this.glossaries = [];
        this.configs = [];
        this.statuses = [];
        this.apis = [];
        this.requirements = [];
        this.NewLine = "<br />";
        this.LineBreak = this.NewLine + this.NewLine;
    }
    HelpBuilder.prototype.Warning = function (texts) {
        var _a;
        (_a = this.warnings).push.apply(_a, texts);
        return this;
    };
    HelpBuilder.prototype.Glossary = function (key, value) {
        this.glossaries.push({ key: key, value: value });
        return this;
    };
    HelpBuilder.prototype.Requirement = function (key, value) {
        this.requirements.push({ key: key, value: value });
        return this;
    };
    HelpBuilder.prototype.Config = function (key, value, defaultValue, example, source) {
        if (defaultValue === void 0) { defaultValue = ""; }
        if (example === void 0) { example = ""; }
        if (source === void 0) { source = ""; }
        this.configs.push({ key: key, value: value || "", defaultValue: defaultValue, example: example, source: source });
        return this;
    };
    HelpBuilder.prototype.Status = function (key, callback) {
        this.statuses.push({ key: key, callback: callback });
        return this;
    };
    HelpBuilder.prototype.Api = function (url, purpose) {
        this.apis.push({ url: url, purpose: purpose });
        return this;
    };
    Object.defineProperty(HelpBuilder.prototype, "Glossaries", {
        get: function () {
            if (this.glossaries.length === 0)
                return "";
            return "<dl>" + this.glossaries.map(function (d) { return "<dt style=\"font-weight: bold\">" + d.key + "</dt><dd>" + d.value + "</dd>"; }).join('') + "</dl>";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HelpBuilder.prototype, "Configs", {
        get: function () {
            if (this.configs.length === 0)
                return "";
            return "<table><tr><th>Key</th><th>Value</th><th>Default</th><th>Example</th><th>Source</th></tr>"
                + this.configs.map(function (c) { return "<tr><td>" + c.key + "</td><td style=\"font-weight: bold\">" + c.value + "</td><td>" + c.defaultValue + "</td><td>" + c.example + "</td><td>" + c.source + "</td></tr>"; }).join('')
                + "</table>";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HelpBuilder.prototype, "Statuses", {
        get: function () {
            if (this.statuses.length === 0)
                return "";
            return "<table><tr><th>Indicator</th><th>Status</th></tr>"
                + this.statuses.map(function (s) { return "<tr><td>" + s.key + "</td><td>" + s.callback() + "</td></tr>"; }).join('')
                + "</table>";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HelpBuilder.prototype, "Apis", {
        get: function () {
            if (this.apis.length === 0)
                return "";
            return "<table><tr><th>Url</th><th>Purpose</th></tr>"
                + this.apis.map(function (a) { return "<tr><td style=\"font-weight: bold\"><a href=" + a.url + ">" + a.url + "</a></td><td>" + a.purpose + "</td></tr>"; }).join('')
                + "</table>";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HelpBuilder.prototype, "Requirements", {
        get: function () {
            if (this.apis.length === 0)
                return "";
            return "<table><tr><th>Thing</th><th>Purpose</th></tr>"
                + this.requirements.map(function (a) { return "<tr><td style=\"font-weight: bold\">" + a.key + "</td><td>" + a.value + "</td></tr>"; }).join('')
                + "</table>";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HelpBuilder.prototype, "Styles", {
        get: function () {
            return "<style>\n        div {\n            padding: 18px;\n            margin: 0;\n        }\n\n        .warning {\n            padding: 24px;\n            margin-top: 12px;\n            background-color: maroon;\n            color: white;\n            border-radius: 5px;\n            font-weight: bold;\n            font-size: 18px;\n        }\n\n        p {\n            font-weight: bold;\n            color: maroon;\n            font-size: 28px;\n        }\n\n        a {\n            color: maroon;\n        }\n\n        dt {\n            margin-top: 12px;\n        }\n        \n        table {\n            border-collapse: collapse;\n            width: 100%;\n        }\n          \n        th, td {\n            padding: 8px;\n            text-align: left;\n            border-bottom: 1px solid #ddd;\n        }\n        </style>";
        },
        enumerable: false,
        configurable: true
    });
    HelpBuilder.prototype.Header = function (text) {
        return "<p>" + text + "</p>";
    };
    HelpBuilder.prototype.Section = function (header, text) {
        if (text.length === 0)
            return "";
        return this.Header(header) + text + this.LineBreak;
    };
    HelpBuilder.prototype.Description = function (text) {
        if (text === undefined || text.length === 0)
            return "";
        return '<i>' + this.description + '</i>';
    };
    Object.defineProperty(HelpBuilder.prototype, "Warnings", {
        get: function () {
            if (this.warnings.length === 0)
                return "";
            return this.NewLine + this.NewLine + this.NewLine
                + this.warnings.map(function (x) { return "<div class=\"warning\">" + x + "</div>"; }).join("")
                + this.NewLine;
        },
        enumerable: false,
        configurable: true
    });
    HelpBuilder.prototype.ToString = function () {
        return this.Styles
            + '<div>'
            + this.Header("" + this.appName)
            + this.Description(this.description)
            + this.Warnings
            + '<hr>'
            + this.Section("Glossary", this.Glossaries)
            + this.Section("Status", this.Statuses)
            + this.Section("Config", this.Configs)
            + this.Section("API", this.Apis)
            + this.Section("Requirements", this.Requirements)
            + '</div>';
    };
    return HelpBuilder;
}());
exports.HelpBuilder = HelpBuilder;
