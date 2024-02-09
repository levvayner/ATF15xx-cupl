import * as vscode from "vscode";
export async function registerVariableExtensionProvider(
    context: vscode.ExtensionContext
) {
    const variableExtensionProvider =
        vscode.languages.registerCompletionItemProvider(
            { scheme: "file", language: "Cupl" },
            {
                provideCompletionItems(
                    document: vscode.TextDocument,
                    position: vscode.Position
                ) {
                    //make sure its the right char
                    //let triggerWord = document.getText(document.getWordRangeAtPosition(position)).trim();
                    const triggerChar = document
                        .lineAt(position.line)
                        .text.charAt(position.character - 1);
                    if (triggerChar !== ".") {
                        return;
                    }

                    // walk through the doc to find if this variable is a pin
                    let prefix = document
                        .lineAt(position)
                        .text.substring(0, position.character - 1)
                        .trim();
                    if (prefix.includes(" ")) {
                        prefix = prefix.split(" ").reverse()[0];
                    }

                    //find if this is a signal defined with a pin
                    let searchPosition = new vscode.Position(0, 0);
                    let found = false;

                    while (
                        searchPosition.line < position.line ||
                        searchPosition.character < position.character
                    ) {
                        let word =
                            document.getWordRangeAtPosition(searchPosition);
                        if (!word) {
                            const w = nextWord(
                                new vscode.Range(
                                    searchPosition,
                                    new vscode.Position(
                                        searchPosition.line,
                                        searchPosition.character + 1
                                    )
                                ),
                                document.lineAt(searchPosition.line),
                                position
                            );
                            if (!w) {
                                return undefined;
                            }
                            searchPosition = w;
                            continue;
                        }
                        if (!word?.isSingleLine) {
                            searchPosition = word?.end;
                        }
                        const line = document.lineAt(word.start.line);
                        if (
                            document.getText(word).replace(";", "") === prefix
                        ) {
                            if (line.isEmptyOrWhitespace) {
                                const w = nextWord(
                                    new vscode.Range(
                                        searchPosition,
                                        new vscode.Position(
                                            searchPosition.line,
                                            searchPosition.character + 1
                                        )
                                    ),
                                    document.lineAt(searchPosition.line),
                                    position
                                );
                                if (!w) {
                                    return undefined;
                                }
                                searchPosition = w;
                                continue;
                            }
                            const firstWord = document.getWordRangeAtPosition(
                                new vscode.Position(
                                    line.lineNumber,
                                    line.firstNonWhitespaceCharacterIndex
                                )
                            );
                            if (
                                document.getText(firstWord).toLowerCase() ===
                                "pin"
                            ) {
                                //check this pin definition is for our word
                                if (
                                    line.text
                                        .replace(";", "")
                                        .split(" ")
                                        .reverse()[0] !== prefix
                                ) {
                                    const w = nextWord(
                                        new vscode.Range(
                                            searchPosition,
                                            new vscode.Position(
                                                searchPosition.line,
                                                searchPosition.character + 1
                                            )
                                        ),
                                        document.lineAt(searchPosition.line),
                                        position
                                    );
                                    if (!w) {
                                        return undefined;
                                    }
                                    searchPosition = w;
                                    continue;
                                }
                                let pinVariable = (name: string) => {
                                    let item = new vscode.CompletionItem(
                                        name,
                                        vscode.CompletionItemKind.Property
                                    );
                                    item.range = new vscode.Range(
                                        position,
                                        position
                                    );
                                    return item;
                                };
                                let makearray = (...args: string[]) => {
                                    return args.map((a) => pinVariable(a));
                                };
                                return makearray(
                                    "ap",
                                    "ar",
                                    "apmux",
                                    "armux",
                                    "byp",
                                    "ca",
                                    "ce",
                                    "ck",
                                    "ckmux",
                                    "d",
                                    "dfb",
                                    "dq",
                                    "imux",
                                    "int",
                                    "io",
                                    "ioar",
                                    "ioap",
                                    "iock",
                                    "iod",
                                    "iol",
                                    "iosp",
                                    "iosr",
                                    "j",
                                    "k",
                                    "l",
                                    "le",
                                    "lemux",
                                    "lfb",
                                    "lq",
                                    "obs",
                                    "oe",
                                    "oemux",
                                    "pr",
                                    "r",
                                    "s",
                                    "sp",
                                    "sr",
                                    "t",
                                    "tec",
                                    "tfb",
                                    "t1",
                                    "t2"
                                );
                            }
                        }
                        const w = nextWord(word, line, position);
                        if (!w) {
                            return undefined;
                        }
                        searchPosition = w;
                    }
                    return undefined;
                },
            },
            "."
        );

    var keywordProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "Cupl" },
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position
            ) {
                if (document.lineAt(position.line).text.trim().length > 0) {
                    return;
                }

                let pinVariable = (name: string) => {
                    let item = new vscode.CompletionItem(
                        name,
                        vscode.CompletionItemKind.Class
                    );
                    item.range = new vscode.Range(position, position);
                    return item;
                };
                let makearray = (...args: string[]) => {
                    return args.map((a) => pinVariable(a));
                };

                return makearray(
                    "PIN",
                    "FIELD",
                    "PINNODE",
                    "MIN",
                    "FUSE",
                    "APPEND",
                    "TABLE",
                    "",
                    "SEQUENCE",
                    "PRESENT",
                    "NEXT",
                    "IF",
                    "CONDITION",
                    "FUNCTION",
                    "TRANSITION"
                );
            },
        }
    );
    var nextInlineProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "Cupl" },
        {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position
            ) {
                const line = document.lineAt(position.line);
                const firstWord = document
                    .getText(
                        document.getWordRangeAtPosition(
                            new vscode.Position(
                                line.lineNumber,
                                line.firstNonWhitespaceCharacterIndex
                            )
                        )
                    )
                    .toLowerCase();

                if (!["if", "default", "present"].includes(firstWord)) {
                    return;
                }

                let item = new vscode.CompletionItem(
                    "NEXT",
                    vscode.CompletionItemKind.Keyword
                );
                item.range = new vscode.Range(position, position);
                return [item];
            },
        }
    );

    //next linestarts with if, default, or present
    context.subscriptions.push(variableExtensionProvider);
    context.subscriptions.push(keywordProvider);
    context.subscriptions.push(nextInlineProvider);
}

function nextWord(
    wordPosition: vscode.Range,
    line: vscode.TextLine,
    endSearch: vscode.Position
) {
    if (
        line.lineNumber === endSearch.line &&
        wordPosition.end.character + 1 >= endSearch.character
    ) {
        return undefined;
    }
    if (wordPosition.end.character < line.range.end.character) {
        return new vscode.Position(
            line.lineNumber,
            wordPosition.end.character + 1
        );
    } else {
        return new vscode.Position(line.lineNumber + 1, 0);
    }
}
