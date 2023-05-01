import * as vscode from 'vscode';

export async function registerSemanticTokenProvider(context: vscode.ExtensionContext) {
    const pinNumbers = ["pin"];
    const tokenModifiers = ["declaration"];
    const legend = new vscode.SemanticTokensLegend(pinNumbers, tokenModifiers);

    const provider: vscode.DocumentSemanticTokensProvider = {
        provideDocumentSemanticTokens(
            document: vscode.TextDocument
        ): vscode.ProviderResult<vscode.SemanticTokens> {
            // analyze the document and return semantic tokens

            const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
            return tokensBuilder.build();
        },
    };

    const selector = { language: "Cupl", scheme: "file" }; // register for all pld documents from the local file system

    vscode.languages.registerDocumentSemanticTokensProvider(
        selector,
        provider,
        legend
    );
}