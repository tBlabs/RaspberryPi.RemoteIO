    
export class HelpBuilder
{
    private warnings: string[] = [];
    private glossaries: { key: string; value: string; }[] = [];
    private configs: { key: string; value: string; defaultValue: string; example: string; source: string; }[] = [];
    private statuses: { key: string; callback: () => string; }[] = [];
    private apis: { url: string; purpose: string; }[] = [];
    private requirements: { key: string; value: string; }[] = [];

    constructor(private appName: string, private description: string = "")
    { }

    public Warning(texts: string[]): this
    {
        this.warnings.push(...texts);

        return this;
    }

    public Glossary(key: string, value: string): this
    {
        this.glossaries.push({ key, value });

        return this;
    }

    public Requirement(key: string, value: string): this
    {
        this.requirements.push({ key, value });

        return this;
    }

    public Config(key: string, value?: string, defaultValue: string = "", example: string = "", source: string = ""): this
    {
        this.configs.push({ key, value: value || "", defaultValue, example, source });

        return this;
    }

    public Status(key: string, callback: () => string): this
    {
        this.statuses.push({ key, callback });

        return this;
    }

    public Api(url: string, purpose: string): this
    {
        this.apis.push({ url, purpose });

        return this;
    }

    private NewLine = "<br />";
    private LineBreak = this.NewLine + this.NewLine;

    private get Glossaries()
    {
        if (this.glossaries.length === 0) return "";

        return `<dl>` + this.glossaries.map(d => `<dt style="font-weight: bold">${d.key}</dt><dd>${d.value}</dd>`).join('') + `</dl>`;
    }

    private get Configs()
    {
        if (this.configs.length === 0) return "";

        return `<table><tr><th>Key</th><th>Value</th><th>Default</th><th>Example</th><th>Source</th></tr>`
            + this.configs.map(c => `<tr><td>${c.key}</td><td style="font-weight: bold">${c.value}</td><td>${c.defaultValue}</td><td>${c.example}</td><td>${c.source}</td></tr>`).join('')
            + `</table>`;
    }

    private get Statuses()
    {
        if (this.statuses.length === 0) return "";

        return `<table><tr><th>Indicator</th><th>Status</th></tr>`
            + this.statuses.map(s => `<tr><td>${s.key}</td><td>${s.callback()}</td></tr>`).join('')
            + `</table>`;
    }

    private get Apis()
    {
        if (this.apis.length === 0) return "";

        return `<table><tr><th>Url</th><th>Purpose</th></tr>`
            + this.apis.map(a => `<tr><td style="font-weight: bold"><a href=${a.url}>${a.url}</a></td><td>${a.purpose}</td></tr>`).join('')
            + `</table>`;
    }

    private get Requirements()
    {
        if (this.apis.length === 0) return "";

        return `<table><tr><th>Thing</th><th>Purpose</th></tr>`
            + this.requirements.map(a => `<tr><td style="font-weight: bold">${a.key}</td><td>${a.value}</td></tr>`).join('')
            + `</table>`;
    }

    public get Styles()
    {
        return `<style>
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
            border-bottom: 1px solid #ddd;
        }
        </style>`;
    }

    private Header(text: string): string
    {
        return `<p>${text}</p>`;
    }

    private Section(header: string, text: string): string
    {
        if (text.length === 0) return "";

        return this.Header(header) + text + this.LineBreak;
    }

    private Description(text: string): string
    {
        if (text === undefined || text.length === 0) return "";

        return '<i>' + this.description + '</i>';
    }

    private get Warnings(): string
    {
        if (this.warnings.length === 0) return "";

        return this.NewLine + this.NewLine + this.NewLine
            + this.warnings.map(x => `<div class="warning">${x}</div>`).join("")
            + this.NewLine;
    }

    public ToString()
    {
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
            + this.Section("Requirements", this.Requirements)
            + '</div>';
    }
}
