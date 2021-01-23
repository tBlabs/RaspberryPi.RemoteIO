"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpBuilder = void 0;
class HelpBuilder {
    constructor(appName, description = "") {
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
    Warning(texts) {
        this.warnings.push(...texts);
        return this;
    }
    Glossary(key, value) {
        this.glossaries.push({ key, value });
        return this;
    }
    Requirement(key, value) {
        this.requirements.push({ key, value });
        return this;
    }
    Config(key, value, defaultValue = "", example = "", source = "") {
        this.configs.push({ key, value: value || "", defaultValue, example, source });
        return this;
    }
    Status(key, callback) {
        this.statuses.push({ key, callback });
        return this;
    }
    Api(url, purpose) {
        this.apis.push({ url, purpose });
        return this;
    }
    get Glossaries() {
        if (this.glossaries.length === 0)
            return "";
        return `<dl>` + this.glossaries.map(d => `<dt style="font-weight: bold">${d.key}</dt><dd>${d.value}</dd>`).join('') + `</dl>`;
    }
    get Configs() {
        if (this.configs.length === 0)
            return "";
        return `<table><tr><th>Key</th><th>Value</th><th>Default</th><th>Example</th><th>Source</th></tr>`
            + this.configs.map(c => `<tr><td>${c.key}</td><td style="font-weight: bold">${c.value}</td><td>${c.defaultValue}</td><td>${c.example}</td><td>${c.source}</td></tr>`).join('')
            + `</table>`;
    }
    get Statuses() {
        if (this.statuses.length === 0)
            return "";
        return `<table><tr><th>Indicator</th><th>Status</th></tr>`
            + this.statuses.map(s => `<tr><td>${s.key}</td><td>${s.callback()}</td></tr>`).join('')
            + `</table>`;
    }
    get Apis() {
        if (this.apis.length === 0)
            return "";
        return `<table><tr><th>Url</th><th>Purpose</th></tr>`
            + this.apis.map(a => `<tr><td style="font-weight: bold"><a href=${a.url}>${a.url}</a></td><td>${a.purpose}</td></tr>`).join('')
            + `</table>`;
    }
    get Requirements() {
        if (this.apis.length === 0)
            return "";
        return `<table><tr><th>Thing</th><th>Purpose</th></tr>`
            + this.requirements.map(a => `<tr><td style="font-weight: bold">${a.key}</td><td>${a.value}</td></tr>`).join('')
            + `</table>`;
    }
    get Styles() {
        return `<style>
        html {
            background-color: #f0f0f0;
        }

        div {
            padding: 18px;
            margin: 0;
        }

        .warning {
            padding: 24px;
            margin-top: 12px;
            background-color: maroon;
            color: white;
            border-radius: 5px;
            font-weight: bold;
            font-size: 18px;
        }

        p {
            font-weight: bold;
            color: maroon;
            font-size: 28px;
        }

        a {
            color: maroon;
        }

        dt {
            margin-top: 12px;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
        }
          
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ccc;
        }
        </style>`;
    }
    Header(text) {
        return `<p>${text}</p>`;
    }
    Section(header, text) {
        if (text.length === 0)
            return "";
        return this.Header(header) + text + this.LineBreak;
    }
    Description(text) {
        if (text === undefined || text.length === 0)
            return "";
        return '<i>' + this.description + '</i>';
    }
    get Warnings() {
        if (this.warnings.length === 0)
            return "";
        return this.NewLine + this.NewLine + this.NewLine
            + this.warnings.map(x => `<div class="warning">${x}</div>`).join("")
            + this.NewLine;
    }
    ToString() {
        return this.Styles
            + '<div>'
            + this.Header(`${this.appName}`)
            + this.Description(this.description)
            + this.Warnings
            + '<hr>'
            + this.Section("Glossary", this.Glossaries)
            + this.Section("Status", this.Statuses)
            + this.Section("Config", this.Configs)
            + this.Section("API", this.Apis)
            + this.Section("Prerequisites", this.Requirements)
            + '</div>';
    }
}
exports.HelpBuilder = HelpBuilder;
//# sourceMappingURL=HelpBuilder.js.map