"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelpBuilder {
    constructor(appName) {
        this.appName = appName;
        this.glossaries = [];
        this.configs = [];
        this.statuses = [];
        this.apis = [];
        this.LineBreak = "<br /><br />";
        this.NewLine = "<br />";
    }
    Glossary(key, value) {
        this.glossaries.push({ key, value });
        return this;
    }
    Config(key, value, defaultValue = "", example = "") {
        this.configs.push({ key, value, defaultValue, example });
        return this;
    }
    Status(key, value) {
        this.statuses.push({ key, value: value() });
        return this;
    }
    Api(url, purpose) {
        this.apis.push({ url, purpose });
        return this;
    }
    get Glossaries() {
        return `<dl>` + this.glossaries.map(d => `<dt style="font-weight: bold">${d.key}</dt><dd>${d.value}</dd>`).join('') + `</dl>`;
    }
    get Configs() {
        return `<table><tr><th>Key</th><th>Value</th><th>Default</th><th>Example</th></tr>`
            + this.configs.map(c => `<tr><td>${c.key}</td><td style="font-weight: bold">${c.value}</td><td>${c.defaultValue}</td><td>${c.example}</td></tr>`).join('')
            + `</table>`;
    }
    get Statuses() {
        return `<table><tr><th>Indicator</th><th>Status</th></tr>`
            + this.statuses.map(s => `<tr><td>${s.key}</td><td>${s.value}</td></tr>`).join('')
            + `</table>`;
    }
    get Apis() {
        return `<table><tr><th>Url</th><th>Purpose</th></tr>`
            + this.apis.map(a => `<tr><td style="font-weight: bold"><a href=${a.url}>${a.url}</a></td><td>${a.purpose}</td></tr>`).join('')
            + `</table>`;
    }
    get Styles() {
        return `<style>
        div {
            padding: 18px;
            margin: 0;
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
            border-bottom: 1px solid #ddd;
        }
        </style>`;
    }
    Header(text) {
        return `<p>${text}</p>`;
    }
    ToString() {
        return this.Styles
            + '<div>'
            + this.Header(`Welcome to ${this.appName}`)
            + '<hr>'
            + this.Header("Glossary")
            + this.Glossaries + this.LineBreak
            + this.Header("Status")
            + this.Statuses + this.LineBreak
            + this.Header("Config")
            + this.Configs + this.LineBreak
            + this.Header("API")
            + this.Apis + this.LineBreak
            + '</div>';
    }
}
exports.HelpBuilder = HelpBuilder;
//# sourceMappingURL=HelpBuilder.js.map